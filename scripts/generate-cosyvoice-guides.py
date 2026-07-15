#!/usr/bin/env python3
"""使用 CosyVoice 3 生成两馆导览音频并同步更新时间轴。"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

import torch
import torchaudio


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MODEL = Path(
    "~/.cache/modelscope/models/FunAudioLLM--Fun-CosyVoice3-0.5B-2512/snapshots/master"
).expanduser()
GENERATED_CACHE = Path("~/.cache/codex/ich-mobile-museum/cosyvoice3").expanduser()


@dataclass(frozen=True)
class GuideConfig:
    id: str
    json_path: Path
    output_dir: Path
    prompt_audio: Path
    instruction: str


GUIDES = (
    GuideConfig(
        id="jingju",
        json_path=ROOT / "content/audio/jingju-three-minute-guide.json",
        output_dir=ROOT / "public/audio/guides/jingju",
        prompt_audio=ROOT / "public/audio/previews/jingju-cosyvoice-preview.m4a",
        instruction=(
            "请用沉稳、自然、有舞台画面感的普通话讲述。语速适中，"
            "重点词轻微强调，转折前自然换气，句末收束，不要播音腔。"
        ),
    ),
    GuideConfig(
        id="tea",
        json_path=ROOT / "content/audio/tea-three-minute-guide.json",
        output_dir=ROOT / "public/audio/guides/tea",
        prompt_audio=ROOT / "public/audio/previews/tea-cosyvoice-preview.m4a",
        instruction=(
            "请用温润、从容、亲切的普通话讲述，像安静的纪录片旁白。"
            "语速舒缓但不拖沓，在意象和转折处自然停顿，句末柔和收束。"
        ),
    ),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--model",
        type=Path,
        default=Path(os.environ.get("COSYVOICE3_MODEL", DEFAULT_MODEL)),
        help="CosyVoice 3 模型目录，默认读取 COSYVOICE3_MODEL。",
    )
    parser.add_argument(
        "--guide",
        choices=("all", "jingju", "tea"),
        default="all",
        help="只生成指定展馆，默认生成全部。",
    )
    parser.add_argument(
        "--cue",
        type=int,
        help="只重做指定句（从 1 开始），必须同时指定 --guide。",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="忽略指定句的推理缓存并重新生成。",
    )
    return parser.parse_args()


def run(*command: str | Path) -> None:
    subprocess.run([str(item) for item in command], check=True)


def audio_duration(path: Path) -> float:
    return float(
        subprocess.check_output(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "csv=p=0",
                str(path),
            ],
            text=True,
        ).strip()
    )


def rounded(value: float) -> float:
    return round(value, 3)


def pause_after(text: str, chapter_end: bool, final: bool) -> float:
    if final:
        return 0
    if chapter_end:
        return 0.8
    if text.endswith(("！", "？")):
        return 0.5
    return 0.32


def generate_guide(
    model: object, config: GuideConfig, work: Path, cue_number: int | None, force: bool
) -> None:
    guide = json.loads(config.json_path.read_text(encoding="utf-8"))
    prompt_wav = work / f"{config.id}-prompt.wav"
    run(
        "ffmpeg",
        "-y",
        "-loglevel",
        "error",
        "-i",
        config.prompt_audio,
        "-ar",
        str(model.sample_rate),
        "-ac",
        "1",
        prompt_wav,
    )

    generated_cues: list[dict[str, object]] = []
    generated_chapters: list[dict[str, object]] = []
    cursor = 0.0
    instruction = f"You are a helpful assistant. {config.instruction}<|endofprompt|>"
    GENERATED_CACHE.mkdir(parents=True, exist_ok=True)
    config.output_dir.mkdir(parents=True, exist_ok=True)

    for index, cue in enumerate(guide["cues"]):
        chapter_id = cue["chapterId"]
        if not any(chapter["id"] == chapter_id for chapter in generated_chapters):
            chapter = next(
                item for item in guide["chapters"] if item["id"] == chapter_id
            )
            generated_chapters.append(
                {"id": chapter_id, "title": chapter["title"], "start": rounded(cursor)}
            )

        cache_key = hashlib.sha256(
            "\0".join(
                (config.id, cue["text"], instruction, str(args_model_identity(model)))
            ).encode("utf-8")
        ).hexdigest()[:16]
        cached_speech = GENERATED_CACHE / f"{config.id}-{index:02d}-{cache_key}.wav"
        selected_for_regeneration = cue_number is None or cue_number == index + 1
        if force and selected_for_regeneration:
            cached_speech.unlink(missing_ok=True)
        if not cached_speech.exists():
            if not selected_for_regeneration:
                raise FileNotFoundError(
                    f"第 {index + 1} 句尚无缓存；请先不带 --cue 生成完整展馆。"
                )
            chunks = list(
                model.inference_instruct2(
                    cue["text"], instruction, str(prompt_wav), stream=False
                )
            )
            speech = torch.cat([chunk["tts_speech"] for chunk in chunks], dim=1)
            torchaudio.save(str(cached_speech), speech, model.sample_rate)

        next_cue = guide["cues"][index + 1] if index + 1 < len(guide["cues"]) else None
        pause = pause_after(
            cue["text"],
            chapter_end=next_cue is None or next_cue["chapterId"] != chapter_id,
            final=next_cue is None,
        )
        output_path = config.output_dir / f"{index + 1:03d}.m4a"
        filters = "loudnorm=I=-18:TP=-2:LRA=7"
        if pause:
            filters += f",apad=pad_dur={pause}"
        run(
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            cached_speech,
            "-af",
            filters,
            "-ar",
            "48000",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            output_path,
        )
        duration = audio_duration(output_path)
        src = output_path.relative_to(ROOT / "public").as_posix()
        generated_cues.append(
            {
                "chapterId": chapter_id,
                "src": src,
                "durationSeconds": rounded(duration),
                "start": rounded(cursor),
                "end": rounded(cursor + duration),
                "text": cue["text"],
            }
        )
        cursor += duration
        print(f"[{config.id}] {index + 1}/{len(guide['cues'])} {cue['text']}")

    duration = cursor
    guide["updatedAt"] = "2026-07-15"
    guide["audio"]["durationSeconds"] = rounded(duration)
    guide["audio"]["voice"] = "CosyVoice 3（中文神经网络合成语音）"
    guide["audio"]["disclosure"] = (
        "AI 合成语音，由 CosyVoice 3 生成，不是真人馆员、艺术家或传承人录音。"
    )
    guide["audio"].pop("src", None)
    guide["chapters"] = generated_chapters
    guide["cues"] = generated_cues
    config.json_path.write_text(
        json.dumps(guide, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"[{config.id}] 完成：{duration:.1f} 秒")


def args_model_identity(model: object) -> str:
    """返回影响缓存的模型类型和采样率标识。"""
    return f"{type(model).__name__}:{model.sample_rate}"


def main() -> None:
    args = parse_args()
    if args.cue is not None and args.guide == "all":
        raise ValueError("使用 --cue 时必须通过 --guide 指定展馆。")
    if args.force and args.cue is None:
        raise ValueError("使用 --force 时必须同时指定 --cue。")
    model_path = args.model.expanduser().resolve()
    if not (model_path / "cosyvoice3.yaml").exists():
        raise FileNotFoundError(f"找不到 CosyVoice 3 模型：{model_path}")
    if shutil.which("ffmpeg") is None or shutil.which("ffprobe") is None:
        raise RuntimeError("需要先安装 FFmpeg。")

    cosyvoice_root = Path.home() / ".cache/codex/CosyVoice"
    sys.path.insert(0, str(cosyvoice_root))
    sys.path.insert(0, str(cosyvoice_root / "third_party/Matcha-TTS"))
    from cosyvoice.cli.cosyvoice import AutoModel

    model = AutoModel(model_dir=str(model_path))
    selected = (
        GUIDES
        if args.guide == "all"
        else tuple(config for config in GUIDES if config.id == args.guide)
    )
    with tempfile.TemporaryDirectory(prefix="cosyvoice-guides-") as directory:
        work = Path(directory)
        for config in selected:
            generate_guide(model, config, work, args.cue, args.force)


if __name__ == "__main__":
    main()

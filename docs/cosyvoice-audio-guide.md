# CosyVoice 语音导览生成说明

## 方案与披露

京剧馆和茶文化馆的导览使用 FunAudioLLM 官方 CosyVoice 3 模型生成，不再使用 macOS 系统 TTS。成品属于 AI 合成语音，不是真人馆员、艺术家、制茶师或传承人录音；页面必须继续展示这一披露。

当前采用两阶段音色方案：

1. 使用 `CosyVoice-300M-SFT` 的固定预置音色生成参考音频：京剧为“中文男”，茶文化为“中文女”。
2. 使用 `Fun-CosyVoice3-0.5B-2512` 读取参考音频，通过 `inference_instruct2` 生成正式导览。参考声音同样来自合成模型，不克隆未经授权的真人声音。

官方资料：

- [CosyVoice 代码与安装说明](https://github.com/FunAudioLLM/CosyVoice)
- [Fun-CosyVoice3-0.5B-2512 模型卡](https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512)
- [CosyVoice 3 论文](https://arxiv.org/abs/2505.17589)

CosyVoice 代码和模型采用 Apache-2.0 许可；发布前仍需保留本项目自己的文稿权利和 AI 合成语音说明。

## 本机环境

已验证环境：Apple M1 Max、64GB 内存、macOS、Python 3.10。官方推理代码在当前 macOS 环境中使用多核 CPU，未使用 CUDA；首次生成整段导览耗时较长是正常现象。

代码环境默认位于：

```text
~/.cache/codex/CosyVoice
~/.cache/codex/CosyVoice/.venv
```

CosyVoice 3 模型默认位于：

```text
~/.cache/modelscope/models/
  FunAudioLLM--Fun-CosyVoice3-0.5B-2512/
  snapshots/master
```

模型权重约 9GB，只保存在用户缓存目录，不提交到仓库。

## 生成命令

生成全部导览：

```bash
pnpm audio:generate
```

只生成一个展馆：

```bash
pnpm audio:generate -- --guide jingju
pnpm audio:generate -- --guide tea
```

只重做某一句（句号从 1 开始）：

```bash
pnpm audio:generate -- --guide jingju --cue 7 --force
pnpm audio:generate -- --guide tea --cue 3 --force
```

单句重做会复用其他句子的推理缓存，随后重新编码该馆的所有句文件并重算累计时间轴。

使用其他模型或 Python 环境：

```bash
COSYVOICE_PYTHON=/path/to/python \
COSYVOICE3_MODEL=/path/to/model/snapshots/master \
pnpm audio:generate
```

运行环境还需要 FFmpeg。Python 环境需安装 CosyVoice 官方依赖；Apple 芯片安装时应跳过 CUDA、TensorRT 和 DeepSpeed 依赖。

## 韵律与时间轴

生成脚本为两馆使用不同的讲述指令：

- 京剧：沉稳、有舞台画面感，重点词轻微强调，转折前换气，避免播音腔。
- 茶文化：温润、从容、亲切，像安静的纪录片旁白，在意象和转折处停顿。

脚本逐句调用 CosyVoice 3，每句话保存为一个独立 M4A。普通句文件末尾附加约 0.32 秒静音，疑问或感叹句约 0.5 秒，章节末句约 0.8 秒。生成完成后会：

1. 将每句响度标准化到约 `-18 LUFS`，峰值限制为 `-2 dBTP`。
2. 输出 48kHz、128kbps、单声道 AAC/M4A。
3. 在每句 JSON 中记录文件地址、文件时长与累计起止时间。
4. 根据实际文件时长重写章节起点和整段导览总时长。

不要手工猜测或复制旧时间轴；任何正文、模型、音色或停顿变更后都必须重新生成。

前端使用单个 `<audio>` 元素顺序加载句文件。整段进度等于“当前句之前的累计时长 + 当前句内播放时间”；拖动整段进度条时，播放器先找到目标句，再设置该句的本地播放位置。句末自动切换下一句，因此界面仍表现为一条连续导览，同时保留单句替换能力。

## 产物

正式单句音频：

```text
public/audio/guides/jingju/001.m4a ...
public/audio/guides/tea/001.m4a ...
```

预置音色试听与 CosyVoice 3 参考音频：

```text
public/audio/previews/jingju-cosyvoice-preview.m4a
public/audio/previews/tea-cosyvoice-preview.m4a
```

同步元数据：

```text
content/audio/jingju-three-minute-guide.json
content/audio/tea-three-minute-guide.json
```

发布前需要试听检查错音、重复、漏字、突兀换气和声线漂移，并执行项目完整质量门禁。

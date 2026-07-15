import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { jingjuAudioGuide } from "../../content/audioGuides";
import type { AudioGuide } from "../../content/schema";

const playbackRates = [1, 1.25, 0.75] as const;

const formatTime = (value: number) =>
  `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;

const cueIndexAt = (guide: AudioGuide, position: number) => {
  const index = guide.cues.findIndex(({ end }) => position < end);
  return index === -1 ? guide.cues.length - 1 : index;
};

export const AudioGuidePlayer = ({
  guide = jingjuAudioGuide,
}: {
  guide?: AudioGuide;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const activeCueRef = useRef<HTMLSpanElement>(null);
  const shouldPlayRef = useRef(false);
  const pendingLocalPositionRef = useRef(0);
  const [activeCueIndex, setActiveCueIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState<(typeof playbackRates)[number]>(1);
  const [buffering, setBuffering] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  const duration = guide.audio.durationSeconds;
  const cue = guide.cues[activeCueIndex];
  const chapter =
    [...guide.chapters].reverse().find(({ start }) => position >= start) ??
    guide.chapters[0];

  useEffect(() => {
    const container = transcriptRef.current;
    const activeCue = activeCueRef.current;
    if (!container || !activeCue) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const nextTop =
      activeCue.offsetTop - container.offsetTop - container.clientHeight / 2;
    container.scrollTo({
      top: Math.max(0, nextTop),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeCueIndex]);

  const playCurrentCue = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
    try {
      await audio.play();
    } catch {
      shouldPlayRef.current = false;
      setPlaying(false);
      setAudioError("语音暂时无法播放，请稍后重试或阅读完整文稿。");
    }
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      shouldPlayRef.current = false;
      audio.pause();
      return;
    }

    if (position >= duration) {
      shouldPlayRef.current = true;
      pendingLocalPositionRef.current = 0;
      setPosition(0);
      setActiveCueIndex(0);
      return;
    }
    shouldPlayRef.current = true;
    setAudioError(null);
    await playCurrentCue();
  };

  const seekTo = (nextPosition: number) => {
    const boundedPosition = Math.min(Math.max(0, nextPosition), duration);
    const nextCueIndex = cueIndexAt(guide, boundedPosition);
    const nextCue = guide.cues[nextCueIndex];
    const localPosition = Math.min(
      Math.max(0, boundedPosition - nextCue.start),
      nextCue.durationSeconds,
    );
    const audio = audioRef.current;

    setPosition(boundedPosition);
    pendingLocalPositionRef.current = localPosition;
    if (nextCueIndex === activeCueIndex && audio) {
      audio.currentTime = localPosition;
      pendingLocalPositionRef.current = 0;
      return;
    }
    setBuffering(true);
    setActiveCueIndex(nextCueIndex);
  };

  const changeSpeed = () => {
    const currentIndex = playbackRates.indexOf(speed);
    const nextSpeed = playbackRates[(currentIndex + 1) % playbackRates.length];
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
    setSpeed(nextSpeed);
  };

  return (
    <section className="guide-player" aria-label={guide.title}>
      <audio
        key={cue.src}
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}${cue.src}`}
        preload="auto"
        onLoadStart={() => setBuffering(true)}
        onCanPlay={(event) => {
          const audio = event.currentTarget;
          audio.playbackRate = speed;
          if (pendingLocalPositionRef.current > 0) {
            audio.currentTime = pendingLocalPositionRef.current;
            pendingLocalPositionRef.current = 0;
          }
          setBuffering(false);
          if (shouldPlayRef.current) void playCurrentCue();
        }}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => {
          setPlaying(true);
          setBuffering(false);
        }}
        onPause={() => {
          if (!shouldPlayRef.current) setPlaying(false);
        }}
        onTimeUpdate={(event) =>
          setPosition(
            Math.min(cue.start + event.currentTarget.currentTime, duration),
          )
        }
        onEnded={() => {
          const nextCueIndex = activeCueIndex + 1;
          if (nextCueIndex < guide.cues.length) {
            pendingLocalPositionRef.current = 0;
            setPosition(guide.cues[nextCueIndex].start);
            setBuffering(true);
            setActiveCueIndex(nextCueIndex);
            return;
          }
          shouldPlayRef.current = false;
          setPlaying(false);
          setPosition(duration);
        }}
        onError={() => {
          shouldPlayRef.current = false;
          setPlaying(false);
          setBuffering(false);
          setAudioError("语音加载失败，请阅读下方完整文稿。");
        }}
      />

      <div className="player-main">
        <button
          className="player-toggle"
          onClick={togglePlayback}
          aria-label={playing ? "暂停导览" : "播放导览"}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <div>
          <p>{guide.title}</p>
          <strong>{chapter.title}</strong>
          <span>
            {formatTime(position)} / {formatTime(duration)}
            {buffering && !audioError ? " · 正在加载" : ""}
          </span>
        </div>
        <button
          className="speed-button"
          onClick={changeSpeed}
          aria-label={`切换播放速度，当前 ${speed} 倍速`}
        >
          {speed}×
        </button>
      </div>

      <input
        className="player-progress"
        type="range"
        min="0"
        max={duration}
        step="0.1"
        value={Math.min(position, duration)}
        onChange={(event) => seekTo(Number(event.target.value))}
        aria-label="导览播放进度"
      />

      <div className="chapter-row" aria-label="导览章节">
        {guide.chapters.map((item) => (
          <button
            key={item.id}
            className={chapter.id === item.id ? "active" : ""}
            onClick={() => seekTo(item.start)}
            aria-pressed={chapter.id === item.id}
          >
            {item.title}
          </button>
        ))}
      </div>

      <section className="transcript" aria-label="同步文字稿">
        <header className="transcript-head">
          <strong>同步文字稿</strong>
          <span>点击章节或句子可跳转</span>
        </header>
        <p className="sr-only" aria-live="polite">
          当前朗读：{cue.text}
        </p>
        <div className="transcript-body" ref={transcriptRef}>
          {guide.chapters.map((item) => (
            <section className="transcript-chapter" key={item.id}>
              <h3>
                <button
                  onClick={() => seekTo(item.start)}
                  aria-current={chapter.id === item.id ? "true" : undefined}
                >
                  {item.title}
                </button>
              </h3>
              <p className="transcript-paragraph">
                {guide.cues
                  .filter(({ chapterId }) => chapterId === item.id)
                  .map((itemCue) => {
                    const itemCueIndex = guide.cues.indexOf(itemCue);
                    const active = activeCueIndex === itemCueIndex;
                    return (
                      <span
                        ref={active ? activeCueRef : undefined}
                        className={`transcript-cue ${active ? "active" : ""}`}
                        key={itemCue.src}
                        role="button"
                        tabIndex={0}
                        onClick={() => seekTo(itemCue.start)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            seekTo(itemCue.start);
                          }
                        }}
                        aria-current={active ? "true" : undefined}
                        aria-label={`跳转到 ${formatTime(itemCue.start)}：${itemCue.text}`}
                      >
                        {itemCue.text}
                      </span>
                    );
                  })}
              </p>
            </section>
          ))}
        </div>
      </section>

      {audioError && (
        <p className="audio-error" role="alert">
          {audioError}
        </p>
      )}

      <div className="player-actions">
        <button
          className="restart-button"
          onClick={() => {
            shouldPlayRef.current = false;
            audioRef.current?.pause();
            seekTo(0);
          }}
        >
          <RotateCcw />
          从头开始
        </button>
        <span>{guide.audio.disclosure}</span>
      </div>

      <details className="guide-sources">
        <summary>文稿来源与说明</summary>
        <p className="guide-rights">
          更新于 {guide.updatedAt}。{guide.audio.rights}
        </p>
        <ul>
          {guide.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
};

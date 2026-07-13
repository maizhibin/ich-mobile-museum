import { Pause, Play, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { jingjuAudioGuide } from "../../content/audioGuides";

const playbackRates = [1, 1.25, 0.75] as const;

const formatTime = (value: number) =>
  `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;

export const AudioGuidePlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(
    jingjuAudioGuide.audio.durationSeconds,
  );
  const [speed, setSpeed] = useState<(typeof playbackRates)[number]>(1);
  const [buffering, setBuffering] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  const chapter =
    [...jingjuAudioGuide.chapters]
      .reverse()
      .find(({ start }) => position >= start) ?? jingjuAudioGuide.chapters[0];
  const cue =
    [...jingjuAudioGuide.cues]
      .reverse()
      .find(({ start }) => position >= start) ?? jingjuAudioGuide.cues[0];

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    setAudioError(null);
    try {
      await audio.play();
    } catch {
      setAudioError("语音暂时无法播放，请稍后重试或阅读完整文稿。");
    }
  };

  const seekTo = (nextPosition: number) => {
    if (audioRef.current) audioRef.current.currentTime = nextPosition;
    setPosition(nextPosition);
  };

  const changeSpeed = () => {
    const currentIndex = playbackRates.indexOf(speed);
    const nextSpeed = playbackRates[(currentIndex + 1) % playbackRates.length];
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
    setSpeed(nextSpeed);
  };

  return (
    <section className="guide-player" aria-label="京剧三分钟语音导览">
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadStart={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => {
          setPlaying(true);
          setBuffering(false);
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setPosition(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          if (Number.isFinite(event.currentTarget.duration)) {
            setDuration(event.currentTarget.duration);
          }
        }}
        onEnded={() => {
          setPlaying(false);
          setPosition(duration);
        }}
        onError={() => {
          setPlaying(false);
          setBuffering(false);
          setAudioError("语音加载失败，请阅读下方完整文稿。");
        }}
      >
        <source
          src={`${import.meta.env.BASE_URL}${jingjuAudioGuide.audio.src}`}
          type={jingjuAudioGuide.audio.mimeType}
        />
      </audio>

      <div className="player-main">
        <button
          className="player-toggle"
          onClick={togglePlayback}
          aria-label={playing ? "暂停导览" : "播放导览"}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <div>
          <p>{jingjuAudioGuide.title}</p>
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
        {jingjuAudioGuide.chapters.map((item) => (
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

      <details className="transcript" open>
        <summary>同步文字稿</summary>
        <p aria-live="polite">{cue.text}</p>
      </details>

      {audioError && (
        <p className="audio-error" role="alert">
          {audioError}
        </p>
      )}

      <div className="player-actions">
        <button
          className="restart-button"
          onClick={() => {
            audioRef.current?.pause();
            seekTo(0);
          }}
        >
          <RotateCcw />
          从头开始
        </button>
        <span>{jingjuAudioGuide.audio.disclosure}</span>
      </div>

      <details className="full-transcript">
        <summary>查看完整文稿与来源</summary>
        {jingjuAudioGuide.chapters.map((item) => (
          <section key={item.id}>
            <h3>{item.title}</h3>
            <p>
              {jingjuAudioGuide.cues
                .filter(({ chapterId }) => chapterId === item.id)
                .map(({ text }) => text)
                .join("")}
            </p>
          </section>
        ))}
        <p className="guide-rights">
          更新于 {jingjuAudioGuide.updatedAt}。{jingjuAudioGuide.audio.rights}
        </p>
        <ul>
          {jingjuAudioGuide.sources.map((source) => (
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

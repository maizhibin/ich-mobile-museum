import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Chapter = { title: string; start: number; transcript: string };
const chapters: Chapter[] = [
  {
    title: "从徽班进京说起",
    start: 0,
    transcript:
      "京剧形成于清代中后期。徽班进京后，与汉调、昆曲及北京地方声腔不断交流，逐渐形成新的舞台艺术。",
  },
  {
    title: "一张脸如何说话",
    start: 45,
    transcript:
      "脸谱的色彩、线条和构图帮助观众快速认识人物，但颜色寓意并不是脱离角色和剧目而存在的固定答案。",
  },
  {
    title: "一桌二椅的想象",
    start: 90,
    transcript:
      "京剧舞台重写意。演员用圆场表示赶路，用马鞭表示骑马，让观众共同完成舞台空间。",
  },
];
const duration = 135;

export const AudioGuidePlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<number | undefined>(undefined);
  const chapter =
    [...chapters].reverse().find((item) => position >= item.start) ??
    chapters[0];

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(
      () =>
        setPosition((current) => {
          if (current >= duration) {
            setPlaying(false);
            return 0;
          }
          return Math.min(duration, current + speed);
        }),
      1000,
    );
    return () => window.clearInterval(timer.current);
  }, [playing, speed]);

  const time = (value: number) =>
    `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  return (
    <section className="guide-player" aria-label="京剧三分钟语音导览">
      <div className="player-main">
        <button
          className="player-toggle"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "暂停导览" : "播放导览"}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <div>
          <p>三分钟认识京剧</p>
          <strong>{chapter.title}</strong>
          <span>
            {time(position)} / {time(duration)}
          </span>
        </div>
        <button
          className="speed-button"
          onClick={() =>
            setSpeed((value) =>
              value === 1 ? 0.75 : value === 0.75 ? 1.25 : 1,
            )
          }
          aria-label="切换播放速度"
        >
          {speed}×
        </button>
      </div>
      <input
        className="player-progress"
        type="range"
        min="0"
        max={duration}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label="导览播放进度"
      />
      <div className="chapter-row">
        {chapters.map((item) => (
          <button
            key={item.start}
            className={chapter.start === item.start ? "active" : ""}
            onClick={() => setPosition(item.start)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <details className="transcript" open>
        <summary>同步文字稿</summary>
        <p aria-live="polite">{chapter.transcript}</p>
      </details>
      <button
        className="restart-button"
        onClick={() => {
          setPosition(0);
          setPlaying(false);
        }}
      >
        <RotateCcw />
        从头开始
      </button>
    </section>
  );
};

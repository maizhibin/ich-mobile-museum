import { Link2, Pause, Play, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { ExhibitionFoundation } from "../../content/schema";

const playConceptAtmosphere = (durationSeconds: number) => {
  const AudioContextConstructor = window.AudioContext;
  const context = new AudioContextConstructor();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.5);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + durationSeconds,
  );
  gain.connect(context.destination);
  [196, 246.94, 293.66].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index * 5;
    oscillator.connect(gain);
    oscillator.start();
    oscillator.stop(context.currentTime + durationSeconds);
  });
  window.setTimeout(() => void context.close(), durationSeconds * 1000 + 100);
  return context;
};

export const AtmosphereIntro = ({
  foundation,
}: {
  foundation: ExhibitionFoundation;
}) => {
  const [open, setOpen] = useState(true);
  const [playing, setPlaying] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const stop = () => {
    void contextRef.current?.close();
    contextRef.current = null;
    setPlaying(false);
  };
  useEffect(() => () => stop(), []);
  if (!open) return null;
  const toggle = async () => {
    if (playing) return stop();
    stop();
    contextRef.current = playConceptAtmosphere(
      foundation.atmosphere.durationSeconds,
    );
    setPlaying(true);
    window.setTimeout(
      () => setPlaying(false),
      foundation.atmosphere.durationSeconds * 1000,
    );
  };
  return (
    <section
      className="atmosphere-intro"
      aria-label={`${foundation.atmosphere.title}氛围入口`}
    >
      <p>15 秒氛围入口</p>
      <h2>{foundation.atmosphere.title}</h2>
      <span>{foundation.atmosphere.description}</span>
      <div>
        <button type="button" onClick={toggle} aria-pressed={playing}>
          {playing ? <Pause /> : <Play />}
          {playing ? "停止氛围声" : "播放概念氛围声"}
        </button>
        <button
          type="button"
          onClick={() => {
            stop();
            setOpen(false);
          }}
        >
          进入展厅
        </button>
      </div>
      <small>{foundation.atmosphere.disclosure}</small>
    </section>
  );
};

export const ExhibitionTakeaway = ({
  foundation,
}: {
  foundation: ExhibitionFoundation;
}) => {
  const [message, setMessage] = useState("");
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share)
        await navigator.share({
          title: foundation.takeaway.nextLabel,
          text: foundation.takeaway.learningCard,
          url,
        });
      else {
        await navigator.clipboard.writeText(url);
        setMessage("链接已复制，可分享给朋友。");
      }
    } catch {
      setMessage("未完成分享；你仍可复制浏览器地址分享。");
    }
  };
  return (
    <>
      <section className="safeguard-panel">
        <p className="eyebrow">保护进行时</p>
        <h2>{foundation.safeguard.title}</h2>
        <p>{foundation.safeguard.summary}</p>
        <ul>
          {foundation.safeguard.actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
        <a
          href={
            foundation.sources.find(
              (item) => item.id === foundation.safeguard.sourceId,
            )?.url
          }
          target="_blank"
          rel="noreferrer"
        >
          查看保护来源
        </a>
      </section>
      <section className="takeaway-panel">
        <p className="eyebrow dark">带走一张学习卡</p>
        <blockquote>{foundation.takeaway.learningCard}</blockquote>
        <div>
          <button type="button" onClick={share}>
            <Share2 /> 分享展厅
          </button>
          <Link to={`/exhibitions/${foundation.takeaway.nextExhibitionId}`}>
            <Link2 /> {foundation.takeaway.nextLabel}
          </Link>
        </div>
        {message && <p role="status">{message}</p>}
      </section>
      <details className="content-ledger">
        <summary>内容台账与来源</summary>
        <p>
          当前已登记 {foundation.assets.length} 件资产；精品标准为至少 8
          件合规资产。社区视角当前 {foundation.communityNodes.length}{" "}
          项，后续须补足至少 2 项有来源节点。
        </p>
        <ul>
          {foundation.assets.map((asset) => (
            <li key={asset.id}>
              <strong>{asset.title}</strong>：{asset.rights}
              {asset.disclosure ? ` ${asset.disclosure}` : ""}
            </li>
          ))}
        </ul>
        <p>社区与传承视角</p>
        <ul>
          {foundation.communityNodes.map((node) => (
            <li key={node.id}>
              {node.title}：
              <a
                href={
                  foundation.sources.find((item) => item.id === node.sourceId)
                    ?.url
                }
                target="_blank"
                rel="noreferrer"
              >
                查看来源
              </a>
            </li>
          ))}
        </ul>
        <ul>
          {foundation.factSources.map((fact) => (
            <li key={fact.id}>
              {fact.label}：
              <a
                href={
                  foundation.sources.find((item) => item.id === fact.sourceId)
                    ?.url
                }
                target="_blank"
                rel="noreferrer"
              >
                查看来源
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
};

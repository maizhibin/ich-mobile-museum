import { Image as ImageIcon, MoveHorizontal, X } from "lucide-react";
import { useRef, useState } from "react";

export const PanoramaViewer = ({ onClose }: { onClose: () => void }) => {
  const [position, setPosition] = useState(50);
  const [fallback, setFallback] = useState(false);
  const dragging = useRef<{ start: number; position: number } | null>(null);
  const move = (next: number) => setPosition(Math.max(0, Math.min(100, next)));
  return (
    <div
      className="panorama-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="京剧后台全景"
    >
      <header>
        <div>
          <small>360° 漫游</small>
          <strong>京剧后台</strong>
        </div>
        <button onClick={onClose} aria-label="关闭全景">
          <X />
        </button>
      </header>
      {fallback ? (
        <figure className="panorama-fallback">
          <img
            src={`${import.meta.env.BASE_URL}assets/jingju-backstage.png`}
            alt="京剧演员在后台镜前勾画脸谱，学员在旁观摩"
          />
          <figcaption>
            图文降级模式：后台的戏服、化妆与乐器共同支撑一场演出。
          </figcaption>
        </figure>
      ) : (
        <div
          className="panorama-stage"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") move(position - 5);
            if (event.key === "ArrowRight") move(position + 5);
          }}
          onPointerDown={(event) => {
            dragging.current = { start: event.clientX, position };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (dragging.current)
              move(
                dragging.current.position -
                  (event.clientX - dragging.current.start) / 5,
              );
          }}
          onPointerUp={() => {
            dragging.current = null;
          }}
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}assets/jingju-panorama.png)`,
            backgroundPosition: `${position}% center`,
          }}
        >
          <span>
            <MoveHorizontal />
            拖动或使用左右方向键
          </span>
          <button className="hotspot costume" onClick={() => move(24)}>
            戏服架
          </button>
          <button className="hotspot makeup" onClick={() => move(52)}>
            化妆台
          </button>
          <button className="hotspot music" onClick={() => move(78)}>
            文武场
          </button>
        </div>
      )}
      <footer>
        <button onClick={() => setFallback((value) => !value)}>
          <ImageIcon />
          {fallback ? "返回全景模式" : "切换图文模式"}
        </button>
        <p>如果设备不适合运行全景，可随时使用等价图文内容。</p>
      </footer>
    </div>
  );
};

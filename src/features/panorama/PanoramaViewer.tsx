import { Image as ImageIcon, X } from "lucide-react";
import { lazy, Suspense, useCallback, useState } from "react";

const SphereViewer = lazy(() =>
  import("./SphereViewer").then(({ SphereViewer: Component }) => ({
    default: Component,
  })),
);

export const PanoramaViewer = ({ onClose }: { onClose: () => void }) => {
  const [fallback, setFallback] = useState(false);
  const showFallback = useCallback(() => setFallback(true), []);

  return (
    <div
      className="panorama-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="京剧后台全景"
    >
      <header>
        <div>
          <small>360° 球面漫游 · AI 概念全景</small>
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
        <Suspense
          fallback={
            <div className="sphere-loading" role="status">
              正在准备球面播放器……
            </div>
          }
        >
          <SphereViewer onError={showFallback} />
        </Suspense>
      )}
      <footer>
        <button onClick={() => setFallback((value) => !value)}>
          <ImageIcon />
          {fallback ? "返回全景模式" : "切换图文模式"}
        </button>
        <p>
          全景为 AI
          生成的空间概念图，并非历史影像或真实馆藏；设备不适合运行时可使用等价图文内容。
        </p>
      </footer>
    </div>
  );
};

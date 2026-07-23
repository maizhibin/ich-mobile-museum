import { Image as ImageIcon, X } from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { panoramaConfigs, type PanoramaKind } from "./panoramaConfigs";

const SphereViewer = lazy(() =>
  import("./SphereViewer").then(({ SphereViewer: Component }) => ({
    default: Component,
  })),
);

export const PanoramaViewer = ({
  kind = "jingju",
  onClose,
}: {
  kind?: PanoramaKind;
  onClose: () => void;
}) => {
  const [fallback, setFallback] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const config = panoramaConfigs[kind];
  const showFallback = useCallback(() => setFallback(true), []);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="panorama-dialog"
      role="dialog"
      aria-modal="true"
      aria-label={config.dialogLabel}
    >
      <header>
        <div>
          <small>{config.eyebrow}</small>
          <strong>{config.title}</strong>
        </div>
        <button ref={closeButtonRef} onClick={onClose} aria-label="关闭全景">
          <X />
        </button>
      </header>
      {fallback ? (
        <figure className="panorama-fallback">
          <img
            src={`${import.meta.env.BASE_URL}${config.fallbackImage}`}
            alt={config.fallbackAlt}
          />
          <figcaption>{config.fallbackCaption}</figcaption>
        </figure>
      ) : (
        <Suspense
          fallback={
            <div className="sphere-loading" role="status">
              正在准备球面播放器……
            </div>
          }
        >
          <SphereViewer config={config} onError={showFallback} />
        </Suspense>
      )}
      <footer>
        <button onClick={() => setFallback((value) => !value)}>
          <ImageIcon />
          {fallback ? "返回全景模式" : "切换图文模式"}
        </button>
        <p>{config.disclosure}</p>
      </footer>
    </div>
  );
};

import { Viewer, events } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { useEffect, useRef } from "react";
import type { PanoramaConfig } from "./panoramaConfigs";

type SphereViewerProps = {
  config: PanoramaConfig;
  onError: () => void;
};

export const SphereViewer = ({ config, onError }: SphereViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let viewer: Viewer | undefined;
    const container = containerRef.current;
    const initializationFrame = window.requestAnimationFrame(() => {
      try {
        viewer = new Viewer({
          container,
          panorama: `${import.meta.env.BASE_URL}${config.panorama}`,
          caption: config.caption,
          description: config.description,
          loadingTxt: config.loadingText,
          defaultYaw: config.defaultYaw,
          defaultPitch: 0,
          defaultZoomLvl: 35,
          minFov: 30,
          maxFov: 90,
          keyboard: "always",
          navbar: [
            "zoom",
            "move",
            "gyroscope",
            "markers",
            "markersList",
            "caption",
            "fullscreen",
          ],
          lang: {
            zoom: "缩放",
            zoomOut: "缩小",
            zoomIn: "放大",
            moveUp: "向上",
            moveDown: "向下",
            moveLeft: "向左",
            moveRight: "向右",
            fullscreen: "全屏",
            menu: "菜单",
            gyroscope: "陀螺仪",
            markers: "显示或隐藏讲解点",
            markersList: "讲解点列表",
            close: "关闭",
          },
          plugins: [
            MarkersPlugin.withConfig({
              markers: config.markers,
              defaultHoverScale: { amount: 1.15, duration: 120 },
            }),
            GyroscopePlugin.withConfig({ moveMode: "smooth" }),
          ],
        });

        viewer.addEventListener(events.PanoramaErrorEvent.type, onError);
      } catch {
        onError();
      }
    });

    return () => {
      window.cancelAnimationFrame(initializationFrame);
      viewer?.destroy();
    };
  }, [config, onError]);

  return (
    <div
      ref={containerRef}
      className="sphere-viewer"
      aria-label={config.ariaLabel}
    />
  );
};

import { Viewer, events } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { useEffect, useRef } from "react";

const markers = [
  {
    id: "costume",
    position: { yaw: "-68deg", pitch: "2deg" },
    html: '<span class="vr-hotspot">戏服架</span>',
    anchor: "center bottom",
    tooltip: "戏服架：蟒、帔、靠等服饰共同塑造舞台身份",
    content:
      "<h2>戏服架</h2><p>京剧服装通过纹样、色彩与形制提示人物的身份、性格和处境。此画面为 AI 生成概念示意，不是历史影像或真实后台复原。</p>",
    listContent: "戏服架",
  },
  {
    id: "makeup",
    position: { yaw: "-180deg", pitch: "-8deg" },
    html: '<span class="vr-hotspot">化妆台</span>',
    anchor: "center bottom",
    tooltip: "化妆台：勾脸、梳头与穿戴的准备空间",
    content:
      "<h2>化妆台</h2><p>演员在登台前完成勾脸、梳头、盔头和穿戴等准备。脸谱与妆容是角色塑造的一部分，并非对现实人物相貌的写实描摹。</p>",
    listContent: "化妆台",
  },
  {
    id: "music",
    position: { yaw: "68deg", pitch: "1deg" },
    html: '<span class="vr-hotspot">文武场</span>',
    anchor: "center bottom",
    tooltip: "文武场：京胡、月琴与锣鼓等伴奏乐器",
    content:
      "<h2>文武场</h2><p>京剧伴奏通常分为以京胡等弦管乐器为主的文场，以及以鼓板、锣、钹等打击乐器为主的武场。</p>",
    listContent: "文武场",
  },
] as const;

type SphereViewerProps = {
  onError: () => void;
};

export const SphereViewer = ({ onError }: SphereViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let viewer: Viewer | undefined;
    const container = containerRef.current;
    const initializationFrame = window.requestAnimationFrame(() => {
      try {
        viewer = new Viewer({
          container,
          panorama: `${import.meta.env.BASE_URL}panoramas/jingju-backstage-concept-4096.jpg`,
          caption: "京剧后台 · AI 概念全景（非真实馆藏）",
          description:
            "使用鼠标、触控或方向键环视；点击标记查看戏服、化妆与文武场说明。",
          loadingTxt: "正在进入概念全景……",
          defaultYaw: "-180deg",
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
              markers: [...markers],
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
  }, [onError]);

  return (
    <div
      ref={containerRef}
      className="sphere-viewer"
      aria-label="京剧后台 AI 概念球面全景"
    />
  );
};

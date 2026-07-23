import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const gallery = [
  {
    id: "stage",
    src: "assets/jingju-stage-concept.webp",
    title: "写意舞台",
    description: "一桌二椅与演员的程式动作，共同唤起观众对时空的想象。",
    alt: "AI 概念插画：京剧演员在一桌二椅构成的写意舞台上表演",
  },
  {
    id: "makeup",
    src: "assets/jingju-makeup-concept.webp",
    title: "妆容与脸谱",
    description: "色彩、纹样与勾画方式服务于具体人物和剧目的舞台塑造。",
    alt: "AI 概念插画：京剧演员对镜勾画脸谱",
  },
  {
    id: "costume",
    src: "assets/jingju-costume-concept.webp",
    title: "穿戴成角",
    description: "服装的形制、纹样与色彩帮助观众辨认人物身份和处境。",
    alt: "AI 概念插画：绣有传统纹样的京剧戏服与盔头",
  },
  {
    id: "instruments",
    src: "assets/jingju-instruments-concept.webp",
    title: "文武场",
    description: "京胡等弦管乐与鼓板、锣钹等打击乐共同推动舞台节奏。",
    alt: "AI 概念插画：京胡、月琴、鼓板和锣钹等京剧伴奏乐器",
  },
] as const;

export const JingjuImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex];
  const goTo = (index: number) => {
    setActiveIndex((index + gallery.length) % gallery.length);
  };

  return (
    <section
      className="tea-gallery jingju-gallery"
      role="region"
      aria-roledescription="跑马灯"
      aria-labelledby="jingju-gallery-title"
    >
      <div className="tea-gallery-head">
        <div>
          <p className="eyebrow dark">看见一台戏</p>
          <h2 id="jingju-gallery-title">从后台准备到台前呈现</h2>
        </div>
        <span>AI 概念插画</span>
      </div>
      <figure
        role="group"
        aria-roledescription="画面"
        aria-label={`${activeIndex + 1} / ${gallery.length}：${activeImage.title}`}
      >
        <img
          key={activeImage.id}
          src={`${import.meta.env.BASE_URL}${activeImage.src}`}
          alt={activeImage.alt}
        />
        <figcaption aria-live="polite">
          <strong>{activeImage.title}</strong>
          <span>{activeImage.description}</span>
        </figcaption>
        <div className="tea-gallery-controls" aria-label="切换京剧图片">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="上一张京剧图片"
          >
            <ChevronLeft />
          </button>
          <div role="group" aria-label="选择京剧图片">
            {gallery.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`查看：${image.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="下一张京剧图片"
          >
            <ChevronRight />
          </button>
        </div>
      </figure>
    </section>
  );
};

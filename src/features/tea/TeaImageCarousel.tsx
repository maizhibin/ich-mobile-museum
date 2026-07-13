import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { TeaExhibition } from "../../content/schema";

type TeaImageCarouselProps = {
  gallery: TeaExhibition["gallery"];
};

export const TeaImageCarousel = ({ gallery }: TeaImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex] ?? gallery[0];
  const goTo = (index: number) => {
    setActiveIndex((index + gallery.length) % gallery.length);
  };

  return (
    <section className="tea-gallery" aria-labelledby="tea-gallery-title">
      <div className="tea-gallery-head">
        <div>
          <p className="eyebrow dark">看见茶的现场</p>
          <h2 id="tea-gallery-title">从一片叶到一席茶</h2>
        </div>
        <span>AI 概念插画</span>
      </div>
      <figure>
        <img
          src={`${import.meta.env.BASE_URL}${activeImage.src}`}
          alt={activeImage.alt}
        />
        <figcaption aria-live="polite">
          <strong>{activeImage.title}</strong>
          <span>{activeImage.description}</span>
        </figcaption>
        <div className="tea-gallery-controls" aria-label="切换茶文化图片">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="上一张图片"
          >
            <ChevronLeft />
          </button>
          <div>
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
            aria-label="下一张图片"
          >
            <ChevronRight />
          </button>
        </div>
      </figure>
    </section>
  );
};

import { useRef, useState } from "react";
import type { TeaExhibition } from "../../content/schema";

type TeaPracticeCompareProps = {
  exhibition: TeaExhibition;
};

export const TeaPracticeCompare = ({ exhibition }: TeaPracticeCompareProps) => {
  const [activeId, setActiveId] = useState(exhibition.regionalPractices[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activePractice =
    exhibition.regionalPractices.find(({ id }) => id === activeId) ??
    exhibition.regionalPractices[0];
  const focusedSteps = activePractice.processFocus
    .map((stepId) => exhibition.process.steps.find(({ id }) => id === stepId))
    .filter((step): step is NonNullable<typeof step> => Boolean(step));

  const selectPractice = (index: number) => {
    const practice = exhibition.regionalPractices[index];
    if (!practice) return;
    setActiveId(practice.id);
    tabRefs.current[index]?.focus();
  };

  return (
    <section className="tea-compare" aria-labelledby="tea-compare-title">
      <p className="eyebrow dark">地方实践</p>
      <h2 id="tea-compare-title">同一总项目，多样地方经验</h2>
      <p className="body-copy">
        选择一个示例，查看它在流程中突出的观察点；这些示例不具有独立 UNESCO
        名录身份。
      </p>
      <div
        className="tea-practice-tabs"
        role="tablist"
        aria-label="地方实践示例"
      >
        {exhibition.regionalPractices.map((practice, index) => {
          const selected = practice.id === activePractice.id;
          return (
            <button
              key={practice.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`tea-practice-tab-${practice.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="tea-practice-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectPractice(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  selectPractice(
                    (index + 1) % exhibition.regionalPractices.length,
                  );
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  selectPractice(
                    (index - 1 + exhibition.regionalPractices.length) %
                      exhibition.regionalPractices.length,
                  );
                }
              }}
            >
              {practice.name}
            </button>
          );
        })}
      </div>
      <article
        id="tea-practice-panel"
        className="tea-practice-panel"
        role="tabpanel"
        aria-labelledby={`tea-practice-tab-${activePractice.id}`}
      >
        <div>
          <span>{activePractice.teaCategory}</span>
          <span>{activePractice.place}</span>
        </div>
        <h3>{activePractice.name}</h3>
        <p>{activePractice.summary}</p>
        <strong>流程观察点</strong>
        <ul>
          {focusedSteps.map((step) => (
            <li key={step.id}>
              {step.order}. {step.title}
            </li>
          ))}
        </ul>
        <small>{activePractice.disclosure}</small>
      </article>
    </section>
  );
};

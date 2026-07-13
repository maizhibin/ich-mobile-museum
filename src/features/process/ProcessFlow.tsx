import type { ProcessFlowData } from "../../content/schema";

type ProcessFlowProps = {
  flow: ProcessFlowData;
  activeStepId: string;
  onStepChange: (stepId: string) => void;
};

export const ProcessFlow = ({
  flow,
  activeStepId,
  onStepChange,
}: ProcessFlowProps) => {
  const activeStep =
    flow.steps.find(({ id }) => id === activeStepId) ?? flow.steps[0];

  return (
    <section className="process-flow" aria-labelledby={`${flow.id}-title`}>
      <p className="eyebrow dark">互动流程</p>
      <h2 id={`${flow.id}-title`}>{flow.title}</h2>
      <div className="process-step-list" aria-label={flow.accessibilityLabel}>
        {flow.steps.map((step) => {
          const selected = step.id === activeStep.id;
          return (
            <button
              key={step.id}
              type="button"
              className={selected ? "active" : undefined}
              aria-pressed={selected}
              onClick={() => onStepChange(step.id)}
            >
              <span aria-hidden="true">{step.order}</span>
              <strong>{step.title}</strong>
            </button>
          );
        })}
      </div>
      <article className="process-step-detail" aria-live="polite">
        <p>
          第 {activeStep.order} 步 · {activeStep.title}
        </p>
        <h3>{activeStep.summary}</h3>
        <p>{activeStep.detail}</p>
        <ul aria-label={`${activeStep.title}关键词`}>
          {activeStep.keywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
      </article>
    </section>
  );
};

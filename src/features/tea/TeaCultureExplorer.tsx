import { useState } from "react";
import type { TeaExhibition } from "../../content/schema";

type TeaCultureExplorerProps = {
  exhibition: TeaExhibition;
};

export const TeaCultureExplorer = ({ exhibition }: TeaCultureExplorerProps) => {
  const [makingPathId, setMakingPathId] = useState(
    exhibition.makingPaths[0].id,
  );
  const [contextId, setContextId] = useState(exhibition.socialContexts[0].id);
  const [wareId, setWareId] = useState(exhibition.teaWare[0].id);
  const makingPath =
    exhibition.makingPaths.find(({ id }) => id === makingPathId) ??
    exhibition.makingPaths[0];
  const context =
    exhibition.socialContexts.find(({ id }) => id === contextId) ??
    exhibition.socialContexts[0];
  const ware =
    exhibition.teaWare.find(({ id }) => id === wareId) ?? exhibition.teaWare[0];
  const pathSteps = makingPath.focusSteps
    .map((id) => exhibition.process.steps.find((step) => step.id === id))
    .filter((step): step is NonNullable<typeof step> => Boolean(step));

  return (
    <div className="tea-explorer">
      <section className="tea-map" aria-labelledby="tea-map-title">
        <p className="eyebrow dark">茶山与地方性</p>
        <h2 id="tea-map-title">五个入口，读一片叶的地方经验</h2>
        <p className="body-copy">
          这是一张关系示意图，不代替地理地图。点开一处，沿着它突出的工序重新回看一片叶子的旅程。
        </p>
        <div className="tea-region-grid">
          {exhibition.regionalPractices.map((practice) => (
            <button
              key={practice.id}
              type="button"
              onClick={() => {
                const target = document.getElementById("practices");
                target?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <strong>{practice.name}</strong>
              <span>{practice.place}</span>
              <small>{practice.teaCategory}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="tea-lab" aria-labelledby="tea-lab-title">
        <p className="eyebrow">制茶实验台</p>
        <h2 id="tea-lab-title">同一鲜叶，不同判断路径</h2>
        <div className="tea-lab-picker" aria-label="选择制茶观察路径">
          {exhibition.makingPaths.map((path) => (
            <button
              key={path.id}
              type="button"
              className={path.id === makingPath.id ? "active" : undefined}
              aria-pressed={path.id === makingPath.id}
              onClick={() => setMakingPathId(path.id)}
            >
              <strong>{path.title}</strong>
              <span>{path.label}</span>
            </button>
          ))}
        </div>
        <article className="tea-lab-result" aria-live="polite">
          <p>{makingPath.summary}</p>
          <ol>
            {makingPath.processNotes.map((note, index) => (
              <li key={note}>
                <span>{index + 1}</span>
                {note}
              </li>
            ))}
          </ol>
          <div>
            {pathSteps.map((step) => (
              <span key={step.id}>{step.title}</span>
            ))}
          </div>
          <small>{makingPath.disclosure}</small>
        </article>
      </section>

      <section className="tea-social" aria-labelledby="tea-social-title">
        <p className="eyebrow dark">茶席任务</p>
        <h2 id="tea-social-title">让一杯茶进入关系</h2>
        <div
          className="tea-context-picker"
          role="radiogroup"
          aria-label="选择饮茶场景"
        >
          {exhibition.socialContexts.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={item.id === context.id}
              className={item.id === context.id ? "active" : undefined}
              onClick={() => setContextId(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <article className="tea-context-result" aria-live="polite">
          <strong>{context.prompt}</strong>
          <p>{context.response}</p>
          <div>
            {context.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="tea-ware" aria-labelledby="tea-ware-title">
        <p className="eyebrow dark">器物观察</p>
        <h2 id="tea-ware-title">让动作有了停靠的地方</h2>
        <div className="tea-ware-picker" aria-label="选择茶器">
          {exhibition.teaWare.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === ware.id ? "active" : undefined}
              aria-pressed={item.id === ware.id}
              onClick={() => setWareId(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <article className="tea-ware-result" aria-live="polite">
          <span aria-hidden="true">器</span>
          <div>
            <p>{ware.role}</p>
            <h3>{ware.name}</h3>
            <p>{ware.description}</p>
            <small>{ware.materialHint}</small>
          </div>
        </article>
      </section>
    </div>
  );
};

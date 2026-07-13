import { Heart } from "lucide-react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useUserPreferences } from "../app/UserPreferences";
import { AppHeader } from "../components/AppHeader";
import { IdentityBadge } from "../components/IdentityBadge";
import { teaExhibition } from "../content/tea";
import { ProcessFlow } from "../features/process/ProcessFlow";
import { TeaPracticeCompare } from "../features/tea/TeaPracticeCompare";
import { TeaCultureExplorer } from "../features/tea/TeaCultureExplorer";

const topics = [
  { id: "intro", label: "初识" },
  { id: "process", label: "流程" },
  { id: "explore", label: "探索" },
  { id: "practices", label: "实践" },
  { id: "sources", label: "来源" },
] as const;

export const TeaPage = () => {
  const { addHistory, favorites, toggleFavorite } = useUserPreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTopic = searchParams.get("section");
  const requestedStep = searchParams.get("step");
  const activeStep =
    teaExhibition.process.steps.find(({ id }) => id === requestedStep)?.id ??
    teaExhibition.process.steps[0].id;
  const liked = favorites.includes(teaExhibition.id);

  useEffect(() => addHistory(teaExhibition.id), [addHistory]);
  useEffect(() => {
    const topic = topics.find(({ id }) => id === activeTopic);
    if (!topic) return;
    const frame = window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document.getElementById(topic.id)?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeTopic]);

  const updateStep = (step: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("section", "process");
    nextParams.set("step", step);
    setSearchParams(nextParams);
  };

  return (
    <>
      <section className="detail-cover tea-cover">
        <img
          src={`${import.meta.env.BASE_URL}${teaExhibition.cover}`}
          alt="概念插画：山间茶园、制茶台与茶席共同构成茶的生活场景"
        />
        <AppHeader back />
        <div className="detail-title">
          <IdentityBadge type={teaExhibition.listType} />
          <p>2022 年列入 · 茶与生活馆</p>
          <h1>{teaExhibition.name}</h1>
          <p>{teaExhibition.summary}</p>
          <button
            className="tag"
            type="button"
            onClick={() => toggleFavorite(teaExhibition.id)}
            aria-pressed={liked}
          >
            <Heart />
            {liked ? "已收藏" : "收藏"}
          </button>
        </div>
      </section>
      <nav className="topic-nav" aria-label="茶文化馆展厅目录">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`?section=${topic.id}${topic.id === "process" ? `&step=${activeStep}` : ""}`}
            aria-current={activeTopic === topic.id ? "location" : undefined}
          >
            {topic.label}
          </Link>
        ))}
      </nav>
      <div className="screen-content tea-topic">
        <section id="intro">
          <p className="eyebrow dark">从一片叶子开始</p>
          <h2>茶不只在杯中</h2>
          <p className="body-copy">{teaExhibition.description}</p>
          <div className="fact-row tea-facts">
            <div>
              <strong>2022 年</strong>
              <span>列入代表作名录</span>
            </div>
            <div>
              <strong>六大茶类</strong>
              <span>多样制作经验</span>
            </div>
            <div>
              <strong>饮与分享</strong>
              <span>连接日常生活</span>
            </div>
          </div>
        </section>
        <section id="process" className="topic-section">
          <ProcessFlow
            flow={teaExhibition.process}
            activeStepId={activeStep}
            onStepChange={updateStep}
          />
        </section>
        <section id="explore" className="topic-section">
          <TeaCultureExplorer exhibition={teaExhibition} />
        </section>
        <section id="practices" className="topic-section">
          <TeaPracticeCompare exhibition={teaExhibition} />
        </section>
        <section id="sources" className="source-panel topic-section">
          <strong>来源、更新时间与权利说明</strong>
          <p>
            内容更新于 {teaExhibition.updatedAt}。{teaExhibition.rights}
          </p>
          <ul>
            {teaExhibition.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

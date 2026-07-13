import { ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { UnescoElementCard } from "../components/UnescoElementCard";
import {
  getMuseum,
  getMuseumElements,
  unescoSourceUrl,
} from "../content/unesco";

export const MuseumPage = () => {
  const { id = "" } = useParams();
  const museum = getMuseum(id);
  if (!museum)
    return (
      <div className="screen-content">
        <h1>未找到专题馆</h1>
      </div>
    );
  const elements = getMuseumElements(id);
  return (
    <>
      <AppHeader back />
      <div className={`museum-hero museum-${id}`}>
        <span>{museum.symbol}</span>
        <p>专题馆</p>
        <h1>{museum.name}</h1>
        <strong>{museum.tagline}</strong>
      </div>
      <div className="screen-content">
        <p className="body-copy">{museum.description}</p>
        <div className="section-head">
          <div>
            <h2>UNESCO 核心展厅</h2>
            <p>{elements.length} 个项目，可从多个专题馆进入</p>
          </div>
        </div>
        <div className="element-list">
          {elements.map((element) => (
            <UnescoElementCard key={element.id} element={element} />
          ))}
        </div>
        <a
          className="source-link"
          href={unescoSourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          查看中国非遗网官方清单 <ExternalLink />
        </a>
      </div>
    </>
  );
};

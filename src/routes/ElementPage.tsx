import { ExternalLink } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { IdentityBadge } from "../components/IdentityBadge";
import { museums, unescoElements, unescoSourceUrl } from "../content/unesco";

export const ElementPage = () => {
  const { id = "" } = useParams();
  const element = unescoElements.find((item) => item.id === id);
  if (!element)
    return (
      <div className="screen-content">
        <h1>未找到项目</h1>
      </div>
    );
  if (element.id === "traditional-tea") {
    return <Navigate to="/exhibitions/traditional-tea" replace />;
  }
  return (
    <>
      <AppHeader back />
      <div className="screen-content page-header">
        <IdentityBadge type={element.listType} />
        <h1 className="element-title">{element.name}</h1>
        <p>{element.year} 年列入 / 入选 UNESCO 非物质文化遗产名录、名册。</p>
        <div className="museum-links">
          <h2>可以从这些专题馆进入</h2>
          {element.museums.map((museumId) => {
            const museum = museums.find((item) => item.id === museumId);
            return (
              museum && (
                <Link key={museum.id} to={`/museums/${museum.id}`}>
                  <span>{museum.symbol}</span>
                  <strong>{museum.name}</strong>
                </Link>
              )
            );
          })}
        </div>
        <div className="empty-panel">
          基础展厅已经建立。后续版本将补充三分钟导览、数字馆藏、人物与社区、招牌互动和保护进行时。
        </div>
        <a
          className="source-link"
          href={unescoSourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          数据来源：中国非物质文化遗产网 <ExternalLink />
        </a>
      </div>
    </>
  );
};

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { UnescoElementCard } from "../components/UnescoElementCard";
import { listTypeLabels, unescoElements } from "../content/unesco";
import type { UnescoElement } from "../content/schema";

type Filter = "ALL" | UnescoElement["listType"];
const filters: Filter[] = [
  "ALL",
  "REPRESENTATIVE",
  "URGENT_SAFEGUARDING",
  "GOOD_PRACTICE",
];

export const DiscoverPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const results = useMemo(
    () =>
      unescoElements.filter(
        (item) =>
          (filter === "ALL" || item.listType === filter) &&
          item.name
            .toLocaleLowerCase("zh-CN")
            .includes(query.trim().toLocaleLowerCase("zh-CN")),
      ),
    [filter, query],
  );
  return (
    <>
      <AppHeader />
      <div className="screen-content page-header">
        <p className="eyebrow dark">UNESCO 中国清单</p>
        <h1>发现 45 项非遗</h1>
        <p>40 项代表作、3 项急需保护项目、2 项优秀保护实践。</p>
        <label className="search-box">
          <Search />
          <span className="sr-only">搜索项目</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索京剧、剪纸、节气……"
          />
        </label>
        <div className="filter-row">
          {filters.map((item) => (
            <button
              key={item}
              className={filter === item ? "selected" : ""}
              onClick={() => setFilter(item)}
            >
              {item === "ALL" ? "全部 45 项" : listTypeLabels[item]}
            </button>
          ))}
        </div>
        <p className="result-count">找到 {results.length} 项</p>
        <div className="element-list">
          {results.map((element) => (
            <UnescoElementCard key={element.id} element={element} />
          ))}
        </div>
      </div>
    </>
  );
};

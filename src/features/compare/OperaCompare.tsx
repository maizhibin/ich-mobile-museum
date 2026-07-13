import { useState } from "react";
import type { CSSProperties } from "react";

const operas = [
  {
    id: "jingju",
    name: "京剧",
    identity: "UNESCO 核心展厅",
    makeup: "脸谱与行当妆并重",
    voice: "西皮、二黄为主要声腔",
    instruments: "京胡、月琴与锣鼓",
    roles: "生、旦、净、丑",
    stage: "写意，一桌二椅",
  },
  {
    id: "kunqu",
    name: "昆曲",
    identity: "UNESCO 核心展厅",
    makeup: "妆面细腻典雅",
    voice: "水磨腔，曲牌体",
    instruments: "曲笛、三弦、笙等",
    roles: "家门细分严谨",
    stage: "歌舞合一，身段细腻",
  },
  {
    id: "cantonese",
    name: "粤剧",
    identity: "UNESCO 核心展厅",
    makeup: "开面与地方妆式",
    voice: "梆子、二黄及地方曲牌",
    instruments: "高胡、扬琴与锣鼓",
    roles: "六柱制等表演分工",
    stage: "岭南声腔与舞台传统",
  },
  {
    id: "yueju",
    name: "越剧",
    identity: "国家级对照展项",
    makeup: "清丽写实倾向",
    voice: "板腔体，多种流派唱腔",
    instruments: "主胡、琵琶等",
    roles: "女小生、花旦等见长",
    stage: "抒情细腻，现代舞美丰富",
  },
] as const;
const dimensions = [
  { key: "makeup", label: "妆容" },
  { key: "voice", label: "唱腔" },
  { key: "instruments", label: "乐器" },
  { key: "roles", label: "行当" },
  { key: "stage", label: "舞台" },
] as const;

export const OperaCompare = () => {
  const [selected, setSelected] = useState(["jingju", "kunqu", "cantonese"]);
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 3
          ? [...current, id]
          : current,
    );
  const selectedOperas = operas.filter((opera) => selected.includes(opera.id));
  return (
    <section className="compare-lab">
      <div className="section-head">
        <div>
          <p className="eyebrow dark">横向比较台</p>
          <h2>同一方舞台，不同种声音</h2>
          <p>选择 2—3 个剧种，比较妆容、唱腔、乐器、行当与舞台。</p>
        </div>
      </div>
      <div className="compare-picker">
        {operas.map((opera) => (
          <button
            key={opera.id}
            className={selected.includes(opera.id) ? "selected" : ""}
            onClick={() => toggle(opera.id)}
            aria-pressed={selected.includes(opera.id)}
          >
            <strong>{opera.name}</strong>
            <small>{opera.identity}</small>
          </button>
        ))}
      </div>
      {selected.length < 2 && (
        <p className="compare-hint">请至少选择两个剧种。</p>
      )}
      <div
        className="compare-table"
        style={{ "--columns": selectedOperas.length } as CSSProperties}
      >
        {dimensions.map((dimension) => (
          <div className="compare-row" key={dimension.key}>
            <strong>{dimension.label}</strong>
            {selectedOperas.map((opera) => (
              <span key={opera.id}>{opera[dimension.key]}</span>
            ))}
          </div>
        ))}
      </div>
      <p className="comparison-note">
        比较内容用于认识差异，不表示各剧种只有一种固定面貌；流派、剧目和时代都会带来变化。
      </p>
    </section>
  );
};

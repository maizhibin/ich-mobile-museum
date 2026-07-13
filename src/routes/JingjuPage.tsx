import { Heart, Rotate3D } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserPreferences } from "../app/UserPreferences";
import { AppHeader } from "../components/AppHeader";
import { IdentityBadge } from "../components/IdentityBadge";
import { OperaCompare } from "../features/compare/OperaCompare";
import { PanoramaViewer } from "../features/panorama/PanoramaViewer";
import { AudioGuidePlayer } from "../features/player/AudioGuidePlayer";

const roles = [
  { name: "生", description: "男性角色，包括老生、小生、武生等。" },
  { name: "旦", description: "女性角色，包括青衣、花旦、武旦等。" },
  { name: "净", description: "性格鲜明，常以脸谱帮助塑造人物。" },
  { name: "丑", description: "机敏风趣，鼻梁常有白色粉块。" },
];
const skills = [
  { name: "唱", description: "用不同板式、腔调和节奏表达人物情绪。" },
  { name: "念", description: "具有音乐性的舞台语言。" },
  { name: "做", description: "以手、眼、身、法、步表现行动与内心。" },
  { name: "打", description: "把武术动作提炼为有节奏的舞台表演。" },
];

export const JingjuPage = () => {
  const { addHistory, favorites, toggleFavorite } = useUserPreferences();
  const [panorama, setPanorama] = useState(false);
  const liked = favorites.includes("jingju");
  useEffect(() => addHistory("jingju"), [addHistory]);
  return (
    <>
      <section className="detail-cover jingju-cover">
        <img
          src={`${import.meta.env.BASE_URL}assets/jingju-backstage.png`}
          alt="京剧演员在后台镜前勾画脸谱，年轻学员在旁观摩"
        />
        <AppHeader back />
        <div className="detail-title">
          <IdentityBadge type="REPRESENTATIVE" />
          <p>2010 年列入 · 戏曲与表演馆</p>
          <h1>京剧</h1>
          <p>一桌二椅，演尽人间万象</p>
          <button
            className="tag"
            onClick={() => toggleFavorite("jingju")}
            aria-pressed={liked}
          >
            <Heart />
            {liked ? "已收藏" : "收藏"}
          </button>
        </div>
      </section>
      <nav className="topic-nav" aria-label="京剧展厅目录">
        <a href="#intro">初识</a>
        <a href="#roles">行当</a>
        <a href="#skills">功法</a>
        <a href="#stage">舞台</a>
        <a href="#compare">比较</a>
      </nav>
      <div className="screen-content jingju-topic">
        <section id="intro">
          <p className="eyebrow dark">三分钟认识</p>
          <h2>它不只是一种唱腔</h2>
          <p className="body-copy">
            京剧形成于清代中后期。徽班进京后，与汉调、昆曲及北京地方声腔不断交流，逐渐形成兼具唱、念、做、打的综合舞台艺术。
          </p>
          <div className="fact-row">
            <div>
              <strong>约 200 年</strong>
              <span>形成与发展</span>
            </div>
            <div>
              <strong>四大行当</strong>
              <span>生、旦、净、丑</span>
            </div>
            <div>
              <strong>写意舞台</strong>
              <span>以少胜多</span>
            </div>
          </div>
          <AudioGuidePlayer />
        </section>
        <section id="roles" className="topic-section">
          <p className="eyebrow dark">认识角色</p>
          <h2>生、旦、净、丑</h2>
          <div className="role-grid">
            {roles.map((role) => (
              <article key={role.name}>
                <span>{role.name}</span>
                <p>{role.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="face-lab">
          <p className="eyebrow">脸谱观察室</p>
          <h2>颜色也会“说话”</h2>
          <p>
            脸谱颜色不是固定的性格标签，但在具体剧目与人物塑造中常有约定俗成的表达倾向。
          </p>
          <div className="face-colors">
            <span>红 · 忠勇</span>
            <span>黑 · 刚直</span>
            <span>白 · 机变</span>
          </div>
        </section>
        <section id="skills" className="topic-section">
          <p className="eyebrow dark">演员的基本功</p>
          <h2>唱、念、做、打</h2>
          <div className="skill-grid">
            {skills.map((skill) => (
              <article key={skill.name}>
                <strong>{skill.name}</strong>
                <p>{skill.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="stage" className="topic-section">
          <p className="eyebrow dark">舞台的秘密</p>
          <h2>一桌二椅，千山万水</h2>
          <p className="body-copy">
            演员用圆场表示赶路，用马鞭表示骑马，用船桨表示行舟。观众不是被动观看，而是与演员一起完成想象。
          </p>
          <button className="immersive-panel" onClick={() => setPanorama(true)}>
            <Rotate3D />
            <span>
              <strong>360° 看京剧后台</strong>
              <small>支持拖动、键盘和图文降级</small>
            </span>
          </button>
        </section>
        <section id="compare">
          <OperaCompare />
        </section>
        <section className="source-panel">
          <strong>来源与说明</strong>
          <p>
            UNESCO
            名录身份与年份来自中国非物质文化遗产网。展厅文字为公众教育版摘要，正式媒体上线前需逐项完成版权和内容审核。
          </p>
          <a
            href="https://www.ihchina.cn/chinadirectory.html"
            target="_blank"
            rel="noreferrer"
          >
            查看官方清单
          </a>
        </section>
      </div>
      {panorama && <PanoramaViewer onClose={() => setPanorama(false)} />}
    </>
  );
};

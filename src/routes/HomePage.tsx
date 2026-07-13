import { Accessibility, Grid2X2, Headphones, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { ExhibitionCard } from "../components/ExhibitionCard";
import { MuseumCard } from "../components/MuseumCard";
import { exhibitions } from "../content/exhibitions";
import { museums } from "../content/unesco";

export const HomePage = () => (
  <>
    <section className="hero">
      <img
        src={`${import.meta.env.BASE_URL}assets/museum-hero.png`}
        alt="传统文化展厅中的戏曲脸谱、陶瓷与参观者"
      />
      <AppHeader />
      <div className="hero-copy">
        <p className="eyebrow">今天，和一门手艺相遇</p>
        <h1>把非遗带回生活里</h1>
        <p>听一段故事，做一次体验，从身边开始认识正在传承的文化。</p>
        <Link className="primary-button light" to="/exhibitions/jingju">
          <Headphones />
          开始语音导览
        </Link>
      </div>
    </section>
    <div className="screen-content">
      <div className="section-head">
        <div>
          <h2>你想怎么逛？</h2>
          <p>每一种方式，都从简单的一步开始</p>
        </div>
      </div>
      <div className="path-grid">
        <Link className="path-card" to="/exhibitions/jingju">
          <Headphones />
          <strong>三分钟听懂</strong>
          <span>故事化音频导览</span>
        </Link>
        <Link className="path-card" to="/interactive">
          <Sparkles />
          <strong>带孩子闯一关</strong>
          <span>任务和小勋章</span>
        </Link>
        <Link className="path-card" to="/mine">
          <Accessibility />
          <strong>长辈安心听</strong>
          <span>大字、清晰、慢一点</span>
        </Link>
        <Link className="path-card" to="/museums">
          <Grid2X2 />
          <strong>从专题馆出发</strong>
          <span>按声音、手艺和节令探索</span>
        </Link>
      </div>
      <div className="section-head">
        <div>
          <h2>五个旗舰专题馆</h2>
          <p>先按体验方式选择，再进入精品展厅</p>
        </div>
        <Link to="/museums">全部</Link>
      </div>
      <div className="museum-grid compact">
        {museums.slice(0, 5).map((museum) => (
          <MuseumCard key={museum.id} museum={museum} />
        ))}
      </div>
      <div className="section-head">
        <div>
          <h2>今日馆藏</h2>
          <p>能听、能看，也能亲手试试</p>
        </div>
      </div>
      <div className="project-grid">
        {exhibitions.map((item) => (
          <ExhibitionCard key={item.id} exhibition={item} />
        ))}
      </div>
    </div>
  </>
);

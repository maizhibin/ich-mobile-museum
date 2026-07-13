import { Accessibility, Headphones, MapPinned, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { ExhibitionCard } from "../components/ExhibitionCard";
import { exhibitions } from "../content/exhibitions";

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
        <Link className="path-card" to="/map">
          <MapPinned />
          <strong>从地图出发</strong>
          <span>找找家乡的手艺</span>
        </Link>
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

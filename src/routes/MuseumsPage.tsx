import { AppHeader } from "../components/AppHeader";
import { MuseumCard } from "../components/MuseumCard";
import { museums } from "../content/unesco";

export const MuseumsPage = () => (
  <>
    <AppHeader />
    <div className="screen-content page-header">
      <p className="eyebrow dark">九种参观方式</p>
      <h1>专题馆</h1>
      <p>不按行政区排队，从声音、手艺、节庆和身体经验进入非遗世界。</p>
      <div className="museum-grid">
        {museums.map((museum) => (
          <MuseumCard key={museum.id} museum={museum} />
        ))}
      </div>
    </div>
  </>
);

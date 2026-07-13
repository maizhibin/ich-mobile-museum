import { Heart, Headphones, Rotate3D } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserPreferences } from "../app/UserPreferences";
import { AppHeader } from "../components/AppHeader";
import { getExhibition } from "../content/exhibitions";

export const ExhibitionPage = () => {
  const { id = "" } = useParams();
  const exhibition = getExhibition(id);
  const { addHistory, favorites, toggleFavorite } = useUserPreferences();
  const [playing, setPlaying] = useState(false);
  const [panorama, setPanorama] = useState(false);

  useEffect(() => {
    if (exhibition) addHistory(exhibition.id);
  }, [exhibition, addHistory]);

  if (!exhibition)
    return (
      <div className="screen-content">
        <h1>未找到展厅</h1>
      </div>
    );

  const liked = favorites.includes(exhibition.id);
  return (
    <>
      <section className="detail-cover">
        <img
          src={`${import.meta.env.BASE_URL}${exhibition.cover}`}
          alt={`${exhibition.name}主题展厅`}
        />
        <AppHeader back />
        <div className="detail-title">
          <p>
            {exhibition.place} · {exhibition.theme}
          </p>
          <h1>{exhibition.name}</h1>
          <p>{exhibition.summary}</p>
          <button
            className="tag"
            onClick={() => toggleFavorite(exhibition.id)}
            aria-pressed={liked}
          >
            <Heart />
            {liked ? "已收藏" : "收藏"}
          </button>
        </div>
      </section>
      <div className="screen-content">
        <p className="eyebrow dark">三分钟认识</p>
        <h2>从一个故事开始</h2>
        <p className="body-copy">{exhibition.description}</p>
        <div className="audio-player">
          <button
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? "暂停导览" : "播放导览"}
          >
            {playing ? "暂停" : <Headphones />}
          </button>
          <div>
            <strong>{playing ? "正在播放导览" : "听馆员讲一讲"}</strong>
            <span>{exhibition.durationMinutes} 分钟 · 含文字稿</span>
          </div>
        </div>
        <ol className="story-steps">
          <li>
            <strong>从生活里来</strong>
            非遗由社区、群体和一代代实践者共同创造并传承。
          </li>
          <li>
            <strong>在今天继续发生</strong>理解历史，也关注当下的人和保护行动。
          </li>
          <li>
            <strong>带着问题离开</strong>收藏展厅，下一次继续深入探索。
          </li>
        </ol>
        {exhibition.id === "jingju" && (
          <button className="immersive-panel" onClick={() => setPanorama(true)}>
            <Rotate3D />
            <span>
              <strong>走进京剧后台全景</strong>
              <small>找找戏服、化妆台和锣鼓乐器</small>
            </span>
          </button>
        )}
      </div>
      {panorama && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="京剧后台全景"
        >
          <button className="modal-close" onClick={() => setPanorama(false)}>
            关闭
          </button>
          <div
            className="panorama"
            style={{
              backgroundImage: `url(${import.meta.env.BASE_URL}assets/jingju-panorama.png)`,
            }}
          />
          <p>拖动或横向滚动，观察京剧后台空间。</p>
        </div>
      )}
    </>
  );
};

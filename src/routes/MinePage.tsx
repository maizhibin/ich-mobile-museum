import { Link } from "react-router-dom";
import { useUserPreferences } from "../app/UserPreferences";
import { AppHeader } from "../components/AppHeader";
import { exhibitions } from "../content/exhibitions";

export const MinePage = () => {
  const { elderMode, favorites, history, toggleElderMode } =
    useUserPreferences();
  const names = (ids: string[]) =>
    ids.map((id) => exhibitions.find((item) => item.id === id)).filter(Boolean);
  return (
    <>
      <AppHeader />
      <div className="screen-content page-header">
        <h1>我的足迹</h1>
        <p>收藏喜欢的文化，随时回来继续参观。</p>
        <div className="stats">
          <div>
            <strong>{history.length}</strong>
            <span>看过</span>
          </div>
          <div>
            <strong>{favorites.length}</strong>
            <span>收藏</span>
          </div>
        </div>
        <button className="large-action" onClick={toggleElderMode}>
          <strong>{elderMode ? "关闭长辈模式" : "开启长辈模式"}</strong>
          <span>调整字号、对比度和动效</span>
        </button>
        <h2>我的收藏</h2>
        {names(favorites).length ? (
          names(favorites).map(
            (item) =>
              item && (
                <Link
                  className="list-row"
                  key={item.id}
                  to={`/exhibitions/${item.id}`}
                >
                  {item.name}
                </Link>
              ),
          )
        ) : (
          <p className="empty-panel">
            还没有收藏，遇到喜欢的展厅就点一下心形按钮。
          </p>
        )}
      </div>
    </>
  );
};

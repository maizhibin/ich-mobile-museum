import { ArrowLeft, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserPreferences } from "../app/UserPreferences";

export const AppHeader = ({ back = false }: { back?: boolean }) => {
  const navigate = useNavigate();
  const { elderMode, toggleElderMode } = useUserPreferences();

  return (
    <header className="topbar">
      <div className="brand">
        {back ? (
          <button
            className="icon-button"
            onClick={() => navigate(-1)}
            aria-label="返回"
          >
            <ArrowLeft />
          </button>
        ) : (
          <Link to="/" className="brand-link">
            <span className="seal">遗</span>
            <span>非遗随身馆</span>
          </Link>
        )}
      </div>
      <div className="top-actions">
        <button
          className={`icon-button ${elderMode ? "active" : ""}`}
          onClick={toggleElderMode}
          aria-pressed={elderMode}
        >
          长
        </button>
        <Link className="icon-button" to="/mine" aria-label="我的收藏">
          <Heart />
        </Link>
      </div>
    </header>
  );
};

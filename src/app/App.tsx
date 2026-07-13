import { HashRouter, Route, Routes } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { ExhibitionPage } from "../routes/ExhibitionPage";
import { HomePage } from "../routes/HomePage";
import { MinePage } from "../routes/MinePage";
import { PlaceholderPage } from "../routes/PlaceholderPage";
import { UserPreferencesProvider, useUserPreferences } from "./UserPreferences";

const AppSurface = () => {
  const { elderMode } = useUserPreferences();
  return (
    <main className={`mobile-prototype ${elderMode ? "elder-mode" : ""}`}>
      <div className="app-surface">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exhibitions/:id" element={<ExhibitionPage />} />
          <Route
            path="/map"
            element={
              <PlaceholderPage
                title="非遗地图"
                description="从地方实践进入一段正在发生的故事。"
              />
            }
          />
          <Route
            path="/museums"
            element={
              <PlaceholderPage
                title="专题馆"
                description="从戏曲、茶、节庆、手工艺与武术进入非遗世界。"
              />
            }
          />
          <Route
            path="/interactive"
            element={
              <PlaceholderPage
                title="互动体验"
                description="用声音、动作和手作完成一次文化发现。"
              />
            }
          />
          <Route path="/mine" element={<MinePage />} />
        </Routes>
        <BottomNav />
      </div>
    </main>
  );
};

export const App = () => (
  <HashRouter>
    <UserPreferencesProvider>
      <AppSurface />
    </UserPreferencesProvider>
  </HashRouter>
);

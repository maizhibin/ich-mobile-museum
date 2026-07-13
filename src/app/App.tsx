import { HashRouter, Route, Routes } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { ExhibitionPage } from "../routes/ExhibitionPage";
import { DiscoverPage } from "../routes/DiscoverPage";
import { ElementPage } from "../routes/ElementPage";
import { HomePage } from "../routes/HomePage";
import { JingjuPage } from "../routes/JingjuPage";
import { MinePage } from "../routes/MinePage";
import { MuseumPage } from "../routes/MuseumPage";
import { MuseumsPage } from "../routes/MuseumsPage";
import { PlaceholderPage } from "../routes/PlaceholderPage";
import { TeaPage } from "../routes/TeaPage";
import { UserPreferencesProvider, useUserPreferences } from "./UserPreferences";

const AppSurface = () => {
  const { elderMode } = useUserPreferences();
  return (
    <main className={`mobile-prototype ${elderMode ? "elder-mode" : ""}`}>
      <div className="app-surface">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exhibitions/jingju" element={<JingjuPage />} />
          <Route path="/exhibitions/traditional-tea" element={<TeaPage />} />
          <Route path="/exhibitions/:id" element={<ExhibitionPage />} />
          <Route path="/museums" element={<MuseumsPage />} />
          <Route path="/museums/:id" element={<MuseumPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/discover/:id" element={<ElementPage />} />
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

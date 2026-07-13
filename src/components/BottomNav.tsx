import { Compass, Grid2X2, House, Sparkles, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "首页", icon: House },
  { to: "/museums", label: "专题馆", icon: Grid2X2 },
  { to: "/discover", label: "发现", icon: Compass },
  { to: "/interactive", label: "互动", icon: Sparkles },
  { to: "/mine", label: "我的", icon: UserRound },
];

export const BottomNav = () => (
  <nav className="bottom-nav" aria-label="主导航">
    {items.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <Icon />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

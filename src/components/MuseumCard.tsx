import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getMuseumElements } from "../content/unesco";
import type { Museum } from "../content/schema";

export const MuseumCard = ({ museum }: { museum: Museum }) => (
  <Link
    className={`museum-card museum-${museum.id}`}
    to={`/museums/${museum.id}`}
  >
    <span className="museum-symbol">{museum.symbol}</span>
    <div>
      <small>{getMuseumElements(museum.id).length} 个核心项目</small>
      <strong>{museum.name}</strong>
      <p>{museum.tagline}</p>
    </div>
    <ArrowRight />
  </Link>
);

import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Exhibition } from "../content/schema";

export const ExhibitionCard = ({ exhibition }: { exhibition: Exhibition }) => (
  <Link className="project-card" to={`/exhibitions/${exhibition.id}`}>
    <img src={`${import.meta.env.BASE_URL}${exhibition.cover}`} alt="" />
    <div>
      <p>
        {exhibition.place} · {exhibition.theme}
      </p>
      <strong>{exhibition.name}</strong>
      <span>
        {exhibition.durationMinutes} 分钟导览 <ArrowRight />
      </span>
    </div>
  </Link>
);

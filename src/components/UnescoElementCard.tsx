import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { UnescoElement } from "../content/schema";
import { IdentityBadge } from "./IdentityBadge";

export const UnescoElementCard = ({ element }: { element: UnescoElement }) => {
  const target = ["jingju", "traditional-tea"].includes(element.id)
    ? `/exhibitions/${element.id}`
    : `/discover/${element.id}`;
  return (
    <Link className="element-card" to={target}>
      <div>
        <IdentityBadge type={element.listType} />
        <strong>{element.name}</strong>
        <span>{element.year} 年列入 / 入选</span>
      </div>
      <ChevronRight />
    </Link>
  );
};

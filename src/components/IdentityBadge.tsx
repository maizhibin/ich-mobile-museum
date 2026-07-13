import { listTypeLabels } from "../content/unesco";
import type { UnescoElement } from "../content/schema";

export const IdentityBadge = ({
  type,
}: {
  type: UnescoElement["listType"];
}) => (
  <span className={`identity-badge ${type.toLowerCase()}`}>
    {listTypeLabels[type]}
  </span>
);

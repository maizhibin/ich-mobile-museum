import { describe, expect, it } from "vitest";
import { exhibitionFoundations, getExhibitionFoundation } from "./foundations";

describe("精品展厅共用底座", () => {
  it("为两个旗舰展厅提供可审计的入口、来源与保护叙事", () => {
    expect(exhibitionFoundations).toHaveLength(2);
    expect(getExhibitionFoundation("jingju")?.atmosphere.durationSeconds).toBe(
      15,
    );
    expect(
      getExhibitionFoundation("traditional-tea")?.safeguard.actions.length,
    ).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";
import { museums, unescoElements } from "./unesco";

describe("UNESCO 中国项目", () => {
  it("包含官方口径的 45 项和 9 个专题馆", () => {
    expect(unescoElements).toHaveLength(45);
    expect(museums).toHaveLength(9);
  });

  it("名录类型数量为 40 / 3 / 2", () => {
    const count = (type: string) =>
      unescoElements.filter((item) => item.listType === type).length;
    expect(count("REPRESENTATIVE")).toBe(40);
    expect(count("URGENT_SAFEGUARDING")).toBe(3);
    expect(count("GOOD_PRACTICE")).toBe(2);
  });
});

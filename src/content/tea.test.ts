import { describe, expect, it } from "vitest";
import { teaExhibition } from "./tea";

describe("茶文化馆内容", () => {
  it("通过 Schema 校验并提供五步可复用流程", () => {
    expect(teaExhibition.process.steps.map(({ order }) => order)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(teaExhibition.regionalPractices).toHaveLength(5);
    expect(
      teaExhibition.regionalPractices.every(({ disclosure }) =>
        disclosure.includes("非独立 UNESCO 项目"),
      ),
    ).toBe(true);
    expect(teaExhibition.makingPaths).toHaveLength(3);
    expect(teaExhibition.socialContexts).toHaveLength(3);
    expect(teaExhibition.teaWare).toHaveLength(4);
    expect(teaExhibition.gallery).toHaveLength(3);
  });
});

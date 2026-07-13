import { describe, expect, it } from "vitest";
import { exhibitions, getExhibition } from "./exhibitions";

describe("展厅内容", () => {
  it("通过 Schema 校验并包含京剧", () => {
    expect(exhibitions.length).toBeGreaterThan(0);
    expect(getExhibition("jingju")?.name).toBe("京剧");
  });
});

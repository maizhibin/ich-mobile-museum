import { expect, test } from "@playwright/test";

test("可以从首页进入京剧展厅", async ({ page }) => {
  await page.goto("/ich-mobile-museum/");
  await expect(
    page.getByRole("heading", { name: "把非遗带回生活里" }),
  ).toBeVisible();
  await page.getByRole("link", { name: /开始语音导览/ }).click();
  await expect(
    page.getByRole("heading", { name: "京剧", exact: true }),
  ).toBeVisible();
});

test("可以浏览专题馆并搜索 45 项清单", async ({ page }) => {
  await page.goto("/ich-mobile-museum/#/museums");
  await expect(
    page.getByRole("heading", { name: "专题馆", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: /戏曲与表演馆/ }).click();
  await expect(page.getByText("UNESCO 核心展厅")).toBeVisible();
  await page.getByRole("link", { name: "发现" }).click();
  await page.getByPlaceholder("搜索京剧、剪纸、节气……").fill("太极拳");
  await expect(page.getByRole("link", { name: /太极拳/ })).toBeVisible();
  await expect(page.getByText("找到 1 项")).toBeVisible();
});

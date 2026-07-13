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

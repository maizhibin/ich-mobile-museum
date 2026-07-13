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
  await page.getByRole("button", { name: "进入展厅" }).click();
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

test("京剧展厅目录可以定位章节而不丢失路由", async ({ page }) => {
  await page.goto("/ich-mobile-museum/#/exhibitions/jingju");

  for (const topic of [
    { id: "intro", label: "初识" },
    { id: "roles", label: "行当" },
    { id: "skills", label: "功法" },
    { id: "stage", label: "舞台" },
    { id: "compare", label: "比较" },
  ]) {
    await page.getByRole("link", { name: topic.label, exact: true }).click();
    await expect(page).toHaveURL(
      new RegExp(`#/exhibitions/jingju\\?section=${topic.id}$`),
    );
    await expect(page.locator(`#${topic.id}`)).toBeInViewport();
    await expect(
      page.getByRole("heading", { name: "京剧", exact: true }),
    ).toBeAttached();
  }
});

test("京剧旗舰展厅支持播放器、比较台和球面全景降级", async ({ page }) => {
  await page.goto("/ich-mobile-museum/#/exhibitions/jingju");
  await expect(
    page.getByRole("heading", { name: "京剧", exact: true }),
  ).toBeVisible();
  await expect
    .poll(
      async () => page.locator("audio").evaluate((audio) => audio.readyState),
      { timeout: 15_000 },
    )
    .toBeGreaterThanOrEqual(1);
  await page.getByRole("button", { name: "播放导览" }).click();
  await expect(page.getByRole("button", { name: "暂停导览" })).toBeVisible({
    timeout: 15_000,
  });
  await expect
    .poll(
      async () => Number(await page.getByLabel("导览播放进度").inputValue()),
      { timeout: 15_000 },
    )
    .toBeGreaterThan(0);
  await page
    .locator(".chapter-row")
    .getByRole("button", { name: "从徽班进京到京剧形成" })
    .click();
  await expect(page.locator(".transcript-cue.active")).toHaveText(
    "京剧不是在某一天突然诞生的。",
  );
  await page
    .locator(".transcript-cue")
    .filter({ hasText: "生多扮演男性人物" })
    .click();
  await page.getByRole("button", { name: "暂停导览" }).click();
  await expect(
    page
      .locator(".chapter-row")
      .getByRole("button", { name: "生旦净丑，不只是角色标签" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".transcript-cue.active")).toContainText(
    "生多扮演男性人物",
  );
  await expect(page.locator(".transcript-paragraph")).toHaveCount(5);
  await expect(page.locator(".transcript-cue.active")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(page.locator(".transcript-cue.active")).toHaveCSS(
    "display",
    "inline",
  );
  await expect
    .poll(async () =>
      Number(await page.getByLabel("导览播放进度").inputValue()),
    )
    .toBeGreaterThanOrEqual(72.6);
  await expect
    .poll(async () =>
      Number(await page.getByLabel("导览播放进度").inputValue()),
    )
    .toBeLessThan(73.5);
  await page.getByText("文稿来源与说明").click();
  await expect(
    page.getByRole("link", { name: "UNESCO：Peking opera" }),
  ).toBeVisible();
  await expect(page.getByText("同一方舞台，不同种声音")).toBeVisible();
  await page.getByRole("button", { name: /360° 看京剧后台/ }).click();
  await expect(
    page.getByRole("dialog", { name: "京剧后台全景" }),
  ).toBeVisible();
  await expect(page.locator(".psv-navbar")).toBeVisible();
  await expect(page.getByText("化妆台", { exact: true })).toBeVisible();
  await expect(page.getByText(/AI 概念全景/).first()).toBeVisible();
  await page.getByRole("button", { name: /切换图文模式/ }).click();
  await expect(
    page
      .getByRole("dialog", { name: "京剧后台全景" })
      .getByAltText(/京剧演员在后台/),
  ).toBeVisible();
  await page.getByRole("button", { name: "关闭全景" }).click();
});

test("茶文化馆提供可分享的工序流程与地方实践比较", async ({ page }) => {
  await page.goto("/ich-mobile-museum/#/museums/tea");
  await page
    .getByRole("link", { name: /中国传统制茶技艺及其相关习俗/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "中国传统制茶技艺及其相关习俗" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "进入展厅" }).click();
  await page.getByRole("button", { name: "制茶" }).click();
  await expect(page).toHaveURL(
    /#\/exhibitions\/traditional-tea\?section=process&step=processing$/,
  );
  await expect(page.getByText("第 2 步 · 制茶")).toBeVisible();
  await page.getByRole("button", { name: "下一张图片" }).click();
  await expect(page.getByText("手上有判断")).toBeVisible();
  await page.getByRole("tab", { name: "铁观音" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("铁观音");
  await expect(page.getByRole("tabpanel")).toContainText("非独立 UNESCO 项目");
  await page.getByRole("link", { name: "探索", exact: true }).click();
  await page.getByRole("button", { name: /乌龙茶观察路径/ }).click();
  await expect(page.getByText("摇青与静置交替")).toBeVisible();
  await page.getByRole("radio", { name: "节日团聚" }).click();
  await expect(page.getByText("团聚或婚礼等重要日子里")).toBeVisible();
  await page.getByRole("button", { name: "茶盘", exact: true }).click();
  await expect(page.getByText("承接一席茶的动作")).toBeVisible();
});

# 非遗随身馆 · 设计规范

> 版本：与产品 v0.5.0 对齐  
> 来源：`src/styles/global.css`、`src/components/*`、`src/routes/*`  
> Sketch 对照文件：`~/Documents/ich_mobile-museum.sketch`  
> 在线展示：https://maizhibin.github.io/ich-mobile-museum/

本文档描述当前 H5 移动端实现的视觉与交互规范，供设计还原、Sketch/Figma 维护与后续迭代共用。实现以代码为准；设计稿与代码冲突时，先核对本文再改代码。

---

## 1. 产品气质

- **媒介感**：纸色底、朱红印章、金点缀，接近博物馆导览册而非通用消费 App。
- **移动优先**：内容在居中画布内阅读，桌面仅作预览框。
- **身份可辨**：UNESCO 名录身份、国家级对照、知识节点在色与文案上必须可区分，不能只靠颜色。
- **可访问**：触控目标 ≥ 44×44 CSS px；尊重 `prefers-reduced-motion`；提供长辈模式。

---

## 2. 画布与布局

| Token / 规则 | 值 | 说明 |
|---|---|---|
| 画布最大宽度 | `540px` | `.mobile-prototype` |
| 最小视口宽 | `320px` | `body` |
| 页面底色（画布外） | `#E6E0D5` | `html` / `body` 外缘 |
| 页面纸色（画布内） | `#F6F2EA` | `--paper` |
| 画布阴影 | `0 0 50px #675E5030` | 桌面预览时区分边缘 |
| 内容水平边距 | `20px` | `.screen-content` |
| 内容上下边距 | `28px` / `44px` | 上 / 下 |
| 底栏预留 | `76px + safe-area` | `.app-surface` `padding-bottom` |
| Hero 最小高度 | `570px` | `.hero` |
| 详情封面最小高度 | `500px` | `.detail-cover` |
| 章节间距 | `18px 0 14px` | `.section-head` |

### 2.1 栅格习惯

- 双列入口：`.path-grid` → `1fr 1fr`，间距 `10px`。
- 列表卡：单列为主；`≥700px` 时 `.project-grid` 可两列。
- 专题馆列表：`.museum-grid`，间距 `12px`。

### 2.2 Sketch 画板建议

- 宽度：`390`（设计）或 `540`（与实现上限一致）。
- 页面结构建议与 Sketch 文件一致：`00 Foundations` / `01 Components` / `02 Screens`。

---

## 3. 颜色

### 3.1 核心令牌（`:root`）

| 名称 | CSS 变量 | Hex | 用途 |
|---|---|---|---|
| Ink / 墨色 | `--ink` | `#292721` | 主文字、图标默认 |
| Muted / 次要 | `--muted` | `#766F64` | 说明、辅助文案 |
| Paper / 纸色 | `--paper` | `#F6F2EA` | 画布背景 |
| Red / 朱红 | `--red` | `#8D2D2A` | 品牌强调、主行动、激活态 |
| Gold / 金 | `--gold` | `#BD9361` | 点缀、眉题关联色 |

### 3.2 扩展色（实现中常用、未入变量）

| 名称 | Hex | 用途 |
|---|---|---|
| Canvas / 外底 | `#E6E0D5` | 画布外背景 |
| Hero Dark | `#17120E` / `#28221D` | 封面底、遮罩 |
| Hero 文案浅色 | `#F2ECE2` | 封面正文 |
| Eyebrow 金 | `#EAD0AD` | 浅色眉题 |
| Card 浅底 | `#FFFAF2` | Path Card、空状态 |
| Border | `#DED4C5` / `#CBBDAD` | 描边 |
| 底栏底 | `#FFFDF9F5` | 半透明底栏 |
| 底栏未选 | `#81796F` | 导航默认色 |
| Focus 环 | `#286FC0` | `:focus-visible` |
| 印章描边 | `#F4D5B4` | `.seal` |

### 3.3 身份色（必须配合文字标签）

| 身份 | 文字色 | 背景色 | 标签文案 |
|---|---|---|---|
| 人类非遗代表作（默认） | `#684A27` | `#F1DFC3` | 人类非遗代表作 |
| 急需保护 | `#8D2D2A` | `#F5D4D1` | 急需保护 |
| 优秀保护实践 | `#315A49` | `#D9EBE2` | 优秀保护实践 |

对应组件：`IdentityBadge` + `.identity-badge` / `.urgent_safeguarding` / `.good_practice`。

### 3.4 专题馆主题色（卡片渐变起点 `--museum`）

| 专题 | 类名 | `--museum` |
|---|---|---|
| 戏曲与表演 | （默认） | `#713832` |
| 茶与生活 | `.museum-tea` | `#48634D` |
| 节庆与岁时 | `.museum-festival` | `#982F2B` |
| 手工艺 | `.museum-craft` | `#755738` |
| 武术与身体 | `.museum-martial` | `#38475A` |
| 音乐与声音 | `.museum-music` | `#55406B` |
| 史诗与口头 | `.museum-oral` | `#73513E` |
| 信俗与社区 | `.museum-belief` | `#49615F` |
| 文字知识技艺 | `.museum-knowledge` | `#4C516A` |

卡片背景：`linear-gradient(135deg, var(--museum), #27221D)`，文字为白 / `#F0DED0`。

### 3.5 长辈模式覆写

```css
.elder-mode {
  --ink: #111;
  font-size: 118%;
}
```

对比度提高、字号放大；底栏字号提到 `13px`。

---

## 4. 字体

| 角色 | 字体 | 字重 | 典型尺寸 | 使用处 |
|---|---|---|---|---|
| Display | Noto Serif SC | 700 | `clamp(38px, 11vw, 54px)` / lh 1.08 | Hero、详情标题 |
| H1 / 页标题 | Noto Serif SC | 700 | 约 `34–36px` | `.page-header h1` |
| H2 / 章节 | Noto Serif SC | 700 | 约 `20–24px` | `.section-head h2` |
| 专题馆名 | Noto Serif SC | 700 | `20px` | `.museum-card strong` |
| 展项卡标题 | Noto Serif SC | 700 | `27px` | `.project-card strong` |
| Body | Noto Sans SC | 400–500 | `14–16px` / lh ~1.6–1.75 | 正文、说明 |
| Eyebrow | Noto Sans SC | 700 | `13px` / tracking `0.18em` | `.eyebrow` |
| Caption | Noto Sans SC | 400–500 | `11–13px` | 辅助、底栏、徽章 |
| 印章字 | Noto Serif SC | 700 | 印章内「遗」 | `.seal` |

加载：Google Fonts（Noto Sans SC 400/500/600/700，Noto Serif SC 600/700）。

---

## 5. 圆角、间距与触控

| 元素 | 圆角 | 最小高度 / 触控 |
|---|---|---|
| 主按钮 / Tag / Chip | `999px`（胶囊） | ≥ `48px` / Chip `40px` |
| Path Card | `18px` | ≥ `132px` |
| Project / Exhibition Card | `22px` | ≥ `150px` |
| Museum Card | `20px` | ≥ `128px`（compact 可 `108px`） |
| Element Card | `16px` | ≥ `104px` |
| List Row | `14px` | padding `16px` |
| Search Box | `16px` | 高 `52px` |
| Seal 印章 | `8px 8px 14px 8px` | `34×34` |
| Icon Button | `50%` | `44×44` |
| Museum Symbol | `50%` | `54×54` |
| Stats / Empty | `18px` | — |

间距常用档：`4 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 22 / 24 / 28px`。

---

## 6. 组件规范

### 6.1 品牌印章 `.seal`

- 尺寸 `34×34`，朱红底 + `#F4D5B4` 描边。
- 异形圆角（右下更大），内嵌衬线「遗」。
- 与文案「非遗随身馆」组成品牌锁，出现在顶栏与封面。

### 6.2 顶栏 `.topbar` / `AppHeader`

- 绝对定位，高约 `74px` + safe-area。
- 深色渐变遮罩：`#17120E99 → transparent`。
- 左侧：品牌或返回；右侧：长辈模式「长」、收藏心形。
- Icon Button：半透明深底、白描边；激活态白底 + 朱红字。

### 6.3 主按钮 `.primary-button`

- 胶囊、字重 700、图标约 `19px`。
- `.light`：白底 + 墨色字（用于深色 Hero）。
- 大红行动块见 `.large-action`（我的页长辈开关等）。

### 6.4 Path Card `.path-card`

- 浅卡底 `#FFFAF2`、描边 `#DED4C5`、内边距 `17px`。
- 图标朱红；标题加粗；说明 `13px` muted。
- 2×2 网格，表达「怎么逛」入口。

### 6.5 Museum Card `.museum-card`

- 深色渐变主题卡，白字；圆形 `museum-symbol` 放馆字（戏/茶/岁…）。
- 结构：符号 | 文案（数量 / 馆名 / tagline）| 箭头。
- 禁止改成无主题色的白卡片，以免与 Path Card 混淆。

### 6.6 Exhibition / Project Card `.project-card`

- 封面图绝对铺满，`opacity: 0.45`，深底。
- 文案相对叠层；主题小字金浅色；标题衬线大号。

### 6.7 Element Card + Identity Badge

- 白底列表卡 + UNESCO 身份徽章。
- 徽章必须显示完整标签文案，不能仅用色点。

### 6.8 底栏 `.bottom-nav`

- 固定底、宽与画布对齐（`min(100%, 540px)`）、毛玻璃感。
- 5 项：首页 / 专题馆 / 发现 / 互动 / 我的。
- 项高 ≥ `68px`；激活态朱红加粗。
- 图标来自 Lucide React，线宽保持一致。

### 6.9 搜索与筛选

- `.search-box`：白底、描边、高 `52px`。
- `.filter-row` 内 Chip：未选白底描边；选中朱红底白字；高 ≥ `40px`。

### 6.10 播放器外壳（京剧导览）

- 白卡圆角容器；播放钮圆朱红；进度条描边底 + 朱红填充。
- 必须标注合成语音 / 来源，不得表现为真人馆员录音。

### 6.11 空状态 `.empty-panel`

- 虚线描边 `#CBBDAD`、浅卡底、muted 文案。

---

## 7. 页面结构（关键屏）

| 屏幕 | 路由 | 结构要点 |
|---|---|---|
| 首页 | `/` | Hero（品牌+一句主张+CTA）→ 逛法 Path → 旗舰专题馆 → 今日馆藏 → 底栏 |
| 专题馆 | `/museums` | 深顶栏 → Eyebrow「九种参观方式」→ 标题 → 9 馆卡片列表 |
| 发现 | `/discover` | Eyebrow「UNESCO 中国清单」→ 搜索 → 身份筛选 → 结果列表 |
| 我的 | `/mine` | 足迹标题 → 看过/收藏统计 → 长辈模式 CTA → 收藏列表或空态 |
| 京剧展厅 | `/exhibitions/jingju` | 封面 → 导览播放器 → 行当/功法/比较/全景等章节 |
| 茶展厅 | `/exhibitions/traditional-tea` | 封面 → 工序/比较/实验台/器物等模块 |

Hero 首屏原则（与产品一致）：

1. 品牌可见（印章 + 馆名）。
2. 一句主标题 + 一句说明 + 一组主 CTA。
3. 全宽封面图 + 底部渐变遮罩，避免在图上贴浮层徽章。

---

## 8. 动效与降级

- 默认尊重 `prefers-reduced-motion: reduce`：动画/过渡压到近乎静止，滚动行为关闭平滑。
- AR / 3D / 全景必须提供图文或视频等价降级（京剧后台全景已按此执行）。
- AI 概念图、合成语音须在界面明确标注，并与历史影像、真人录音区分。

---

## 9. 无障碍清单

- [ ] 图片有合适 `alt`；装饰图可空 alt。
- [ ] 音视频有字幕或完整文稿；导览支持逐句跳转。
- [ ] 可键盘聚焦；`:focus-visible` 使用蓝色 3px 外轮廓。
- [ ] 触控目标 ≥ 约 `44×44`。
- [ ] 身份与状态不只依赖颜色（徽章文案、字重、图标）。
- [ ] 长辈模式可切换，并反映在 `aria-pressed`。
- [ ] 展厅页提供来源、更新时间与权利信息。

---

## 10. 内容与视觉边界

- UNESCO 核心项目、国家级对照、知识节点在数据与 UI 中分开展示。
- 不在界面展示密钥、私人联系方式或受限仪式资料。
- 传统医药内容仅作文化介绍，不做疗效承诺。

---

## 11. 文件对照

| 产物 | 路径 |
|---|---|
| 全局样式与令牌 | `src/styles/global.css` |
| 复用组件 | `src/components/` |
| 页面 | `src/routes/` |
| 本规范 | `docs/DESIGN.md` |
| Sketch 设计文件 | `~/Documents/ich_mobile-museum.sketch` |

修订本规范时：同步更新 CSS 变量或组件类名，并在 Sketch Foundations 页刷新色板与字阶。

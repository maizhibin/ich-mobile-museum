# 非遗随身馆

面向移动端的 UNESCO 中国非物质文化遗产数字博物馆。项目以“专题馆 → 精品展厅 → 互动展项”组织内容，第一阶段围绕中国列入 UNESCO 非物质文化遗产名录、名册的 45 个项目展开。

在线展示：<https://maizhibin.github.io/ich-mobile-museum/>

## 当前版本

当前版本为 **v0.5.1**。

- v0.2：完成 Vite、React、TypeScript 工程化和 GitHub Pages 部署配置。
- v0.3：上线 9 个专题馆、45 项 UNESCO 中国项目、名录身份筛选和搜索。
- v0.4：完成京剧旗舰展厅、章节播放器、剧种比较台和京剧后台全景。
- v0.4.1：京剧后台升级为 WebGL 球面播放器，加入 4096×2048 AI 概念全景、空间讲解点和移动端陀螺仪，并保留图文降级。
- v0.4.2：修复 Hash 路由与京剧展厅页内锚点冲突，目录支持章节定位、刷新和链接分享。
- v0.4.3：完成“三分钟认识京剧”原创文稿、约 2 分 58 秒中文合成语音、真实音频播放、逐句同步文字稿和完整来源闭环。
- v0.4.4：同步文字稿升级为完整文稿高亮与逐句点击跳转；京剧概念全景初始视角调整为正对化妆台。
- v0.4.5：同步文字稿恢复原有章节段落排版，当前朗读句仅改变文字颜色，保留逐句点击跳转。
- v0.4.6：修复 GitHub Pages 发布源，改由 Actions 部署构建产物；同步升级工作流 Action 以适配 Node.js 24 运行时。
- v0.5.0：上线茶文化馆旗舰展厅、可复用工序流程、五个地方实践比较入口，以及制茶实验台、茶席任务、器物观察和 AI 概念插画图片流；内容由 Schema 校验并提供来源、更新与权利说明。
- v0.5.1：建立精品展厅共用底座：可跳过的概念氛围入口、资产/来源台账、保护进行时、学习卡分享与下一展厅路径。

### UNESCO 数据口径

截至 2025 年 12 月，中国共有 45 个项目列入 UNESCO 非物质文化遗产名录、名册：

- 人类非物质文化遗产代表作名录：40 项。
- 急需保护的非物质文化遗产名录：3 项。
- 优秀保护实践名册：2 项。

项目数据以[中国非物质文化遗产网官方清单](https://www.ihchina.cn/chinadirectory.html)为主要依据。UNESCO 核心项目、国家级对照展项和一般知识节点在产品中使用不同身份标识。

## 功能概览

### 专题馆

项目目前规划并实现了 9 个专题入口：

- 戏曲与表演馆
- 茶与生活馆
- 节庆与岁时馆
- 手工艺馆
- 武术与身体馆
- 音乐与声音馆
- 史诗与口头传统馆
- 信俗与社区馆
- 文字、知识与技艺馆

同一个非遗项目可以出现在多个专题馆中。专题馆是策展关系，不会改变项目的官方分类和名录身份。

### 京剧旗舰展厅

- 京剧历史与核心知识导览。
- 生、旦、净、丑四大行当介绍。
- 唱、念、做、打基本功展示。
- 带真实中文语音、章节跳转、完整文稿逐句高亮与点击跳转、进度和倍速的导览播放器。
- 导览提供完整文稿、更新时间、官方来源和合成语音标识，不冒充真人馆员或传承人录音。
- 京剧、昆曲、粤剧、越剧横向比较。
- 支持触控、键盘、移动端陀螺仪和空间讲解点的 WebGL 球面全景。
- 全景使用 4096×2048 AI 概念图并明确标注，与历史影像和真实馆藏区分；保留等价图文降级。
- 本地收藏、足迹和长辈模式。

### 45 项发现页

- 按项目名称搜索。
- 按代表作、急需保护项目和优秀保护实践筛选。
- 从项目跳转到相关专题馆。
- 显示列入或入选年份和官方来源。

## 技术栈

- Vite 8
- React 19
- TypeScript 6
- React Router
- Zod
- Lucide React
- Photo Sphere Viewer
- Vitest
- Playwright
- ESLint
- Prettier

项目使用 ESM、React 函数组件和 Hooks，不使用 class 组件。

## 目录结构

```text
ich-mobile-museum/
├── .github/workflows/       # GitHub Pages 自动部署
├── content/                 # UNESCO、专题馆与展厅 JSON 数据
├── docs/                    # 产品、数据库与迭代设计文档
├── public/audio/            # 经处理的公开播放音频
├── public/assets/           # 可公开分发的常规图片和媒体资源
├── public/panoramas/        # 球面全景分发资源
├── src/
│   ├── app/                 # 应用外壳、路由与用户偏好
│   ├── components/          # 通用组件
│   ├── content/             # Schema、内容加载与查询
│   ├── features/            # 播放器、比较、全景等业务能力
│   ├── routes/              # 页面组件
│   └── styles/              # 全局样式与设计令牌
├── tests/e2e/               # 端到端测试
├── AGENTS.md                # 开发协作规范
└── README.md
```

当前仅包含一个纯前端应用，因此没有提前建立空的 `frontend/` 和 `backend/`。开始开发小程序、App 或 API 时，再升级为 `apps/*` 与 `packages/*` 的多应用结构。

## 本地开发

### 环境要求

- Node.js 22+
- pnpm 11+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

默认访问：

```text
http://localhost:5173/ich-mobile-museum/
```

### 生产构建

```bash
pnpm build
pnpm preview
```

GitHub Pages 子路径通过 Vite 的 `base: "/ich-mobile-museum/"` 配置处理；应用使用 Hash 路由，确保静态托管环境中刷新深层页面不会返回 404。

## 质量检查

提交前执行：

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

当前端到端测试覆盖：

- 从首页进入京剧展厅。
- 浏览专题馆并搜索 45 项 UNESCO 清单。
- 操作京剧播放器、剧种比较台、WebGL 球面全景和图文降级模式。

Playwright 本地默认调用已安装的 Google Chrome。

## 内容维护

主要数据文件：

- `content/audio/jingju-three-minute-guide.md`：京剧导览源文稿与来源说明。
- `content/audio/jingju-three-minute-guide.json`：音频元数据、章节和逐句时间轴。
- `content/unesco-elements.json`：45 项 UNESCO 中国项目。
- `content/museums.json`：9 个专题馆。
- `content/exhibitions.json`：已经进入精品制作阶段的展厅。
- `content/tea-exhibition.json`：茶文化馆流程、地方实践示例、来源与权利说明。

内容会在构建和测试过程中通过 Zod Schema 校验。新增或修改项目时必须同步确认：

1. 名称、年份和名录类型准确。
2. 至少关联一个专题馆。
3. 核心事实具有官方来源。
4. 图片、音视频和人物资料具有公开传播权利。
5. 增强体验具有无障碍降级方案。

茶文化馆的地方实践示例用于理解工序差异，不表示其拥有独立 UNESCO 名录身份；所有展示均明确标注其与“中国传统制茶技艺及其相关习俗”这一 UNESCO 总项目的关系。

## GitHub Pages 部署

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会自动执行：

1. 安装依赖。
2. 格式、lint、类型和单元测试检查。
3. Vite 生产构建。
4. 上传 `dist/` 并部署到 GitHub Pages。

Pull Request 只执行验证，不覆盖正式站点。

仓库 **Settings → Pages → Build and deployment** 的 Source 必须选择 **GitHub Actions**；不能选择“Deploy from a branch”，否则 GitHub Pages 会直接发布仓库根目录的开发版 `index.html`。

## 版本与提交规范

- 每个里程碑使用独立的 `codex/` 分支。
- 合并前必须通过全部质量检查。
- 功能、目录、运行方式、数据口径或版本状态发生变化时，必须在同一次提交中同步更新 README。
- 不提交 `node_modules/`、`dist/`、测试报告和本地环境文件。

## 后续计划

- v0.5：茶文化馆与通用工序流程。
- v0.6：太极拳与动作播放器。
- v0.6：太极拳与多视角动作播放器。
- v0.7：中国剪纸与手工艺通用组件。
- v0.8：春节、节庆时间轴和周期性运营。
- v0.9：补齐 45 个基础展厅。
- v1.0：完成五个旗舰专题馆和正式发布质量审查。

详细规划见：

- [纯前端迭代路线](docs/frontend-iteration-roadmap.md)
- [UNESCO 中国非遗精品馆群 MVP 方案](docs/unesco-china-boutique-museums-mvp.md)
- [全国国家级非遗数据库与数字博物馆方案](docs/national-ich-digital-museum-design.md)

## 文化与 AI 使用原则

- 不将未经授权的 AI 合成声音冒充艺术家或传承人。
- AI 内容与真人录音、历史资料使用不同标识。
- 传统医药内容只作文化介绍，不提供诊断或疗效承诺。
- 不公开受限仪式、敏感地点或私人联系方式。
- 对争议起源、民族归属和流派关系保留来源与多观点。

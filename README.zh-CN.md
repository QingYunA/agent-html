<div align="center">

<img src="./assets/logo.svg" width="64" height="64" alt="agent-html logo">

# agent-html

<p>
  <strong>专为 AI Agent 打造的零依赖单文件 HTML 设计系统与技能</strong><br>
  深度复刻 shadcn/ui 极简中性美学 · 100% 离线自包含 · 0 npm 依赖 · 0 外部 CDN<br>
  专为 Claude Code、Pi、Codex、Cursor 全局适配
</p>

<p>
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a>
</p>

<p>
  <a href="https://github.com/QingYunA/agent-html/releases"><img src="https://img.shields.io/github/v/release/QingYunA/agent-html?style=flat&color=18181b" alt="Release"></a>
  <a href="https://skills.sh"><img src="https://img.shields.io/badge/skills.sh-npx%20skills%20add%20QingYunA%2Fagent--html-10b981?style=flat&logo=npm" alt="skills.sh install"></a>
  <img src="https://img.shields.io/badge/dependencies-0%20npm%20%7C%200%20cdn-10b981?style=flat" alt="Dependencies">
  <img src="https://img.shields.io/badge/theme-light%20%26%20dark-blue?style=flat" alt="Themes">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-18181b?style=flat" alt="License"></a>
  <a href="https://github.com/QingYunA/agent-html/stargazers"><img src="https://img.shields.io/github/stars/QingYunA/agent-html?style=flat&logo=github&color=18181b" alt="Stars"></a>
</p>

<p>
  <a href="#安装配置">安装配置</a> ·
  <a href="#核心价值">核心价值</a> ·
  <a href="#六大通用布局母版">六大母版</a> ·
  <a href="#快速上手与-cli">快速上手</a> ·
  <a href="#微-css-核心基座">微 CSS 基座</a> ·
  <a href="#自验检查器">Linter</a>
</p>

</div>

---

<p align="center">
  <img src="assets/screenshots/gallery.png" alt="agent-html 组件画廊" width="100%">
</p>

---

## 解决什么痛点？

让大模型（Claude Code, Pi, Codex, ChatGPT）生成 HTML 报表或看板时，99% 的输出都会掉进两个典型陷阱：

- **CDN 依赖陷阱**：模型习惯注入 `<script src="https://cdn.tailwindcss.com"></script>` 和谷歌字体。初看还行，但只要放到企业内网、隔离机房（Air-gapped）就彻底白屏，初次加载耗时 2 秒并伴随严重的排版闪烁（FOUC），过段时间 CDN 链接失效整个文件就烂掉了。
- **AI 视觉垃圾陷阱**：如果不让它用 CDN，模型就会手写内联 CSS——生成刺眼的纯黑边框、30px 不协调的留白、粗糙的高饱和度色块，且没有任何暗黑模式支持。

`agent-html` 彻底终结了这个两难局面：提炼了一套仅 ~75 行的原生 CSS 变量基座与 4 套经过实战检验的空间布局母版。生成的 HTML 文件双击秒开，自带高级企业级质感。

---

## 核心价值

- **零依赖自包含**：0 个 npm 包、0 行构建脚本、0 个外部 CDN。双击即可在任何离线环境秒开。
- **Zinc 冷灰中性色阶**：精准复刻 shadcn/ui 的设计变量体系。1px 微细边框、精细圆角、高信息密度。
- **六大通用空间布局母版**：收敛长文档报告、宽屏监控大盘、双栏审查工作台、并排对比矩阵、事件时间轴、敏捷任务看板六大泛化骨架。
- **原生明暗双模式**：CSS 变量原生自适应系统偏好，内置 5 行原生 JS 切换开关。
- **闭环反馈设计**：提供“一键导出 Markdown”与“复制审查结论至终端 Agent”机制，拒绝单向死胡同页面。
- **确定性自验检查器（`scripts/validate.mjs`）**：Agent 在将 HTML 呈现给人类前，自动运行检查标签对称性、零 CDN 泄漏与移动端视口配置。
- **24 个内联纯矢量 SVG**：精选 Lucide 风格矢量图标，继承字体颜色，不依赖图标字体库。
- **零 CDN 纯原生图表**：纯 SVG 面积走势图、柱状分布图、复合环形占比图、水平排行榜。

---

## 六大通用布局母版

摆脱具体的业务限制，`agent-html` 将界面提炼为 6 套带有清晰 `<!-- [Slot: ...] -->` 插槽注释的基础空间骨架：

### 母版 1：单栏长文档与评估审查报告 (`templates/report.html`)
单栏居中流式布局（最大宽度 860px），专为阅读和打印优化。包含元数据标头、状态徽章、KPI 得分概览、执行摘要 Callout、原生 `<details>` 手风琴折叠栏、一键复制 Markdown 以及 `@media print` 打印防截断样式。

> **适用场景**：技术评审 ADR、面试评估报告、故障复盘 Postmortem、需求草案、更新日志。

<p align="center">
  <img src="assets/screenshots/report.png" alt="报告母版" width="100%">
</p>

---

### 母版 2：数据大盘与过滤表格 (`templates/dashboard.html`)
宽屏响应式网格布局。包含 4 列 KPI 统计卡片、纯原生响应式 SVG 趋势图表（24小时面积图与 P95 柱状分布图）、双重实时过滤工具栏（文本搜索 + 状态下拉）、斑马纹表格以及原生 `<dialog>` 模态弹窗。

> **适用场景**：资源监控大盘、调休考勤管理、Token 用量追踪、工单列表。

<p align="center">
  <img src="assets/screenshots/dashboard.png" alt="数据大盘母版" width="100%">
</p>

---

### 母版 3：左右双栏工作台与审查器 (`templates/inspector.html`)
视口充满型应用布局（`100vh` 页面无外滚动条）。左侧 320px 边栏支持实时过滤列表，右侧详情区动态联动渲染所选条目属性、3列关键指标网格、人工审查裁决按钮组（通过/修复/拒绝）以及带一键复制的深色代码块。

> **适用场景**：链路 Trace 回溯、JSONL 审查工具、Prompt 调试器、日志分析。

<p align="center">
  <img src="assets/screenshots/inspector.png" alt="工作台母版" width="100%">
</p>

---

### 母版 4：并排横向对比与评测矩阵 (`templates/compare.html`)
双栏左右并排对比布局（基准方案 vs 升级挑战方案）。包含胜出判定 Callout、参数规格比对、输出快照对比、量化差异对照表（Delta）以及一键复制 Markdown 摘要。

> **适用场景**：大模型 A/B 评测、Prompt 调优版本对比、架构方案 V1 vs V2 差异评估、产品定价规格矩阵。

<p align="center">
  <img src="assets/screenshots/compare.png" alt="对比矩阵母版" width="100%">
</p>

---

### 母版 5：事件时间轴与故障编年史 (`templates/timeline.html`)
高信息密度的垂直单轨时间线，具备语义化状态圆点（故障、警告、恢复、信息）、精确时间戳、操作人标签、可展开诊断日志以及一键复制时间线为 Markdown 功能。

> **适用场景**：突发故障复盘 (Postmortem)、版本发布路线图 (Roadmap)、变更历史 (Changelog)、长流程事件溯源。

<p align="center">
  <img src="assets/screenshots/timeline.png" alt="时间轴母版" width="100%">
</p>

---

### 母版 6：任务分拣与敏捷拖拽看板 (`templates/kanban.html`)
交互式四列分类看板（Backlog、进行中、阻塞阻断、已完成）。零外部库依赖，纯原生 HTML5 Drag & Drop（~35 行原生 JS 实现拖拽交互），并提供“一键复制看板决策发回 Agent”闭环按钮。

> **适用场景**：Bug 故障分拣、需求优先级评估、日常任务状态流转。

<p align="center">
  <img src="assets/screenshots/kanban.png" alt="敏捷看板母版" width="100%">
</p>

---

## 快速上手与 CLI

### 本地直接预览
无需安装 Node.js，无需启动开发服务器，直接在浏览器中打开：

```bash
# 核心组件画廊
open index.html

# 预览 6 大母版
open templates/report.html
open templates/dashboard.html
open templates/inspector.html
open templates/compare.html
open templates/timeline.html
open templates/kanban.html
```

### 独立 CLI 命令行辅助

仓库内置了零外部依赖的独立 CLI 工具：

```bash
# 直接在默认浏览器打开组件画廊
npx agent-html open

# 快速导出指定通用母版代码到本地文件
npx agent-html template dashboard > my-dashboard.html
npx agent-html template report > my-report.html

# 对任意生成的 HTML 进行零 CDN 泄漏与标签静态检查
npx agent-html check my-dashboard.html
```

---

## 微 CSS 核心基座

生成的每个单文件 HTML 均在 `<head><style>` 中内置这段约 75 行的纯原生 CSS 变量设计底座：

```css
:root {
  --bg: #fafafa;
  --card: #ffffff;
  --card-fg: #09090b;
  --primary: #18181b;
  --primary-fg: #fafafa;
  --primary-hover: #27272a;
  --secondary: #f4f4f5;
  --secondary-fg: #18181b;
  --muted: #f4f4f5;
  --muted-fg: #71717a;
  --border: #e4e4e7;
  --ring: #18181b;
  --radius: 8px;
  --radius-sm: 6px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  --ok: #16a34a;   --ok-bg: #f0fdf4;   --ok-border: #bbf7d0;
  --warn: #d97706; --warn-bg: #fffbeb; --warn-border: #fde68a;
  --err: #dc2626;  --err-bg: #fef2f2;  --err-border: #fecaca;
  --info: #2563eb; --info-bg: #eff6ff; --info-border: #bfdbfe;
}

[data-theme="dark"] {
  --bg: #09090b;
  --card: #121215;
  --card-fg: #fafafa;
  --primary: #fafafa;
  --primary-fg: #18181b;
  --primary-hover: #e4e4e7;
  --secondary: #27272a;
  --secondary-fg: #fafafa;
  --muted: #18181b;
  --muted-fg: #a1a1aa;
  --border: #27272a;
  --ring: #d4d4d8;

  --ok: #4ade80;   --ok-bg: #052e1680;   --ok-border: #166534;
  --warn: #fbbf24; --warn-bg: #451a0380; --warn-border: #854d0e;
  --err: #f87171;  --err-bg: #450a0a80;  --err-border: #991b1b;
  --info: #60a5fa; --info-bg: #17255480; --info-border: #1e40af;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--bg);
  color: var(--card-fg);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

### 必备微脚本片段

**原生暗黑模式切换（5 行）**：
```javascript
const toggle = document.getElementById('themeToggle');
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
toggle?.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});
```

**纯前端表格实时搜索过滤（5 行）**：
```javascript
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('#dataTable tbody tr').forEach(tr => {
    tr.style.display = (!q || tr.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
});
```

---

## 安装配置

### 1. 使用 `skills` 一行命令安装（推荐）

无需手动克隆或配软链接，直接通过生态标准 CLI 一键安装至当前工程或全局 70+ 款 Agent：

```bash
# 安装至当前项目工作区（Claude Code, Cursor, Copilot 等）
npx skills add QingYunA/agent-html

# 或全局安装至本机所有 70+ 款 Coding Agent（Claude Code, Pi, Cursor, Codex 等）
npx skills add QingYunA/agent-html -g
```

### 2. 手动 Git 软链安装（备选）

若你习惯本地源码管理：

```bash
git clone https://github.com/QingYunA/agent-html.git ~/Code/agent-html

# 链接至统一规范目录
ln -sf ~/Code/agent-html/skills/agent-html ~/.agents/skills/agent-html

# 为 Claude Code 或 Pi 建立感知软链
ln -sf ../../.agents/skills/agent-html ~/.claude/skills/agent-html
ln -sf ../../../.agents/skills/agent-html ~/.pi/agent/skills/agent-html
```

---

## 触发提示词示例

安装完成后，以下日常指令将自动触发 `agent-html` Skill：
- *“帮我做个单文件 HTML 监控看板，展示集群延迟和吞吐量趋势图”*
- *“生成一份技术面试评估报告，单文件 HTML，排版要高级，支持直接打印”*
- *“做一个模型 A 和模型 B 的横向对比矩阵页面”*
- *“不要输出 markdown 墙，把这次架构评审结果做成可视化单文件页面”*

---

## 自验检查器 (Linter)

Agent 在将生成的 HTML 交给用户之前，可自检页面规范合规性：

```bash
# 验证单个生成文件
node scripts/validate.mjs path/to/output.html

# 验证所有内置母版
node scripts/validate.mjs --all
```

### 检查规则

- `[ZERO_CDN]`：严禁任何外部 CDN 脚本或远程字体链接泄漏。
- `[THEME_TOKENS]`：必须具备完整的 CSS 变量底座与深浅模式支持。
- `[VIEWPORT]`：必须配置移动端自适应视口标签。
- `[TAG_HYGIENE]`：确保 `<html>`, `<head>`, `<body>` 标签完整对称闭合。
- `[AFFORDANCE]`：非死胡同页面（必须提供导出、复制或打印等操作入口）。
- `[COLOPHON]`：必须包含时间戳生成元数据注释。

---

## 仓库目录结构

```text
agent-html/
├── README.md                      # 英文文档与全景展示
├── README.zh-CN.md                # 简体中文文档
├── index.html                     # 原子组件画廊
├── templates/ -> skills/...       # 4 大通用母版（软链至 assets/templates）
│   ├── report.html                # 单栏长文档与评估审查报告母版
│   ├── dashboard.html             # 数据大盘与过滤表格母版
│   ├── inspector.html             # 左右双栏工作台与审查器母版
│   └── compare.html               # 并排横向对比与评测矩阵母版
├── assets/
│   ├── logo.svg                   # 矢量品牌 Logo
│   └── screenshots/               # 高清预览大图
├── scripts/
│   └── validate.mjs               # 零依赖确定性 HTML 检查脚本
└── skills/
    └── agent-html/
        ├── SKILL.md               # 面向 Agent 的生成准则与插槽规范
        ├── assets/                # 随 Skill 打包的模板资产
        └── evals/                 # 自动化评测用例集
```

---

## 开源协议

[MIT License](LICENSE) © 2026 QingYunA

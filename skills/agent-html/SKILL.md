---
name: agent-html
description: 为 AI Agent 提供基于 shadcn/ui 极简现代美学的单文件 HTML 组件化规范与母版体系。当用户要求“生成 HTML 页面/网页”、“前端可视化大盘/看板”、“面试/分析/测试报告”、“对比矩阵/方案比对”、“review 结果做成可视化页面”、“代码审查报告”、“不要输出 markdown 墙/不要文字墙”、“把分析结果做成可交互单文件网页”等场景时，务必使用本 Skill。零构建、零 npm、严禁引入外部 CDN（无断网白屏风险），纯原生 HTML/CSS/SVG，支持暗黑模式与双击秒开。
---

# Agent HTML 设计系统与组件化规范

本规范指导 AI Agent 如何生成**高信息密度、工业级质感、零外部依赖、双击秒开**的单文件 HTML。

---

## 零、价值研判准则：何时用 HTML，何时坚决不用 (Judgment Rules)

> **黄金法则**：*Markdown 是事实来源（Source of Truth），HTML 是人类决策与评审表面（Human Review Surface）。*

并不是所有输出都需要制作成 HTML。在动手前，AI Agent 必须先做价值研判：

### 1. 优先使用 HTML 的场景（具备以下任一特征）：
- **空间性与多维性 (Spatial)**：宽屏数据大盘、左右双栏日志审查器、指标统计网格、密集状态看板；
- **并行与对比性 (Parallel / A-B)**：基准 vs 挑战者、版本 Diff、模型评测、方案取舍矩阵；
- **可交互与即时过滤 (Interactive / Filterable)**：包含数十条记录需毫秒级搜索、多 Tab 切换、手风琴折叠展开；
- **供人类正式决策/归档 (Human Review Surface)**：正式架构评审、面试录用报告、技术复盘白皮书、发布日志。

### 2. 坚决不要使用 HTML 的场景（留在终端 Markdown 即可）：
- **线性单线条内容**：普通的问答、短解释、单次代码段说明（< 200 字）；
- **纯终端命令/脚本**：用户需要立即在终端复制执行的 shell 命令；
- **无空间结构的信息**：没有表格、没有对比、没有维度的流水账文本；强行输出 HTML 会打断用户终端心流并浪费 Token。

### 3. 定了要用 HTML 之后，再定粒度 (Output Granularity)

这是**第二问**，和第一问同等重要。判错粒度会让用户拿到一份远超或远低于预期的东西：

| 粒度 | 交付物 | 什么时候用 |
| :--- | :--- | :--- |
| **片段** | 单个组件卡片 / 一张图 / 一个表格 | 单点结论、单个对比，用户只想看一眼 |
| **证据页** | 一页：KPI 概览 + 图表 + 关键明细表 | 2–3 个独立结论，需要摆证据但不需要完整叙事 |
| **整页母版** | 六种通用母版之一（见「通用布局母版」一节） | 完整叙事交付：报告、复盘、评审、白皮书 |

**默认档位是「证据页」，不是「整页母版」。** 用户说「分析一下这组数据」「帮我把这个看板做出来」但**没有**说「报告 / 白皮书 / 年报 / 复盘 / 评审」时：

- **必须先交付证据页**（KPI + 最强的一张或两张图 + 关键明细），并在回复里用一句话提示「如需完整报告可以再展开」；
- **不得**因为「数据很丰富」「结论很多」「用户说了分析」就自行升格为整页母版；
- 反过来，用户明确要了「报告 / 白皮书」时，也不得只交付一张图。

拿不准时**选更细的粒度**：多给一张卡片，用户会自己说「再展开」；多给一份六章节报告，用户只会觉得被淹没。

---

## 一、反模式规避清单 (Anti-Patterns to Avoid)

在生成 HTML 时，严禁出现以下常见 AI 反模式。分两组：**工程与交付层**（1–10，多数可被 `scripts/validate.mjs` 机器判定）与**数据与语义层**（11–17，多数只能人眼复核）。

### 1. 工程与交付层（1–10）

1. **穿 HTML 外衣的普通 Markdown (Markdown in an HTML Trenchcoat)**：只是用 `<p>` 和 `<h1>` 包裹几大段流水账文字，完全没用上卡片、网格、状态徽章与 Callout。
2. **偷渡外网 CDN / 远程字体**：引入 Tailwind CDN、Google Fonts、CDN 脚本。在离线环境、内网机房直接白屏失效。
3. **交互死胡同 (Dead-end UI / No Copy-back)**：用户在页面上做了筛选、勾选或人工审核，但页面没有任何“复制结果”或“导出 Markdown”按钮，导致操作无法带回终端给 Agent。
4. **硬编码固定高度截断 (Fixed-height Truncation)**：设置 `height: 400px; overflow: hidden;`，在不同系统或字体大小下导致内容直接被切断。
5. **假装支持暗黑模式**：部分元素硬编码 `#ffffff` 或 `#000000`，在暗黑模式下文字或背景融为一体不可见。
6. **缺乏移动端/小屏响应式**：未加 `<meta name="viewport">` 或缺乏 `@media` 断点，分屏小窗口下横向滚动条爆炸。
7. **缺乏空状态处理 (Empty State)**：表格或列表在搜索无果时白茫茫一片，未提供“暂无匹配记录”提示。
8. **打印样式缺失 (@media print)**：报告类页面未做 `@media print` 样式优化，用户需要导出 PDF 时按钮乱飞。
9. **图表引入重型第三方库**：为了画简单折线图引入 Chart.js/ECharts（有断网白屏风险），必须坚持纯原生矢量 SVG。
10. **丢失关键元数据与数据精度**：过度美化排版却丢掉了关键错误码、时间戳、原始 ID 或 Trace，导致失去工程核验价值。

### 2. 数据与语义层（11–17）

这一组是**「把图画错」而不是「把页面写坏」**。它们不会让页面报错、不会白屏，校验器也测不出来，但会让读者**得出错误结论**——比技术 bug 更危险，因为看不出来。

11. **面积/半径编码未开方**：用半径或圆点大小表示数值时，必须 `Math.sqrt(v)`。直接拿数值当半径会让**面积按平方增长**——2 倍的差异被画成 4 倍，系统性夸大差距。
12. **柱状图断轴**：柱的契约是**长度 ∝ 数值**，截断 Y 轴等于毁约。极端值场景的正确做法只有三条：① 让极端值冲天（最诚实）② 主图 + 放大镜小图 ③ 撕柱不撕轴（明说画不下）。
13. **聚合数冒充原始记录**：把「37%」摊成 37 个点是可以的，但**必须在副标题或底注写明 `1 点 = 1 个百分点`**；不许为了凑密度编造不存在的个体记录。
14. **取整不认账**：占比取整后加总不足 100（如 49+27+14+5+3 = 98）时，底注写明「另外 2% 被四舍五入吃掉了」。**不凑假数据把它补到 100。**
15. **颜色无数据含义**：禁止「拿到五个颜色平均撒到所有元素上」。颜色必须连接真实维度——序数梯接数值、分类色接类目、强调色只给唯一主角——并在底注写清它在编码什么。去掉颜色后，图的结构仍应读得懂。
16. **演示数据不确定**：演示/占位数据禁用 `Math.random()`，必须用确定性伪随机。**刷新两次必须长得一样**，否则截图、录屏、回归对比全部失效。
17. **给无真实记录的元素加交互**：给纯装饰元素加 hover / 点击是欺骗。加交互前先问「这个元素背后有没有一条真实记录？」——完整判定流程见「交互」一节的**三问**。

> 📕 **失败记忆**：以上反模式的**成因、真实案例与复查方式**见 `references/failures.md`（12 条）。写新组件前先扫一眼——规范告诉你该做什么，失败记忆告诉你不要再重蹈什么。该文档末尾有一张索引表，诚实标注了哪些教训已经变成机器约束、哪些还只能靠人。

---

## 二、为什么这样设计？(Design Principles & The "Why")

1. **为什么坚决追求纯单文件与零外部依赖（Zero-Dependency Standalone）？**
   - 很多可视化报告、用例审查工具常在内网机房、无公网访问的隔离环境（Air-gapped）、或本地离线存档中打开。
   - 引入 Tailwind CDN (`cdn.tailwindcss.com`) 或第三方字体库，会在弱网下引发白屏（FOUC）、CDN 节点下线失效或公司 CSP 策略拦截。因此必须将精炼的 CSS 变量与极简微脚本直接内嵌。

2. **为什么严格采用 shadcn/ui 的 Zinc/Slate 中性色体系？**
   - 大模型在自由发挥时容易产生“AI审美漂移”——随机的大圆角、大面积刺眼渐变色、过大的无意义留白。
   - shadcn 的核心是：**冷灰中性底色、精准 1px 微细浅色边框、高信息密度、语义化状态点（Green/Amber/Red）**。这种排版能让任何数据报表看起来都像资深前端工程师耗费数日精心调校过的专业企业级产品。

3. **为什么必须原生内置暗黑模式（Light / Dark Theme）？**
   - 工程师与运维人员大量在暗黑 IDE/终端环境下工作。通过 CSS 变量原生映射，仅需 5 行原生 JS 即可实现丝滑切换，零构建成本却能极大提升使用体验。

---

## 三、六大通用布局母版与渐进式披露 (Progressive Disclosure)

不要从零手写完整页面。接到需求后，首先从以下 6 种**通用布局母版**中选择最贴近的骨架。支持中英文双语母版体系，根据用户输入语言对齐：
- **英文场景**：参考 `assets/templates/en/<name>.html`
- **中文场景**：参考 `assets/templates/zh/<name>.html`

> 🗂 **本仓库的资产分三层，别搞混：**
>
> | 层 | 位置 | 是什么 | 怎么用 |
> |---|---|---|---|
> | **骨架（母版）** | `assets/templates/zh|en/*.html` | 整页版式的正本 | 复制整份作为起点，替换内容 |
> | **零件（组件字典）** | `references/components.md` | 按钮/卡片/图表等片段的正本 | 按需取用单个片段 |
> | **成文（案例）** | `examples/`（仅仓库） | 真实数据走完全流程、且通过全部门禁的成品 | **拿不准交付物长什么样就先看这里** |
>
> **交付给用户的永远是单文件成品**，是从母版或组件拼装出来的。
> **每个资产只有一个正本。** 同一段代码不允许在两处各存一份——两份手抄副本必然漂移（见 `references/failures.md` F-014）。发现重复时，保留一处、另一处改为指针。
> `examples/README.md` 逐条记录了那个案例示范了哪几条容易忘的规矩，包括一条**门禁测不出、只能靠人眼**的图表刻度错误（F-015）。
>
> 📌 **本文件里所有相对路径都相对于本 Skill 的根目录**（即 `SKILL.md` 所在目录），不是相对于你当前的工作目录。安装到 `~/.agents/skills/agent-html` 后，`scripts/validate.mjs` 指的是 `~/.agents/skills/agent-html/scripts/validate.mjs`。

| 布局模式 | 读者时间 | 信息密度 | 核心交互 | 中文母版路径 | 英文母版路径 | 适用需求与核心结构 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Report 报告**<br>(Document / Report) | 30s+ | 中 | 悬浮目录 ScrollSpy、折叠手风琴 | `assets/templates/zh/report.html` | `assets/templates/en/report.html` | **技术选型、架构审查、故障复盘、面试报告、需求说明、发布日志**。<br>结构：自适应宽屏容器（默认 1200px ~ 1280px，支持宽屏自适应扩展至 96%，避免宽屏下表格被挤扁）、悬浮目录（Sticky TOC with ScrollSpy）、核心结论 Callout、KPI 概览栏、多章节 `<details>` 折叠手风琴、一键复制为 Markdown 导出。 |
| **Dashboard 数据面板**<br>(Dashboard & Data Grid) | <10s | 高 | 实时双重过滤、复制表格 | `assets/templates/zh/dashboard.html` | `assets/templates/en/dashboard.html` | **资源监控、用量大盘、考勤/调休管理、订单/任务流管理**。<br>结构：宽屏网格，顶部操作栏、4 列自适应 KPI 统计卡、原生 SVG 走势图与柱状图、实时双重过滤表格、一键复制表格 (MD)。 |
| **Inspector 审查工作台**<br>(Master-Detail Workbench) | 逐条读 | 高 | Master-Detail 联动、人工裁决 | `assets/templates/zh/inspector.html` | `assets/templates/en/inspector.html` | **日志/Trace 审查、Prompt 调试器、JSONL 编辑器、配置管理**。<br>结构：视口充满（100vh），左侧条目列表过滤，右侧动态联动渲染选中条目详情、人工审查裁决条（Pass/Fix/Reject）、复制审查结论发回 Agent。 |
| **Compare 对比**<br>(Side-by-Side Comparison) | ~30s | 中 | 并排对照、Delta 判定 | `assets/templates/zh/compare.html` | `assets/templates/en/compare.html` | **模型 A/B 测试、Prompt 改版前后对比、架构版本 diff、产品套餐/特性矩阵**。<br>结构：并排双栏卡片（基准 vs 挑战者）、核心裁决 Callout、量化差异对照表（Delta 胜负判定标签）、一键导出 Markdown。 |
| **Timeline 时间线**<br>(Timeline & Postmortem) | 30s+ | 中 | 折叠诊断日志 | `assets/templates/zh/timeline.html` | `assets/templates/en/timeline.html` | **发布路线图 (Roadmap)、变更历史 (Changelog)、突发事件复盘 (Postmortem)**。<br>结构：左侧单轨垂直时间线、状态节点小圆点、精确时间戳与操作人 Tag、可展开诊断日志、一键复制时间轴为 Markdown。 |
| **Kanban 看板**<br>(Triage & Agile Kanban) | <10s | 中 | 原生 HTML5 拖拽排序 | `assets/templates/zh/kanban.html` | `assets/templates/en/kanban.html` | **缺陷分类整理、需求优先级排序、任务状态流转**。<br>结构：4 列敏捷看板（Backlog, In Progress, Blocked, Done）、纯原生 HTML5 拖拽排序（零依赖）、一键复制分拣结果回 Agent 闭环。 |

> **用「读者时间」和「信息密度」选型，不要按行业词选型。** 母版名字里的「报告」「看板」「复盘」描述的是**版式性格**，不是使用场景限制——「时间线」可以承载个人生活数据，「对比」可以承载两个方案的取舍。选型看的是：读者愿意花几秒、内容有多密、需不需要特定的交互。

> ⚠️ **中英母版必须结构同构。** zh 与 en 是同一套骨架的两个语言版本，不是两个平行维护的模板；改动其一必须同步另一个。`scripts/validate.mjs` 的 `[ZH_EN_PARITY]` 会把「中文有而英文没有的 `<nav>` / `<aside>` / `<details>`」判为阻断。

> 💡 **组件字典查阅**：所有按钮变体、胶囊徽章、常用 24 个矢量图标、原生纯 SVG 图表与微交互组件的完整代码，都在 `references/components.md`。**它是组件代码的唯一正本。**

---

## 四、微 CSS 核心基座 (Micro-CSS Base)

在生成 HTML 时，务必将以下约 75 行 CSS 基座放入 `<head><style>` 中，它是所有组件质感一致的基石：

```css
:root {
  --bg: #fafafa;
  --card: #ffffff;
  --card-fg: #09090b;
  --popover: #ffffff;
  --popover-fg: #09090b;
  --primary: #18181b;
  --primary-fg: #fafafa;
  --primary-hover: #27272a;
  --secondary: #f4f4f5;
  --secondary-fg: #18181b;
  --secondary-hover: #e4e4e7;
  --accent: #f4f4f5;
  --accent-fg: #18181b;
  --destructive: #dc2626;
  --destructive-fg: #fafafa;
  --muted: #f4f4f5;
  --muted-fg: #71717a;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #18181b;
  --radius: 8px;
  --radius-sm: 6px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  --ok: #16a34a;   --ok-bg: #f0fdf4;   --ok-border: #bbf7d0;
  --warn: #d97706; --warn-bg: #fffbeb; --warn-border: #fde68a;
  --err: #dc2626;  --err-bg: #fef2f2;  --err-border: #fecaca;
  --info: #2563eb; --info-bg: #eff6ff; --info-border: #bfdbfe;

  /* 图表专用色（Tremor 风格）。语义固定，不可当作装饰色随机分配：
     每个色相各承担一种数据含义，见「轻量原生图表规范」一节。 */
  --chart-indigo: #6366f1;   /* 主指标时序走势 */
  --chart-emerald: #10b981;  /* 正常 / 健康 / 增长 / 放行 */
  --chart-amber: #f59e0b;    /* 警戒 / 抖动 / 温和上升 */
  --chart-rose: #f43f5e;     /* 异常瓶颈 / 错误峰值 / 降级 */
  --chart-violet: #8b5cf6;   /* P95 / P99 峰值高亮 */
  --chart-cyan: #06b6d4;     /* 辅助对比时序 / 出向流量 */
  --chart-slate: #64748b;    /* 低优对比柱 / 中性刻度 */
}

[data-theme="dark"] {
  --bg: #09090b;
  --card: #121215;
  --card-fg: #fafafa;
  --popover: #121215;
  --popover-fg: #fafafa;
  --primary: #fafafa;
  --primary-fg: #18181b;
  --primary-hover: #e4e4e7;
  --secondary: #27272a;
  --secondary-fg: #fafafa;
  --secondary-hover: #3f3f46;
  --accent: #27272a;
  --accent-fg: #fafafa;
  --destructive: #ef4444;
  --destructive-fg: #fafafa;
  --muted: #18181b;
  --muted-fg: #a1a1aa;
  --border: #27272a;
  --input: #27272a;
  --ring: #d4d4d8;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);

  --ok: #4ade80;   --ok-bg: #052e1680;   --ok-border: #166534;
  --warn: #fbbf24; --warn-bg: #451a0380; --warn-border: #854d0e;
  --err: #f87171;  --err-bg: #450a0a80;  --err-border: #991b1b;
  --info: #60a5fa; --info-bg: #17255480; --info-border: #1e40af;

  --chart-indigo: #818cf8;
  --chart-emerald: #34d399;
  --chart-amber: #fbbf24;
  --chart-rose: #fb7185;
  --chart-violet: #a78bfa;
  --chart-cyan: #22d3ee;
  --chart-slate: #94a3b8;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--bg);
  color: var(--card-fg);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  height: 34px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--card-fg);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
}
.btn:hover { background: var(--secondary); }
.btn-primary { background: var(--primary); color: var(--primary-fg); border-color: var(--primary); }
.btn-primary:hover { background: var(--primary-hover); opacity: 0.95; }
.btn-destructive { background: var(--err); color: #fff; border-color: var(--err); }
.btn-sm { height: 28px; padding: 0 8px; font-size: 12px; }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  height: 20px;
  padding: 0 7px;
  border-radius: 9999px;
  border: 1px solid var(--border);
  background: var(--secondary);
  color: var(--secondary-fg);
}
.badge-dot { width: 5px; height: 5px; border-radius: 9999px; background: currentColor; }
.badge-success { background: var(--ok-bg); color: var(--ok); border-color: var(--ok-border); }
.badge-warning { background: var(--warn-bg); color: var(--warn); border-color: var(--warn-border); }
.badge-danger  { background: var(--err-bg);  color: var(--err);  border-color: var(--err-border); }
.badge-info    { background: var(--info-bg); color: var(--info); border-color: var(--info-border); }
```

---

## 五、高频原子 HTML 插槽字典 (Atomic HTML Snippets)

> 💡 **原子积木按需索取 (Progressive Disclosure)**：本节列举最核心的高频插槽。如需查阅完整 24 个研发矢量图标、复合多色段环形图、水平耗时排行榜等详细代码片段，可使用 `read` 工具查阅本 Skill 目录下的 `references/components.md`。

### 1. 指标卡片 (Stat Card)
```html
<div class="stat-card" style="padding: 18px 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);">
  <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--muted-fg);">
    <span>可用剩余额度</span>
    <span style="color: var(--ok); font-weight: 600;">↑ 正常</span>
  </div>
  <div style="font-size: 26px; font-weight: 700; margin: 6px 0 2px;">3.5 天</div>
  <div style="font-size: 12px; color: var(--muted-fg);">本月总产生：7.5 天</div>
</div>
```

### 2. 执行摘要提示条 (Callout / Alert)
```html
<div style="padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--ok-border); background: var(--ok-bg); font-size: 13px; line-height: 1.5; margin-bottom: 16px;">
  <strong style="color: var(--ok); display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    <span>核心评估结论</span>
  </strong>
  <span>系统整体稳定性与架构设计符合上线标准，建议推进下一阶段发布。</span>
</div>
```

### 3. 可折叠审查项手风琴 (Accordion)
```html
<details style="border-bottom: 1px solid var(--border);">
  <summary style="list-style: none; padding: 12px 0; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; user-select: none;">
    <span>1. 分布式容灾与降级验证</span>
    <span style="color: var(--muted-fg);">▾</span>
  </summary>
  <div style="padding-bottom: 14px; font-size: 13px; color: var(--muted-fg); line-height: 1.6;">
    已验证跨可用区自动切流，模拟机房断网后 2.4s 内完成健康检测与流量重新路由。
  </div>
</details>
```

### 4. 数据表格与搜索框 (Table with Search)
```html
<div class="card">
  <div style="padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
    <input type="text" id="searchInput" placeholder="实时搜索过滤..." style="height: 32px; padding: 0 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--card-fg); outline: none;">
  </div>
  <table id="dataTable" style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
    <thead>
      <tr style="background: var(--secondary); color: var(--muted-fg); border-bottom: 1px solid var(--border);">
        <th style="padding: 10px 16px;">项目编号</th>
        <th style="padding: 10px 16px;">负责人</th>
        <th style="padding: 10px 16px;">状态</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 16px;">TASK-001</td>
        <td style="padding: 10px 16px;">陈云青</td>
        <td style="padding: 10px 16px;"><span class="badge badge-success"><span class="badge-dot"></span>已完成</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

### 5. 常用纯矢量 SVG 图标字典 (24 个精选工程图标)
所有图标均基于 `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"`，通过继承字色自动融入暗黑模式：
- 搜索: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`
- 成功: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
- 警告: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
- 复制: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
- 日历: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`
- 终端: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`
- 过滤: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`
- 外链: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
- 用户: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
- 折叠: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>`
- 删除: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`
- 下载: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
- Git分支: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`
- Git提交: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>`
- Git PR: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>`
- 缺陷/Bug: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="14" x="8" y="6" rx="4"/><path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M20 13h-4"/><path d="M4 13h4"/><path d="m10 4 1 2"/><path d="m14 4-1 2"/></svg>`
- 服务器: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`
- 数据库: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`
- CPU算力: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 15h3"/><path d="M1 9h3"/><path d="M1 15h3"/></svg>`
- 心跳/探活: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`
- 安全防护: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
- 鉴权锁定: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
- 刷新/重试: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>`
- 系统设置: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`

### 6. 轻量原生图表规范 (Zero-CDN Pure SVG Charts)

在生成数据大盘与报表时，**严禁引入 Chart.js / ECharts / Recharts 等外部 CDN 库**。图表统一采用纯原生矢量 SVG 实现：

- **零网络依赖**：脱机、内网机房 100% 秒开，绝无 CDN 挂掉或白屏风险；
- **暗黑模式自适应**：直接使用主题变量（含 `--chart-*` 图表语义色，定义见「微 CSS 核心基座」），无须额外 JS 监听重绘；
- **自适应视口**：统一 `viewBox` + `style="width: 100%; height: auto;"`，Retina 与打印完美保真。

> 📖 **六种核心形态的完整代码在 `references/components.md` 的「原生轻量图表」一节**（面积折线 / 垂直柱状 / 复合环形 / 双线时序 / 水平排行榜 / 半环仪表）。
> **代码在那边，契约在这边。改代码前先读本节。**

#### 图表四件套（缺一不可，违反即返工）

每张图必须齐全这四个部分，顺序固定：

1. **结论式标题** —— 写判断，不写图型名。`峰值落在 16:00 的批处理窗口` 可以，`24小时吞吐量趋势` 不行。
2. **副标题写单位契约** —— 用 `1 X = 1 Y` 说清一个视觉单位等于多少真实数量，再用 `·` 追加图例与时间范围。**这是数据诚实性的核心，不是装饰**：
   - `1 格 = 1 个百分点 · 空心 = 周末 · 近 30 天`
   - `1 tick = 1 天 · 每 5 天一个刻度`
   - 摊开聚合数时必须写明口径（见反模式 13）；取整加总不足 100 要认账（见反模式 14）。
3. **图体** —— 数据层诚实。密度来自单位，不来自修饰。
4. **底部全大写编码说明行** —— `font-size: 10px; letter-spacing: .08em; color: var(--muted-fg)`，说明**颜色与刻度在编码什么**：
   - `橙色 = 唯一主角（本轮最高耗时）`
   - `灰阶 = 数值大小，越深越大`

#### 轻度家具（让图不寒酸，但不改变 shadcn 语言）

只画数据 + 一根基线的小图必然寒酸。补下面四件——**它们不携带数据，只提供阅读轨道**：

| 家具 | 做法 |
|---|---|
| 基线加重 | 底部一根 `1px` 实线（`var(--border)`），区别于上方 `stroke-dasharray="3 3"` 的参考虚线 |
| rim 刻度 | 沿基线每 5 或 10 个单位一个 tick 点，让读者能估读而不必逐个看数字 |
| 参考导轨 | 2–3 条水平虚线，对齐 Y 轴整数值 |
| 峰值引线 | 峰值气泡引一根 `1px` 折线到数据点，避免气泡悬空 |

> ⚠️ **不要照搬编辑叙事风格（Lupi 系）的家具**：用发丝线构成面积、用横档线构成柱、去掉卡片边框与阴影——那是另一种设计语言的签名，搬进来会同时破坏两边的身份。
> agent-html 的图表语言是 **shadcn 企业看板**：白色卡片 + `1px` 边框 + 语义状态色。**保持它。**
## 六、交互：先问三问，再选脚本 (Interaction)

**不要默认「加了交互就更高级」。** 给没有内容的元素加行为是欺骗；给一眼能读完的内容加行为是噪音。加任何交互之前，按顺序回答三问：

1. **这个元素背后有没有一条真实记录？**
   没有（纯肌理装饰：分隔线、装饰性图形、背景点缀）→ **禁止加交互**。给没有内容的元素加 hover 或点击，是在暗示它有什么可以查看。
2. **有记录 —— 不点能不能读出来？**
   能（元素少于约 50 个，且两端或关键处有标注）→ **静态就够用**，hover 只是锦上添花，不是必需品。
3. **元素超过约 50 个，或存在多段路径？**
   → **必须**提供 hover / pin，否则读者只能看到一团氛围，无法逐条查询。

三问定完之后，再决定用下面哪个脚本。反过来说：**如果三问的答案指向「不需要交互」，就不要因为「母版里有这个功能」而硬加。**

### 1. 暗黑模式切换按钮（建议所有页面右上角均标配）
```javascript
const toggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDark) document.documentElement.setAttribute('data-theme', 'dark');

toggle?.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});
```

### 2. 表格前端毫秒级实时搜索过滤
```javascript
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('#dataTable tbody tr').forEach(tr => {
    tr.style.display = (!q || tr.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
});
```

### 3. 一键导出回 Markdown 文本 (Copy as Markdown)
页面顶部或侧边标配导出按钮，允许用户将当前 HTML 结论零损耗带走（发飞书、贴 GitHub Issue/PR 或发群）：
```javascript
document.getElementById('copyMarkdownBtn')?.addEventListener('click', () => {
  const md = `# ${document.querySelector('h1').innerText}\n\n` +
    `> 状态：${document.querySelector('.badge')?.innerText || '已归档'}\n\n` +
    `## 核心结论\n${document.querySelector('.callout')?.innerText || ''}\n`;
  navigator.clipboard.writeText(md).then(() => {
    const btn = document.getElementById('copyMarkdownBtn');
    const orig = btn.innerText;
    btn.innerText = '已复制 Markdown!';
    setTimeout(() => { btn.innerText = orig; }, 1800);
  });
});
```

### 4. 人工审查决策汇总回传 Agent (Review Verdict Copy-Back)
工作台或审查器母版中，记录用户在页面的单项决策并生成结构化文本，方便用户一键复制粘回终端让 Agent 接着执行：
```javascript
document.getElementById('exportDecisionBtn')?.addEventListener('click', () => {
  let lines = ['### 人工审查结论回传 (Review Decisions)'];
  document.querySelectorAll('.item-row').forEach(row => {
    const id = row.getAttribute('data-id');
    const verdict = row.getAttribute('data-verdict') || 'PASS';
    lines.push(`- [${verdict}] ${id}: ${row.getAttribute('data-name')}`);
  });
  lines.push('\n请根据上述人工裁决结果继续处理下一步任务。');
  navigator.clipboard.writeText(lines.join('\n')).then(() => {
    alert('审查结论已复制到剪贴板，可直接在终端中 Cmd+V 发给 Agent 继续执行！');
  });
});
```

### 5. 长文档悬浮目录与阅读进度监听 (Sticky TOC ScrollSpy)
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.toc-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });

document.querySelectorAll('section[id]').forEach(el => observer.observe(el));
```

### 6. 页脚 Colophon 溯源元数据印章
在每个交付的单文件 HTML 底部必须附带正式的归档印记：
```html
<footer style="margin-top: 40px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted-fg); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
  <div>Generated by <strong>Agent HTML</strong> · 零依赖单文件规范 · 100% 离线自包含</div>
  <div>时间戳：2026-09-08 · 基准：main@HEAD · 状态：已正式归档</div>
</footer>
```

### 7. 原生 HTML5 看板跨列拖拽逻辑 (Kanban Drag & Drop)
零外部库，仅 ~30 行原生事件监听即可实现卡片跨列拖拽：
```javascript
let dragged = null;
document.querySelectorAll('.card-item').forEach(card => {
  card.addEventListener('dragstart', () => { dragged = card; card.classList.add('dragging'); });
  card.addEventListener('dragend', () => { card.classList.remove('dragging'); dragged = null; });
});
document.querySelectorAll('.kanban-col').forEach(col => {
  col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drag-over'); });
  col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
  col.addEventListener('drop', (e) => {
    e.preventDefault();
    col.classList.remove('drag-over');
    if (dragged) col.querySelector('.cards-container').appendChild(dragged);
  });
});
```

---

## 七、交付自验与质量门禁 (Self-Verification Gate)

交付前要做两件事：**能跑门禁就跑门禁；跑不了门禁就逐条人工过清单，并把「门禁未运行」如实讲出来。**

### 1 · 先探测环境（不要假设有 Node）

门禁脚本是 Node 写的。**很多 Agent 运行环境根本没有 Node，也可能没有 Chrome**——这不是错误，但你必须先探测、再决定走哪条路，**绝不能因为跑不了就默认产物没问题**。

```bash
command -v node >/dev/null 2>&1 && echo "有 node" || echo "无 node"
```

| 环境 | 走哪条路 |
|---|---|
| 有 `node` | 跑静态门禁（下面第 2 节），**必须**。这是最快、最确定的一层 |
| 有 `node` 且有 Chrome/Chromium | 再跑渲染烟测（第 3 节）。可选但强烈建议 |
| **无 `node`** | 跳过脚本，直接执行第 4 节的**人工自检清单**，并在交付说明里明确写出「本环境无 Node，门禁未运行，已按人工清单逐条核对」 |
| 有 `node` 无 Chrome | 跳过烟测即可。烟测退出码 `2` 表示**环境不具备条件，不是产物缺陷**，不要据此判定交付物不合格 |

**透明度高于面子。** 一条「门禁未运行」的诚实交代，比一句「已校验通过」的虚假声明有用得多——后者会让用户拿着没验过的产物去做决策。

### 2 · 静态门禁（有 Node 时必跑）

路径相对**本 Skill 根目录**（不是你的工作目录）：

```bash
node <skill>/scripts/validate.mjs <generated_file.html>   # 校验单个产物
node <skill>/scripts/validate.mjs --all                    # 校验技能全部产物
node <skill>/scripts/validate.mjs --all --json             # 机器可读输出
```

该脚本零网络、零 Token、纯 Node 内置模块，共 **19 条规则 ＋ 2 条跨文件检查**。

**10 条阻断级规则**（违反必须返工）：

1. `[ZERO_CDN]` 是否含有外部 script / link / `@import` CDN 引用与远程字体；
2. `[THEME_TOKENS]` 是否声明完整 CSS 变量底座（`--bg` `--card` `--primary` `--border`）并支持暗黑模式；
3. `[VIEWPORT]` 是否具备移动端小屏响应式 viewport；
4. `[TAG_HYGIENE]` svg / details / dialog / table / nav / aside 等关键标签是否对称闭合；
5. `[DUP_ID]` 同一文件内 `id` 是否唯一（否则 JS 取到的元素不确定）；
6. `[SCRIPT_SYNTAX]` 每个内联 `<script>` 能否通过编译——**"没报错" ≠ "跑得起来"**；
7. `[DARK_MODE_LEAK]` token 块之外是否硬编码了 `#fff` / `#000` / `white` / `black`（假暗黑模式）；
8. `[WIDTH_HYGIENE]` 含表格是否提供 `overflow-x` 滚动容器、主容器是否被硬编码得过窄；
9. `[DOC_FENCES]` 规范文档的 Markdown 代码围栏是否配对（未闭合会让后续全文变成代码块，Agent 会读错规范）；
10. `[CSS_VAR_DEFINED]` `var(--x)` 引用的变量是否在同文件内定义。单文件零依赖下没有外部样式表可救；且**不带 fallback 的 `var()` 失效是整体失效而非降级**——`stroke` 会变成 `none`，图形直接消失，而不是颜色不对。

> 第 8 条的常见修法：`.container` 基础宽度用 `max-width: 1280px`（或 `width: 100%; max-width: 1380px`），表格外层包裹 `<div class="table-wrap" style="overflow-x: auto; width: 100%;">`。严禁把主容器硬编码成 800–860px 的死宽度。

**9 条提醒级规则**（建议人工复核）：

11. `[NO_RANDOM]` 演示/图形数据是否使用了 `Math.random()`（必须确定性）；
12. `[CHART_TOKEN_ONLY]` SVG 的 `fill` / `stroke` 是否硬编码色值（应取 CSS 变量以跟随主题）；
13. `[FIXED_HEIGHT]` 是否固定像素高度与 `overflow:hidden` 并存导致截断；
14. `[PRINT_STYLE]` 文档型母版是否提供 `@media print`；
15. `[EMPTY_STATE]` 实现了筛选/搜索是否同时实现了空状态；
16. `[AFFORDANCE]` 是否具备复制/导出出口（杜绝交互死胡同）；
17. `[COLOPHON]` 是否包含页脚溯源归档印章；
18. `[DOC_SECTIONS]` 章节编号是否重复或跳号；
19. `[MIN_FONT]` SVG 内字号是否低于 9px（装不下应改 hover 显示，**不许缩小字号硬塞**）。

**2 条跨文件检查**：

- `[ZH_EN_PARITY]`：zh 母版有而 en 缺失的结构元素（nav / aside / details / table / dialog / section）判为阻断；同一功能的导出按钮 id 在中英两版不一致判为提醒。
- `[DOC_TOKEN_COVERAGE]`：规范文档里的 ```` ```html ```` 代码样例若引用了 Micro-CSS 基座之外的 CSS 变量，判为阻断。**这条防的是「照文档做反而做坏」**——基座与样例是两份手抄副本，缺了这道检查就会各自漂移（见 `references/failures.md` F-014）。

### 3 · 渲染烟测（静态 lint 覆盖不到的盲区；有 Chrome 时建议跑）

静态 lint 能证明"代码没报错"，**证明不了"页面真的画出来了"**。交付前再跑一次渲染烟测：

```bash
node <skill>/scripts/smoke.mjs            # 技能全部产物
node <skill>/scripts/smoke.mjs <file.html>  # 单个产物
```

它把产物复制到临时目录（**不改动仓库文件**），注入探针脚本后用 headless Chrome 以 `--dump-dom` 输出**渲染后**的 DOM，再断言运行时事实：

- 内联脚本是否有**运行期**报错（语法合法 ≠ 跑得起来，这条静态 lint 永远测不到）；
- `SVG` 是否真的画出了图元（而不是容器在、内容空的"空壳"）；
- 点击 `#themeToggle` 前后 `--bg` 是否真的变化（假暗黑模式）；
- 是否存在被 `overflow:hidden` 截断的内容；
- 窄视口下是否横向溢出。

需要本机有 Chrome/Chromium（可用 `CHROME_PATH` 指定，支持 macOS / Linux 常见路径）。**找不到浏览器时它以退出码 `2` 跳过，并且在语言上明确这是环境问题、不是产物缺陷。** `node <skill>/scripts/smoke.mjs --selftest` 会注入缺陷，证明探针本身确实能失败。

### 4 · 豁免机制（白名单先于规则）

误报会摧毁对门禁的信任，因此**容器的 token 定义块（`:root` / `[data-theme]` / `prefers-color-scheme`）与 `@media print` 块内的颜色字面量永远合法**，不需要任何豁免。

确实需要豁免时，在命中行的**上一行**写：

```css
/* @lint-allow: DARK_MODE_LEAK — 该按钮悬浮在恒为深色的代码块表面上，不随主题反转 */
.copy-btn:hover { background: #3f3f46; color: #fff; }
```

- 豁免**作用域仅为「注释所在行 + 下一行」**，不会掩盖同文件其他位置的真实违规（这条是被 F-003 逼出来的：最初的实现是文件级豁免，放行一处会顺带掩盖别处）；
- **必须写明理由**（≥4 字符），不写理由的豁免不生效（F-004）；
- 典型可豁免场景：恒为深色的代码块/终端表面上的按钮（F-005）。**不要用它来掩盖真正的暗黑模式缺陷。**

> 为什么把白名单放在规则之前？因为第一版规则上线时，20 个文件里报出 9 处「硬编码颜色」，逐一查看后**全部合法**——6 处是 `:root` 里的 `--card: #ffffff`，3 处在 `@media print` 内。完整经过见 `references/failures.md` F-002。

### 5 · 门禁本身的有效性（维护者向）

```bash
node <repo>/scripts/test-rules.mjs   # 仅仓库开发时可用
```

该脚本为每条规则生成一份恰好含一处缺陷的合成 HTML，断言对应规则确实命中，并用反向用例断言白名单与豁免机制不误报。**改规则后必须重跑**——一个"什么都能过"的校验器等于没有校验器。

三个门禁的完整组合：

```bash
npm test          # 静态 lint + 规则变异测试（无需浏览器）
npm run test:smoke   # 渲染烟测 + 烟测自测（需要 Chrome）
npm run test:all     # 以上全部
```

### 6 · 人工自检清单（**没有 Node 时这是唯一的验证路径**）

校验器与烟测加起来仍然**测不了「图有没有画对」**。以下 6 项无法静态判定，脚本全绿也不代表没问题——**必须由 Agent 在交付前对照「反模式规避清单」的数据与语义层逐条自查**：

- [ ] **柱状图没有断轴**？（截断 Y 轴等于毁约；需理解 Y 轴语义）
- [ ] **面积/半径编码开了平方根**？（需知道某个 `r` 绑定的是数值还是面积）
- [ ] **颜色连接了真实数据维度**，且底注写清了它在编码什么？（语义判断）
- [ ] **卡片标题写的是结论，不是图型名**？（"Revenue by plan" 可以，"柱状图" 不行）
- [ ] **图型与数据形状匹配**？（语义判断）
- [ ] **演示数据是确定性的**？（刷新两次必须长得一样）

另外两项虽可静态发现，但代价高、容易漏，交付前顺手确认一次：

- [ ] **语言纯度**：中文母版与英文母版不混排，一份交付只用一种语言；
- [ ] **粒度正确**：符合「价值研判准则」第 3 条的判定——没有把「分析一下」做成整页报告，也没有把「要一份报告」做成一页图表。

> 这份清单不是补充说明，而是**门禁的边界声明**，也是**没有 Node 时的唯一验证路径**。
> 门禁全绿同样只证明「工程上没坏」，不证明「图上没错」——F-015 就是一个 18 条规则、14 个产物烟测、28 个变异用例全绿、图却画错了的实例。

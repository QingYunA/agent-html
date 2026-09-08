# Agent HTML 🎨

> **面向 AI Agent 的轻量级单文件 HTML 组件化规范与母版体系**
> 零 npm、零构建链、零外网 CDN 依赖，纯原生现代 HTML5/CSS/JS，开箱复刻 shadcn/ui 极简现代中性美学。

---

## 💡 为什么需要这个项目？

在日常使用 AI Agent（如 Claude Code, Pi, Codex 等）生成可视化看板、面试评估报告、系统测试比对或数据分析页时，常常面临：
1. **每次都要从零手写 HTML/CSS**：消耗大量 context tokens 和生成等待时间。
2. **样式风格不统一**：有的用 Tailwind CDN（断网就白屏），有的手写粗糙表格，缺乏一致的高级感。
3. **维护心智重**：重型的前端框架（React/Vue/Vite）对于这种单次展示性报表太重了。

**`agent-html` 的解决方案**：
- **纯单文件自包含（100% Offline & Standalone）**：双击即可在任何浏览器本地秒开，内联纯原生 CSS 变量与微脚本，绝不依赖任何外部网络。
- **shadcn/ui 极简中性美学**：Zinc/Slate 冷灰质感底座、1px 精致边框、状态徽章、信息高密度。
- **四大通用布局母版**：收敛提炼为单栏长文档报告、宽屏监控大盘网格、左右双栏审查工作台、并排横向对比矩阵四大通用骨架。
- **打通全局 Agent Skill**：无论是哪个 Agent，只要调用 `agent-html` Skill 就能直接照着标准化组件与母版组装页面。

---

## 📂 仓库目录结构

```text
agent-html/
├── README.md                      # 本文档
├── index.html                     # 🎨 核心画廊：所有原子组件、变体及交互的展示体验站
├── templates/ -> skills/...       # 📦 4 大通用布局母版（单文件软链，可直接双击运行）
│   ├── report.html                # 1. 单栏文档与评估报告母版 (Document / Executive Report)
│   ├── dashboard.html             # 2. 数据大盘与过滤表格母版 (Analytics Dashboard & Grid)
│   ├── inspector.html             # 3. 左右双栏工作台与审查器母版 (Master-Detail Workbench)
│   └── compare.html               # 4. 并排横向对比与评测矩阵母版 (Side-by-Side Comparison)
└── skills/
    └── agent-html/
        ├── SKILL.md               # 🤖 供 Agent 全局调用的技能说明书与代码片段字典
        ├── assets/
        │   ├── index.html         # 画廊入口镜像软链
        │   └── templates/         # 4 大母版物理源文件
        └── evals/
            └── evals.json         # 4 套覆盖各场景母版的验证基准测试集
```

---

## 🚀 快速体验与浏览

无需启动任何本地开发服务器，直接在 Finder 中双击或在终端中用浏览器打开：

```bash
# 1. 打开核心组件画廊体验站
open index.html

# 2. 预览单栏文档与评估报告母版
open templates/report.html

# 3. 预览数据大盘与过滤表格母版
open templates/dashboard.html

# 4. 预览双栏工作台与审查器母版
open templates/inspector.html

# 5. 预览并排横向对比与评测矩阵母版
open templates/compare.html
```

---

## 🧩 核心原子组件清单

| 组件 | 说明 | 常见变体与特性 |
| :--- | :--- | :--- |
| **Button** | 按钮组件 | Primary、Secondary、Outline、Ghost、Destructive、Icon |
| **Badge** | 状态胶囊徽章 | Success (绿)、Warning (黄)、Danger (红)、Info (蓝)、带状态小圆点 |
| **Stat Card** | KPI 指标块 | 统计数字、环比/同比趋势 Badge、副标题说明 |
| **Callout / Alert** | 摘要提示条 | 成功、预警、错误、信息提示条，用于报告核心结论 |
| **Table** | 交互式数据表格 | 精细 1px 边框、表头悬浮、行 Hover 效果、内置 5 行原生搜索过滤 |
| **Tabs** | 药丸分段选项卡 | Segmented Control 风格切换不同内容面板 |
| **Accordion** | 折叠手风琴 | 基于原生 `<details><summary>`，带顺滑展开箭头与无 JS 支持 |
| **Native Dialog** | 模态弹窗 | 基于原生 `<dialog>`，自带 Backdrop 模糊毛玻璃遮罩 |
| **Code Block** | 代码展示框 | 深色代码块，支持一键复制代码到剪贴板 |
| **Curated SVG** | 常用矢量图标 | 提取自 Lucide 的常用矢量 SVG，自适应字色，无网络依赖 |

---

## 🌓 设计变量与暗黑模式 (Design Tokens)

`agent-html` 内置对暗黑模式的无缝支持：
- 默认读取系统偏好（`prefers-color-scheme: dark`）。
- 支持通过 `document.documentElement.setAttribute('data-theme', 'dark')` 手动切换。

```css
:root {
  --bg: #fafafa;
  --card: #ffffff;
  --card-fg: #09090b;
  --primary: #18181b;
  --primary-fg: #fafafa;
  --border: #e4e4e7;
  --ok: #16a34a;
  --warn: #d97706;
  --err: #dc2626;
  --info: #2563eb;
}

[data-theme="dark"] {
  --bg: #09090b;
  --card: #121215;
  --card-fg: #fafafa;
  --primary: #fafafa;
  --primary-fg: #18181b;
  --border: #27272a;
}
```

---

## 🤖 如何在 Agent 中使用？

本仓库的 `skills/agent-html` 已自动软链接至系统全局 Skill 目录：
- `~/.agents/skills/agent-html`
- `~/.pi/agent/skills/agent-html`
- `~/.claude/skills/agent-html`

当你对 Claude Code、Pi 或 Codex 说：
> “做个调休看板单文件 HTML”  
> “帮我生成一份技术面试评估报告的 HTML 页面，样式参考 shadcn”  
> “做一个单文件的数据大盘，要求支持离线查看”  

Agent 将自动触发 `agent-html` Skill，直接复用本规范中的 CSS 基座和母版骨架，数秒内生成出工业级美观、零依赖的单文件 HTML。

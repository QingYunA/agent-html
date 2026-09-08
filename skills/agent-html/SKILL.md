---
name: agent-html
description: 为 AI Agent 提供 shadcn/ui 风格的轻量级单文件 HTML 组件化规范与母版体系。用于生成高质感、零构建、零 CDN 依赖、100% 离线自包含的可视化报表、数据看板、面试评估报告、任务轨迹回溯器与单文件工具。触发场景：生成 HTML、做个网页、做个看板、做个数据报表、面试分析报告、调休管理看板、可视化展示、单文件 HTML、类似 shadcn 风格的前端页面。
---

# Agent HTML 设计系统与组件化规范

专为 AI Agent（Claude, Pi, Codex 等）设计的单文件 HTML 生成准则。**零 npm、零构建链、零外网 CDN 依赖，纯原生现代 HTML5/CSS/JS，双击秒开，永久离线可用。**

---

## 一、三项核心铁律 (Hard Rules)

1. **绝对自包含（Zero-Dependency Standalone）**：
   - 严禁引入外部 CDN 样式或脚本（如 `cdn.tailwindcss.com`, `unpkg.com`）。
   - 图标使用纯内联矢量 SVG（带 `stroke="currentColor"`），杜绝 FontAwesome 或图片外链。
   - 单文件直接丢给任何人、断网环境、离线内网均可 100% 正常渲染与交互。

2. **严格遵循 shadcn/ui 极简中性美学**：
   - **底色与边框**：冷灰 Zinc/Slate 色系（亮色背景 `#fafafa`，卡片 `#ffffff`，精致 1px 边框 `#e4e4e7`；暗色背景 `#09090b`，卡片 `#121215`，边框 `#27272a`）。
   - **圆角与投影**：小圆角（按钮 6px，卡片 8~12px，胶囊 9999px）；微细弥散阴影（`0 1px 2px rgba(0,0,0,0.05)`）。
   - **高信息密度**：字号以 12px~14px 为主，标题 16px~24px，紧凑干练，不搞空旷留白。

3. **原生明暗双模式（Light / Dark Theme）**：
   - 必须在 `:root` 和 `[data-theme="dark"]` 中声明双套变量。
   - 页面右上角默认配备极简的日月切换按钮（5 行原生 JS）。

---

## 二、生成决策工作流 (Decision Workflow)

当收到生成 HTML 的任务时，按以下 3 步执行：

1. **判定场景母版 (Archetype)**：
   - **分析/评估报告**（面试报告、QA测试对比、审计记录）→ 使用 **母版 1：Report**
   - **状态/管理看板**（考勤调休、用量大盘、业务监控表）→ 使用 **母版 2：Dashboard**
   - **数据工具/审查器**（JSONL编辑器、日志分析、轨迹重放）→ 使用 **母版 3：Inspector**
2. **嵌入微 CSS 基座 (Micro-CSS Base)**：将下文给出的标准化 `<style>` 片段完整置入 `<head>`。
3. **组装原子零件与填充数据**：按需选用 Button、Badge、Stat Card、Table、Callout 等标准插槽。

---

## 三、微 CSS 核心基座（直接内嵌在 `<style>` 中）

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

## 四、高频原子代码片段 (Copy-Paste Snippets)

### 1. 指标卡片 (Stat Card)
```html
<div class="stat-card" style="padding: 18px 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);">
  <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--muted-fg);">
    <span>指标名称</span>
    <span style="color: var(--ok);">↑ +12%</span>
  </div>
  <div style="font-size: 26px; font-weight: 700; margin: 6px 0 2px;">98.4%</div>
  <div style="font-size: 12px; color: var(--muted-fg);">对比基线持续改善</div>
</div>
```

### 2. 摘要 Callout
```html
<div style="padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--ok-border); background: var(--ok-bg); font-size: 13px; line-height: 1.5; margin-bottom: 16px;">
  <strong style="color: var(--ok); display: block; margin-bottom: 2px;">✓ 结论摘要</strong>
  <span>核心测试用例全部通过，未检测到任何架构或安全回归。</span>
</div>
```

### 3. 可折叠手风琴 (Accordion)
```html
<details style="border-bottom: 1px solid var(--border);">
  <summary style="list-style: none; padding: 12px 0; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between;">
    <span>1. 系统架构深度评估</span>
    <span style="color: var(--muted-fg);">▾</span>
  </summary>
  <div style="padding-bottom: 14px; font-size: 13px; color: var(--muted-fg);">
    详细的展开分析内容或 Q&A 问答记录。
  </div>
</details>
```

### 4. 常用 SVG 图标字典 (Lucide 风格)
- 搜索: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`
- 勾选: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
- 复制: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`

---

## 五、经典微脚本 (Micro Vanilla JS)

### 1. 暗黑模式切换（必须标配在每个页面底部）
```javascript
const toggle = document.getElementById('themeToggle');
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (isDark) document.documentElement.setAttribute('data-theme', 'dark');

toggle?.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', cur ? 'light' : 'dark');
});
```

### 2. 纯客户端实时搜索过滤表格（5 行代码）
```javascript
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('#dataTable tbody tr').forEach(tr => {
    tr.style.display = (!q || tr.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
});
```

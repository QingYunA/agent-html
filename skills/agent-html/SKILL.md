---
name: agent-html
description: 为 AI Agent 提供基于 shadcn/ui 极简现代美学的单文件 HTML 组件化规范与母版体系。只要用户需要生成、编写、设计或重构任何 HTML 页面、前端可视化展示、数据大盘/看板、调休或考勤管理表、面试分析报告、评测对比报表、日志/JSONL 排障审查器或交互式单文件小工具，务必使用本 Skill，即使用户没有明确提到“单文件”或“shadcn”。严禁脱离本规范手写粗糙的临时样式，严禁引入有外网断网风险的外部 CDN。
---

# Agent HTML 设计系统与组件化规范

本规范指导 AI Agent 如何生成**高信息密度、工业级质感、零外部依赖、双击秒开**的单文件 HTML。

---

## 一、为什么这样设计？(Design Principles & The "Why")

1. **为什么坚决追求纯单文件与零外部依赖（Zero-Dependency Standalone）？**
   - 很多可视化报告、用例审查工具常在内网机房、无公网访问的隔离环境（Air-gapped）、或本地离线存档中打开。
   - 引入 Tailwind CDN (`cdn.tailwindcss.com`) 或第三方字体库，会在弱网下引发白屏（FOUC）、CDN 节点下线失效或公司 CSP 策略拦截。因此必须将精炼的 CSS 变量与极简微脚本直接内嵌。

2. **为什么严格采用 shadcn/ui 的 Zinc/Slate 中性色体系？**
   - 大模型在自由发挥时容易产生“AI审美漂移”——随机的大圆角、大面积刺眼渐变色、过大的无意义留白。
   - shadcn 的核心是：**冷灰中性底色、精准 1px 微细浅色边框、高信息密度、语义化状态点（Green/Amber/Red）**。这种排版能让任何数据报表看起来都像资深前端工程师耗费数日精心调校过的专业企业级产品。

3. **为什么必须原生内置暗黑模式（Light / Dark Theme）？**
   - 工程师与运维人员大量在暗黑 IDE/终端环境下工作。通过 CSS 变量原生映射，仅需 5 行原生 JS 即可实现丝滑切换，零构建成本却能极大提升使用体验。

---

## 二、场景母版与渐进式披露 (Progressive Disclosure)

当用户提出需求时，首先判定所属的三大业务母版之一。如果需要完整骨架参考，可直接使用 `read` 工具读取本 Skill 目录下的配套资产：

| 业务场景 | 对应母版与相对路径 | 适用场景与核心要素 |
| :--- | :--- | :--- |
| **评估与分析报告** | `assets/templates/report.html` | 面试评估、技术比对、自动化测试报告。<br>要素：候选人/项目元数据、定级徽章、KPI评分栏、执行摘要 Callout、能力维度折叠手风琴、浏览器打印/PDF 适配。 |
| **指标监控与数据看板** | `assets/templates/dashboard.html` | 调休管理、AI用量大盘、业务运营看板。<br>要素：4列 KPI 统计卡（数值+环比）、实时搜索与状态下拉双重过滤表格、新增/核销原生 `<dialog>` 弹窗。 |
| **双栏审查与数据工具** | `assets/templates/inspector.html` | JSONL查看器、轨迹排障重放、Prompt调试器。<br>要素：Master-Detail 左右双栏结构、左栏列表即时过滤、右栏动态渲染详情与带一键复制的深色代码块。 |

---

## 三、微 CSS 核心基座 (Micro-CSS Base)

在生成 HTML 时，务必将以下约 75 行 CSS 基座放入 `<head><style>` 中，它是所有组件质感一致的基石：

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

## 四、高频原子 HTML 插槽字典 (Atomic HTML Snippets)

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

### 5. 常用纯矢量 SVG 图标字典 (继承字色)
- 搜索: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`
- 成功: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
- 复制: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
- 日历: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`

---

## 五、经典微交互原生脚本 (Micro Vanilla JS)

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

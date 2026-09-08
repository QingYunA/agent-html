---
name: agent-html
description: 为 AI Agent 提供基于 shadcn/ui 极简现代美学的单文件 HTML 组件化规范与母版体系。当用户要求“生成 HTML 页面/网页”、“前端可视化大盘/看板”、“面试/分析/测试报告”、“对比矩阵/方案比对”、“review 结果做成可视化页面”、“代码审查报告”、“不要输出 markdown 墙/不要文字墙”、“把分析结果做成可交互单文件网页”等场景时，务必使用本 Skill。零构建、零 npm、严禁引入外部 CDN（无断网白屏风险），纯原生 HTML/CSS/SVG，支持暗黑模式与双击秒开。
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

## 二、通用布局母版与渐进式披露 (Progressive Disclosure)

不要从零手写完整页面。接到需求后，首先从以下 4 种**通用布局母版**中选择最贴近的骨架。需要完整实现时，可使用 `read` 工具读取本 Skill 目录下的对应母版资产：

| 布局模式 | 对应母版路径 | 适用需求与核心结构 |
| :--- | :--- | :--- |
| **单栏文档与评估报告**<br>(Document / Report) | `assets/templates/report.html` | **技术选型、架构审查、故障复盘、面试报告、需求说明、发布日志**。<br>结构：单栏居中（860px），元数据标头、核心结论 Callout、KPI 概览栏、多章节 `<details>` 折叠手风琴、浏览器打印/PDF 样式支持。 |
| **数据大盘与过滤表格**<br>(Dashboard & Data Grid) | `assets/templates/dashboard.html` | **资源监控、用量大盘、考勤/调休管理、订单/任务流管理**。<br>结构：宽屏网格，顶部操作栏、4 列自适应 KPI 统计卡（数值+环比趋势）、实时搜索与下拉双重过滤表格、原生 `<dialog>` 弹窗。 |
| **左右双栏工作台与审查器**<br>(Master-Detail Workbench) | `assets/templates/inspector.html` | **日志/Trace 审查、Prompt 调试器、JSONL 编辑器、配置管理**。<br>结构：视口充满（100vh），左侧可折叠/过滤条目列表，右侧动态联动渲染选中条目详情、3 列属性网格、带一键复制的深色代码块。 |
| **并排横向对比与评测矩阵**<br>(Side-by-Side Comparison) | `assets/templates/compare.html` | **模型 A/B 测试、Prompt 改版前后对比、架构版本 diff、产品套餐/特性矩阵**。<br>结构：并排双栏卡片（基准 vs 挑战者）、核心裁决 Callout、量化差异对照表（Delta/胜负判定标签）。 |

> 💡 **组件字典查阅**：如需查看所有按钮变体、胶囊徽章、常用 SVG 图标与实时组件效果，可直接读取或打开 `assets/index.html`。

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

### 6. 轻量原生图表规范 (Zero-CDN Pure SVG Charts)
在生成数据大盘与报表时，**严禁引入 Chart.js / ECharts / Recharts 等外部 CDN 库**。图表统一采用纯原生矢量 SVG 实现：
- **零网络依赖**：脱机、内网机房 100% 秒开，绝无 CDN 挂掉或白屏风险；
- **暗黑模式自适应**：直接使用 `var(--primary)`、`var(--border)`、`var(--muted-fg)` 等主题变量，无须额外 JS 监听重绘；
- **自适应视口**：设定统一 `viewBox="0 0 500 150"` 与 `style="width: 100%; height: auto;"`，Retina 屏幕与打印完美保真。

#### A. 面积折线趋势图 (Area Trend Line Chart)
```html
<div class="card" style="padding: 16px 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
    <div>
      <div style="font-size: 14px; font-weight: 600;">24小时吞吐量趋势 (TPS)</div>
      <div style="font-size: 12px; color: var(--muted-fg);">平均 TPS: 1,420 · 峰值: 2,890</div>
    </div>
    <span class="badge badge-success"><span class="badge-dot"></span>+14.8% 环比</span>
  </div>
  <svg viewBox="0 0 500 150" style="width: 100%; height: auto; overflow: visible;">
    <defs>
      <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.00"/>
      </linearGradient>
    </defs>
    <!-- 网格参考虚线 -->
    <line x1="30" y1="20" x2="490" y2="20" stroke="var(--border)" stroke-dasharray="3 3" />
    <line x1="30" y1="60" x2="490" y2="60" stroke="var(--border)" stroke-dasharray="3 3" />
    <line x1="30" y1="100" x2="490" y2="100" stroke="var(--border)" stroke-dasharray="3 3" />
    <line x1="30" y1="130" x2="490" y2="130" stroke="var(--border)" />
    <!-- Y 轴刻度 -->
    <text x="22" y="24" font-size="10" fill="var(--muted-fg)" text-anchor="end">3k</text>
    <text x="22" y="64" font-size="10" fill="var(--muted-fg)" text-anchor="end">2k</text>
    <text x="22" y="104" font-size="10" fill="var(--muted-fg)" text-anchor="end">1k</text>
    <text x="22" y="133" font-size="10" fill="var(--muted-fg)" text-anchor="end">0</text>
    <!-- 渐变阴影面积与折线 -->
    <path d="M 40 110 Q 90 95, 130 85 T 220 50 T 310 75 T 400 35 T 480 45 L 480 130 L 40 130 Z" fill="url(#trendAreaGrad)" />
    <path d="M 40 110 Q 90 95, 130 85 T 220 50 T 310 75 T 400 35 T 480 45" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    <!-- 关键数据点与峰值气泡 -->
    <circle cx="220" cy="50" r="3.5" fill="var(--card)" stroke="var(--primary)" stroke-width="2"/>
    <circle cx="400" cy="35" r="4.5" fill="var(--ok)" stroke="var(--card)" stroke-width="2"/>
    <g transform="translate(400, 18)">
      <rect x="-24" y="-12" width="48" height="18" rx="4" fill="var(--primary)" />
      <text x="0" y="1" font-size="10" font-weight="600" fill="var(--primary-fg)" text-anchor="middle">2,890</text>
    </g>
    <!-- X 轴刻度 -->
    <text x="40" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">00:00</text>
    <text x="130" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">04:00</text>
    <text x="220" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">08:00</text>
    <text x="310" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">12:00</text>
    <text x="400" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">16:00</text>
    <text x="480" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">20:00</text>
  </svg>
</div>
```

#### B. 柱状对比分布图 (Column Bar Chart)
```html
<div class="card" style="padding: 16px 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
    <div>
      <div style="font-size: 14px; font-weight: 600;">各模块响应延迟分布 (ms)</div>
      <div style="font-size: 12px; color: var(--muted-fg);">P95 阶段统计基准</div>
    </div>
    <span class="badge"><span class="badge-dot"></span>6 个服务模块</span>
  </div>
  <svg viewBox="0 0 500 150" style="width: 100%; height: auto; overflow: visible;">
    <!-- 网格参考虚线 -->
    <line x1="30" y1="20" x2="490" y2="20" stroke="var(--border)" stroke-dasharray="3 3" />
    <line x1="30" y1="60" x2="490" y2="60" stroke="var(--border)" stroke-dasharray="3 3" />
    <line x1="30" y1="100" x2="490" y2="100" stroke="var(--border)" stroke-dasharray="3 3" />
    <line x1="30" y1="130" x2="490" y2="130" stroke="var(--border)" />
    <!-- Y 轴刻度 -->
    <text x="22" y="24" font-size="10" fill="var(--muted-fg)" text-anchor="end">120</text>
    <text x="22" y="64" font-size="10" fill="var(--muted-fg)" text-anchor="end">80</text>
    <text x="22" y="104" font-size="10" fill="var(--muted-fg)" text-anchor="end">40</text>
    <text x="22" y="133" font-size="10" fill="var(--muted-fg)" text-anchor="end">0</text>
    <!-- 柱状单元: x, y, width, height, rx -->
    <rect x="52" y="106" width="36" height="24" rx="4" fill="var(--primary)" opacity="0.85" />
    <text x="70" y="100" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">24</text>
    <text x="70" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">网关</text>

    <rect x="124" y="82" width="36" height="48" rx="4" fill="var(--primary)" opacity="0.85" />
    <text x="142" y="76" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">48</text>
    <text x="142" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">鉴权</text>

    <rect x="196" y="38" width="36" height="92" rx="4" fill="var(--warn)" opacity="0.9" />
    <text x="214" y="32" font-size="10" font-weight="600" fill="var(--warn)" text-anchor="middle">92</text>
    <text x="214" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">订单</text>

    <rect x="268" y="95" width="36" height="35" rx="4" fill="var(--primary)" opacity="0.85" />
    <text x="286" y="89" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">35</text>
    <text x="286" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">支付</text>

    <rect x="340" y="112" width="36" height="18" rx="4" fill="var(--primary)" opacity="0.85" />
    <text x="358" y="106" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">18</text>
    <text x="358" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">存储</text>

    <rect x="412" y="66" width="36" height="64" rx="4" fill="var(--primary)" opacity="0.85" />
    <text x="430" y="60" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">64</text>
    <text x="430" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">检索</text>
  </svg>
</div>
```

#### C. KPI 卡片内嵌迷你走势线 (Sparkline)
```html
<div class="stat-card" style="padding: 16px 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);">
  <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--muted-fg);">
    <span>每日活跃会话 (DAU)</span>
    <span style="color: var(--ok); font-weight: 600;">↑ +18.2%</span>
  </div>
  <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-top: 6px;">
    <div>
      <div style="font-size: 24px; font-weight: 700; line-height: 1.1;">48,290</div>
      <div style="font-size: 12px; color: var(--muted-fg); margin-top: 4px;">近 7 日持续攀升</div>
    </div>
    <svg width="84" height="28" viewBox="0 0 84 28" fill="none" style="overflow: visible;">
      <path d="M 2 24 L 16 20 L 30 22 L 44 14 L 58 16 L 70 6 L 82 2" stroke="var(--ok)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="82" cy="2" r="2.5" fill="var(--ok)"/>
    </svg>
  </div>
</div>
```

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

# Agent HTML 原子组件与代码插槽参考字典 (Components Reference)

> 本文件作为 `agent-html` 的高阶原子积木参考字典。当用户需要向页面中插入局部组件（如新增某种图表、特定 SVG 图标、表单弹窗或数据表格）时，AI Agent 可按需 `read` 本文件索取现成代码片段。

---

## 目录
1. [按钮与操作变体 (Buttons Matrix)](#1-按钮与操作变体-buttons-matrix)
2. [徽章与状态胶囊 (Badges)](#2-徽章与状态胶囊-badges)
3. [指标卡片与迷你趋势 (Stat Cards & Sparklines)](#3-指标卡片与迷你趋势-stat-cards--sparklines)
4. [执行摘要提示条 (Callouts)](#4-执行摘要提示条-callouts)
5. [交互式数据表格 (Interactive Table with Filter)](#5-交互式数据表格-interactive-table-with-filter)
6. [原生轻量图表 (Zero-CDN Pure SVG Charts)](#6-原生轻量图表-zero-cdn-pure-svg-charts)
7. [常用 24 个研发工程矢量图标 (Curated SVG Icons)](#7-常用-24-个研发工程矢量图标-curated-svg-icons)
8. [微交互组件 (Dialog, Details, Tabs)](#8-微交互组件-dialog-details-tabs)

---

## 1. 按钮与操作变体 (Buttons Matrix)

```html
<!-- 样式变体 -->
<button class="btn btn-primary">Primary 主要操作</button>
<button class="btn btn-secondary">Secondary 辅助操作</button>
<button class="btn btn-outline">Outline 边框按钮</button>
<button class="btn btn-ghost">Ghost 幽灵按钮</button>
<button class="btn btn-destructive">Destructive 危险操作</button>

<!-- 尺寸与图标变体 -->
<button class="btn btn-primary btn-sm">小号按钮 (sm)</button>
<button class="btn btn-primary">默认尺寸 (md)</button>
<button class="btn btn-primary btn-lg">大号操作 (lg)</button>

<!-- 带图标按钮 -->
<button class="btn btn-outline btn-sm">
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  <span>下载报告</span>
</button>

<!-- 正方形纯图标按钮 (用于暗黑模式切换、设置等) -->
<button class="btn btn-outline btn-icon" title="系统设置">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
</button>
```

---

## 2. 徽章与状态胶囊 (Badges)

```html
<span class="badge badge-success"><span class="badge-dot"></span>200 OK 正常运行</span>
<span class="badge badge-warning"><span class="badge-dot"></span>Warning 资源预警</span>
<span class="badge badge-danger"><span class="badge-dot"></span>Critical 阻断性异常</span>
<span class="badge badge-info"><span class="badge-dot"></span>In Progress 进行中</span>
<span class="badge">Default 中性默认</span>
```

---

## 3. 指标卡片与迷你趋势 (Stat Cards & Sparklines)

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
    <!-- 84x28 迷你 Sparkline -->
    <svg width="84" height="28" viewBox="0 0 84 28" fill="none" style="overflow: visible;">
      <path d="M 2 24 L 16 20 L 30 22 L 44 14 L 58 16 L 70 6 L 82 2" stroke="var(--ok)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="82" cy="2" r="2.5" fill="var(--ok)"/>
    </svg>
  </div>
</div>
```

---

## 4. 执行摘要提示条 (Callouts)

```html
<!-- 成功/放行摘要 -->
<div style="padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--ok-border); background: var(--ok-bg); font-size: 13px; line-height: 1.5; margin-bottom: 16px;">
  <strong style="color: var(--ok); display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    <span>核心评估结论</span>
  </strong>
  <span>系统架构符合生产准入规范，建议准予放行并开启第一阶段灰度放量。</span>
</div>

<!-- 警示/阻断提示 -->
<div style="padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--warn-border); background: var(--warn-bg); font-size: 13px; line-height: 1.5; margin-bottom: 16px;">
  <strong style="color: var(--warn); display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span>阻断性风险提示</span>
  </strong>
  <span>检测到异地可用区网关存在丢包抖动，须待上游修复后再行启动割接。</span>
</div>
```

---

## 5. 交互式数据表格 (Interactive Table with Filter)

```html
<div class="card">
  <div style="padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
    <input type="text" id="searchInput" placeholder="实时搜索过滤..." style="height: 32px; padding: 0 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--card-fg); outline: none;">
    <button id="copyTableMdBtn" class="btn btn-sm">复制表格 (MD)</button>
  </div>
  <table id="dataTable" style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
    <thead>
      <tr style="background: var(--secondary); color: var(--muted-fg); border-bottom: 1px solid var(--border);">
        <th style="padding: 10px 16px;">项目编号</th>
        <th style="padding: 10px 16px;">模块名称</th>
        <th style="padding: 10px 16px;">响应延迟</th>
        <th style="padding: 10px 16px;">当前状态</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 16px;"><code>TASK-001</code></td>
        <td style="padding: 10px 16px;">Auth-Gateway</td>
        <td style="padding: 10px 16px;">14ms</td>
        <td style="padding: 10px 16px;"><span class="badge badge-success"><span class="badge-dot"></span>正常</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 6. 原生轻量图表 (Zero-CDN Pure SVG Charts)

## 6. 原生轻量图表 (Zero-CDN Pure SVG Charts - 6 大核心形态)

> 💡 **设计与配色规范 (Tremor & shadcn-inspired)**：
> 绝不引入 Chart.js / ECharts 等 CDN，统一采用纯矢量 SVG 驱动。配色采用调校后的语义化色彩变量（避免刺眼高饱和红绿，暗黑模式自动切换为柔和高对比阶）。
> - `--chart-indigo`: `#6366f1` (暗黑: `#818cf8`) — 主指标时序走势
> - `--chart-emerald`: `#10b981` (暗黑: `#34d399`) — 正常健康、增长、放行
> - `--chart-amber`: `#f59e0b` (暗黑: `#fbbf24`) — 警戒、抖动、温和上升
> - `--chart-rose`: `#f43f5e` (暗黑: `#fb7185`) — 异常瓶颈、错误峰值、降级
> - `--chart-violet`: `#8b5cf6` (暗黑: `#a78bfa`) — P95/P99 峰值柱状高亮
> - `--chart-cyan`: `#06b6d4` (暗黑: `#22d3ee`) — 辅助对比时序、出向流量
> - `--chart-slate`: `#64748b` (暗黑: `#94a3b8`) — 低优对比柱、中性刻度

### A. 面积折线走势图 (Area Trend Line Chart)
```html
<div class="card" style="padding: 16px 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
    <span style="font-weight: 600; font-size: 13px;">24h 吞吐走势 (TPS)</span>
    <span style="color: var(--chart-emerald); font-weight: 600; font-size: 11px;">↑ +18.4%</span>
  </div>
  <svg viewBox="0 0 400 95" style="width: 100%; height: 85px; overflow: visible;">
    <defs>
      <linearGradient id="areaGradIndigo" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--chart-indigo)" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="var(--chart-indigo)" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <path d="M 0 70 Q 55 30, 110 52 T 210 36 T 310 18 T 400 28 L 400 95 L 0 95 Z" fill="url(#areaGradIndigo)"/>
    <path d="M 0 70 Q 55 30, 110 52 T 210 36 T 310 18 T 400 28" fill="none" stroke="var(--chart-indigo)" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="210" cy="36" r="3" fill="var(--card)" stroke="var(--chart-indigo)" stroke-width="2"/>
    <circle cx="310" cy="18" r="3.5" fill="var(--chart-indigo)" stroke="var(--card)" stroke-width="2"/>
  </svg>
</div>
```

### B. 阶段耗时垂直柱状图 (Column Histogram)
```html
<div class="card" style="padding: 16px 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; margin-bottom: 8px;">
    <span style="font-weight: 600;">各阶段响应延迟分布 (ms)</span>
    <span class="badge" style="font-size: 10px; height: 18px;">P95</span>
  </div>
  <svg viewBox="0 0 400 95" style="width: 100%; height: 85px; overflow: visible;">
    <rect x="25" y="60" width="38" height="32" rx="4" fill="var(--chart-slate)" opacity="0.6"/>
    <text x="44" y="54" font-size="10" font-weight="600" fill="var(--muted-fg)" text-anchor="middle">24ms</text>
    <rect x="100" y="40" width="38" height="52" rx="4" fill="var(--chart-indigo)" opacity="0.8"/>
    <text x="119" y="34" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">48ms</text>
    <rect x="175" y="18" width="38" height="74" rx="4" fill="var(--chart-violet)" opacity="0.95"/>
    <text x="194" y="12" font-size="10" font-weight="700" fill="var(--chart-violet)" text-anchor="middle">92ms</text>
    <rect x="250" y="50" width="38" height="42" rx="4" fill="var(--chart-indigo)" opacity="0.8"/>
    <text x="269" y="44" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">35ms</text>
    <rect x="325" y="68" width="38" height="24" rx="4" fill="var(--chart-slate)" opacity="0.6"/>
    <text x="344" y="62" font-size="10" font-weight="600" fill="var(--muted-fg)" text-anchor="middle">18ms</text>
  </svg>
</div>
```

### C. 复合环形占比分布图 (Multi-Segment Donut Chart)
```html
<div class="card" style="padding: 16px 20px;">
  <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
    <span style="font-weight: 600;">节点健康度全景分布</span>
    <span class="badge badge-success">99.8% 达标</span>
  </div>
  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
    <svg viewBox="0 0 160 160" style="width: 82px; height: 82px; flex-shrink: 0;">
      <circle cx="80" cy="80" r="54" fill="none" stroke="var(--secondary)" stroke-width="18"/>
      <!-- 周长 2*PI*54 ≈ 339.3 -->
      <circle cx="80" cy="80" r="54" fill="none" stroke="var(--chart-emerald)" stroke-width="18" stroke-dasharray="220.5 339.3" stroke-dashoffset="0" transform="rotate(-90 80 80)"/>
      <circle cx="80" cy="80" r="54" fill="none" stroke="var(--chart-amber)" stroke-width="18" stroke-dasharray="84.8 339.3" stroke-dashoffset="-220.5" transform="rotate(-90 80 80)"/>
      <circle cx="80" cy="80" r="54" fill="none" stroke="var(--chart-rose)" stroke-width="18" stroke-dasharray="33.9 339.3" stroke-dashoffset="-305.3" transform="rotate(-90 80 80)"/>
      <text x="80" y="77" text-anchor="middle" font-size="16" font-weight="700" fill="var(--card-fg)">1,280</text>
      <text x="80" y="93" text-anchor="middle" font-size="9" fill="var(--muted-fg)">Nodes</text>
    </svg>
    <div style="font-size: 11px; display: flex; flex-direction: column; gap: 4px; flex: 1;">
      <div style="display: flex; justify-content: space-between;"><span style="color: var(--chart-emerald); font-weight: 500;">● 65% 正常运行</span><strong>832</strong></div>
      <div style="display: flex; justify-content: space-between;"><span style="color: var(--chart-amber); font-weight: 500;">● 25% 负载预警</span><strong>320</strong></div>
      <div style="display: flex; justify-content: space-between;"><span style="color: var(--chart-rose); font-weight: 500;">● 10% 异常降级</span><strong>128</strong></div>
    </div>
  </div>
</div>
```

### D. 双线时序对比图 (Dual-Line Ingress vs Egress)
```html
<div class="card" style="padding: 16px 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 6px;">
    <span style="font-weight: 600;">出入网络流量对冲</span>
    <div style="display: flex; gap: 8px; font-size: 10px;">
      <span style="color: var(--chart-indigo);">— 入向 1.4G</span>
      <span style="color: var(--chart-cyan);">┄ 出向 860M</span>
    </div>
  </div>
  <svg viewBox="0 0 400 95" style="width: 100%; height: 85px; overflow: visible;">
    <defs>
      <linearGradient id="dualAreaGradRef" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--chart-indigo)" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="var(--chart-indigo)" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <path d="M 0 55 Q 60 25, 120 40 T 240 25 T 340 15 T 400 30 L 400 95 L 0 95 Z" fill="url(#dualAreaGradRef)"/>
    <path d="M 0 55 Q 60 25, 120 40 T 240 25 T 340 15 T 400 30" fill="none" stroke="var(--chart-indigo)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 0 75 Q 60 60, 120 68 T 240 48 T 340 40 T 400 52" fill="none" stroke="var(--chart-cyan)" stroke-width="2" stroke-dasharray="4 4" stroke-linecap="round"/>
    <circle cx="340" cy="15" r="3.5" fill="var(--chart-indigo)" stroke="var(--card)" stroke-width="2"/>
    <circle cx="340" cy="40" r="3" fill="var(--chart-cyan)" stroke="var(--card)" stroke-width="1.5"/>
  </svg>
</div>
```

### E. 水平耗时对比排行榜 (Horizontal Ranking Bar)
```html
<div class="card" style="padding: 16px 20px;">
  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
    <span style="font-weight: 600;">核心模块耗时排行</span>
    <span style="font-size: 10px; color: var(--muted-fg);">P95 ms</span>
  </div>
  <div style="display: flex; flex-direction: column; gap: 6px; font-size: 11px;">
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2px;"><span>DB Pool Wait</span><strong style="color: var(--chart-rose);">280ms</strong></div>
      <div style="background: var(--secondary); height: 6px; border-radius: 9999px; overflow: hidden;"><div style="background: var(--chart-rose); width: 85%; height: 100%;"></div></div>
    </div>
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2px;"><span>LLM Stream First Token</span><strong style="color: var(--chart-amber);">195ms</strong></div>
      <div style="background: var(--secondary); height: 6px; border-radius: 9999px; overflow: hidden;"><div style="background: var(--chart-amber); width: 62%; height: 100%;"></div></div>
    </div>
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2px;"><span>Auth Gateway JWT</span><strong style="color: var(--chart-indigo);">48ms</strong></div>
      <div style="background: var(--secondary); height: 6px; border-radius: 9999px; overflow: hidden;"><div style="background: var(--chart-indigo); width: 22%; height: 100%;"></div></div>
    </div>
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2px;"><span>Asset Cache Edge</span><strong style="color: var(--chart-emerald);">12ms</strong></div>
      <div style="background: var(--secondary); height: 6px; border-radius: 9999px; overflow: hidden;"><div style="background: var(--chart-emerald); width: 8%; height: 100%;"></div></div>
    </div>
  </div>
</div>
```

### F. 半环水位仪表盘 (Semi-Circle Capacity Gauge)
```html
<div class="card" style="padding: 16px 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 4px;">
    <span style="font-weight: 600;">集群内存负载水位</span>
    <span class="badge badge-warning" style="font-size: 10px; height: 18px;">Normal</span>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <svg viewBox="0 0 180 100" style="width: 140px; height: 78px; overflow: visible;">
      <defs>
        <linearGradient id="gaugeGradRef" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--chart-emerald)"/>
          <stop offset="60%" stop-color="var(--chart-indigo)"/>
          <stop offset="100%" stop-color="var(--chart-amber)"/>
        </linearGradient>
      </defs>
      <!-- 半圆周长 = 204.2 -->
      <circle cx="90" cy="90" r="65" fill="none" stroke="var(--secondary)" stroke-width="16" stroke-dasharray="204.2 408.4" stroke-dashoffset="0" transform="rotate(-180 90 90)" stroke-linecap="round"/>
      <circle cx="90" cy="90" r="65" fill="none" stroke="url(#gaugeGradRef)" stroke-width="16" stroke-dasharray="160.1 408.4" stroke-dashoffset="0" transform="rotate(-180 90 90)" stroke-linecap="round"/>
      <text x="90" y="74" text-anchor="middle" font-size="18" font-weight="700" fill="var(--card-fg)">78.4%</text>
      <text x="90" y="88" text-anchor="middle" font-size="9" fill="var(--muted-fg)">15.6 / 20 TB used</text>
      <text x="25" y="98" font-size="9" fill="var(--muted-fg)" text-anchor="middle">0%</text>
      <text x="155" y="98" font-size="9" fill="var(--muted-fg)" text-anchor="middle">100%</text>
    </svg>
  </div>
</div>
```

---

## 7. 常用 24 个研发工程矢量图标 (Curated SVG Icons)

| 图标分类 | 名称 | 纯 SVG 代码片段 |
| :--- | :--- | :--- |
| **基础操作** | 搜索 (Search) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>` |
| | 成功 (Check) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>` |
| | 警告 (Alert) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` |
| | 复制 (Copy) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>` |
| | 日历 (Calendar) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>` |
| | 终端 (Terminal) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>` |
| | 过滤 (Filter) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>` |
| | 外链 (External) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>` |
| | 用户 (User) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` |
| | 折叠 (Chevron) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>` |
| | 删除 (Trash) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>` |
| | 下载 (Download) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>` |
| **研发协同** | Git 分支 | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>` |
| | Git 提交 | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>` |
| | Git PR | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>` |
| | 缺陷 (Bug) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="14" x="8" y="6" rx="4"/><path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M20 13h-4"/><path d="M4 13h4"/><path d="m10 4 1 2"/><path d="m14 4-1 2"/></svg>` |
| **基础设施** | 服务器 (Server) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>` |
| | 数据库 (DB) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>` |
| | CPU 算力 | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 15h3"/><path d="M1 9h3"/><path d="M1 15h3"/></svg>` |
| | 心跳探活 (Activity) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` |
| **安全控制** | 安全防护 (Shield) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` |
| | 鉴权锁定 (Lock) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>` |
| | 重试刷新 (Refresh) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>` |
| | 系统设置 (Settings) | `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>` |

---

## 8. 微交互组件 (Dialog, Details, Tabs)

### A. 原生模态弹窗 (Native Dialog)
```html
<dialog id="actionModal" style="border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); color: var(--card-fg); padding: 24px; max-width: 440px; width: 90%; margin: auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);">
  <div style="font-weight: 600; font-size: 16px; margin-bottom: 12px;">操作确认</div>
  <p style="font-size: 13px; color: var(--muted-fg); margin-bottom: 20px;">此操作将正式向生产环境应用最新配置变更。</p>
  <div style="display: flex; justify-content: flex-end; gap: 8px;">
    <button class="btn btn-sm" onclick="document.getElementById('actionModal').close()">取消</button>
    <button class="btn btn-primary btn-sm" onclick="document.getElementById('actionModal').close()">确认执行</button>
  </div>
</dialog>
```

### B. 原生折叠手风琴 (Native Details)
```html
<details style="border-bottom: 1px solid var(--border);">
  <summary style="list-style: none; padding: 12px 0; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; user-select: none;">
    <span>查看详细网络切流日志与排障诊断</span>
    <span style="color: var(--muted-fg);">▾</span>
  </summary>
  <div style="padding-bottom: 14px; font-size: 13px; color: var(--muted-fg); line-height: 1.6;">
    已验证跨可用区自动切流，模拟机房断网后 2.4s 内完成健康检测与流量重新路由。
  </div>
</details>
```

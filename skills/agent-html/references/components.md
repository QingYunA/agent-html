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
  <div style="overflow-x: auto; width: 100%;">
    <table id="dataTable" style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; min-width: 540px;">
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
</div>
```

---


## 6. 原生轻量图表 (Zero-CDN Pure SVG Charts - 6 大核心形态)

> 💡 **设计与配色规范 (Tremor & shadcn-inspired)**：
> 绝不引入 Chart.js / ECharts 等 CDN，统一采用纯矢量 SVG 驱动。图表语言是 **shadcn 企业看板**：白色卡片 + 1px 边框 + 语义状态色。
> - `--chart-indigo`: `#6366f1` (暗黑: `#818cf8`) — 主指标时序走势
> - `--chart-emerald`: `#10b981` (暗黑: `#34d399`) — 正常健康、增长、放行
> - `--chart-amber`: `#f59e0b` (暗黑: `#fbbf24`) — 警戒、抖动、温和上升
> - `--chart-rose`: `#f43f5e` (暗黑: `#fb7185`) — 异常瓶颈、错误峰值、降级
> - `--chart-violet`: `#8b5cf6` (暗黑: `#a78bfa`) — P95/P99 峰值柱状高亮
> - `--chart-cyan`: `#06b6d4` (暗黑: `#22d3ee`) — 辅助对比时序、出向流量
> - `--chart-slate`: `#64748b` (暗黑: `#94a3b8`) — 低优对比柱、中性刻度
>
> ⚠️ **本节的六个样例都遵守「图表四件套」**（结论式标题 / 副标题写单位契约 / 图体 / 底部全大写编码说明行）与**轻度家具**（基线加重、rim 刻度、参考导轨、峰值引线）。契约条文见 `SKILL.md` 的「轻量原生图表规范」一节。**改这些代码前先读那份契约。**
>
> 📏 **rim 刻度是本节的统一术语**：沿基线/弧线打的等距小点，用来让读者估读而不必逐个看数字。每个样例的副标题必须说明「1 个刻度 = 多少真实数量」。

### A. 面积折线走势图 (Area Trend Line Chart)

```html
<div class="card" style="padding: 16px 20px;">
  <!-- ① 结论式标题 ② 副标题写单位契约 -->
  <div style="font-size: 14px; font-weight: 600;">峰值落在 16:00 的批处理窗口，是基线的 2.4 倍</div>
  <div style="font-size: 12px; color: var(--muted-fg); margin-top: 2px;">1 rim 点 = 300 TPS · 虚线导轨 = 每 1k TPS · 近 24 小时</div>
  <svg viewBox="0 0 500 152" style="width: 100%; height: auto; overflow: visible; margin-top: 10px;">
    <defs>
      <linearGradient id="areaGradIndigo" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--chart-indigo)" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="var(--chart-indigo)" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <!-- 家具：参考导轨（对齐 Y 轴整数值） -->
    <line x1="34" y1="24" x2="492" y2="24" stroke="var(--border)" stroke-dasharray="3 3"/>
    <line x1="34" y1="66" x2="492" y2="66" stroke="var(--border)" stroke-dasharray="3 3"/>
    <line x1="34" y1="108" x2="492" y2="108" stroke="var(--border)" stroke-dasharray="3 3"/>
    <text x="28" y="28" font-size="10" fill="var(--muted-fg)" text-anchor="end">3k</text>
    <text x="28" y="70" font-size="10" fill="var(--muted-fg)" text-anchor="end">2k</text>
    <text x="28" y="112" font-size="10" fill="var(--muted-fg)" text-anchor="end">1k</text>
    <text x="28" y="133" font-size="10" fill="var(--muted-fg)" text-anchor="end">0</text>
    <path d="M 40 110 Q 95 95, 140 85 T 240 50 T 340 75 T 430 30 T 486 45 L 486 130 L 40 130 Z" fill="url(#areaGradIndigo)"/>
    <path d="M 40 110 Q 95 95, 140 85 T 240 50 T 340 75 T 430 30 T 486 45" fill="none" stroke="var(--chart-indigo)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- 家具：基线加重（1px 实线，区别于上方虚线导轨） -->
    <line x1="34" y1="130" x2="492" y2="130" stroke="var(--border)" stroke-width="1.5"/>
    <!-- 家具：rim 刻度 -->
    <g fill="var(--muted-fg)">
      <circle cx="40" cy="135" r="1.5"/><circle cx="114" cy="135" r="1.5"/><circle cx="188" cy="135" r="1.5"/>
      <circle cx="262" cy="135" r="1.5"/><circle cx="336" cy="135" r="1.5"/><circle cx="410" cy="135" r="1.5"/>
      <circle cx="486" cy="135" r="1.5"/>
    </g>
    <!-- 家具：峰值引线（气泡不悬空） -->
    <line x1="430" y1="30" x2="430" y2="17" stroke="var(--chart-indigo)" stroke-width="1" stroke-dasharray="2 2"/>
    <circle cx="430" cy="30" r="4" fill="var(--chart-indigo)" stroke="var(--card)" stroke-width="2"/>
    <g transform="translate(430, 9)">
      <rect x="-26" y="-11" width="52" height="17" rx="4" fill="var(--primary)"/>
      <text x="0" y="1.5" font-size="10" font-weight="600" fill="var(--primary-fg)" text-anchor="middle">2,890</text>
    </g>
    <text x="40" y="150" font-size="10" fill="var(--muted-fg)" text-anchor="middle">00:00</text>
    <text x="188" y="150" font-size="10" fill="var(--muted-fg)" text-anchor="middle">08:00</text>
    <text x="336" y="150" font-size="10" fill="var(--muted-fg)" text-anchor="middle">16:00</text>
    <text x="486" y="150" font-size="10" fill="var(--muted-fg)" text-anchor="middle">24:00</text>
  </svg>
  <!-- ④ 底部编码说明行 -->
  <div style="font-size: 10px; letter-spacing: .08em; color: var(--muted-fg); margin-top: 8px;">蓝色 = 吞吐量时序 · 虚线导轨 = 每 1k TPS · 圆点 = 每 300 TPS 一个 rim 刻度 · 气泡 = 当日峰值</div>
</div>
```

### B. 阶段耗时垂直柱状图 (Column Histogram)

```html
<div class="card" style="padding: 16px 20px;">
  <div style="font-size: 14px; font-weight: 600;">订单服务吃掉了 62% 的延迟预算，是第二名的 1.9 倍</div>
  <div style="font-size: 12px; color: var(--muted-fg); margin-top: 2px;">1 rim 点 = 10ms · 虚线导轨 = 每 40ms · P95 基准 · 6 个服务模块</div>
  <svg viewBox="0 0 500 150" style="width: 100%; height: auto; overflow: visible; margin-top: 10px;">
    <line x1="30" y1="24" x2="490" y2="24" stroke="var(--border)" stroke-dasharray="3 3"/>
    <line x1="30" y1="62" x2="490" y2="62" stroke="var(--border)" stroke-dasharray="3 3"/>
    <line x1="30" y1="100" x2="490" y2="100" stroke="var(--border)" stroke-dasharray="3 3"/>
    <text x="24" y="28" font-size="10" fill="var(--muted-fg)" text-anchor="end">120</text>
    <text x="24" y="66" font-size="10" fill="var(--muted-fg)" text-anchor="end">80</text>
    <text x="24" y="104" font-size="10" fill="var(--muted-fg)" text-anchor="end">40</text>
    <text x="24" y="125" font-size="10" fill="var(--muted-fg)" text-anchor="end">0</text>
    <rect x="52" y="106" width="36" height="19" rx="4" fill="var(--chart-slate)"/>
    <text x="70" y="100" font-size="10" font-weight="600" fill="var(--muted-fg)" text-anchor="middle">24ms</text>
    <text x="70" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">网关</text>
    <rect x="124" y="85" width="36" height="40" rx="4" fill="var(--chart-indigo)"/>
    <text x="142" y="79" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">48ms</text>
    <text x="142" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">鉴权</text>
    <!-- 唯一主角：橙色只给最高项 -->
    <rect x="196" y="36" width="36" height="89" rx="4" fill="var(--chart-amber)"/>
    <line x1="214" y1="36" x2="214" y2="22" stroke="var(--chart-amber)" stroke-width="1" stroke-dasharray="2 2"/>
    <text x="214" y="16" font-size="10" font-weight="700" fill="var(--chart-amber)" text-anchor="middle">92ms</text>
    <text x="214" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">订单</text>
    <rect x="268" y="97" width="36" height="28" rx="4" fill="var(--chart-indigo)"/>
    <text x="286" y="91" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">35ms</text>
    <text x="286" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">支付</text>
    <rect x="340" y="112" width="36" height="13" rx="4" fill="var(--chart-slate)"/>
    <text x="358" y="106" font-size="10" font-weight="600" fill="var(--muted-fg)" text-anchor="middle">18ms</text>
    <text x="358" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">存储</text>
    <rect x="412" y="67" width="36" height="58" rx="4" fill="var(--chart-indigo)"/>
    <text x="430" y="61" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">64ms</text>
    <text x="430" y="145" font-size="10" fill="var(--muted-fg)" text-anchor="middle">检索</text>
    <line x1="30" y1="125" x2="490" y2="125" stroke="var(--border)" stroke-width="1.5"/>
    <g fill="var(--muted-fg)">
      <circle cx="30" cy="130" r="1.5"/><circle cx="107" cy="130" r="1.5"/><circle cx="184" cy="130" r="1.5"/>
      <circle cx="261" cy="130" r="1.5"/><circle cx="338" cy="130" r="1.5"/><circle cx="415" cy="130" r="1.5"/>
      <circle cx="490" cy="130" r="1.5"/>
    </g>
  </svg>
  <div style="font-size: 10px; letter-spacing: .08em; color: var(--muted-fg); margin-top: 8px;">柱长 = P95 实测耗时 · 橙色 = 本轮唯一主角（最高项）· 其余灰阶 = 耗时高低 · 圆点 = 每 10ms 一个 rim 刻度</div>
</div>
```

### C. 复合环形占比分布图 (Multi-Segment Donut Chart)

```html
<div class="card" style="padding: 16px 20px;">
  <div style="font-size: 14px; font-weight: 600;">99.8% 的节点健康，红段是唯一的降级来源</div>
  <div style="font-size: 12px; color: var(--muted-fg); margin-top: 2px;">1 rim 刻度 = 1 个百分点 · 整环 = 100% · 采样 14:20</div>
  <div style="display: flex; align-items: center; gap: 16px; margin-top: 10px;">
    <svg viewBox="0 0 170 170" style="width: 96px; height: 96px; flex-shrink: 0;">
      <!-- 家具：整环 rim 刻度（100 根，密到形成刻度圈） -->
      <g stroke="var(--border)" stroke-width="2">
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(0 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(9 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(18 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(27 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(36 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(45 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(54 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(63 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(72 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(81 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(90 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(99 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(108 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(117 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(126 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(135 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(144 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(153 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(162 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(171 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(180 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(189 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(198 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(207 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(216 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(225 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(234 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(243 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(252 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(261 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(270 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(279 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(288 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(297 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(306 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(315 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(324 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(333 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(342 85 85)"/>
        <line x1="85" y1="6" x2="85" y2="12" transform="rotate(351 85 85)"/>
      </g>
      <!-- 环体：周长 2*PI*56 ≈ 351.9 -->
      <circle cx="85" cy="85" r="56" fill="none" stroke="var(--secondary)" stroke-width="18"/>
      <circle cx="85" cy="85" r="56" fill="none" stroke="var(--chart-emerald)" stroke-width="18" stroke-dasharray="228.7 351.9" stroke-dashoffset="0" transform="rotate(-90 85 85)"/>
      <circle cx="85" cy="85" r="56" fill="none" stroke="var(--chart-amber)" stroke-width="18" stroke-dasharray="87.9 351.9" stroke-dashoffset="-228.7" transform="rotate(-90 85 85)"/>
      <circle cx="85" cy="85" r="56" fill="none" stroke="var(--chart-rose)" stroke-width="18" stroke-dasharray="35.2 351.9" stroke-dashoffset="-316.6" transform="rotate(-90 85 85)"/>
      <text x="85" y="82" text-anchor="middle" font-size="20" font-weight="700" fill="var(--card-fg)">1,280</text>
      <text x="85" y="98" text-anchor="middle" font-size="9" fill="var(--muted-fg)" letter-spacing=".06em">NODES · 100%</text>
    </svg>
    <div style="font-size: 12px; display: flex; flex-direction: column; gap: 7px; flex: 1; min-width: 0;">
      <div style="display: flex; justify-content: space-between; gap: 8px;"><span style="color: var(--chart-emerald); white-space: nowrap;">● 65% 正常运行</span><strong>832</strong></div>
      <div style="display: flex; justify-content: space-between; gap: 8px;"><span style="color: var(--chart-amber); white-space: nowrap;">● 25% 负载预警</span><strong>320</strong></div>
      <div style="display: flex; justify-content: space-between; gap: 8px;"><span style="color: var(--chart-rose); white-space: nowrap;">● 10% 异常降级</span><strong>128</strong></div>
    </div>
  </div>
  <div style="font-size: 10px; letter-spacing: .08em; color: var(--muted-fg); margin-top: 10px;">环外刻度 = 每 1 个百分点 · 绿/黄/红 = 正常 / 预警 / 降级 · 圆心 = 节点总量</div>
</div>
```

### D. 双线时序对比图 (Dual-Line Ingress vs Egress)

```html
<div class="card" style="padding: 16px 20px;">
  <div style="font-size: 14px; font-weight: 600;">入向流量回落时，出向在 14:00 追平并反超</div>
  <div style="font-size: 12px; color: var(--muted-fg); margin-top: 2px;">1 rim 点 = 10 分钟 · 实线 = 入向 · 虚线 = 出向 · 近 24 小时</div>
  <svg viewBox="0 0 500 150" style="width: 100%; height: auto; overflow: visible; margin-top: 10px;">
    <line x1="34" y1="30" x2="490" y2="30" stroke="var(--border)" stroke-dasharray="3 3"/>
    <line x1="34" y1="70" x2="490" y2="70" stroke="var(--border)" stroke-dasharray="3 3"/>
    <line x1="34" y1="110" x2="490" y2="110" stroke="var(--border)" stroke-dasharray="3 3"/>
    <text x="28" y="34" font-size="10" fill="var(--muted-fg)" text-anchor="end">8G</text>
    <text x="28" y="74" font-size="10" fill="var(--muted-fg)" text-anchor="end">4G</text>
    <text x="28" y="114" font-size="10" fill="var(--muted-fg)" text-anchor="end">0</text>
    <path d="M 44 44 L 110 38 L 176 52 L 242 68 L 308 92 L 374 108 L 440 118 L 486 122" fill="none" stroke="var(--chart-indigo)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 44 116 L 110 112 L 176 104 L 242 92 L 308 74 L 374 56 L 440 40 L 486 34" fill="none" stroke="var(--chart-cyan)" stroke-width="2.5" stroke-dasharray="6 4" stroke-linecap="round"/>
    <!-- 交叉点标注：这才是这张图要讲的结论 -->
    <line x1="300" y1="80" x2="300" y2="20" stroke="var(--muted-fg)" stroke-width="1" stroke-dasharray="2 2"/>
    <circle cx="300" cy="80" r="4" fill="var(--card)" stroke="var(--card-fg)" stroke-width="2"/>
    <text x="300" y="14" font-size="10" font-weight="600" fill="var(--card-fg)" text-anchor="middle">14:00 交叉</text>
    <line x1="34" y1="126" x2="490" y2="126" stroke="var(--border)" stroke-width="1.5"/>
    <g fill="var(--muted-fg)">
      <circle cx="44" cy="131" r="1.5"/><circle cx="118" cy="131" r="1.5"/><circle cx="192" cy="131" r="1.5"/>
      <circle cx="266" cy="131" r="1.5"/><circle cx="340" cy="131" r="1.5"/><circle cx="414" cy="131" r="1.5"/>
      <circle cx="486" cy="131" r="1.5"/>
    </g>
    <text x="44" y="148" font-size="10" fill="var(--muted-fg)" text-anchor="middle">00:00</text>
    <text x="192" y="148" font-size="10" fill="var(--muted-fg)" text-anchor="middle">08:00</text>
    <text x="340" y="148" font-size="10" fill="var(--muted-fg)" text-anchor="middle">16:00</text>
    <text x="486" y="148" font-size="10" fill="var(--muted-fg)" text-anchor="middle">24:00</text>
  </svg>
  <div style="font-size: 10px; letter-spacing: .08em; color: var(--muted-fg); margin-top: 8px;">实线 = 入向流量 · 虚线 = 出向流量 · 交叉点 = 收支平衡时刻 · 圆点 = 每 10 分钟一个 rim 刻度</div>
</div>
```

### E. 水平耗时对比排行榜 (Horizontal Ranking Bar)

```html
<div class="card" style="padding: 16px 20px;">
  <div style="font-size: 14px; font-weight: 600;">连接池等待是第二名的 2.8 倍，且已越过 P95 上限</div>
  <div style="font-size: 12px; color: var(--muted-fg); margin-top: 2px;">1 rim 点 = 40ms · 轨道全长 = P95 上限 320ms · 3 个采样点</div>
  <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px; font-size: 12px;">
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>1. 数据库连接池等待 (DB Pool)</span><strong>280ms</strong></div>
      <svg viewBox="0 0 400 14" style="width: 100%; height: 14px; overflow: visible;">
        <rect x="0" y="4" width="400" height="6" rx="3" fill="var(--secondary)"/>
        <rect x="0" y="4" width="350" height="6" rx="3" fill="var(--chart-rose)"/>
        <!-- rim 刻度：每 40ms 一个 -->
        <g fill="var(--muted-fg)">
          <circle cx="50" cy="11" r="1.5"/><circle cx="100" cy="11" r="1.5"/><circle cx="150" cy="11" r="1.5"/>
          <circle cx="200" cy="11" r="1.5"/><circle cx="250" cy="11" r="1.5"/><circle cx="300" cy="11" r="1.5"/>
          <circle cx="350" cy="11" r="1.5"/><circle cx="400" cy="11" r="1.5"/>
        </g>
        <line x1="320" y1="0" x2="320" y2="14" stroke="var(--chart-amber)" stroke-width="2"/>
      </svg>
    </div>
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>2. 模型首字生成 (LLM First Token)</span><strong>195ms</strong></div>
      <svg viewBox="0 0 400 14" style="width: 100%; height: 14px; overflow: visible;">
        <rect x="0" y="4" width="400" height="6" rx="3" fill="var(--secondary)"/>
        <rect x="0" y="4" width="244" height="6" rx="3" fill="var(--chart-indigo)"/>
        <g fill="var(--muted-fg)">
          <circle cx="50" cy="11" r="1.5"/><circle cx="100" cy="11" r="1.5"/><circle cx="150" cy="11" r="1.5"/>
          <circle cx="200" cy="11" r="1.5"/><circle cx="250" cy="11" r="1.5"/><circle cx="300" cy="11" r="1.5"/>
          <circle cx="350" cy="11" r="1.5"/><circle cx="400" cy="11" r="1.5"/>
        </g>
        <line x1="320" y1="0" x2="320" y2="14" stroke="var(--chart-amber)" stroke-width="2"/>
      </svg>
    </div>
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>3. 网关鉴权解析 (Auth Gateway)</span><strong>48ms</strong></div>
      <svg viewBox="0 0 400 14" style="width: 100%; height: 14px; overflow: visible;">
        <rect x="0" y="4" width="400" height="6" rx="3" fill="var(--secondary)"/>
        <rect x="0" y="4" width="60" height="6" rx="3" fill="var(--chart-slate)"/>
        <g fill="var(--muted-fg)">
          <circle cx="50" cy="11" r="1.5"/><circle cx="100" cy="11" r="1.5"/><circle cx="150" cy="11" r="1.5"/>
          <circle cx="200" cy="11" r="1.5"/><circle cx="250" cy="11" r="1.5"/><circle cx="300" cy="11" r="1.5"/>
          <circle cx="350" cy="11" r="1.5"/><circle cx="400" cy="11" r="1.5"/>
        </g>
        <line x1="320" y1="0" x2="320" y2="14" stroke="var(--chart-amber)" stroke-width="2"/>
      </svg>
    </div>
  </div>
  <div style="font-size: 10px; letter-spacing: .08em; color: var(--muted-fg); margin-top: 12px;">轨道 = 0 → P95 上限 320ms · 填充 = 实测耗时 · 琥珀竖线 = 预警阈值 · 圆点 = 每 40ms 一个 rim 刻度</div>
</div>
```

### F. 半环水位仪表盘 (Semi-Circle Capacity Gauge)

```html
<div class="card" style="padding: 16px 20px;">
  <div style="font-size: 14px; font-weight: 600;">配额还剩 38%，按当前消耗速率够用 11 天</div>
  <div style="font-size: 12px; color: var(--muted-fg); margin-top: 2px;">1 rim 刻度 = 5 个百分点 · 20 个刻度 = 100% · 计算窗口 30 天</div>
  <svg viewBox="0 0 220 130" style="width: 100%; max-width: 260px; height: auto; overflow: visible; margin-top: 10px;">
    <!-- 底弧：半径 80，从 180° 到 360° -->
    <path d="M 30 100 A 80 80 0 0 1 190 100" fill="none" stroke="var(--secondary)" stroke-width="16" stroke-linecap="round"/>
    <!-- 水位弧：38% × 半圆周长(251.3) ≈ 95.5 -->
    <path d="M 30 100 A 80 80 0 0 1 190 100" fill="none" stroke="var(--chart-indigo)" stroke-width="16" stroke-linecap="round"
          stroke-dasharray="95.5 251.3"/>
    <!-- 家具：rim 刻度（每 5% 一根，共 20 根） -->
    <g stroke="var(--muted-fg)" stroke-width="1.5">
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(0 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(9 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(18 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(27 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(36 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(45 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(54 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(63 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(72 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(81 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(90 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(99 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(108 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(117 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(126 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(135 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(144 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(153 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(162 110 100)"/>
      <line x1="30" y1="100" x2="36" y2="100" transform="rotate(171 110 100)"/>
    </g>
    <!-- 预警阈值 25%：从右侧数第 5 根刻度 -->
    <line x1="110" y1="100" x2="110" y2="20" stroke="var(--chart-amber)" stroke-width="1.5" stroke-dasharray="3 3" transform="rotate(135 110 100)"/>
    <text x="110" y="86" text-anchor="middle" font-size="26" font-weight="700" fill="var(--card-fg)">38%</text>
    <text x="110" y="104" text-anchor="middle" font-size="11" fill="var(--muted-fg)">剩余配额 · 约 11 天</text>
    <text x="30" y="118" text-anchor="middle" font-size="10" fill="var(--muted-fg)">0%</text>
    <text x="110" y="118" text-anchor="middle" font-size="10" fill="var(--muted-fg)">50%</text>
    <text x="190" y="118" text-anchor="middle" font-size="10" fill="var(--muted-fg)">100%</text>
  </svg>
  <div style="font-size: 10px; letter-spacing: .08em; color: var(--muted-fg); margin-top: 8px;">弧长 = 已用配额 · 外圈刻度 = 每 5 个百分点 · 琥珀虚线 = 25% 预警阈值</div>
</div>
```

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

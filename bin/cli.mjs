#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const args = process.argv.slice(2);
const cmd = args[0] || 'help';

// Ready-to-copy atomic component snippets (Zero-Dependency)
const SNIPPETS = {
  button: `<!-- 按钮组件 (Buttons) -->
<button class="btn btn-primary">Primary 主要操作</button>
<button class="btn btn-secondary">Secondary 次要操作</button>
<button class="btn btn-outline">Outline 边框按钮</button>
<button class="btn btn-ghost">Ghost 幽灵按钮</button>
<button class="btn btn-destructive">Destructive 危险操作</button>
<button class="btn btn-primary btn-sm">小号 (sm)</button>
<button class="btn btn-primary btn-lg">大号 (lg)</button>`,

  badge: `<!-- 状态标签组件 (Badges) -->
<span class="badge badge-success"><span class="badge-dot"></span>200 OK 正常</span>
<span class="badge badge-warning"><span class="badge-dot"></span>Warning 预警</span>
<span class="badge badge-danger"><span class="badge-dot"></span>Error 异常</span>
<span class="badge badge-info"><span class="badge-dot"></span>Running 进行中</span>
<span class="badge">Default 默认</span>`,

  'metric-card': `<!-- 指标统计卡 (Metric Stat Card) -->
<div class="stat-card" style="padding: 16px 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);">
  <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--muted-fg);">
    <span>每日调用量 (Requests)</span>
    <span style="color: var(--ok); font-weight: 600;">↑ +14.8%</span>
  </div>
  <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-top: 6px;">
    <div>
      <div style="font-size: 24px; font-weight: 700; line-height: 1.1;">1,248,920</div>
      <div style="font-size: 12px; color: var(--muted-fg); margin-top: 4px;">P95 延迟 124ms</div>
    </div>
    <svg width="84" height="28" viewBox="0 0 84 28" fill="none" style="overflow: visible;">
      <path d="M 2 24 L 16 20 L 30 22 L 44 14 L 58 16 L 70 6 L 82 2" stroke="var(--ok)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="82" cy="2" r="2.5" fill="var(--ok)"/>
    </svg>
  </div>
</div>`,

  callout: `<!-- 提示摘要框 (Callout) -->
<div style="padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--ok-border); background: var(--ok-bg); font-size: 13px; line-height: 1.5;">
  <strong style="color: var(--ok); display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    <span>核心评估结论</span>
  </strong>
  <span>系统架构符合上线标准，P99 延迟与吞吐量均已达到放行阈值，建议开启灰度。</span>
</div>`,

  table: `<!-- 数据表格组件 (Filterable Table Container) -->
<div class="card" style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden;">
  <div style="padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
    <input type="text" id="searchInput" placeholder="输入关键字搜索..." style="height: 32px; padding: 0 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--card-fg); outline: none; font-size: 13px;">
    <button class="btn btn-outline btn-sm">复制数据 (MD)</button>
  </div>
  <div style="overflow-x: auto; width: 100%;">
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
      <thead>
        <tr style="background: var(--secondary); color: var(--muted-fg); border-bottom: 1px solid var(--border);">
          <th style="padding: 10px 16px;">服务名称</th>
          <th style="padding: 10px 16px;">请求量</th>
          <th style="padding: 10px 16px;">延迟</th>
          <th style="padding: 10px 16px;">状态</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--border);">
          <td style="padding: 10px 16px; font-weight: 500;">api-gateway</td>
          <td style="padding: 10px 16px;">840k</td>
          <td style="padding: 10px 16px;">18ms</td>
          <td style="padding: 10px 16px;"><span class="badge badge-success"><span class="badge-dot"></span>正常</span></td>
        </tr>
        <tr>
          <td style="padding: 10px 16px; font-weight: 500;">auth-service</td>
          <td style="padding: 10px 16px;">320k</td>
          <td style="padding: 10px 16px;">42ms</td>
          <td style="padding: 10px 16px;"><span class="badge badge-success"><span class="badge-dot"></span>正常</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`,

  'svg-chart': `<!-- 纯原生矢量面积折线图 (Pure SVG Area Trend Chart) -->
<div class="card" style="padding: 16px 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
    <span style="font-weight: 600; font-size: 13px;">实时吞吐走势 (QPS)</span>
    <span style="color: var(--chart-emerald, #10b981); font-weight: 600; font-size: 11px;">↑ +18.4%</span>
  </div>
  <svg viewBox="0 0 400 95" style="width: 100%; height: 85px; overflow: visible;">
    <defs>
      <linearGradient id="areaGradIndigo" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#6366f1" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <path d="M 0 70 Q 55 30, 110 52 T 210 36 T 310 18 T 400 28 L 400 95 L 0 95 Z" fill="url(#areaGradIndigo)"/>
    <path d="M 0 70 Q 55 30, 110 52 T 210 36 T 310 18 T 400 28" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="400" cy="28" r="3.5" fill="#6366f1"/>
  </svg>
</div>`,

  modal: `<!-- 原生无依赖模态弹窗 (Native Dialog Modal) -->
<button class="btn btn-outline" onclick="document.getElementById('demoModal').showModal()">打开对话框</button>

<dialog id="demoModal" style="border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); color: var(--card-fg); padding: 24px; max-width: 480px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
  <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">确认执行此操作？</div>
  <p style="font-size: 13px; color: var(--muted-fg); margin-bottom: 20px; line-height: 1.5;">执行后将不可撤销，变更将直接同步至生产环境。</p>
  <div style="display: flex; justify-content: flex-end; gap: 8px;">
    <button class="btn btn-secondary" onclick="document.getElementById('demoModal').close()">取消</button>
    <button class="btn btn-primary" onclick="document.getElementById('demoModal').close()">确认执行</button>
  </div>
</dialog>`
};

function printHelp() {
  console.log(`
agent-html · Zero-dependency single-file HTML design system & agent skill

Usage:
  npx agent-html <command> [options]

Commands:
  open [--zh]               Open the local component library in your browser (default EN, --zh for CN)
  snippet <name>            Output copy-ready atomic HTML component (button, badge, metric-card, callout, table, svg-chart, modal)
  list                      List all 6 built-in layout templates
  template <name> [--lang]  Output raw HTML template (dashboard, report, compare, inspector, timeline, kanban)
  check <file>              Run the deterministic offline HTML linter against a file
  install                   Quickly install/symlink the skill to ~/.agents/skills/agent-html

Snippet names available:
  - button        Primary, secondary, outline, destructive, and sizing variants
  - badge         Success, warning, error, info, and neutral status pills
  - metric-card   Stat KPI card with sparkline trend
  - callout       Executive alert & takeaway summary box
  - table         Filterable clean table container with header actions
  - svg-chart     Zero-dependency pure SVG area line chart
  - modal         Native HTML5 <dialog> modal with backdrop

Layout Templates (6 套模板):
  - report        Report 报告 (单栏文档 / 事故复盘)
  - dashboard     Dashboard 数据面板 (指标大盘 / API 消耗)
  - inspector     Inspector 审查工作台 (双栏查看 / 日志追溯)
  - compare       Compare 对比 (并排对比 / 选型矩阵)
  - timeline      Timeline 时间线 (时序编年 / 服务恢复)
  - kanban        Kanban 看板 (敏捷任务 / Bug 分拣)

Examples:
  npx agent-html open
  npx agent-html open --zh
  npx agent-html snippet button
  npx agent-html snippet metric-card > stat.html
  npx agent-html template dashboard > api-dashboard.html
  npx agent-html template --zh report > incident-report.html
  npx agent-html check my-dashboard.html
`);
}

switch (cmd) {
  case 'open': {
    const isZh = args.includes('--zh') || args.includes('-zh');
    const targetFile = isZh ? 'index.zh-CN.html' : 'index.html';
    const indexPath = resolve(rootDir, targetFile);
    const openCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    execSync(`${openCmd} "${indexPath}"`);
    console.log(`✨ Opened gallery: ${indexPath}`);
    break;
  }

  case 'snippet': {
    const sName = args.slice(1).find(arg => !arg.startsWith('-'));
    if (!sName) {
      console.log('Available atomic snippets:');
      Object.keys(SNIPPETS).forEach(k => console.log(`  - ${k}`));
      console.log('\nUsage: npx agent-html snippet <name>');
      break;
    }
    const snippet = SNIPPETS[sName.toLowerCase()];
    if (!snippet) {
      console.error(`Error: Unknown snippet "${sName}". Available snippets: ${Object.keys(SNIPPETS).join(', ')}`);
      process.exit(1);
    }
    process.stdout.write(snippet + '\n');
    break;
  }

  case 'list': {
    console.log(`
Available 6 Layout Templates:
  1. report     Report 报告 (单栏文档 / 审查复盘)
  2. dashboard  Dashboard 数据面板 (指标大盘 / 过滤表格)
  3. inspector  Inspector 审查工作台 (双栏查看 / 日志审查)
  4. compare    Compare 对比 (并排横向对比 / 矩阵)
  5. timeline   Timeline 时间线 (时序编年 / 事故记录)
  6. kanban     Kanban 看板 (任务流转 / 缺陷分拣)

Languages available:
  - English:  npx agent-html template en/<name> (or --en)
  - Chinese:  npx agent-html template zh/<name> (or --zh)
`);
    break;
  }

  case 'template': {
    const isZh = args.includes('--zh') || args.includes('-zh');
    const isEn = args.includes('--en') || args.includes('-en');
    const tName = args.slice(1).find(arg => !arg.startsWith('-'));

    if (!tName) {
      console.error('Error: Please specify template name: dashboard, report, compare, inspector, timeline, or kanban');
      console.error('Example: npx agent-html template dashboard (or en/dashboard, zh/dashboard)');
      process.exit(1);
    }

    let tPath = '';
    if (tName.startsWith('zh/') || tName.startsWith('en/')) {
      tPath = resolve(rootDir, `templates/${tName}.html`);
    } else if (isZh) {
      tPath = resolve(rootDir, `templates/zh/${tName}.html`);
    } else if (isEn) {
      tPath = resolve(rootDir, `templates/en/${tName}.html`);
    } else {
      const enPath = resolve(rootDir, `templates/en/${tName}.html`);
      const zhPath = resolve(rootDir, `templates/zh/${tName}.html`);
      tPath = existsSync(enPath) ? enPath : zhPath;
    }

    if (!existsSync(tPath)) {
      console.error(`Error: Template "${tName}" not found at ${tPath}`);
      process.exit(1);
    }
    process.stdout.write(readFileSync(tPath, 'utf8'));
    break;
  }

  case 'check': {
    const target = args[1];
    if (!target) {
      console.error('Error: Please specify HTML file to validate');
      process.exit(1);
    }
    const valScript = resolve(rootDir, 'skills/agent-html/scripts/validate.mjs');
    execSync(`node "${valScript}" "${target}"`, { stdio: 'inherit' });
    break;
  }

  case 'install': {
    const skillSource = resolve(rootDir, 'skills/agent-html');
    const targetAgents = resolve(process.env.HOME || '~', '.agents/skills/agent-html');
    execSync(`mkdir -p "${resolve(process.env.HOME || '~', '.agents/skills')}"`);
    execSync(`ln -sf "${skillSource}" "${targetAgents}"`);
    console.log(`✅ Successfully symlinked skill to: ${targetAgents}`);
    console.log(`💡 For universal installation across 70+ agents, run:\n   npx skills add QingYunA/agent-html -g`);
    break;
  }

  case 'help':
  case '--help':
  case '-h':
  default:
    printHelp();
    break;
}

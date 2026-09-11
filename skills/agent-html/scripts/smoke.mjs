#!/usr/bin/env node
/**
 * scripts/smoke.mjs
 *
 * 零依赖渲染烟测（Render Smoke Test）
 * ────────────────────────────────────────────────────────────────
 * 静态 lint 能证明"代码没报错"，证明不了"页面真的画出来了"。
 * 本脚本补上这一段：
 *
 *   1. 把每个产物复制到临时目录，注入两段探针脚本（不改动仓库文件）；
 *   2. 用 headless Chrome 以 --dump-dom 输出**渲染后**的 DOM；
 *   3. 从 DOM 里取回探针产出的 JSON，断言运行时事实。
 *
 * 覆盖静态 lint 完全测不到的盲区：
 *   · 内联脚本是否有**运行期**报错（语法合法 ≠ 跑得起来）
 *   · SVG 是否真的画出了图元（而不是空壳）
 *   · 暗黑模式切换是否真的生效
 *   · 是否存在被 overflow:hidden 截断的内容
 *   · 窄视口下是否横向溢出
 *
 * 用法：
 *   node scripts/smoke.mjs                 # 全部产物
 *   node scripts/smoke.mjs <file.html>     # 单个产物
 *   node scripts/smoke.mjs --selftest      # 证明探针本身能发现缺陷
 */

import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, basename, dirname, resolve, relative } from 'node:path';
import { exit, argv, stdout, stderr } from 'node:process';
import { fileURLToPath } from 'node:url';

/**
 * 路径全部相对**脚本自身位置**解析，而不是 cwd——技能被安装或复制到任何
 * 位置后，从任意工作目录调用都能找到自己的资产。
 */
const SELF_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = resolve(SELF_DIR, '..');           // <skill>/
const REPO_DIR = resolve(SKILL_DIR, '..', '..');     // 开发检出时的仓库根（安装后不存在）

/** 展示用路径：开发检出下相对仓库根，安装后相对技能目录。 */
function displayPath(file) {
  const isRepo = existsSync(join(REPO_DIR, 'package.json'));
  for (const base of isRepo ? [REPO_DIR, SKILL_DIR] : [SKILL_DIR]) {
    const r = relative(base, file);
    if (r && !r.startsWith('..')) return r;
  }
  return file;
}

/* ── Chrome 定位 ───────────────────────────────────────────────── */
const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
];

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  return CHROME_CANDIDATES.find((p) => existsSync(p)) || null;
}

const CHROME = findChrome();
if (!CHROME) {
  // 退出码 2 = 环境不具备运行条件，与「烟测失败」(1) 区分开。
  // 这**不是**产物有问题，调用方不应据此判定交付物不合格。
  stderr.write('⚠️  未找到 Chrome/Chromium，渲染烟测跳过（这不是产物缺陷）。\n');
  stderr.write('   如需运行：安装 Chrome，或设置 CHROME_PATH 指向浏览器可执行文件。\n');
  exit(2);
}

/* ── 目标收集 ──────────────────────────────────────────────────── */
function walkHtml(dir) {
  let out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walkHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const targets = [];
const fileArgs = argv.slice(2).filter((a) => !a.startsWith('-'));
if (fileArgs.length) {
  for (const a of fileArgs) {
    const p = resolve(a);
    if (!existsSync(p)) {
      stderr.write(`❌ 找不到文件: ${a}\n`);
      exit(1);
    }
    targets.push(p);
  }
} else {
  // ① 技能自带资产：安装后依然存在
  const tplDir = resolve(SKILL_DIR, 'assets', 'templates');
  if (existsSync(tplDir)) targets.push(...walkHtml(tplDir));
  // ② 仓库额外产物：仅开发检出下存在。
  //    画廊页虽然属于网站，但它也是这个技能的真实产物，同样要看着。
  const exDir = resolve(REPO_DIR, 'examples');
  if (existsSync(exDir)) targets.push(...walkHtml(exDir));
  for (const name of ['index.html', 'index.zh-CN.html']) {
    const p = resolve(REPO_DIR, name);
    if (existsSync(p)) targets.push(p);
  }
}

if (!targets.length) {
  stderr.write('未找到待测产物。\n');
  exit(1);
}

/* ── 探针注入 ──────────────────────────────────────────────────
   注入分两段：
   · HEAD 段 —— 必须最先执行，才能捕获后续所有脚本的运行期报错；
   · BODY 段 —— 在 load 之后做断言，把结果写进 #__selftest。
   结果用 encodeURIComponent 编码，避免 HTML 转义问题。        */

const HEAD_PROBE = `<script>
window.__smokeErrors = [];
window.addEventListener('error', function (e) {
  window.__smokeErrors.push(String((e && e.message) || e));
});
window.addEventListener('unhandledrejection', function (e) {
  window.__smokeErrors.push('unhandledrejection: ' + String(e.reason));
});
</script>`;

const BODY_PROBE = `<div id="__selftest" style="display:none"></div>
<script>
(function () {
  function px(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }

  function svgStats() {
    var out = [];
    document.querySelectorAll('svg').forEach(function (s) {
      var r = s.getBoundingClientRect();
      out.push({
        w: Math.round(r.width),
        h: Math.round(r.height),
        drawn: s.querySelectorAll('path,rect,circle,line,polyline,polygon,text,canvas,image,use').length
      });
    });
    return out;
  }

  function clipped() {
    var out = [];
    document.querySelectorAll('.card, section, .stat-mini, .event-card, .item-row, .detail-card').forEach(function (el) {
      var cs = getComputedStyle(el);
      var hidden = cs.overflow === 'hidden' || cs.overflowY === 'hidden';
      if (hidden && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) {
        out.push({ cls: String(el.className).slice(0, 48), scroll: el.scrollHeight, client: el.clientHeight });
      }
    });
    return out;
  }

  function themeProbe() {
    var toggle = document.getElementById('themeToggle');
    var read = function () {
      var cs = getComputedStyle(document.documentElement);
      return {
        theme: document.documentElement.getAttribute('data-theme') || '(auto)',
        bg: cs.getPropertyValue('--bg').trim(),
        card: cs.getPropertyValue('--card').trim()
      };
    };
    var before = read();
    if (!toggle) return { present: false, before: before, after: before, toggled: false };
    toggle.click();
    var after = read();
    return { present: true, before: before, after: after, toggled: before.bg !== after.bg };
  }

  function report() {
    var de = document.documentElement;
    var affordances = 0;
    document.querySelectorAll('button, a').forEach(function (el) {
      var t = (el.id + ' ' + el.className + ' ' + (el.textContent || '')) + ' ' + (el.getAttribute('title') || '');
      if (/copy|export|print|复制|导出|打印/i.test(t)) affordances += 1;
    });
    var payload = {
      title: document.title,
      errors: window.__smokeErrors || [],
      docW: de.scrollWidth,
      viewW: de.clientWidth,
      hOverflow: de.scrollWidth > de.clientWidth + 2,
      svgs: svgStats(),
      clipped: clipped(),
      affordances: affordances,
      theme: themeProbe()
    };
    document.getElementById('__selftest').textContent = encodeURIComponent(JSON.stringify(payload));
  }

  if (document.readyState === 'complete') setTimeout(report, 400);
  else window.addEventListener('load', function () { setTimeout(report, 400); });
})();
</script>`;

/* ── 渲染 ──────────────────────────────────────────────────────── */
const VIEWPORT = '1440,900';
const workDir = mkdtempSync(join(tmpdir(), 'agent-html-smoke-'));

function inject(html, snippet, at) {
  const idx = html.toLowerCase().indexOf(at);
  if (idx === -1) return html + snippet;
  const cut = at === '<head>' ? idx + at.length : idx;
  return html.slice(0, cut) + snippet + html.slice(cut);
}

/** 把一段完整 HTML 落地到临时目录并渲染，取回探针产出的 JSON。 */
function renderStaged(html, name) {
  const staged = join(workDir, `${name}.html`);
  mkdirSync(dirname(staged), { recursive: true });
  writeFileSync(staged, html, 'utf8');

  const run = spawnSync(CHROME, [
    '--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--virtual-time-budget=4000',
    `--window-size=${VIEWPORT}`,
    '--dump-dom',
    `file://${staged}`,
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 60000 });

  const dom = run.stdout || '';
  const match = dom.match(/<div id="__selftest"[^>]*>([\s\S]*?)<\/div>/);
  if (!match || !match[1].trim()) {
    return { ok: false, reason: run.error ? String(run.error.message) : '探针未产出结果（页面可能未能加载）' };
  }
  try {
    return { ok: true, data: JSON.parse(decodeURIComponent(match[1].trim())) };
  } catch (e) {
    return { ok: false, reason: `探针结果无法解析：${e.message}` };
  }
}

const withProbes = (source) => inject(inject(source, HEAD_PROBE, '<head>'), BODY_PROBE, '</body>');

function render(file) {
  return renderStaged(
    withProbes(readFileSync(file, 'utf8')),
    `${basename(file, '.html')}-${Math.abs(file.length)}`,
  );
}

/* ── 文档代码样例渲染 ──────────────────────────────────────────
   文档里的 ```html 样例是 Agent 会直接抄走的代码。它们坏了，静态
   lint 一条都抓不到——F-014 就是这么漏掉的：样例引用了文档基座里
   未定义的 CSS 变量，图形静默消失，而所有门禁全绿。

   这里把「文档承诺的基座 CSS」与「全部 ```html 样例」拼成一个真实
   页面渲染，验证照文档做出来的东西确实画得出来。 */
// 技能内永远存在；根 README 仅开发检出下存在
const DOC_SAMPLE_SOURCES = [
  resolve(SKILL_DIR, 'references', 'components.md'),
  resolve(REPO_DIR, 'README.md'),
  resolve(REPO_DIR, 'README.zh-CN.md'),
];

function renderDocSamples() {
  const skillPath = resolve(SKILL_DIR, 'SKILL.md');
  if (!existsSync(skillPath)) return { ok: false, reason: '找不到 SKILL.md' };

  const cssBlock = readFileSync(skillPath, 'utf8').match(/```css([\s\S]*?)```/);
  if (!cssBlock) return { ok: false, reason: 'SKILL.md 里找不到 ```css 基座块' };

  const blocks = [];
  for (const full of DOC_SAMPLE_SOURCES) {
    if (!existsSync(full)) continue;
    for (const m of readFileSync(full, 'utf8').matchAll(/```html([\s\S]*?)```/g)) blocks.push(m[1]);
  }
  if (!blocks.length) return { ok: false, reason: '未找到任何 ```html 样例' };

  const page = `<!DOCTYPE html>
<html lang="zh"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>doc-samples</title>
<style>${cssBlock[1]}
  body{padding:24px;display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
</style></head><body>
${blocks.join('\n')}
</body></html>`;

  const outcome = renderStaged(withProbes(page), 'doc-samples');
  return { ...outcome, blocks: blocks.length };
}

/** 文档样例只关心「画出来了没有」，不适用产物才有的 affordance/colophon 检查。 */
function assessDocSamples(data, blocks) {
  const findings = [];
  const add = (level, message) => findings.push({ level, message });

  for (const err of data.errors) add('error', `样例脚本运行期报错：${err}`);
  if (data.hOverflow) add('error', `样例页面横向溢出：文档宽 ${data.docW}px > 视口 ${data.viewW}px`);
  if (!data.svgs.length) add('error', `${blocks} 个样例里一个 SVG 都没渲染出来`);

  for (const s of data.svgs.filter((x) => x.w > 60 && x.h > 40 && x.drawn === 0)) {
    add('error', `样例 SVG 是空壳：${s.w}×${s.h}px，图元 0 个——照抄这段代码的 Agent 会得到一张空图`);
  }
  for (const s of data.svgs.filter((x) => x.w > 200 && x.h > 60 && x.drawn < 3 && x.drawn > 0)) {
    add('warn', `样例 SVG 图元过少：${s.w}×${s.h}px 只有 ${s.drawn} 个，疑似渲染不完整`);
  }
  return findings;
}

/* ── 断言 ──────────────────────────────────────────────────────── */
function assess(rel, data) {
  const findings = [];
  const add = (level, message) => findings.push({ level, message });

  if (data.errors.length) {
    for (const err of data.errors) add('error', `运行期 JS 报错：${err}`);
  }

  if (data.hOverflow) {
    add('error', `横向溢出：文档宽 ${data.docW}px > 视口 ${data.viewW}px`);
  }

  const blank = data.svgs.filter((s) => s.w > 60 && s.h > 40 && s.drawn === 0);
  for (const s of blank) add('error', `SVG 空壳未绘制：${s.w}×${s.h}px，图元 0 个（脚本可能未执行或容器被裁剪）`);

  const thin = data.svgs.filter((s) => s.w > 200 && s.h > 100 && s.drawn < 3 && s.drawn > 0);
  for (const s of thin) add('warn', `SVG 图元过少：${s.w}×${s.h}px 只有 ${s.drawn} 个图元，疑似渲染不完整`);

  for (const c of data.clipped) {
    add('warn', `内容被 overflow:hidden 截断："${c.cls}" 内容高 ${c.scroll}px 但容器仅 ${c.client}px`);
  }

  if (data.theme.present && !data.theme.toggled) {
    add('error', `暗黑模式切换无效：点击 #themeToggle 前后 --bg 均为 "${data.theme.before.bg}"`);
  }

  if (data.affordances === 0) {
    add('warn', '运行期未找到任何复制/导出/打印出口');
  }

  return findings;
}

/* ── 执行 ──────────────────────────────────────────────────────── */

/** 渲染一个文件并产出断言结果。 */
function assessFile(file) {
  const outcome = render(file);
  if (!outcome.ok) {
    return { data: null, findings: [{ level: 'error', message: outcome.reason }] };
  }
  return { data: outcome.data, findings: assess(file, outcome.data) };
}

/* ── 变异自测：证明本脚本确实能失败 ────────────────────────────
   一个永远通过的烟测等于没有烟测。以下用合成产物注入缺陷，
   断言探针确实能捕获——尤其是"脚本语法合法但运行期抛错"这种
   静态 lint 完全看不见的缺陷。                                  */
const FIXTURE = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Smoke Fixture</title>
<style>
  :root { --bg: #fafafa; --card: #ffffff; }
  [data-theme="dark"] { --bg: #09090b; --card: #121215; }
  body { background: var(--bg); }
</style></head>
<body>
  <div class="card" style="padding:20px">
    <svg viewBox="0 0 400 300" style="width:400px;height:300px">
      <rect x="0" y="0" width="20" height="20"/><circle cx="80" cy="80" r="10"/><path d="M10 10 L90 90"/>
    </svg>
  </div>
  <button id="copyBtn">Copy</button>
  <button id="themeToggle">theme</button>
  <script>
    document.getElementById('themeToggle').addEventListener('click', function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
    });
  </script>
</body></html>`;

const SMOKE_CASES = [
  {
    label: '基准合成产物必须通过（探针本身不产生假阳性）',
    html: FIXTURE,
    expect: [],
    expectClean: true,
  },
  {
    label: '必须捕获运行期 JS 报错（语法合法但执行即抛错）',
    html: FIXTURE.replace('</body>', "<script>throw new Error('boom');</script></body>"),
    expect: ['运行期 JS 报错'],
  },
  {
    label: '必须捕获"SVG 空壳"（容器在但图元一个没画）',
    html: FIXTURE.replace('</body>', '<svg viewBox="0 0 400 300" style="width:400px;height:300px"></svg></body>'),
    expect: ['SVG 空壳未绘制'],
  },
  {
    label: '必须捕获"暗黑模式切换无效"',
    html: FIXTURE.replace(
      "var dark = document.documentElement.getAttribute('data-theme') === 'dark';",
      'var dark = true;',
    ),
    expect: ['暗黑模式切换无效'],
  },
  {
    label: '必须捕获横向溢出',
    html: FIXTURE.replace('</body>', '<div style="width:3000px;height:10px"></div></body>'),
    expect: ['横向溢出'],
  },
];

function runSelftest() {
  const dir = mkdtempSync(join(tmpdir(), 'agent-html-smoke-selftest-'));
  process.stdout.write(`\n🧪 烟测有效性自测 · ${SMOKE_CASES.length} 个用例\n\n`);
  let failed = 0;

  for (const [i, testCase] of SMOKE_CASES.entries()) {
    const file = join(dir, `case-${i}.html`);
    writeFileSync(file, testCase.html, 'utf8');
    const { findings } = assessFile(file);
    const messages = findings.map((f) => f.message).join(' || ');

    const problems = [];
    for (const needle of testCase.expect) {
      if (!messages.includes(needle)) problems.push(`期望命中「${needle}」，实际未命中`);
    }
    if (testCase.expectClean && findings.length) {
      problems.push(`期望完全干净，实际报出：${messages}`);
    }

    if (problems.length) {
      failed += 1;
      process.stdout.write(`  ❌ ${testCase.label}\n`);
      for (const p of problems) process.stdout.write(`        - ${p}\n`);
    } else {
      process.stdout.write(`  ✅ ${testCase.label}\n`);
    }
  }

  rmSync(dir, { recursive: true, force: true });
  process.stdout.write('\n');
  if (failed) {
    process.stderr.write(`❌ ${failed} 个用例未达预期：烟测可能无法发现真实缺陷。\n\n`);
    exit(1);
  }
  process.stdout.write(`✅ 全部通过：探针被证明能捕获运行期报错、空壳 SVG、失效的主题切换与横向溢出。\n\n`);
  exit(0);
}

if (argv.includes('--selftest')) runSelftest();

const results = [];
let totalErrors = 0;
let totalWarnings = 0;

process.stdout.write(`\n🔍 渲染烟测 · ${targets.length} 个产物 · headless Chrome（虚拟时间 4000ms，视口 ${VIEWPORT.replace(',', '×')}）\n\n`);

for (const file of targets) {
  const rel = displayPath(file);
  const { data, findings } = assessFile(file);
  results.push({ rel, findings, data });
}

// 只在全量运行时检查文档样例（单文件调用时没必要多跑一次 Chrome）
if (!fileArgs.length) {
  const doc = renderDocSamples();
  if (!doc.ok) {
    results.push({ rel: 'docs: 代码样例', findings: [{ level: 'error', message: doc.reason }], data: null });
  } else {
    results.push({
      rel: `docs: ${doc.blocks} 个代码样例`,
      findings: assessDocSamples(doc.data, doc.blocks),
      data: doc.data,
      isDocs: true,
    });
  }
}

rmSync(workDir, { recursive: true, force: true });

for (const r of results) {
  const errors = r.findings.filter((f) => f.level === 'error');
  const warnings = r.findings.filter((f) => f.level === 'warn');
  totalErrors += errors.length;
  totalWarnings += warnings.length;
  if (!errors.length && !warnings.length) {
    const s = r.data;
    const drawn = s ? s.svgs.reduce((n, x) => n + x.drawn, 0) : 0;
    const tail = r.isDocs
      ? `${s ? s.svgs.length : 0} 个样例 SVG / ${drawn} 个图元`
      : `${s ? s.svgs.length : 0} 个 SVG / ${drawn} 个图元 / 主题切换 ${s && s.theme.toggled ? '正常' : 'N/A'}`;
    process.stdout.write(`  ✅ PASS  ${r.rel}  \x1b[2m(${tail})\x1b[0m\n`);
    continue;
  }
  process.stdout.write(`  ${errors.length ? '❌' : '⚠️ '} ${errors.length ? '\x1b[31mFAIL\x1b[0m' : '\x1b[33mWARN\x1b[0m'}  ${r.rel}\n`);
  for (const f of [...errors, ...warnings]) {
    const mark = f.level === 'error' ? '\x1b[31m[阻断]\x1b[0m' : '\x1b[33m[提醒]\x1b[0m';
    process.stdout.write(`        ${mark} ${f.message}\n`);
  }
}

process.stdout.write(`\n${'─'.repeat(64)}\n`);
if (totalErrors === 0) {
  process.stdout.write(`🎉 烟测通过：${results.length} 个产物均渲染成功，0 项阻断，${totalWarnings} 项提醒。\n\n`);
  exit(0);
}
process.stdout.write(`🚨 烟测未通过：${totalErrors} 项阻断，${totalWarnings} 项提醒。\n\n`);
exit(1);

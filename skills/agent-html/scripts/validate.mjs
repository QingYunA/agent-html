#!/usr/bin/env node
/**
 * scripts/validate.mjs
 *
 * Agent HTML 确定性静态校验器
 * ────────────────────────────────────────────────────────────────
 * 设计原则：
 *   1. 零网络、零依赖、零 Token —— 只用 Node 内置模块，无头浏览器不参与。
 *   2. 白名单先于规则 —— token 定义块（:root / [data-theme] /
 *      prefers-color-scheme）与 @media print 块内的颜色字面量永远合法。
 *      误报会摧毁 Agent 对门禁的信任，比没有门禁更糟。
 *   3. 显式豁免 —— `@lint-allow: RULE_ID — 理由` 可豁免单条规则；
 *      理由少于 4 个字符不生效。必须为每个豁免留下可追溯的原因。
 *   4. 分级 —— error 阻断（规范硬门），warn 提醒（建议人工复核）。
 *
 * 用法：
 *   node scripts/validate.mjs <file.html> [...]     # 校验指定文件
 *   node scripts/validate.mjs --all                 # 校验仓库全部产物
 *   node scripts/validate.mjs --all --json          # 机器可读输出
 */

import { readFileSync, existsSync, readdirSync, realpathSync } from 'node:fs';
import { resolve, join, relative, basename, dirname } from 'node:path';
import { exit, argv, stdout, stderr } from 'node:process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

/** 展示用路径：开发检出下相对仓库根，安装后相对技能目录。 */
function displayPath(file) {
  const isRepo = existsSync(join(REPO_DIR, 'package.json'));
  for (const base of isRepo ? [REPO_DIR, SKILL_DIR] : [SKILL_DIR]) {
    const r = relative(base, file);
    if (r && !r.startsWith('..')) return r;
  }
  return file;
}

/* ═══════════════════════════════════════════════════════════════
   0 · 参数与目标收集
   ═══════════════════════════════════════════════════════════════ */

const rawArgs = argv.slice(2);
const FLAGS = new Set(rawArgs.filter((a) => a.startsWith('-')));
const PATH_ARGS = rawArgs.filter((a) => !a.startsWith('-'));
const AS_JSON = FLAGS.has('--json');

function usage() {
  stdout.write(`用法:
  node scripts/validate.mjs <file.html> [...]   # 校验指定文件
  node scripts/validate.mjs --all               # 校验仓库全部产物
  node scripts/validate.mjs --all --json        # 机器可读输出
`);
}

if (FLAGS.has('-h') || FLAGS.has('--help')) {
  usage();
  exit(0);
}
if (rawArgs.length === 0) {
  usage();
  exit(1);
}

function findHtmlFiles(dir) {
  let files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      try {
        files.push(realpathSync(full));
      } catch {
        files.push(resolve(full));
      }
    }
  }
  return files;
}

/**
 * 路径全部相对**脚本自身位置**解析，而不是 cwd。
 * 这样技能被安装到 `~/.agents/skills/agent-html`（乃至被复制到任何位置）后，
 * 从任意工作目录调用都能找到自己的资产——原先的 cwd 相对写法在安装后全部失效。
 */
const SELF_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = resolve(SELF_DIR, '..');            // <skill>/
const REPO_DIR = resolve(SKILL_DIR, '..', '..');      // 开发检出时的仓库根（安装后不存在）

const targetFiles = [];
if (FLAGS.has('--all')) {
  const addIfExists = (p) => {
    if (existsSync(p)) targetFiles.push(realpathSync(p));
  };

  // ① 技能自带资产：安装后依然存在
  addIfExists(resolve(SKILL_DIR, 'SKILL.md'));
  for (const sub of ['references', 'evals']) {
    const dir = resolve(SKILL_DIR, sub);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir)) {
      if (entry.endsWith('.md')) addIfExists(join(dir, entry));
    }
  }
  const tplDir = resolve(SKILL_DIR, 'assets', 'templates');
  if (existsSync(tplDir)) targetFiles.push(...findHtmlFiles(tplDir));

  // ② 仓库额外产物：仅在开发检出下存在，安装后自动跳过
  const exDir = resolve(REPO_DIR, 'examples');
  if (existsSync(exDir)) targetFiles.push(...findHtmlFiles(exDir));
  for (const doc of ['README.md', 'README.zh-CN.md', 'index.html', 'index.zh-CN.html']) {
    addIfExists(resolve(REPO_DIR, doc));
  }
} else {
  for (const a of PATH_ARGS) {
    const p = resolve(a);
    if (!existsSync(p)) {
      stderr.write(`❌ 找不到文件: ${a}\n`);
      exit(1);
    }
    try {
      targetFiles.push(realpathSync(p));
    } catch {
      targetFiles.push(p);
    }
  }
}

const uniqueFiles = Array.from(new Set(targetFiles)).sort();
if (uniqueFiles.length === 0) {
  stderr.write('未指定待校验的 HTML 文件。\n');
  exit(1);
}

/* ═══════════════════════════════════════════════════════════════
   1 · 通用工具
   ═══════════════════════════════════════════════════════════════ */

const lineAt = (text, index) => text.slice(0, index).split('\n').length;
const countOf = (text, needle) => text.split(needle).length - 1;

/** 把若干区间替换为等长空格（保留换行），用于"屏蔽后扫描"。 */
function blankRanges(text, ranges) {
  const chars = [...text];
  for (const [start, end] of ranges) {
    for (let i = start; i < end; i += 1) if (chars[i] !== '\n') chars[i] = ' ';
  }
  return chars.join('');
}

/** 从 `{` 出发做括号配对，返回匹配的 `}` 下标。 */
function matchBrace(text, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1;
    else if (text[i] === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * 找出 CSS 中所有选择器命中 selectorTest 的 `sel{...}` 区间。
 * 命中后整块跳过，因此 @media 这类嵌套块会被整体纳入。
 */
function cssBlockRanges(css, selectorTest) {
  const ranges = [];
  for (let i = 0; i < css.length; i += 1) {
    if (css[i] !== '{') continue;
    let start = i - 1;
    while (start >= 0 && !'{};'.includes(css[start])) start -= 1;
    const selector = css.slice(start + 1, i);
    if (!selectorTest(selector)) continue;
    const end = matchBrace(css, i);
    if (end === -1) continue;
    ranges.push([start + 1, end + 1]);
    i = end;
  }
  return ranges;
}

const TOKEN_SELECTOR = /:root|\[data-theme|prefers-color-scheme/;
const PRINT_SELECTOR = /@media\s+print/;

const STYLE_BLOCK_RE = /<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi;
const SCRIPT_BLOCK_RE = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
const SVG_BLOCK_RE = /<svg\b[\s\S]*?<\/svg>/gi;
const STYLE_ATTR_RE = /\sstyle\s*=\s*(["'])([\s\S]*?)\1/gi;

/** 一次解析出全文的结构分区，供各规则共享。 */
function analyze(rel, content) {
  const styles = [];
  const scripts = [];
  const svgs = [];
  let m;

  STYLE_BLOCK_RE.lastIndex = 0;
  while ((m = STYLE_BLOCK_RE.exec(content))) {
    styles.push({ text: m[1], start: m.index + m[0].indexOf(m[1]) });
  }
  SCRIPT_BLOCK_RE.lastIndex = 0;
  let scriptIndex = 0;
  while ((m = SCRIPT_BLOCK_RE.exec(content))) {
    scriptIndex += 1;
    if (!/\bsrc\s*=/i.test(m[0].slice(0, m[0].indexOf('>')))) {
      scripts.push({ text: m[1], start: m.index + m[0].indexOf(m[1]), index: scriptIndex });
    }
  }
  SVG_BLOCK_RE.lastIndex = 0;
  while ((m = SVG_BLOCK_RE.exec(content))) svgs.push({ text: m[0], start: m.index });

  // 颜色扫描目标：style 块内容（屏蔽 token/print 块）+ 行内 style 属性
  const colorTargets = [];
  for (const style of styles) {
    const masked = blankRanges(
      style.text,
      cssBlockRanges(style.text, (s) => TOKEN_SELECTOR.test(s) || PRINT_SELECTOR.test(s)),
    );
    colorTargets.push({ text: masked, offset: style.start });
  }
  STYLE_ATTR_RE.lastIndex = 0;
  while ((m = STYLE_ATTR_RE.exec(content))) {
    colorTargets.push({ text: m[2], offset: m.index + m[0].indexOf(m[2]) });
  }

  // 显式豁免：@lint-allow: RULE — 理由（理由须 ≥4 字符）
  // 作用域为「注释所在行 + 下一行」，因此可精确豁免单个声明，
  // 不会因为豁免一处而掩盖同一文件里其他真实的违规。
  const allows = [];
  const allowRe = /@lint-allow:\s*([A-Z_]+)\s*[—–:-]\s*(\S[^\n*]*?)\s*(?:\*\/|-->|\n|$)/g;
  while ((m = allowRe.exec(content))) {
    if (m[2].trim().length < 4) continue;
    allows.push({ rule: m[1], line: lineAt(content, m.index), reason: m[2].trim() });
  }
  const isAllowed = (ruleId, line) => allows.some((a) => a.rule === ruleId && (line === a.line || line === a.line + 1));

  return { rel, content, styles, scripts, svgs, colorTargets, allows, isAllowed };
}

/* ═══════════════════════════════════════════════════════════════
   2 · 规则注册表
   ═══════════════════════════════════════════════════════════════ */

const RULES = [];
/**
 * 注册一条规则。
 * @param scope 'html' 只跑 HTML 产物（默认）；'doc' 只跑 Markdown 规范文档；'any' 都跑
 */
const rule = (id, level, describe, run, scope = 'html') => RULES.push({ id, level, describe, run, scope });

/* ── 结构性硬门 ───────────────────────────────────────────────── */

rule('ZERO_CDN', 'error', '严禁外部 CDN / 远程字体（断网白屏与 CSP 拦截）', (ctx) => {
  const out = [];
  const patterns = [
    [/<script\b[^>]*\bsrc\s*=\s*["'](?:https?:)?\/\//gi, '外部 CDN Script'],
    [/<link\b[^>]*\bhref\s*=\s*["'](?:https?:)?\/\//gi, '外部 CDN 样式或字体'],
    [/@import\s+(?:url\()?["'](?:https?:)?\/\//gi, 'CSS 外部 @import'],
  ];
  for (const [re, label] of patterns) {
    for (const m of ctx.content.matchAll(re)) {
      out.push({ line: lineAt(ctx.content, m.index), message: `${label}: ${m[0].slice(0, 60)}` });
    }
  }
  return out;
});

rule('THEME_TOKENS', 'error', '必须具备 shadcn 风格 CSS 变量底座与暗黑模式', (ctx) => {
  const out = [];
  const required = ['--bg', '--card', '--primary', '--border'];
  // 必须匹配「声明」形式 `--x:`，否则 `--primary` 会被 `--primary-fg` 蒙混过关
  const missing = required.filter((v) => !new RegExp(`${v}\\s*:`).test(ctx.content));
  if (!ctx.content.includes(':root') || missing.length) {
    out.push({
      line: 1,
      message: `缺少核心 Micro-CSS 变量底座（需声明 ${missing.length ? missing.join(', ') : '--bg, --card, --primary, --border'}）`,
    });
  }
  if (!/data-theme\s*=\s*["']dark["']|prefers-color-scheme/.test(ctx.content)) {
    out.push({ line: 1, message: '未检测到暗黑模式支持（需 data-theme="dark" 或 prefers-color-scheme）' });
  }
  return out;
});

rule('VIEWPORT', 'error', '必须声明移动端响应式 viewport', (ctx) => {
  if (/name\s*=\s*["']viewport["']/i.test(ctx.content)) return [];
  return [{ line: 1, message: '缺少 <meta name="viewport">，小视口下渲染异常' }];
});

rule('TAG_HYGIENE', 'error', '关键双标签必须对称闭合', (ctx) => {
  const out = [];
  const lower = ctx.content.toLowerCase();
  for (const tag of ['svg', 'dialog', 'details', 'style', 'script', 'table', 'nav', 'aside']) {
    // `<tag` 不会命中 `</tag>`（`<` 之后是 `/`），可直接计数
    const open = countOf(lower, `<${tag}`);
    const close = countOf(lower, `</${tag}>`);
    if (open === 0 && close === 0) continue;
    if (open !== close) {
      out.push({ line: 1, message: `标签 <${tag}> 开闭不匹配：开 ${open} 个，闭 ${close} 个` });
    }
  }
  return out;
});

rule('DUP_ID', 'error', '同一文件内 id 必须唯一（否则 JS 取到的元素不确定）', (ctx) => {
  const out = [];
  const seen = new Map();
  for (const m of ctx.content.matchAll(/\sid\s*=\s*(["'])([^"']+)\1/g)) {
    const id = m[2];
    if (seen.has(id)) {
      out.push({ line: lineAt(ctx.content, m.index), message: `重复 id="${id}"（首次出现于第 ${seen.get(id)} 行）` });
    } else {
      seen.set(id, lineAt(ctx.content, m.index));
    }
  }
  return out;
});

rule('SCRIPT_SYNTAX', 'error', '内联脚本必须能通过语法编译（"没报错" ≠ "跑得起来"）', (ctx) => {
  const out = [];
  for (const script of ctx.scripts) {
    if (!script.text.trim()) continue;
    try {
      new vm.Script(script.text, { filename: `${ctx.rel}#script-${script.index}` });
    } catch (error) {
      out.push({ line: lineAt(ctx.content, script.start), message: `内联脚本 #${script.index} 语法错误：${error.message}` });
    }
  }
  return out;
});

rule('DARK_MODE_LEAK', 'error', '严禁在 token 块之外硬编码 #fff / #000（假暗黑模式）', (ctx) => {
  const out = [];
  const re = /#ffffff\b|#fff\b|#000000\b|#000\b|[:\s](?:white|black)(?=\s*[;}"'])/gi;
  for (const target of ctx.colorTargets) {
    for (const m of target.text.matchAll(re)) {
      out.push({
        line: lineAt(ctx.content, target.offset + m.index),
        message: `硬编码颜色 "${m[0].trim()}" 绕过 CSS 变量，暗黑模式下会失配。改用 var(--card-fg) / var(--primary-fg) / var(--card)`,
      });
    }
  }
  return out;
});

rule('WIDTH_HYGIENE', 'error', '含表格的页面必须提供横向滚动容器，避免窄容器挤压', (ctx) => {
  const out = [];
  if (!/<table\b/i.test(ctx.content)) return out;
  if (!/overflow-x\s*:\s*(?:auto|scroll)/i.test(ctx.content)) {
    out.push({ line: 1, message: '含 <table> 但没有 overflow-x:auto 的滚动容器，窄屏下表格会被挤压变形' });
  }
  const widths = [];
  for (const style of ctx.styles) {
    for (const m of style.text.matchAll(/max-width\s*:\s*(\d+)px/gi)) widths.push(Number(m[1]));
  }
  const maxWidth = widths.length ? Math.max(...widths) : 0;
  if (maxWidth > 0 && maxWidth < 1024) {
    out.push({ line: 1, message: `主容器最大宽度仅 ${maxWidth}px，宽屏下表格会被挤扁（建议 ≥1280px 或 width:100%）` });
  }
  return out;
});

/* ── 行为与数据契约 ───────────────────────────────────────────── */

rule('NO_RANDOM', 'warn', '演示/图形数据必须确定，禁用 Math.random()', (ctx) => {
  const out = [];
  for (const script of ctx.scripts) {
    for (const m of script.text.matchAll(/Math\.random\s*\(/g)) {
      out.push({
        line: lineAt(ctx.content, script.start + m.index),
        message: '检测到 Math.random()。演示数据请改用确定性伪随机；若确为生成唯一 ID，加 `@lint-allow: NO_RANDOM — 理由`',
      });
    }
  }
  return out;
});

// #fff / #000 属于 DARK_MODE_LEAK 的辖区（且它是阻断级）。这里跳过，
// 否则同一个缺陷会被两条规则各报一次，噪音掩盖真信号。
const DARK_LEAK_HEX = /^#(?:fff|ffffff|000|000000)$/i;

rule('CHART_TOKEN_ONLY', 'warn', 'SVG 图形颜色必须取自 CSS 变量，才能跟随暗黑模式', (ctx) => {
  const out = [];
  for (const svg of ctx.svgs) {
    for (const m of svg.text.matchAll(/\b(?:fill|stroke|stop-color|flood-color)\s*=\s*["'](#[0-9a-fA-F]{3,8})["']/g)) {
      if (DARK_LEAK_HEX.test(m[1])) continue;
      out.push({
        line: lineAt(ctx.content, svg.start + m.index),
        message: `SVG 硬编码色值 ${m[1]}，应改用 var(--primary) / var(--muted-fg) / currentColor`,
      });
    }
  }
  return out;
});

rule('FIXED_HEIGHT', 'warn', '禁止固定像素高度 + overflow:hidden 截断内容', (ctx) => {
  const out = [];
  for (const style of ctx.styles) {
    for (let i = 0; i < style.text.length; i += 1) {
      if (style.text[i] !== '{') continue;
      let start = i - 1;
      while (start >= 0 && !'{};'.includes(style.text[start])) start -= 1;
      const selector = style.text.slice(start + 1, i);
      const end = matchBrace(style.text, i);
      if (end === -1) continue;
      const body = style.text.slice(i + 1, end);
      i = end;
      if (!/height\s*:\s*\d{3,}px/i.test(body)) continue;
      if (!/overflow\s*:\s*hidden/i.test(body)) continue;
      if (/svg|canvas|pre|code|table-wrap|scroll/i.test(selector)) continue;
      out.push({
        line: lineAt(ctx.content, style.start + start),
        message: `"${selector.trim().slice(0, 40)}" 同时使用固定像素高度与 overflow:hidden，不同字号/平台上内容会被切断`,
      });
    }
  }
  return out;
});

rule('PRINT_STYLE', 'warn', '文档型页面应提供 @media print 样式（导出 PDF 用）', (ctx) => {
  const name = basename(ctx.rel).replace(/\.html?$/i, '');
  // 落地页/组件画廊的用途是屏幕浏览，不产生打印交付，不适用本规则
  if (/^index(\.|$)/i.test(name)) return [];
  const docLike = /^(?:report|compare|timeline)/i.test(name);
  if (/@media\s+print/.test(ctx.content)) return [];
  return [{
    line: 1,
    message: `缺少 @media print 样式，导出 PDF 时按钮/操作栏会一并打印${docLike ? '（文档型母版，必须补）' : ''}`,
  }];
});

rule('EMPTY_STATE', 'warn', '实现筛选/搜索的页面必须同时实现空状态', (ctx) => {
  const scripts = ctx.scripts.map((s) => s.text).join('\n');
  const hasFilter = /addEventListener\(\s*['"]input['"]/.test(scripts) || /\.filter\s*\(/.test(scripts);
  if (!hasFilter) return [];
  const hasEmptyState = /暂无|没有匹配|无匹配|未找到|no results|No matching|empty-?state|notFound/i.test(ctx.content);
  if (hasEmptyState) return [];
  return [{ line: 1, message: '实现了筛选/搜索，但没有空状态提示：搜索无结果时用户会看到一片空白' }];
});

rule('CSS_VAR_DEFINED', 'error', 'var(--x) 引用的变量必须在同文件内定义（单文件零依赖下没有外部来源）', (ctx) => {
  const defined = new Set();
  for (const m of ctx.content.matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(m[1]);
  const out = [];
  const seen = new Set();
  for (const target of ctx.colorTargets) {
    // 只查没有 fallback 的 var()：var(--x, #fff) 有兜底，最坏是颜色不对，不会整条属性失效
    for (const m of target.text.matchAll(/var\(\s*(--[a-z0-9-]+)\s*\)/gi)) {
      const name = m[1];
      if (defined.has(name) || seen.has(name)) continue;
      seen.add(name);
      out.push({
        line: lineAt(ctx.content, target.offset + m.index),
        message: `var(${name}) 未在本文件内定义且没有 fallback——该属性会整体失效（例如 stroke 变成 none，线直接不可见）`,
      });
    }
  }
  return out;
});

rule('MIN_FONT', 'warn', 'SVG 内字号不得低于 9px（装不下就改 hover 出，不许缩小字号硬塞）', (ctx) => {
  const out = [];
  const seen = new Set();
  for (const svg of ctx.svgs) {
    for (const m of svg.text.matchAll(/font-size\s*[=:]\s*["']?([\d.]+)/gi)) {
      const size = Number(m[1]);
      if (!Number.isFinite(size) || size >= 9) continue;
      const line = lineAt(ctx.content, svg.start + m.index);
      if (seen.has(line)) continue;
      seen.add(line);
      out.push({
        line,
        message: `SVG 字号 ${size}px 低于 9px 下限，读者无法辨认——装不下应改为 hover 显示，而不是缩小字号硬塞`,
      });
    }
  }
  return out;
});

rule('AFFORDANCE', 'warn', '必须提供复制/导出出口（杜绝交互死胡同）', (ctx) => {
  if (/clipboard|copy|export|print|复制|导出/i.test(ctx.content)) return [];
  return [{ line: 1, message: '未检测到复制或导出出口，用户的页面操作无法带回 Agent 闭环' }];
});

rule('COLOPHON', 'warn', '建议提供页脚溯源元数据印章', (ctx) => {
  if (/colophon|generated by|时间戳|归档/i.test(ctx.content)) return [];
  return [{ line: 1, message: '未检测到页脚 Colophon 溯源印章（生成时间 / 上下文标识）' }];
});

/* ── 规范文档完整性 ────────────────────────────────────────────
   文档损坏的代价比 HTML 报错更高：Agent 会照着读错的规范干活。 */

rule('DOC_FENCES', 'error', 'Markdown 代码围栏必须配对（未闭合会让后续全文变成代码块）', (ctx) => {
  const fences = ctx.content.split('\n').filter((l) => /^```/.test(l)).length;
  if (fences % 2 === 0) return [];
  return [{ line: 1, message: `代码围栏数为奇数（${fences} 个），文档中存在未闭合的 \`\`\` 代码块` }];
}, 'doc');

rule('DOC_SECTIONS', 'warn', '文档章节编号不应重复或缺号', (ctx) => {
  const CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const out = [];

  /** 扫描一种编号写法，返回按出现顺序排列的 [{ key, line, index }] 并顺手报重复。 */
  const scan = (re, toIndex) => {
    const seen = new Map();
    for (const m of ctx.content.matchAll(re)) {
      const key = m[1];
      const line = lineAt(ctx.content, m.index);
      if (seen.has(key)) {
        out.push({ line, message: `章节编号「${key}」重复（首次出现于第 ${seen.get(key).line} 行）` });
      } else {
        seen.set(key, { key, line, index: toIndex(key) });
      }
    }
    return [...seen.values()].sort((a, b) => a.line - b.line);
  };

  const sequences = [
    { seq: scan(/^##\s+([零一二三四五六七八九十]+)、/gm, (k) => CN.indexOf(k)), suffix: '、' },
    { seq: scan(/^##\s+(\d+)\./gm, Number), suffix: '.' },
  ];

  for (const { seq, suffix } of sequences) {
    for (let i = 0; i < seq.length - 1; i += 1) {
      if (seq[i + 1].index - seq[i].index > 1) {
        out.push({
          line: seq[i + 1].line,
          message: `章节编号跳号：从「${seq[i].key}${suffix}」直接跳到「${seq[i + 1].key}${suffix}」，中间缺 ${seq[i + 1].index - seq[i].index - 1} 节`,
        });
      }
    }
  }
  return out;
}, 'doc');

/* ═══════════════════════════════════════════════════════════════
   3 · 跨文件中英同构检查
   ═══════════════════════════════════════════════════════════════ */

const FEATURE_KEYS = [
  ['section', /<section\b/gi],
  ['details', /<details\b/gi],
  ['nav', /<nav\b/gi],
  ['aside', /<aside\b/gi],
  ['table', /<table\b/gi],
  ['dialog', /<dialog\b/gi],
];

const FEATURE_LABEL = {
  section: '章节 <section>',
  details: '折叠块 <details>',
  nav: '导航 <nav>',
  aside: '侧栏 <aside>',
  table: '表格 <table>',
  dialog: '弹窗 <dialog>',
};

function featureInventory(content) {
  const inv = {};
  for (const [key, re] of FEATURE_KEYS) inv[key] = (content.match(re) || []).length;
  return inv;
}

function affordanceIds(content) {
  const ids = new Set();
  for (const m of content.matchAll(/\sid\s*=\s*(["'])([^"']*?(?:copy|export)[^"']*)\1/gi)) ids.add(m[2]);
  return ids;
}

function checkPairParity(entries) {
  const findings = [];
  const byName = new Map();
  for (const entry of entries) {
    const dir = basename(dirname(entry.file));
    if (dir !== 'zh' && dir !== 'en') continue;
    const key = basename(entry.file).replace(/\.html?$/i, '');
    if (!byName.has(key)) byName.set(key, {});
    byName.get(key)[dir] = entry;
  }

  for (const [name, pair] of byName) {
    if (!pair.zh || !pair.en) continue;
    const zhInv = featureInventory(pair.zh.content);
    const enInv = featureInventory(pair.en.content);

    for (const [key] of FEATURE_KEYS) {
      if (zhInv[key] > 0 && enInv[key] === 0) {
        findings.push({
          rel: `zh|en/${name}.html`,
          rule: 'ZH_EN_PARITY',
          level: 'error',
          line: 1,
          message: `中文版有 ${zhInv[key]} 个${FEATURE_LABEL[key]}，英文版一个都没有——英文母版结构残缺`,
        });
      } else if (zhInv[key] > enInv[key] + 1) {
        findings.push({
          rel: `zh|en/${name}.html`,
          rule: 'ZH_EN_PARITY',
          level: 'warn',
          line: 1,
          message: `${FEATURE_LABEL[key]}数量不一致：中文 ${zhInv[key]} 个，英文 ${enInv[key]} 个`,
        });
      }
    }

    const zhIds = affordanceIds(pair.zh.content);
    const enIds = affordanceIds(pair.en.content);
    if (zhIds.size && enIds.size) {
      const zhOnly = [...zhIds].filter((i) => !enIds.has(i));
      const enOnly = [...enIds].filter((i) => !zhIds.has(i));
      if (zhOnly.length && enOnly.length) {
        findings.push({
          rel: `zh|en/${name}.html`,
          rule: 'ZH_EN_PARITY',
          level: 'warn',
          line: 1,
          message: `同一功能的导出按钮 id 不一致：中文 ${zhOnly.join(', ')} vs 英文 ${enOnly.join(', ')}`,
        });
      }
    }
  }
  return findings;
}

/**
 * 文档代码样例的 token 覆盖率检查。
 *
 * 这是「文档与文档之间」的一致性：`SKILL.md` 的 ```css 块定义了 Agent 会
 * 复制进每个产物的 Micro-CSS 基座；其余文档（如 references/components.md）
 * 里的 ```html 样例会引用 `var(--x)`。若某个变量只有画廊页定义了、基座里
 * 没有，那么「照文档搭基座 + 照样例抄组件」的 Agent 会得到一条失效的属性。
 * 单文件零依赖下没有外部样式表可救，所以这一定是缺陷。
 */
function checkDocTokenCoverage(entries) {
  const findings = [];
  const skill = entries.find((e) => /SKILL\.md$/.test(e.file));
  if (!skill) return findings;

  const cssBlock = skill.content.match(/```css([\s\S]*?)```/);
  if (!cssBlock) return findings;

  const defined = new Set();
  for (const m of cssBlock[1].matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(m[1]);

  for (const entry of entries) {
    if (!/\.md$/i.test(entry.file)) continue;
    if (/SKILL\.md$/.test(entry.file)) continue; // SKILL.md 自己就是基座正本

    for (const block of entry.content.matchAll(/```html([\s\S]*?)```/g)) {
      const offset = block.index + block[0].indexOf(block[1]);
      const seen = new Set();
      for (const m of block[1].matchAll(/var\(\s*(--[a-z0-9-]+)\s*\)/gi)) {
        const name = m[1];
        if (defined.has(name) || seen.has(name)) continue;
        seen.add(name);
        findings.push({
          rel: displayPath(entry.file),
          rule: 'DOC_TOKEN_COVERAGE',
          level: 'error',
          line: lineAt(entry.content, offset + m.index),
          message: `代码样例引用了 var(${name})，但文档承诺的 Micro-CSS 基座（SKILL.md 的 \`\`\`css 块）未定义它——照抄这段样例的 Agent 会得到一条失效的属性（如 stroke 变 none，图形不可见）`,
        });
      }
    }
  }
  return findings;
}

/* ═══════════════════════════════════════════════════════════════
   4 · 执行
   ═══════════════════════════════════════════════════════════════ */

const entries = uniqueFiles.map((file) => ({ file, content: readFileSync(file, 'utf8') }));
const report = [];

for (const entry of entries) {
  const ctx = analyze(displayPath(entry.file), entry.content);
  const perFile = [];
  const isDoc = /\.md$/i.test(entry.file);
  for (const { id, level, run, scope } of RULES) {
    if (scope === 'html' && isDoc) continue;
    if (scope === 'doc' && !isDoc) continue;
    let hits = [];
    try {
      hits = run(ctx) || [];
    } catch (error) {
      hits = [{ line: 1, message: `规则执行异常：${error.message}` }];
    }
    for (const hit of hits) {
      if (ctx.isAllowed(id, hit.line)) continue;
      perFile.push({ rule: id, level, line: hit.line, message: hit.message });
    }
  }
  report.push({ file: entry.file, rel: ctx.rel, findings: perFile });
}

const crossFindings = [...checkPairParity(entries), ...checkDocTokenCoverage(entries)];
const ruleHits = new Map();
for (const item of report) {
  for (const f of item.findings) ruleHits.set(f.rule, (ruleHits.get(f.rule) || 0) + 1);
}
for (const f of crossFindings) ruleHits.set(f.rule, (ruleHits.get(f.rule) || 0) + 1);

const totalErrors = report.reduce((n, r) => n + r.findings.filter((f) => f.level === 'error').length, 0)
  + crossFindings.filter((f) => f.level === 'error').length;
const totalWarnings = report.reduce((n, r) => n + r.findings.filter((f) => f.level === 'warn').length, 0)
  + crossFindings.filter((f) => f.level === 'warn').length;

/* ═══════════════════════════════════════════════════════════════
   5 · 输出
   ═══════════════════════════════════════════════════════════════ */

if (AS_JSON) {
  stdout.write(`${JSON.stringify({
    files: report.length,
    errors: totalErrors,
    warnings: totalWarnings,
    ruleHits: Object.fromEntries([...ruleHits].sort()),
    results: report.map((r) => ({ file: r.rel, findings: r.findings })),
    crossFile: crossFindings,
  }, null, 2)}\n`);
  exit(totalErrors === 0 ? 0 : 1);
}

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

stdout.write(`\n🔍 Agent HTML 静态自验 · ${report.length} 个文件 · ${RULES.length} 条规则\n\n`);

for (const item of report) {
  const errors = item.findings.filter((f) => f.level === 'error');
  const warnings = item.findings.filter((f) => f.level === 'warn');
  if (!errors.length && !warnings.length) {
    stdout.write(`  ✅ ${C.green('PASS')}  ${item.rel}\n`);
    continue;
  }
  const tag = errors.length ? C.red('FAIL') : C.yellow('WARN');
  stdout.write(`  ${errors.length ? '❌' : '⚠️ '} ${tag}  ${item.rel}  ${C.dim(`(${errors.length} 阻断 / ${warnings.length} 提醒)`)}\n`);
  for (const f of [...errors, ...warnings]) {
    const mark = f.level === 'error' ? C.red('[阻断]') : C.yellow('[提醒]');
    stdout.write(`        ${mark} ${C.dim(`[${f.rule}]`)} L${f.line} ${f.message}\n`);
  }
}

if (crossFindings.length) {
  stdout.write(`\n  🔀 跨文件检查\n`);
  for (const f of crossFindings) {
    const mark = f.level === 'error' ? C.red('[阻断]') : C.yellow('[提醒]');
    stdout.write(`        ${mark} ${C.dim(`[${f.rule}]`)} ${f.rel} ${f.message}\n`);
  }
}

stdout.write(`\n${'─'.repeat(64)}\n`);
if (ruleHits.size) {
  stdout.write('规则命中分布：\n');
  for (const [id, n] of [...ruleHits].sort((a, b) => b[1] - a[1])) {
    stdout.write(`  ${String(n).padStart(3)}  ${id}\n`);
  }
  stdout.write(`${'─'.repeat(64)}\n`);
}

if (totalErrors === 0) {
  stdout.write(`🎉 校验通过：0 项阻断，${totalWarnings} 项提醒。\n\n`);
  exit(0);
}
stdout.write(`🚨 校验未通过：${totalErrors} 项阻断，${totalWarnings} 项提醒。\n\n`);
exit(1);

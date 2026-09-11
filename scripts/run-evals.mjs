#!/usr/bin/env node
/**
 * scripts/run-evals.mjs
 *
 * agent-html 技能评测运行器
 * ────────────────────────────────────────────────────────────────
 * 解决一个问题：**改完 skill，你怎么知道是改好了还是改坏了？**
 *
 * 对 evals/evals.json 里的每个用例，分别跑「带技能」和「不带技能」两条线，
 * 收集产物，用两把尺子打分：
 *
 *   1. 机器尺 —— expectations 里带 `check` 的条目，正则/门禁判定，零 Token、可复现；
 *   2. 人眼尺 —— 标了 `level: "human"` 的条目，记为待判定，由人看截图下结论
 *      （F-015 证明过：门禁全绿也可能图是错的，机器尺覆盖不了这一类）。
 *
 * 产出 <workspace>/iteration-N/benchmark.md —— 一张通过率对照表。
 *
 * ⚠️ 这是**维护者工具**，不是技能资产：它不随技能分发，Agent 也不需要它。
 *    （这条区分来自 references/failures.md F-016。）
 *
 * 用法：
 *   node scripts/run-evals.mjs                       # 干跑：只列计划，不调 agent
 *   node scripts/run-evals.mjs --score-only          # 只对已有产物评分（不调 agent）
 *   node scripts/run-evals.mjs --eval 1 --eval 3     # 只跑指定用例
 *   node scripts/run-evals.mjs --skill <path>        # 指定技能路径
 *   node scripts/run-evals.mjs --agent-cmd "<cmd>"    # 显式点名 agent（读 stdin）后才真正生成
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exit, argv, stdout, stderr } from 'node:process';

const SELF_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(SELF_DIR, '..');
const SKILL_DIR = resolve(REPO_DIR, 'skills', 'agent-html');
const EVALS_FILE = resolve(SKILL_DIR, 'evals', 'evals.json');

/* ── 参数 ──────────────────────────────────────────────────────── */
const args = argv.slice(2);
const flag = (name) => args.includes(name);
const valueOf = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const valuesOf = (name) => {
  const out = [];
  args.forEach((a, i) => { if (a === name && args[i + 1]) out.push(args[i + 1]); });
  return out;
};

const SCORE_ONLY = flag('--score-only');
const ONLY = valuesOf('--eval').map(Number);
const WORKSPACE = resolve(valueOf('--workspace', join(REPO_DIR, 'agent-html-workspace')));
// 本工具**不预设任何 agent 产品**。生成产物会让你本机某个 CLI 真的跑起来、
// 真的消耗额度，那必须由使用者显式点名，不能由脚本替他决定。
const AGENT_CMD = valueOf('--agent-cmd', process.env.EVAL_AGENT_CMD || null);
const TIMEOUT_MS = Number(valueOf('--timeout', '600000'));

if (flag('-h') || flag('--help')) {
  stdout.write(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^\/\*\*?/, ''));
  exit(0);
}

if (!existsSync(EVALS_FILE)) {
  stderr.write(`❌ 找不到评测集：${EVALS_FILE}\n`);
  exit(1);
}
const evalsDoc = JSON.parse(readFileSync(EVALS_FILE, 'utf8'));
const DEFAULTS = evalsDoc.defaults || [];
const EVALS = evalsDoc.evals.filter((e) => !ONLY.length || ONLY.includes(e.id));

if (!EVALS.length) {
  stderr.write('❌ 没有匹配的用例。\n');
  exit(1);
}

/* ── 评测集预校验 ──────────────────────────────────────────────
   正则写错的话，等到跑完 agent 才炸就太浪费了（agent 调用是真金白银）。
   加载时先编译一遍所有 pattern，有问题立刻报出来。 */
{
  const problems = [];
  const checkList = (list, where) => {
    for (const e of list) {
      if (!e.pattern) continue;
      try { new RegExp(e.pattern, 'gi'); } catch (err) { problems.push(`${where}：/${e.pattern}/ → ${err.message}`); }
      if (!['has', 'count', 'absent'].includes(e.check)) {
        problems.push(`${where}：带 pattern 但 check 不是 has/count/absent（当前 "${e.check}"）`);
      }
    }
  };
  checkList(DEFAULTS, 'defaults');
  for (const ev of EVALS) checkList(ev.expectations || [], `eval ${ev.id}`);
  if (problems.length) {
    stderr.write(`❌ 评测集里有 ${problems.length} 处问题，先修好再跑：\n`);
    for (const p of problems) stderr.write(`   - ${p}\n`);
    exit(1);
  }
}

/* ── 干跑：没指定 agent 就只列计划，绝不擅自调用 ──────────────── */
if (!SCORE_ONLY && !AGENT_CMD) {
  stdout.write(`
⚠️  未指定 --agent-cmd，本次只做**干跑**：只列出将要生成的用例与目标路径，
   不会调用任何外部 agent。

   本工具不会替你挑一个 agent 产品来跑——那会消耗你可能并不想动用的额度。
   要真正生成，请显式点名，例如：

     node scripts/run-evals.mjs --agent-cmd "claude -p --permission-mode acceptEdits"
     node scripts/run-evals.mjs --agent-cmd "codex exec"
     node scripts/run-evals.mjs --agent-cmd "your-agent"     # 从 stdin 读 prompt

   约定：命令从 **stdin** 读取完整 prompt，并在**当前工作目录**（outputs/）下写产物。
   注意有些 CLI 默认跑在「计划模式」，只写计划不落地文件，需要显式给写文件权限。

   只对已有产物评分（不调任何 agent）：  node scripts/run-evals.mjs --score-only

   将生成以下用例：

`);
  for (const ev of EVALS) {
    const name = ev.name || `eval-${ev.id}`;
    const n = DEFAULTS.length + (ev.expectations || []).length;
    const human = [...DEFAULTS, ...(ev.expectations || [])].filter((e) => e.level === 'human').length;
    stdout.write(`   #${ev.id} ${name.padEnd(28)} ${n} 条判定（其中 ${human} 条需人眼）\n`);
    stdout.write(`        with_skill    → <workspace>/iteration-N/${String(ev.id).padStart(2, '0')}-${name}/with_skill/outputs/\n`);
    stdout.write(`        without_skill → <workspace>/iteration-N/${String(ev.id).padStart(2, '0')}-${name}/without_skill/outputs/\n`);
  }
  stdout.write('\n');
  exit(0);
}

/* ── 迭代目录 ──────────────────────────────────────────────────── */
function existingIterations() {
  if (!existsSync(WORKSPACE)) return [];
  return readdirSync(WORKSPACE)
    .map((n) => /^iteration-(\d+)$/.exec(n))
    .filter(Boolean)
    .map((m) => Number(m[1]))
    .sort((a, b) => a - b);
}

/** 这个迭代目录里有没有真正的产物（失败或中断的运行会留下空壳目录）。 */
function hasRuns(dir) {
  if (!existsSync(dir)) return false;
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .some((e) => existsSync(join(dir, e.name, 'with_skill', 'outputs'))
      || existsSync(join(dir, e.name, 'without_skill', 'outputs')));
}

function resolveIteration() {
  if (flag('--iteration')) {
    const n = valueOf('--iteration');
    return { n: Number(n), dir: join(WORKSPACE, `iteration-${n}`) };
  }
  const used = existingIterations();
  // 只评分时：从最新往回找，落在第一个**真正含产物**的迭代上，
  // 免得被上一次失败运行留下的空壳目录骗到。
  if (SCORE_ONLY) {
    for (let i = used.length - 1; i >= 0; i -= 1) {
      const dir = join(WORKSPACE, `iteration-${used[i]}`);
      if (hasRuns(dir)) return { n: used[i], dir };
    }
    stderr.write(`❌ --score-only 在 ${WORKSPACE} 下找不到任何含产物的 iteration-N 目录。\n`);
    exit(1);
  }
  const n = used.length ? used[used.length - 1] + 1 : 1;
  return { n, dir: join(WORKSPACE, `iteration-${n}`) };
}

const ITERATION = resolveIteration();

/* ── 生成：调 agent ────────────────────────────────────────────── */
const PROMPT_WITH_SKILL = (task, outPath) => `${task}

---
请先完整阅读并严格遵循这个技能规范，再动手：
${join(SKILL_DIR, 'SKILL.md')}

（该技能引用的其它文件都相对它所在目录解析，例如 ${join(SKILL_DIR, 'references', 'components.md')}。）

要求：把最终产物写成**单个自包含 HTML 文件**，保存到：
${outPath}

完成后只回复该文件路径，不要输出 HTML 源码本身。`;

const PROMPT_WITHOUT_SKILL = (task, outPath) => `${task}

要求：把最终产物写成**单个自包含 HTML 文件**，保存到：
${outPath}

完成后只回复该文件路径，不要输出 HTML 源码本身。`;

function generate(runDir, prompt) {
  const outDir = join(runDir, 'outputs');
  mkdirSync(outDir, { recursive: true });
  const started = Date.now();

  const run = spawnSync('bash', ['-lc', AGENT_CMD], {
    input: prompt,
    cwd: outDir,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    timeout: TIMEOUT_MS,
  });

  // stdout 一定要落盘：agent「跑了但没写文件」时，它是唯一的线索
  const agentOut = `${run.stdout || ''}\n\n--- stderr ---\n${run.stderr || ''}`;
  writeFileSync(join(runDir, 'agent-output.txt'), agentOut, 'utf8');
  const produced = findHtml(outDir).length;

  const meta = {
    cmd: AGENT_CMD,
    exit_code: run.status,
    duration_ms: Date.now() - started,
    artifacts_found: produced,
    stderr_tail: (run.stderr || '').slice(-1200),
  };
  writeFileSync(join(runDir, 'timing.json'), `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
  return meta;
}

/* ── 产物定位 ──────────────────────────────────────────────────── */
function findHtml(dir) {
  if (!existsSync(dir)) return [];
  let out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(findHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** 取最大的那个 HTML 作为主产物（agent 可能顺手写几个中间文件）。 */
function pickArtifact(runDir) {
  const files = findHtml(join(runDir, 'outputs'))
    .map((f) => ({ f, size: statSync(f).size }))
    .sort((a, b) => b.size - a.size);
  return files.length ? files[0].f : null;
}

/* ── 机器尺 ────────────────────────────────────────────────────── */
const VALIDATOR = resolve(SKILL_DIR, 'scripts', 'validate.mjs');
const SMOKE = resolve(SKILL_DIR, 'scripts', 'smoke.mjs');

function gateCounts(file) {
  const run = spawnSync('node', [VALIDATOR, file, '--json'], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  try {
    const parsed = JSON.parse(run.stdout);
    return { errors: parsed.errors, warnings: parsed.warnings, rules: parsed.ruleHits || {} };
  } catch {
    return null;
  }
}

function smokeOk(file) {
  const run = spawnSync('node', [SMOKE, file], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 120000 });
  return { ok: run.status === 0, skipped: run.status === 2, out: (run.stdout || '').slice(-400) };
}

const CDN_RE = /<script\b[^>]*\bsrc\s*=\s*["'](?:https?:)?\/\/|<link\b[^>]*\bhref\s*=\s*["'](?:https?:)?\/\/|@import\s+(?:url\()?["'](?:https?:)?\/\//i;

function evaluateExpectation(exp, ctx) {
  const { content, file } = ctx;
  if (!content) return { text: exp.text, passed: false, evidence: '未找到产物文件' };

  switch (exp.check) {
    case 'no_cdn': {
      const hit = CDN_RE.exec(content);
      return { text: exp.text, passed: !hit, evidence: hit ? `发现外部引用：${hit[0].slice(0, 60)}` : '无任何外部引用' };
    }
    case 'has':
    case 'count': {
      const re = new RegExp(exp.pattern, 'gi');
      const n = (content.match(re) || []).length;
      const min = exp.check === 'count' ? (exp.min ?? 1) : (exp.min ?? 1);
      return {
        text: exp.text,
        passed: n >= min,
        evidence: `匹配 ${n} 处（要求 ≥${min}） /${exp.pattern}/`,
      };
    }
    case 'absent': {
      const re = new RegExp(exp.pattern, 'i');
      const hit = re.test(content);
      return { text: exp.text, passed: !hit, evidence: hit ? `不应出现但命中了 /${exp.pattern}/` : '未命中' };
    }
    case 'validate_clean': {
      const g = gateCounts(file);
      if (!g) return { text: exp.text, passed: false, evidence: '门禁执行失败' };
      const rules = Object.keys(g.rules);
      return {
        text: exp.text,
        passed: g.errors === 0,
        evidence: g.errors === 0
          ? `0 阻断 / ${g.warnings} 提醒${rules.length ? `（命中：${rules.join(', ')}）` : ''}`
          : `${g.errors} 项阻断：${rules.filter((r) => r !== 'ZH_EN_PARITY').join(', ') || '见门禁输出'}`,
      };
    }
    case 'smoke_clean': {
      const s = smokeOk(file);
      return {
        text: exp.text,
        passed: s.ok,
        evidence: s.skipped ? '环境无 Chrome，跳过（不计入失败）' : s.ok ? '渲染通过' : '渲染失败',
      };
    }
    default:
      return { text: exp.text, passed: null, evidence: '未知 check 类型，需人工判定' };
  }
}

function scoreRun(runDir, expectations) {
  const file = pickArtifact(runDir);
  const content = file ? readFileSync(file, 'utf8') : null;
  const results = expectations.map((exp) => {
    if (exp.level === 'human' || !exp.check) {
      return { text: exp.text, passed: null, evidence: '需人工判定（看截图）' };
    }
    return evaluateExpectation(exp, { content, file });
  });

  const graded = results.filter((r) => r.passed !== null);
  const summary = {
    passed: graded.filter((r) => r.passed).length,
    failed: graded.filter((r) => !r.passed).length,
    human_pending: results.filter((r) => r.passed === null).length,
    pass_rate: graded.length ? graded.filter((r) => r.passed).length / graded.length : 0,
  };

  const gates = file ? gateCounts(file) : null;
  writeFileSync(join(runDir, 'grading.json'), `${JSON.stringify({
    artifact: file ? relative(runDir, file) : null,
    expectations: results,
    summary,
    gates: gates ? { errors: gates.errors, warnings: gates.warnings, rules: gates.rules } : null,
  }, null, 2)}\n`, 'utf8');

  return { results, summary, gates, artifact: file };
}

/* ── 主流程 ────────────────────────────────────────────────────── */
mkdirSync(ITERATION.dir, { recursive: true });
stdout.write(`\n🧪 agent-html 技能评测 · iteration-${ITERATION.n} · ${EVALS.length} 个用例\n`);
stdout.write(`   技能：${SKILL_DIR}\n`);
stdout.write(`   工作区：${ITERATION.dir}\n`);
if (!SCORE_ONLY) stdout.write(`   生成命令：${AGENT_CMD}（prompt 走 stdin）\n`);
stdout.write('\n');

const rows = [];

for (const ev of EVALS) {
  const name = ev.name || `eval-${ev.id}`;
  const expectations = [...DEFAULTS, ...(ev.expectations || [])];
  const row = { id: ev.id, name, prompt: ev.prompt };

  for (const arm of ['with_skill', 'without_skill']) {
    const runDir = join(ITERATION.dir, `${String(ev.id).padStart(2, '0')}-${name}`, arm);

    if (!SCORE_ONLY) {
      stdout.write(`  ▶ #${ev.id} ${name} · ${arm} … `);
      const prompt = arm === 'with_skill'
        ? PROMPT_WITH_SKILL(ev.prompt, join(runDir, 'outputs', 'artifact.html'))
        : PROMPT_WITHOUT_SKILL(ev.prompt, join(runDir, 'outputs', 'artifact.html'));
      const meta = generate(runDir, prompt);
      if (meta.artifacts_found === 0) {
        stdout.write(`⚠️  未产出文件（exit ${meta.exit_code}）——见 agent-output.txt\n`);
      } else {
        stdout.write(`已生成 ${meta.artifacts_found} 个文件\n`);
      }
    }

    row[arm] = scoreRun(runDir, expectations);
  }

  const w = row.with_skill.summary;
  const wo = row.without_skill.summary;
  stdout.write(`  ✅ #${ev.id} ${name}：带技能 ${w.passed}/${w.passed + w.failed}，不带 ${wo.passed}/${wo.passed + wo.failed}\n`);
  rows.push(row);
}

/* ── 汇总 ──────────────────────────────────────────────────────── */
const agg = (arm, key) => {
  const vals = rows.map((r) => r[arm].summary[key]);
  const mean = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
  const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / (vals.length || 1));
  return { mean, sd, vals };
};

const benchmark = {
  skill: evalsDoc.skill_name,
  iteration: ITERATION.n,
  workspace: relative(REPO_DIR, ITERATION.dir),
  generated_at: new Date().toISOString(),
  agent_cmd: SCORE_ONLY ? null : AGENT_CMD,
  totals: {
    with_skill: { pass_rate: agg('with_skill', 'pass_rate').mean, ...agg('with_skill', 'pass_rate') },
    without_skill: { pass_rate: agg('without_skill', 'pass_rate').mean, ...agg('without_skill', 'pass_rate') },
  },
  evals: rows.map((r) => ({
    id: r.id,
    name: r.name,
    with_skill: r.with_skill.summary,
    without_skill: r.without_skill.summary,
    gates: { with_skill: r.with_skill.gates, without_skill: r.without_skill.gates },
  })),
};

writeFileSync(join(ITERATION.dir, 'benchmark.json'), `${JSON.stringify(benchmark, null, 2)}\n`, 'utf8');

const pct = (x) => `${Math.round(x * 100)}%`;
const cell = (r, arm) => {
  const s = r[arm].summary;
  const tot = s.passed + s.failed;
  return `${s.passed}/${tot} (${pct(s.pass_rate)})`;
};

const md = [];
md.push(`# agent-html 技能评测 · iteration-${ITERATION.n}`);
md.push('');
md.push(`- 生成命令：${SCORE_ONLY ? '（未生成，仅评分）' : `\`${AGENT_CMD}\``}`);
md.push(`- 用例数：${rows.length}`);
md.push(`- 评分口径：机器判定条目；标 \`level: human\` 的条目需人眼看截图`);
md.push('');
md.push('## 通过率对照');
md.push('');
md.push('| # | 用例 | 带技能 | 不带技能 | Δ |');
md.push('|---|---|---|---|---|');
for (const r of rows) {
  const w = r.with_skill.summary.pass_rate;
  const wo = r.without_skill.summary.pass_rate;
  const d = w - wo;
  md.push(`| ${r.id} | ${r.name} | ${cell(r, 'with_skill')} | ${cell(r, 'without_skill')} | ${d >= 0 ? '+' : ''}${Math.round(d * 100)}pt |`);
}
const tw = agg('with_skill', 'pass_rate');
const two = agg('without_skill', 'pass_rate');
md.push(`| | **平均** | **${pct(tw.mean)}** ±${pct(tw.sd)} | ${pct(two.mean)} ±${pct(two.sd)} | **${tw.mean - two.mean >= 0 ? '+' : ''}${Math.round((tw.mean - two.mean) * 100)}pt** |`);
md.push('');
md.push('## 静态门禁（阻断 / 提醒）');
md.push('');
md.push('| # | 用例 | 带技能 | 不带技能 |');
md.push('|---|---|---|---|');
for (const r of rows) {
  const g = (x) => (x ? `${x.errors} / ${x.warnings}` : '—');
  md.push(`| ${r.id} | ${r.name} | ${g(r.with_skill.gates)} | ${g(r.without_skill.gates)} |`);
}
md.push('');
md.push('## 待人工判定的条目');
md.push('');
md.push('机器尺覆盖不了「图有没有画对」这类问题（F-015 的教训）。以下条目需要人眼看产物截图：');
md.push('');
for (const r of rows) {
  const pending = r.with_skill.results.filter((x) => x.passed === null);
  if (pending.length) {
    md.push(`**#${r.id} ${r.name}**`);
    for (const p of pending) md.push(`- [ ] ${p.text}`);
    md.push('');
  }
}
md.push('## 未通过的机器条目');
md.push('');
let anyFail = false;
for (const r of rows) {
  const failed = r.with_skill.results.filter((x) => x.passed === false);
  if (!failed.length) continue;
  anyFail = true;
  md.push(`**#${r.id} ${r.name}**`);
  for (const f of failed) md.push(`- ❌ ${f.text} — ${f.evidence}`);
  md.push('');
}
if (!anyFail) md.push('（无）');
md.push('');
md.push('## 怎么用这张表');
md.push('');
md.push('1. **改完 skill 重跑一遍**，看平均通过率是涨是跌；');
md.push('2. 逐条看「未通过的机器条目」——那是 skill 没讲清楚的地方，补规范而不是补产物；');
md.push('3. **别跳过人眼那一节。** 机器全绿不等于图是对的。');

writeFileSync(join(ITERATION.dir, 'benchmark.md'), `${md.join('\n')}\n`, 'utf8');

stdout.write(`\n${'─'.repeat(64)}\n`);
stdout.write(`带技能 ${pct(tw.mean)}  vs  不带技能 ${pct(two.mean)}   （Δ ${Math.round((tw.mean - two.mean) * 100)}pt）\n`);
stdout.write(`📄 ${join(ITERATION.dir, 'benchmark.md')}\n\n`);

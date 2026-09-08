<div align="center">

<img src="./assets/logo.svg" width="64" height="64" alt="agent-html logo">

# agent-html

<p>
  <strong>Zero-dependency, single-file HTML design system & agent skill for LLMs.</strong><br>
  Inspired by shadcn/ui. 100% offline. 0 npm packages. 0 external CDNs.<br>
  Optimized for Claude Code, Pi, Codex, and Cursor.
</p>

<p>
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a>
</p>

<p>
  <a href="https://github.com/QingYunA/agent-html/releases"><img src="https://img.shields.io/github/v/release/QingYunA/agent-html?style=flat&color=18181b" alt="Release"></a>
  <a href="https://skills.sh"><img src="https://img.shields.io/badge/skills.sh-npx%20skills%20add%20QingYunA%2Fagent--html-10b981?style=flat&logo=npm" alt="skills.sh install"></a>
  <img src="https://img.shields.io/badge/dependencies-0%20npm%20%7C%200%20cdn-10b981?style=flat" alt="Dependencies">
  <img src="https://img.shields.io/badge/theme-light%20%26%20dark-blue?style=flat" alt="Themes">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-18181b?style=flat" alt="License"></a>
  <a href="https://github.com/QingYunA/agent-html/stargazers"><img src="https://img.shields.io/github/stars/QingYunA/agent-html?style=flat&logo=github&color=18181b" alt="Stars"></a>
</p>

<p>
  <a href="#installation">Installation</a> ·
  <a href="#what-you-get">What You Get</a> ·
  <a href="#the-6-archetypes">The 6 Archetypes</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#micro-css-base">Micro-CSS Base</a> ·
  <a href="#linter">Linter</a>
</p>

</div>

---

<p align="center">
  <img src="assets/screenshots/gallery.png" alt="agent-html Component Gallery" width="100%">
</p>

---

## The Problem

When asking LLMs (Claude Code, Pi, Codex, ChatGPT) to generate an HTML dashboard or report, the output usually falls into one of two traps:

- **The CDN trap:** The model injects `<script src="https://cdn.tailwindcss.com"></script>` and external Google Fonts. It looks acceptable at first glance, but breaks completely in air-gapped corporate intranets, takes 2 seconds to parse, causes flash-of-unstyled-content (FOUC), and rots over time when CDN endpoints change.
- **The visual slop trap:** If you forbid CDNs, the model hallucinates raw inline CSS with garish colors, harsh pure-black borders, random 30px paddings, broken alignment, and zero dark mode support.

`agent-html` fixes this by packaging a tight ~75-line native CSS token sheet and 4 battle-tested layout archetypes. Double-click any generated file in Finder, and it renders instantly with enterprise-grade polish.

---

## What You Get

- **Zero dependencies:** No `node_modules`, no npm build step, no CDN links. Every file runs offline and standalone.
- **Zinc-neutral design tokens:** A pure CSS variable port of shadcn/ui. 1px borders, subtle radii, clean typography, and high information density.
- **6 structural layout archetypes:** Scaffolds for Reports, Dashboards, Workbenches, Side-by-Side Comparisons, Timelines, and Kanban Boards ready to copy.
- **Native light & dark modes:** Seamless switching with CSS variables and a 5-line vanilla JS toggle.
- **Closed-loop feedback:** Built-in "Copy as Markdown" and "Copy Review Decisions" affordances so static HTML files never become dead ends.
- **Deterministic verification linter:** Includes `scripts/validate.mjs` so agents self-test tag symmetry, zero-CDN compliance, and viewport setup before presenting files to humans.
- **24 curated vector SVGs:** Lucide-style inline vector icons with `stroke="currentColor"` that adapt to font colors without font files.
- **Zero-CDN Pure SVG charts:** Area trend curves, column distributions, multi-segment donut ratio charts, and horizontal ranking bars.

---

## The 6 Archetypes

Rather than rigid business screens, `agent-html` provides 6 fundamental layout scaffolds with clear `<!-- [Slot: ...] -->` injection points:

### Archetype 1: Document & Executive Report (`templates/report.html`)
Single-column centered layout (860px max-width) optimized for readability and print. Includes metadata header, status badges, KPI score overview, executive summary callout, native `<details>` accordions, one-click "Copy as Markdown" export, and `@media print` styles.

> **Use for**: Technical reviews, interview assessments, postmortems, architecture RFCs, and changelogs.

<p align="center">
  <img src="assets/screenshots/report.png" alt="Report Template" width="100%">
</p>

---

### Archetype 2: Analytics Dashboard & Data Grid (`templates/dashboard.html`)
Fluid wide-screen layout with a 4-column KPI metric grid, responsive pure SVG charts (24h throughput area trend & P95 latency distribution bars with zero external libraries), dual-filter toolbar (real-time text search + status select), zebra hover table, and native `<dialog>` action modals.

> **Use for**: Resource usage monitoring, quota trackers, task lists, and operational dashboards.

<p align="center">
  <img src="assets/screenshots/dashboard.png" alt="Dashboard Template" width="100%">
</p>

---

### Archetype 3: Master-Detail Workbench (`templates/inspector.html`)
Full-viewport app layout (`100vh` without outer page scroll). Left sidebar (320px) handles real-time item filtering, while the right detail pane dynamically renders selected metadata, property grids, human review verdict actions (Pass/Fix/Reject), and a "Copy Review Decisions back to Agent" button to close the interactive feedback loop.

> **Use for**: Trace replay, log inspectors, JSONL viewers, and prompt debuggers.

<p align="center">
  <img src="assets/screenshots/inspector.png" alt="Inspector Template" width="100%">
</p>

---

### Archetype 4: Side-by-Side Comparison Matrix (`templates/compare.html`)
Two-column split view (Baseline vs. Challenger) with verdict callout, parameter specs, sample payload outputs, quantitative delta matrix table, and one-click "Copy as Markdown" export.

> **Use for**: LLM model evaluations (Model A vs. Model B), prompt revision benchmarks, and feature/pricing comparisons.

<p align="center">
  <img src="assets/screenshots/compare.png" alt="Compare Template" width="100%">
</p>

---

### Archetype 5: Event Timeline & Incident Postmortem (`templates/timeline.html`)
High-density single-track vertical timeline with semantic status nodes (Error, Warning, Success, Info), exact timestamps, operator tags, expandable diagnosis logs, and one-click "Copy as Markdown" export.

> **Use for**: Incident postmortems, changelogs, release roadmaps, and event chronicles.

<p align="center">
  <img src="assets/screenshots/timeline.png" alt="Timeline Template" width="100%">
</p>

---

### Archetype 6: Triage & Agile Kanban Board (`templates/kanban.html`)
Interactive 4-column categorization board (Backlog, Progress, Blocked, Done). Zero external dependencies, pure HTML5 drag-and-drop (~35 lines vanilla JS). Features a "Copy Triage Decisions to Agent" button to close the interactive loop.

> **Use for**: Ticket triage, task prioritization, backlog grooming, and bug tracking.

<p align="center">
  <img src="assets/screenshots/kanban.png" alt="Kanban Template" width="100%">
</p>

---

## Quick Start & CLI

### Local Preview
No build step or Node.js server required. Open directly in your browser:

```bash
# Core component gallery
open index.html

# 6 Layout templates
open templates/report.html
open templates/dashboard.html
open templates/inspector.html
open templates/compare.html
open templates/timeline.html
open templates/kanban.html
```

### Standalone CLI Helper

The repository includes a zero-dependency CLI executable:

```bash
# Open the gallery directly
npx agent-html open

# Extract any raw archetype directly to a file
npx agent-html template dashboard > my-dashboard.html
npx agent-html template report > my-report.html

# Validate any HTML file for zero-CDN & tag hygiene
npx agent-html check my-dashboard.html
```

---

## Micro-CSS Base

Every standalone HTML generated with this system inlines this ~75-line token block in `<head><style>`:

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
```

### Essential Micro-Scripts

**Native Dark Mode Switcher (5 lines)**:
```javascript
const toggle = document.getElementById('themeToggle');
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
toggle?.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});
```

**Real-time Table Search (5 lines)**:
```javascript
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('#dataTable tbody tr').forEach(tr => {
    tr.style.display = (!q || tr.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
});
```

---

## Installation

### 1. The 1-Line Install via `skills` (Recommended)

Install directly to your current project (Claude Code, Cursor, Copilot, etc.) with zero manual cloning:

```bash
# Install to current project workspace
npx skills add QingYunA/agent-html

# Or install globally to all 70+ agents on your machine (Claude Code, Pi, Cursor, Codex, etc.)
npx skills add QingYunA/agent-html -g
```

### 2. Manual Git Symlink (Alternative)

If you prefer managing local symlinks manually:

```bash
git clone https://github.com/QingYunA/agent-html.git ~/Code/agent-html

# Link into universal agents directory
ln -sf ~/Code/agent-html/skills/agent-html ~/.agents/skills/agent-html

# If using Claude Code or Pi:
ln -sf ../../.agents/skills/agent-html ~/.claude/skills/agent-html
ln -sf ../../../.agents/skills/agent-html ~/.pi/agent/skills/agent-html
```

---

## Triggering the Skill

Once installed, prompts like:
- *"Generate a standalone HTML dashboard for our cluster metrics with a trend chart"*
- *"Create an executive evaluation report for candidate John Doe as a single file"*
- *"Build a side-by-side prompt comparison matrix in HTML"*
- *"Don't write a wall of markdown, give me a clean single-file visual report for this PR review"*

will automatically trigger the `agent-html` skill and produce clean, zero-dependency, self-contained files.

---

## Linter

Agents can self-verify their generated HTML before presenting it to the user:

```bash
# Validate a specific file
node scripts/validate.mjs path/to/output.html

# Validate all bundled templates
node scripts/validate.mjs --all
```

### Check Rules

- `[ZERO_CDN]`: Zero external CDN scripts or remote stylesheet links.
- `[THEME_TOKENS]`: Complete CSS token base (`--bg`, `--card`, `--border`, status colors) & dark mode support.
- `[VIEWPORT]`: Mobile responsive meta tag (`viewport`).
- `[TAG_HYGIENE]`: Symmetric tag closure (`<html>`, `<head>`, `<body>`).
- `[AFFORDANCE]`: Non-dead-end UI (export, copy, or print action present).
- `[COLOPHON]`: Timestamped generation metadata stamp in HTML comments.

---

## Repository Structure

```text
agent-html/
├── README.md                      # English documentation & showcase
├── README.zh-CN.md                # 简体中文文档
├── index.html                     # Visual gallery of all atomic components
├── templates/ -> skills/...       # Standalone HTML templates (symlinked to assets)
│   ├── report.html                # Single-column document & evaluation report
│   ├── dashboard.html             # Metrics dashboard & filterable table
│   ├── inspector.html             # Master-detail split workbench
│   ├── compare.html               # Side-by-side A/B comparison matrix
│   ├── timeline.html              # Event timeline & incident postmortem
│   └── kanban.html                # Triage & agile drag-and-drop kanban board
├── assets/
│   ├── logo.svg                   # Vector brand logo
│   └── screenshots/               # High-res preview assets
├── scripts/
│   └── validate.mjs               # Zero-dependency deterministic HTML linter
└── skills/
    └── agent-html/
        ├── SKILL.md               # The LLM prompt instructions & slot definitions
        ├── assets/                # Bundled templates & index mirror
        └── evals/                 # Benchmark eval test cases
```

---

## License

[MIT](LICENSE) © 2026 QingYunA

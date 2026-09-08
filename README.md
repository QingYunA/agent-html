# agent-html

> Zero-dependency, single-file HTML design system & agent skill inspired by [shadcn/ui](https://ui.shadcn.com).  
> 100% offline, zero npm packages, zero external CDNs. High information density, light/dark mode, and 4 layout archetypes for LLMs.

---

## The Problem

When asking LLMs (Claude Code, Pi, Codex, ChatGPT) to generate a quick HTML report or dashboard, you usually hit one of two walls:

1. **The CDN trap**: The model injects `<script src="https://cdn.tailwindcss.com"></script>` and external Google Fonts. It looks okay initially, but breaks completely in air-gapped corporate intranets, takes 2 seconds to render, and rots when CDNs change or network drops.
2. **The visual slop trap**: If you forbid CDNs, the model hallucinates ad-hoc CSS—inconsistent 24px paddings, harsh pure-black borders, mismatched border-radii, and zero dark mode support.

`agent-html` solves this by providing a tight ~75-line native CSS token base and 4 structural layout archetypes that agents can inline directly. Double-click any generated file in Finder, and it renders instantly with enterprise-grade polish.

---

## Showcase

### 1. Component Gallery (`index.html`)
The full atom catalog: Buttons (5 variants), Badges with status dots, Stat cards, Callouts, interactive Tables, Segmented tabs, Native `<dialog>` modals, and 12 Lucide-style inline SVGs.

![Component Gallery](assets/screenshots/gallery.png)

---

### 2. The 4 Structural Archetypes

Rather than rigid business-specific screens, `agent-html` provides 4 fundamental layout scaffolds:

#### Archetype 1: Document & Executive Report (`templates/report.html`)
Single-column centered layout (860px max-width) optimized for readability and print. Includes metadata header, status badges, KPI score overview, executive summary callout, native `<details>` accordions, and `@media print` styles.

> **Use for**: Technical reviews, interview assessments, postmortems, architecture RFCs, and changelogs.

![Report Template](assets/screenshots/report.png)

---

#### Archetype 2: Analytics Dashboard & Data Grid (`templates/dashboard.html`)
Fluid wide-screen layout with a 4-column KPI metric grid, dual-filter toolbar (real-time text search + status select), zebra hover table, and native `<dialog>` action modals.

> **Use for**: Resource usage monitoring, quota trackers, task lists, and operational dashboards.

![Dashboard Template](assets/screenshots/dashboard.png)

---

#### Archetype 3: Master-Detail Workbench (`templates/inspector.html`)
Full-viewport app layout (`100vh` without outer page scroll). Left sidebar (320px) handles real-time item filtering, while the right detail pane dynamically renders selected metadata, property grids, and formatted code blocks with one-click copy.

> **Use for**: Trace replay, log inspectors, JSONL viewers, and prompt debuggers.

![Inspector Template](assets/screenshots/inspector.png)

---

#### Archetype 4: Side-by-Side Comparison Matrix (`templates/compare.html`)
Two-column split view (Baseline vs. Challenger) with verdict callout, parameter specs, sample payload outputs, and a quantitative delta matrix table.

> **Use for**: LLM model evaluations (Model A vs. Model B), prompt revision benchmarks, and feature/pricing comparisons.

![Compare Template](assets/screenshots/compare.png)

---

## Quick Start

### Local Preview
No build step or Node.js server required. Open directly in your browser:

```bash
# Core component gallery
open index.html

# 4 Layout templates
open templates/report.html
open templates/dashboard.html
open templates/inspector.html
open templates/compare.html
```

---

## How It Works (For Humans & AI Agents)

### 1. The Micro-CSS Base (~75 lines)
Every standalone HTML generated with this system includes this zero-dep token block in `<head><style>`. It maps shadcn's Zinc neutral palette into pure CSS variables:

```css
:root {
  --bg: #fafafa;
  --card: #ffffff;
  --card-fg: #09090b;
  --primary: #18181b;
  --primary-fg: #fafafa;
  --secondary: #f4f4f5;
  --secondary-fg: #18181b;
  --muted: #f4f4f5;
  --muted-fg: #71717a;
  --border: #e4e4e7;
  --ring: #18181b;
  --radius: 8px;
  --radius-sm: 6px;

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
  --secondary: #27272a;
  --secondary-fg: #fafafa;
  --muted: #18181b;
  --muted-fg: #a1a1aa;
  --border: #27272a;

  --ok: #4ade80;   --ok-bg: #052e1680;   --ok-border: #166534;
  --warn: #fbbf24; --warn-bg: #451a0380; --warn-border: #854d0e;
  --err: #f87171;  --err-bg: #450a0a80;  --err-border: #991b1b;
  --info: #60a5fa; --info-bg: #17255480; --info-border: #1e40af;
}
```

### 2. 5-Line Micro Scripts

**Native Dark Mode Switcher**:
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

**Real-time Table Search (Zero dependencies)**:
```javascript
document.getElementById('searchInput')?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('#dataTable tbody tr').forEach(tr => {
    tr.style.display = (!q || tr.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
});
```

---

## Global Agent Skill Installation

To let your local coding agents (Claude Code, Pi, Codex) automatically use this system whenever you ask for an HTML page or report:

```bash
# Clone the repository
git clone https://github.com/QingYunA/agent-html.git ~/Code/agent-html

# Symlink the skill to your global agent skills directory
ln -sf ~/Code/agent-html/skills/agent-html ~/.agents/skills/agent-html

# If you use Claude Code or Pi:
ln -sf ../../.agents/skills/agent-html ~/.claude/skills/agent-html
ln -sf ../../../.agents/skills/agent-html ~/.pi/agent/skills/agent-html
```

Once installed, prompts like:
- *"Generate a standalone HTML dashboard for our cluster metrics"*
- *"Create an executive evaluation report for candidate John Doe as a single file"*
- *"Build a side-by-side prompt comparison matrix in HTML"*

will automatically trigger the `agent-html` skill and output clean, zero-dependency, self-contained files.

---

## Repository Structure

```text
agent-html/
├── README.md                      # Documentation & showcase
├── index.html                     # Visual gallery of all atomic components
├── templates/                     # Standalone HTML templates (symlinked to assets)
│   ├── report.html                # Single-column document & evaluation report
│   ├── dashboard.html             # Metrics dashboard & filterable table
│   ├── inspector.html             # Master-detail split workbench
│   └── compare.html               # Side-by-side A/B comparison matrix
├── assets/
│   └── screenshots/               # High-res preview assets for README
└── skills/
    └── agent-html/
        ├── SKILL.md               # The LLM prompt instructions & slot definitions
        ├── assets/                # Bundled templates & index mirror
        └── evals/                 # Benchmark eval test cases
```

---

## License

MIT

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
  <a href="https://agent-html-bice.vercel.app" target="_blank"><strong>🌐 Live Interactive Demo ↗</strong></a>
</p>

<p>
  <a href="https://agent-html-bice.vercel.app" target="_blank"><img src="https://img.shields.io/badge/Live%20Demo-agent--html--bice.vercel.app-000000?style=flat&logo=vercel&logoColor=white" alt="Live Demo"></a>
  <a href="https://github.com/QingYunA/agent-html/releases"><img src="https://img.shields.io/github/v/release/QingYunA/agent-html?style=flat&color=18181b" alt="Release"></a>
  <a href="https://skills.sh"><img src="https://img.shields.io/badge/skills.sh-npx%20skills%20add%20QingYunA%2Fagent--html-10b981?style=flat&logo=npm" alt="skills.sh install"></a>
  <img src="https://img.shields.io/badge/dependencies-0%20npm%20%7C%200%20cdn-10b981?style=flat" alt="Dependencies">
  <img src="https://img.shields.io/badge/theme-light%20%26%20dark-blue?style=flat" alt="Themes">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-18181b?style=flat" alt="License"></a>
  <a href="https://github.com/QingYunA/agent-html/stargazers"><img src="https://img.shields.io/github/stars/QingYunA/agent-html?style=flat&logo=github&color=18181b" alt="Stars"></a>
</p>

<p>
  <a href="#installation--quick-start">Installation</a> ·
  <a href="#the-problem">The Problem</a> ·
  <a href="#what-you-get">What You Get</a> ·
  <a href="#the-6-archetypes">The 6 Archetypes</a> ·
  <a href="#atomic-capabilities--component-arsenal">Component Library</a> ·
  <a href="#prompt-triggers">Prompt Triggers</a> ·
  <a href="#star-history">Star History</a>
</p>

</div>

---

<p align="center">
  <a href="https://agent-html-bice.vercel.app" target="_blank">
    <img width="2326" height="1442" alt="agent-html live gallery" src="https://github.com/user-attachments/assets/cb546a47-188e-46ac-af2a-c4af09a3ca59" />
  </a>
  <br>
  <sub>👉 Click the preview above or visit <a href="https://agent-html-bice.vercel.app" target="_blank"><strong>agent-html-bice.vercel.app</strong></a> to test the live interactive component gallery &amp; archetype previews.</sub>
</p>

---

## Installation & Quick Start

### 1-Line Install via `skills` (Recommended)

Install directly into your coding agent (Claude Code, Cursor, Pi, Codex, Copilot, etc.) with zero manual cloning:

```bash
# Install to current project workspace
npx skills add QingYunA/agent-html

# Or install globally across all 70+ agents on your machine
npx skills add QingYunA/agent-html -g
```

### Try it Instantly (CLI & Live Web App)

No build step or Node.js server required. Explore the component gallery (or test online directly at [**agent-html-bice.vercel.app**](https://agent-html-bice.vercel.app)):

```bash
# Open the interactive component gallery in your browser
npx agent-html open

# Extract any raw archetype directly to a file
npx agent-html snippet button
npx agent-html template dashboard > api-dashboard.html
npx agent-html template kanban > my-kanban.html
```

<details>
<summary><strong>Manual Git Symlink Setup (Alternative)</strong></summary>

```bash
git clone https://github.com/QingYunA/agent-html.git ~/Code/agent-html

# Link into universal agents directory
ln -sf ~/Code/agent-html/skills/agent-html ~/.agents/skills/agent-html

# If using Claude Code or Pi:
ln -sf ../../.agents/skills/agent-html ~/.claude/skills/agent-html
ln -sf ../../../.agents/skills/agent-html ~/.pi/agent/skills/agent-html
```
</details>

---

## The Problem

When asking LLMs (Claude Code, Pi, Codex, ChatGPT) to generate an HTML dashboard or report, the output usually falls into one of two traps:

- **The CDN trap:** The model injects `<script src="https://cdn.tailwindcss.com"></script>` and external Google Fonts. It looks acceptable at first glance, but breaks completely in air-gapped corporate intranets, takes 2 seconds to parse, causes flash-of-unstyled-content (FOUC), and rots over time when CDN endpoints change.
- **The visual slop trap:** If you forbid CDNs, the model hallucinates raw inline CSS with garish colors, harsh pure-black borders, random 30px paddings, broken alignment, and zero dark mode support.

`agent-html` fixes this by packaging a tight ~75-line native CSS token sheet and 6 battle-tested layout archetypes. Double-click any generated file in Finder, and it renders instantly with enterprise-grade polish.

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

<p align="center">
  <img src="assets/screenshots/en/preview.gif" alt="agent-html 6 Layout Archetypes Animated Preview" width="100%">
</p>

| Archetype | Template Path | Best For | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **01. Report** | [`templates/en/report.html`](templates/en/report.html) | Technical reviews, RFCs, audits | TOC ScrollSpy, KPI score overview, details accordion, print CSS |
| **02. Dashboard** | [`templates/en/dashboard.html`](templates/en/dashboard.html) | Metrics monitoring, billing | 4 KPI cards, native SVG area & bar charts, filterable table |
| **03. Inspector** | [`templates/en/inspector.html`](templates/en/inspector.html) | Trace inspection, prompt debugging | 100vh split screen, item filtering, JSON payload viewer, review actions |
| **04. Compare** | [`templates/en/compare.html`](templates/en/compare.html) | Model A/B testing, prompt diffs | Dual baseline vs challenger cards, delta comparison matrix |
| **05. Timeline** | [`templates/en/timeline.html`](templates/en/timeline.html) | Incident postmortems, changelogs | Single-track vertical timeline, status dots, diagnostic logs |
| **06. Kanban** | [`templates/en/kanban.html`](templates/en/kanban.html) | Bug triage, backlog grooming | 4-column drag & drop, status badges, agent feedback loop |

<details>
<summary><strong>📸 Click to view full-resolution static screenshots for all 6 archetypes</strong></summary>
<br>

#### 01. Document & Executive Report
<p align="center"><img src="assets/screenshots/en/report.png" alt="Report Template" width="100%"></p>

#### 02. API Usage & Cost Dashboard & Data Grid
<p align="center"><img src="assets/screenshots/en/dashboard.png" alt="Dashboard Template" width="100%"></p>

#### 03. Agent Trace & Log Inspector & Inspector
<p align="center"><img src="assets/screenshots/en/inspector.png" alt="Inspector Template" width="100%"></p>

#### 04. DeepSeek vs GPT-4o Comparison Matrix
<p align="center"><img src="assets/screenshots/en/compare.png" alt="Compare Template" width="100%"></p>

#### 05. Service Recovery Timeline & Incident Postmortem
<p align="center"><img src="assets/screenshots/en/timeline.png" alt="Timeline Template" width="100%"></p>

#### 06. Triage & Agile Kanban Board
<p align="center"><img src="assets/screenshots/en/kanban.png" alt="Kanban Template" width="100%"></p>

</details>

---

## Atomic Component Library

Beyond full-page archetypes, `agent-html` packages production-grade **atomic primitives** and **zero-CDN pure SVG charts**. 100% offline, zero npm, zero external CDN, and instant dark mode support:

### 1. Button System (Buttons Matrix)

<p align="center">
  <img src="assets/arsenal/en/buttons.svg" alt="agent-html button system & status badges" width="100%">
</p>

Semantic variants aligned with shadcn/ui standards, complete with `:hover`, `:active`, and `:disabled` micro-interactions:

| Variant | Class | Semantic Role | Common Use Case |
| :--- | :--- | :--- | :--- |
| **Primary** | `.btn.btn-primary` | Solid high-contrast block | Submit, approve, primary CTAs |
| **Secondary** | `.btn.btn-secondary` | Neutral subtle background | Cancel, back to list, secondary filters |
| **Outline** | `.btn.btn-outline` | 1px border stroke | Export report, copy Markdown, view details |
| **Ghost** | `.btn.btn-ghost` | Transparent, hover-only fill | Table row actions, breadcrumbs, link buttons |
| **Destructive**| `.btn.btn-destructive`| Semantic warning red | Block release, drop database, abort workflow |
| **With Icon** | `.btn` with inline `<svg>` | Icon + text pair | Download PDF, refresh status, search |
| **Icon Button** | `.btn.btn-icon` | 32x32px square | Theme toggle, settings, collapse trigger |

```html
<!-- Ready-to-copy button snippets -->
<button class="btn btn-primary">Approve Release</button>
<button class="btn btn-secondary">Previous Step</button>
<button class="btn btn-outline btn-sm">
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  <span>Export PDF</span>
</button>
<button class="btn btn-destructive btn-sm">Block Deployment</button>
```

---

### 2. Zero-CDN Pure SVG Charts

<p align="center">
  <img src="assets/arsenal/en/charts.svg" alt="agent-html 6 zero-CDN pure SVG charts" width="100%">
</p>

Zero external JS chart libraries required. Uses standard inline SVG for crisp, Retina-sharp rendering that never breaks:

| Chart Type | Native Mechanism | Key Advantage | Typical Use Cases |
| :--- | :--- | :--- | :--- |
| **📈 Area Trend** | Bezier curves with `linearGradient` | Zero load time, smooth gradient | 24h throughput (TPS), latency trends |
| **📊 Column Histogram** | Rounded `rect` with data value labels | High contrast, intuitive comparison | P95/P99 latency distribution, error codes |
| **🍩 Multi-Segment Donut** | `circle` with `stroke-dasharray` offsets | Pure CSS variable math, zero JS | Node health ratio, resource allocations |
| **📉 Dual-Line Ingress/Egress**| Solid line vs dashed comparator line | Dual-metric temporal correlation | Inbound vs outbound traffic, baseline vs test |
| **📑 Horizontal Ranking Bar** | Pill progress bars with semantic colors | Maximum space efficiency | Slow query ranking, TTFT by model |
| **⏱️ Semi-Circle Gauge** | Semi-circle stroke arc with gradient | Immediate threshold alert | Memory watermark, API rate-limit quota |

<details>
<summary><strong>Where is the SVG chart code?</strong></summary>

The full, canonical code for all six chart forms lives in **one place** — [`skills/agent-html/references/components.md`](skills/agent-html/references/components.md), section 6.

It is deliberately **not duplicated here**. Two hand-copied versions of the same snippet always drift apart, and a stale copy in a README is worse than no copy: an agent that copies it produces a broken chart. (We learned this the hard way — see `skills/agent-html/references/failures.md` **F-014**.)

Each chart there ships with the **four-part contract**: a conclusion-style title, a subtitle stating the unit contract (`1 rim dot = 300 TPS`), the body, and an uppercase encoding caption. The contract itself is specified in [`SKILL.md`](skills/agent-html/SKILL.md).

</details>

---

### 3. 24 Curated Engineering Vector Icons

<p align="center">
  <img src="assets/arsenal/en/icons.svg" alt="agent-html 24 curated vector icons" width="100%">
</p>

Designed with `stroke="currentColor"` to automatically inherit font size and color in light and dark modes:

| Category | Curated Icons | Engineering Context |
| :--- | :--- | :--- |
| **System & Shell** | `Search` · `Terminal` · `Settings` · `Activity` | Global search, CLI output, settings, healthcheck |
| **DevOps & Git** | `Branch` · `Commit` · `PR` · `Bug` | Code reviews, trace audits, changelog releases |
| **Status & Verdicts** | `Check` · `Alert` · `Shield` · `Lock` | Pass badges, critical blockers, security audits |
| **Actions & Data** | `Copy` · `Download` · `Calendar` · `Filter` · `Refresh` | Copy back to Agent, PDF export, date ranges |
| **Infrastructure** | `Server` · `Database` · `CPU` · `External` | Host metrics, slow queries, cluster CPU, RFC docs |

```html
<!-- Automatic theme & color inheritance -->
<span style="display: inline-flex; align-items: center; gap: 6px; color: var(--ok);">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
  <span>All test suites passing</span>
</span>
```

---

## Prompt Triggers

Once installed, prompts like:
- *"Generate a standalone HTML dashboard for our cluster metrics with a trend chart"*
- *"Create an executive evaluation report for candidate John Doe as a single file"*
- *"Build a side-by-side prompt comparison matrix in HTML"*
- *"Don't write a wall of markdown, give me a clean single-file visual report for this PR review"*

will automatically trigger the `agent-html` skill and produce clean, zero-dependency, self-contained files.

---

## Atomic Components & Design Reference

All atomic HTML slots (buttons, badges, callouts, KPI stat cards), 24 currentColor vector SVGs, zero-CDN pure SVG charts, and vanilla interaction scripts are documented in [skills/agent-html/references/components.md](skills/agent-html/references/components.md) and live-previewed in `index.html`.

---

## Star History

<p align="center">
  <a href="https://star-history.com/#qingyuna/agent-html&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=qingyuna/agent-html&type=Date&theme=dark" />
      <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=qingyuna/agent-html&type=Date" />
      <img src="https://api.star-history.com/svg?repos=qingyuna/agent-html&type=Date" alt="Star History Chart" width="100%" />
    </picture>
  </a>
</p>

---

## Community

Join the discussion and share your feedback on [LINUX DO](https://linux.do).

---

## License

[MIT](LICENSE) © 2026 QingYunA


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

function printHelp() {
  console.log(`
agent-html · Zero-dependency single-file HTML design system & agent skill

Usage:
  npx agent-html <command> [options]

Commands:
  open [--zh]               Open the local component gallery in your browser (default EN, --zh for CN)
  list                      List all 6 built-in structural layout templates
  template <name> [--lang]  Output raw HTML template (report, dashboard, inspector, compare, timeline, kanban)
  check <file>              Run the deterministic offline HTML linter against a file
  install                   Quickly install/symlink the skill to ~/.agents/skills/agent-html

Skills.sh Install (Recommended for all 70+ agents):
  npx skills add QingYunA/agent-html
  npx skills add QingYunA/agent-html -g

Examples:
  npx agent-html open
  npx agent-html open --zh
  npx agent-html template dashboard > my-dashboard.html
  npx agent-html template zh/kanban > my-kanban.html
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

  case 'list': {
    console.log(`
Available 6 Layout Templates:
  1. report     Single-column document & executive evaluation report (TOC + print)
  2. dashboard  Fluid wide analytics dashboard & real-time filterable data grid
  3. inspector  Master-detail split workbench (100vh app layout)
  4. compare    Side-by-side A/B comparison & quantitative delta matrix
  5. timeline   Event timeline chronicle & incident postmortem
  6. kanban     Triage & agile drag-and-drop kanban board

Languages available:
  - English:  templates/en/<name>.html (e.g. npx agent-html template en/dashboard)
  - Chinese:  templates/zh/<name>.html (e.g. npx agent-html template zh/dashboard)
`);
    break;
  }

  case 'template': {
    let tName = args[1];
    if (!tName || tName.startsWith('-')) {
      console.error('Error: Please specify template name: report, dashboard, inspector, compare, timeline, or kanban');
      console.error('Example: npx agent-html template dashboard (or en/dashboard, zh/dashboard)');
      process.exit(1);
    }

    const isZh = args.includes('--zh');
    let tPath = resolve(rootDir, `templates/${tName}.html`);
    if (!existsSync(tPath)) {
      if (isZh) {
        tPath = resolve(rootDir, `templates/zh/${tName}.html`);
      } else {
        tPath = resolve(rootDir, `templates/en/${tName}.html`);
      }
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
    const valScript = resolve(rootDir, 'scripts/validate.mjs');
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

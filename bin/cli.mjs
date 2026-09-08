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
  open              Open the local component gallery in your browser
  list              List all 4 built-in structural layout templates
  template <name>   Output raw HTML template (report, dashboard, inspector, compare)
  check <file>      Run the deterministic offline HTML linter against a file
  install           Quickly install/symlink the skill to ~/.agents/skills/agent-html

Skills.sh Install (Recommended):
  npx skills add QingYunA/agent-html
  npx skills add QingYunA/agent-html -g  # Global for all 70+ agents

Examples:
  npx agent-html open
  npx agent-html template dashboard > my-dashboard.html
  npx agent-html check my-dashboard.html
`);
}

switch (cmd) {
  case 'open': {
    const indexPath = resolve(rootDir, 'index.html');
    const openCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    execSync(`${openCmd} "${indexPath}"`);
    console.log(`✨ Opened gallery: ${indexPath}`);
    break;
  }

  case 'list': {
    console.log(`
Available Templates:
  1. report     Single-column document & executive evaluation report
  2. dashboard  Fluid wide analytics dashboard & real-time filterable data grid
  3. inspector  Master-detail split workbench (100vh app layout)
  4. compare    Side-by-side A/B comparison & quantitative delta matrix
`);
    break;
  }

  case 'template': {
    const tName = args[1];
    if (!tName) {
      console.error('Error: Please specify template name: report, dashboard, inspector, or compare');
      process.exit(1);
    }
    const tPath = resolve(rootDir, `templates/${tName}.html`);
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

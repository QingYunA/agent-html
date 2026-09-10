import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ROOT = path.resolve('.');

// Exact dimensions matched to the repository's screenshot standards:
// compare:   2320 x 1720 (window 1160, 860 @2x)
// dashboard: 2560 x 1720 (window 1280, 860 @2x)
// inspector: 2560 x 1640 (window 1280, 820 @2x)
// kanban:    2560 x 1680 (window 1280, 840 @2x)
// report:    2080 x 1800 (window 1040, 900 @2x)
// timeline:  2080 x 1720 (window 1040, 860 @2x)
// gallery:   2560 x 1680 (window 1280, 840 @2x)

const TEMPLATES = [
  { name: 'compare', width: 1160, height: 860 },
  { name: 'dashboard', width: 1280, height: 860 },
  { name: 'inspector', width: 1280, height: 820 },
  { name: 'kanban', width: 1280, height: 840 },
  { name: 'report', width: 1040, height: 900 },
  { name: 'timeline', width: 1040, height: 860 },
];

function capture(fileUrl, outPath, width, height) {
  const cmd = `"${CHROME}" --headless --disable-gpu --window-size=${width},${height} --force-device-scale-factor=2 --hide-scrollbars --screenshot="${outPath}" "${fileUrl}"`;
  execSync(cmd, { stdio: 'pipe' });
}

console.log('📸 Starting automated screenshot capture with Headless Chrome (2x Retina)...');

// 1. Capture Chinese & English templates
for (const lang of ['zh', 'en']) {
  for (const t of TEMPLATES) {
    const filePath = path.join(ROOT, `skills/agent-html/assets/templates/${lang}/${t.name}.html`);
    const outPath = path.join(ROOT, `assets/screenshots/${lang}/${t.name}.png`);
    const fileUrl = `file://${filePath}`;
    process.stdout.write(`  Rendering [${lang}] ${t.name}... `);
    capture(fileUrl, outPath, t.width, t.height);
    console.log('✅ Done');
  }
}

// 2. Capture Landing Page Galleries
console.log('  Rendering [zh] gallery.png... ');
capture(`file://${path.join(ROOT, 'index.zh-CN.html')}`, path.join(ROOT, 'assets/screenshots/zh/gallery.png'), 1280, 840);
console.log('✅ Done');

console.log('  Rendering [en] gallery.png... ');
capture(`file://${path.join(ROOT, 'index.html')}`, path.join(ROOT, 'assets/screenshots/en/gallery.png'), 1280, 840);
console.log('✅ Done');

console.log('🎉 All 14 high-resolution screenshots generated successfully!');

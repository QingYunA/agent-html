import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ROOT = path.resolve('.');
const TEMP_DIR = '/tmp/preview_frames';

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const ORDER = ['report', 'dashboard', 'inspector', 'compare', 'timeline', 'kanban'];

// Render 1280x860 @ 1x for smooth preview animation
function renderFrame(lang, name, outPath) {
  const filePath = path.join(ROOT, `skills/agent-html/assets/templates/${lang}/${name}.html`);
  const cmd = `"${CHROME}" --headless --disable-gpu --window-size=1280,860 --hide-scrollbars --screenshot="${outPath}" "file://${filePath}"`;
  execSync(cmd, { stdio: 'pipe' });
}

for (const lang of ['zh', 'en']) {
  console.log(`🎬 Generating preview video & gif for [${lang}]...`);
  const langDir = path.join(TEMP_DIR, lang);
  if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

  // 1. Render base frames
  for (const name of ORDER) {
    const framePath = path.join(langDir, `${name}.png`);
    renderFrame(lang, name, framePath);
  }

  // 2. Build input list for ffmpeg with 2.5s duration per slide
  const listFile = path.join(langDir, 'input.txt');
  let listContent = '';
  for (const name of ORDER) {
    listContent += `file '${langDir}/${name}.png'\nduration 2.5\n`;
  }
  // Repeat last frame to avoid ffmpeg cut
  listContent += `file '${langDir}/${ORDER[ORDER.length - 1]}.png'\n`;
  fs.writeFileSync(listFile, listContent);

  const mp4Out = path.join(ROOT, `assets/screenshots/${lang}/preview.mp4`);
  const gifOut = path.join(ROOT, `assets/screenshots/${lang}/preview.gif`);

  // 3. Generate mp4
  execSync(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -vf "fps=24,format=yuv420p" -c:v libx264 -preset fast -crf 22 "${mp4Out}"`, { stdio: 'pipe' });
  console.log(`  ✅ Generated ${mp4Out}`);

  // 4. Generate optimized gif (1000px width with palettegen for high quality & small file size)
  const palette = path.join(langDir, 'palette.png');
  execSync(`ffmpeg -y -i "${mp4Out}" -vf "fps=12,scale=1000:-1:flags=lanczos,palettegen" "${palette}"`, { stdio: 'pipe' });
  execSync(`ffmpeg -y -i "${mp4Out}" -i "${palette}" -filter_complex "fps=12,scale=1000:-1:flags=lanczos[x];[x][1:v]paletteuse" "${gifOut}"`, { stdio: 'pipe' });
  console.log(`  ✅ Generated ${gifOut}`);
}

console.log('🎉 All preview videos and gifs updated successfully!');

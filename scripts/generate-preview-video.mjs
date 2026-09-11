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

// Render at 1440x900 @ 2x (2880x1800 Retina) for crystal-clear typography and charts
function renderFrame(lang, name, outPath) {
  const filePath = path.join(ROOT, `skills/agent-html/assets/templates/${lang}/${name}.html`);
  const cmd = `"${CHROME}" --headless --disable-gpu --window-size=1440,900 --force-device-scale-factor=2 --hide-scrollbars --screenshot="${outPath}" "file://${filePath}"`;
  execSync(cmd, { stdio: 'pipe' });
}

for (const lang of ['zh', 'en']) {
  console.log(`🎬 Generating Retina HD preview video & gif for [${lang}]...`);
  const langDir = path.join(TEMP_DIR, lang);
  if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

  // 1. Render 2x retina frames
  for (const name of ORDER) {
    const framePath = path.join(langDir, `${name}.png`);
    process.stdout.write(`  Rendering ${name}... `);
    renderFrame(lang, name, framePath);
    console.log('✅');
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

  // 3. Generate high-definition MP4 (2880x1800 @ 30fps, slow preset, CRF 18 visually lossless)
  console.log('  Encoding 2K Retina MP4 (H.264 CRF 18)...');
  execSync(`/opt/homebrew/bin/ffmpeg -y -f concat -safe 0 -i "${listFile}" -vf "fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 18 "${mp4Out}"`, { stdio: 'pipe' });
  console.log(`  ✅ Generated ${mp4Out}`);

  // 4. Generate high-definition GIF (1200px width, lanczos filter, diff-based palette for crisp text)
  console.log('  Encoding high-definition GIF (1200px lanczos)...');
  const palette = path.join(langDir, 'palette.png');
  execSync(`/opt/homebrew/bin/ffmpeg -y -i "${mp4Out}" -vf "fps=12,scale=1200:-1:flags=lanczos,palettegen=stats_mode=diff" "${palette}"`, { stdio: 'pipe' });
  execSync(`/opt/homebrew/bin/ffmpeg -y -i "${mp4Out}" -i "${palette}" -filter_complex "fps=12,scale=1200:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" "${gifOut}"`, { stdio: 'pipe' });
  console.log(`  ✅ Generated ${gifOut}`);
}

console.log('🎉 All Retina preview videos and GIFs updated successfully!');

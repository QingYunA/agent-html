#!/usr/bin/env node
/**
 * scripts/generate-promo-video.mjs
 *
 * Renders the 30-second promo video from scripts/promo/promo.html.
 * The storyboard is a pure function of time, so this steps t at 30 fps,
 * screenshots every frame with headless Chromium and encodes them with ffmpeg.
 *
 * Maintainer tool (not part of the skill). Needs Playwright and ffmpeg:
 *   npm i -D playwright   (or a global install; PLAYWRIGHT_BROWSERS_PATH is honoured)
 *   FFMPEG_PATH=/opt/homebrew/bin/ffmpeg node scripts/generate-promo-video.mjs
 *
 * Output:
 *   assets/promo/agent-html-promo.mp4   1920x1080 · 30 fps · H.264 CRF 18
 *   assets/promo/agent-html-promo.png   poster frame
 *   assets/promo/agent-html-promo.webp  1280px animated WebP that autoplays inline in the README
 *                                       (needs python3 + Pillow; see scripts/promo/to-webp.py)
 */

import { mkdtempSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FFMPEG = process.env.FFMPEG_PATH || '/opt/homebrew/bin/ffmpeg';
const FPS = 30;
const DURATION = 30;
const POSTER_T = 13.2; // mid-way through the template showcase
const OUT_DIR = join(ROOT, 'assets', 'promo');

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    // fall back to a global install
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    return createRequire(join(globalRoot, 'noop.js'))('playwright');
  }
}

const { chromium } = await loadPlaywright();
const frames = mkdtempSync(join(tmpdir(), 'agent-html-promo-'));
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
try {
  // 1. Dark-mode dashboard for the light→dark wipe in scene 4
  const darkPath = join(frames, 'dashboard-dark.png');
  const dark = await browser.newPage({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2, colorScheme: 'dark' });
  await dark.goto(pathToFileURL(join(ROOT, 'skills/agent-html/assets/templates/en/dashboard.html')).href);
  await dark.waitForTimeout(300);
  await dark.screenshot({ path: darkPath });
  await dark.close();

  // 2. Step the storyboard
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(ROOT, 'scripts/promo/promo.html')).href);
  await page.evaluate(async (src) => {
    await document.fonts.ready;
    await window.setDarkShot(src);
    await Promise.all([...document.images].map((img) => img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })));
  }, pathToFileURL(darkPath).href);

  const total = FPS * DURATION;
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.render(t), i / FPS);
    await page.screenshot({ path: join(frames, `f${String(i).padStart(4, '0')}.png`) });
    if (i % FPS === 0) process.stdout.write(`\r  rendering ${i / FPS}s / ${DURATION}s`);
  }
  process.stdout.write(`\r  rendered ${total} frames          \n`);

  await page.evaluate((t) => window.render(t), POSTER_T);
  await page.screenshot({ path: join(OUT_DIR, 'agent-html-promo.png') });
} finally {
  await browser.close();
}

// 3. Encode
const mp4 = join(OUT_DIR, 'agent-html-promo.mp4');
execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
console.log(`✅ ${mp4}`);
console.log(`✅ ${join(OUT_DIR, 'agent-html-promo.png')}`);

// 4. Animated WebP for the README: GitHub strips <video> for files stored in the repo,
//    but an animated image autoplays inline. 1280px · 15 fps, every frame a keyframe.
const small = join(frames, 'webp');
mkdirSync(small, { recursive: true });
execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', mp4, '-vf', 'fps=15,scale=1280:-1:flags=lanczos', join(small, '%04d.png')], { stdio: 'inherit' });
const webp = join(OUT_DIR, 'agent-html-promo.webp');
try {
  execFileSync(process.env.PYTHON || 'python3', [join(ROOT, 'scripts/promo/to-webp.py'), small, webp, '15'], { stdio: 'inherit' });
  console.log(`✅ ${webp}`);
} catch {
  console.warn('⚠️  Skipped the README WebP: needs python3 with Pillow (pip install pillow).');
}
rmSync(frames, { recursive: true, force: true });
if (!existsSync(mp4)) process.exit(1);

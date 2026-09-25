#!/usr/bin/env node
/**
 * scripts/generate-promo-video.mjs
 *
 * Renders the 30-second promo video (English and Chinese) from scripts/promo/promo.html.
 * The storyboard is a pure function of time, so this steps t at 30 fps,
 * screenshots every frame with headless Chromium, synthesises the soundtrack from
 * the storyboard's sound cues (scripts/promo/soundtrack.py) and muxes both with ffmpeg.
 *
 * Maintainer tool (not part of the skill). Needs:
 *   - Playwright (local or global install)
 *   - ffmpeg with libx264 + aac (FFMPEG_PATH, default /opt/homebrew/bin/ffmpeg)
 *   - python3 with numpy + scipy (soundtrack) and Pillow (README WebP)
 *
 *   node scripts/generate-promo-video.mjs            # both languages
 *   node scripts/generate-promo-video.mjs --lang zh  # one language
 *   node scripts/generate-promo-video.mjs --dump-zh-chars chars.txt   # input for build-zh-font.py
 *
 * Output per language (suffix "" for en, "-zh" for zh):
 *   assets/promo/agent-html-promo{suffix}.mp4    1920x1080 · 30 fps · H.264 CRF 18 · AAC 192k, -16 LUFS
 *   assets/promo/agent-html-promo{suffix}.png    poster frame
 *   assets/promo/agent-html-promo{suffix}.webp   1280px animated WebP that autoplays inline in the README
 */

import { mkdtempSync, mkdirSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { execFileSync, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FFMPEG = process.env.FFMPEG_PATH || '/opt/homebrew/bin/ffmpeg';
const PYTHON = process.env.PYTHON || 'python3';
const FPS = 30;
const DURATION = 30;
const POSTER_T = 13.2; // mid-way through the template showcase
const OUT_DIR = join(ROOT, 'assets', 'promo');
const STORYBOARD = pathToFileURL(join(ROOT, 'scripts/promo/promo.html')).href;

const args = process.argv.slice(2);
const argValue = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const LANGS = argValue('--lang') ? [argValue('--lang')] : ['en', 'zh'];

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    return createRequire(join(globalRoot, 'noop.js'))('playwright');
  }
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();

async function openStoryboard(lang) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(`${STORYBOARD}?lang=${lang}`);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

try {
  // Every character the zh storyboard can render, for scripts/promo/build-zh-font.py
  if (argValue('--dump-zh-chars')) {
    const page = await openStoryboard('zh');
    const text = await page.evaluate((duration) => {
      let s = document.body.innerText;
      for (let t = 0; t < duration; t += 0.1) { window.render(t); s += document.body.innerText; }
      return [...new Set(s)].join('');
    }, DURATION);
    writeFileSync(argValue('--dump-zh-chars'), text, 'utf8');
    console.log(`✅ ${text.length} unique characters → ${argValue('--dump-zh-chars')}`);
    process.exit(0);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  for (const lang of LANGS) {
    const suffix = lang === 'en' ? '' : `-${lang}`;
    const work = mkdtempSync(join(tmpdir(), `agent-html-promo-${lang}-`));
    console.log(`🎬 [${lang}]`);

    // 1. Dark-mode dashboard for the light→dark wipe in scene 4
    const darkPath = join(work, 'dashboard-dark.png');
    const dark = await browser.newPage({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2, colorScheme: 'dark' });
    await dark.goto(pathToFileURL(join(ROOT, `skills/agent-html/assets/templates/${lang}/dashboard.html`)).href);
    await dark.waitForTimeout(300);
    await dark.screenshot({ path: darkPath });
    await dark.close();

    // 2. Step the storyboard
    const page = await openStoryboard(lang);
    await page.evaluate(async (src) => {
      await window.setDarkShot(src);
      await Promise.all([...document.images].map((img) => img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })));
    }, pathToFileURL(darkPath).href);
    const cues = await page.evaluate(() => window.CUES);
    writeFileSync(join(work, 'cues.json'), JSON.stringify(cues));

    const total = FPS * DURATION;
    for (let i = 0; i < total; i++) {
      await page.evaluate((t) => window.render(t), i / FPS);
      await page.screenshot({ path: join(work, `f${String(i).padStart(4, '0')}.png`) });
      if (i % FPS === 0) process.stdout.write(`\r  rendering ${i / FPS}s / ${DURATION}s`);
    }
    process.stdout.write(`\r  rendered ${total} frames          \n`);
    await page.evaluate((t) => window.render(t), POSTER_T);
    await page.screenshot({ path: join(OUT_DIR, `agent-html-promo${suffix}.png`) });
    await page.close();

    // 3. Soundtrack (same music for every language; cues come from this storyboard)
    const wav = join(work, 'music.wav');
    execFileSync(PYTHON, [join(ROOT, 'scripts/promo/soundtrack.py'), join(work, 'cues.json'), wav], { stdio: 'inherit' });

    // 4. Encode picture + sound
    const mp4 = join(OUT_DIR, `agent-html-promo${suffix}.mp4`);
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(work, 'f%04d.png'), '-i', wav,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
      '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
      '-shortest', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
    console.log(`  ✅ ${mp4}`);

    // 5. Animated WebP for the README: GitHub strips <video> for files stored in the repo,
    //    but an animated image autoplays inline (silently). 1280px · 15 fps, every frame a keyframe.
    const small = join(work, 'webp');
    mkdirSync(small, { recursive: true });
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', mp4, '-vf', 'fps=15,scale=1280:-1:flags=lanczos', join(small, '%04d.png')], { stdio: 'inherit' });
    const webp = join(OUT_DIR, `agent-html-promo${suffix}.webp`);
    try {
      execFileSync(PYTHON, [join(ROOT, 'scripts/promo/to-webp.py'), small, webp, '15'], { stdio: 'inherit' });
    } catch {
      console.warn('  ⚠️  Skipped the README WebP: needs python3 with Pillow (pip install pillow).');
    }
    rmSync(work, { recursive: true, force: true });
    if (!existsSync(mp4)) process.exit(1);
  }
} finally {
  await browser.close();
}

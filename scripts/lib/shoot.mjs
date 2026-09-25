/**
 * scripts/lib/shoot.mjs — one 2x screenshot helper for the maintainer scripts.
 *
 * Prefers Playwright: its viewport is exactly width x height. Chrome's own
 * `--headless --screenshot --window-size=W,H` renders a slightly shorter
 * viewport in new-headless mode and pads the PNG with a blank strip at the
 * bottom (~85 CSS px), which leaked into the README screenshots. The Chrome CLI
 * path is kept as a fallback for machines without Playwright.
 *
 * Env overrides for the fallback: CHROME_PATH, CHROME_FLAGS (e.g. --no-sandbox as root).
 */
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CHROME_FLAGS = process.env.CHROME_FLAGS || '';

let browserPromise = null;

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    try {
      const globalRoot = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      return createRequire(join(globalRoot, 'noop.js'))('playwright');
    } catch {
      return null;
    }
  }
}

async function browser() {
  if (!browserPromise) {
    browserPromise = loadPlaywright().then((pw) => (pw ? pw.chromium.launch() : null));
  }
  return browserPromise;
}

/** Screenshot `fileUrl` at width x height CSS px, device scale 2, light scheme. */
export async function screenshot(fileUrl, outPath, width, height, { colorScheme = 'light', settleMs = 400 } = {}) {
  const b = await browser();
  if (!b) {
    execSync(`"${CHROME}" ${CHROME_FLAGS} --headless --disable-gpu --window-size=${width},${height} --force-device-scale-factor=2 --hide-scrollbars --screenshot="${outPath}" "${fileUrl}"`, { stdio: 'pipe' });
    return;
  }
  const page = await b.newPage({ viewport: { width, height }, deviceScaleFactor: 2, colorScheme });
  await page.goto(fileUrl);
  // Landing pages fade sections in on scroll; show everything for a still capture.
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in')));
  await page.waitForTimeout(settleMs);
  await page.screenshot({ path: outPath });
  await page.close();
}

export async function closeBrowser() {
  const b = browserPromise && (await browserPromise);
  if (b) await b.close();
}

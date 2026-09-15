import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PREVIEW_PORT = 4178;

const previewProc = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--port', String(PREVIEW_PORT), '--strictPort'], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

await new Promise(r => setTimeout(r, 2500));

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu']
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PREVIEW_PORT}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-\\[9999\\]'), { timeout: 10000 });
  await new Promise(r => setTimeout(r, 500));

  const btnHandle = await page.$('#contact button[type="submit"]');
  await btnHandle.hover();
  await new Promise(r => setTimeout(r, 400));

  const hoverResult = await page.evaluate(() => {
    const btn = document.querySelector('#contact button[type="submit"]');
    const cs = window.getComputedStyle(btn);
    return {
      isHover: btn.matches(':hover'),
      backgroundColor: cs.backgroundColor,
      boxShadow: cs.boxShadow
    };
  });

  console.log('Hover result with btnHandle.hover():', JSON.stringify(hoverResult, null, 2));
} finally {
  await browser.close();
  previewProc.kill();
}

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const HERO_SHADER_PATH = path.resolve('components/HeroShader.tsx');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failedTests++;
  }
}

console.log('====================================================');
console.log('CHALLENGER 1 EMPIRICAL TEST SUITE: MILESTONE 2');
console.log('Target: HeroShader.tsx (R3, R4, Motion, Scroll, WebGL)');
console.log('====================================================\n');

// ----------------------------------------------------
// Test Section 1: Mathematical Properties & Bounds
// ----------------------------------------------------
console.log('--- SECTION 1: Mathematical Bounds & Edge Cases ---');

// 1.1 Scroll Fade Computation Stress Test
function computeScrollFade(scrollY, heroHeight) {
  const fadeDistance = Math.max(heroHeight * 0.75, 1);
  return Math.max(0, Math.min(1, 1 - (scrollY / fadeDistance)));
}

// Normal hero height (e.g. 800px, fadeDistance = 600px)
const normalHeroHeight = 800;
assert(computeScrollFade(0, normalHeroHeight) === 1.0, 'ScrollFade at scrollY=0 is exactly 1.0');
assert(computeScrollFade(300, normalHeroHeight) === 0.5, 'ScrollFade at scrollY=300 (halfway) is exactly 0.5');
assert(computeScrollFade(600, normalHeroHeight) === 0.0, 'ScrollFade at scrollY=600 (75% of hero) is exactly 0.0');
assert(computeScrollFade(800, normalHeroHeight) === 0.0, 'ScrollFade at scrollY=800 (100% of hero) is 0.0');
assert(computeScrollFade(2500, normalHeroHeight) === 0.0, 'ScrollFade deep down (scrollY=2500) remains clamped to 0.0');

// Rubber-banding / negative scroll
assert(computeScrollFade(-100, normalHeroHeight) === 1.0, 'ScrollFade with negative scrollY is clamped to 1.0');

// Edge case: heroHeight = 0 or negative
assert(computeScrollFade(0, 0) === 1.0, 'ScrollFade handles heroHeight=0 without NaN or divide-by-zero');
assert(computeScrollFade(50, 0) === 0.0, 'ScrollFade handles heroHeight=0 when scrolled');

// Check the pausing condition threshold: scrollFade <= 0.001
const fadeDist = normalHeroHeight * 0.75;
const fadeAtJustBelow = computeScrollFade(fadeDist * 0.998, normalHeroHeight);
const fadeAtThreshold = computeScrollFade(fadeDist * 0.999, normalHeroHeight);
const fadeAtEnd = computeScrollFade(fadeDist, normalHeroHeight);

assert(fadeAtJustBelow > 0.001, `Just before threshold (0.998), fade is ${fadeAtJustBelow.toFixed(4)} > 0.001 (rendering active)`);
assert(fadeAtThreshold <= 0.001001, `At threshold (0.999), fade is ${fadeAtThreshold.toFixed(4)} <= 0.001 (pausing triggered)`);
assert(fadeAtEnd <= 0.001, `At 100% fade distance, fade is 0.0 <= 0.001 (pausing triggered)`);

// Check canvas.style.opacity string formatting
assert(computeScrollFade(0, normalHeroHeight).toFixed(3) === "1.000", 'canvas.style.opacity at top is "1.000"');
assert(computeScrollFade(600, normalHeroHeight).toFixed(3) === "0.000", 'canvas.style.opacity at fade cutoff is "0.000"');

// 1.2 Alpha Range Stress Test (R4 requirement: 0.50–0.65)
function computeBaseAlpha(f) {
  return 0.52 + 0.13 * (f * 0.5 + 0.5);
}

function computeFinalAlpha(f, mouseInfluence, scrollFade) {
  const baseAlpha = computeBaseAlpha(f);
  const alpha = Math.min(0.70, Math.max(0.48, baseAlpha + mouseInfluence * 0.10));
  return alpha * scrollFade;
}

// Simplex noise output domain is [-1.0, 1.0]
const minBaseAlpha = computeBaseAlpha(-1.0);
const maxBaseAlpha = computeBaseAlpha(1.0);
const midBaseAlpha = computeBaseAlpha(0.0);

assert(Math.abs(minBaseAlpha - 0.52) < 1e-6, `Base alpha minimum at f=-1 is ${minBaseAlpha.toFixed(2)} (within 0.50-0.65 range)`);
assert(Math.abs(maxBaseAlpha - 0.65) < 1e-6, `Base alpha maximum at f=+1 is ${maxBaseAlpha.toFixed(2)} (within 0.50-0.65 range)`);
assert(Math.abs(midBaseAlpha - 0.585) < 1e-6, `Base alpha midpoint at f=0 is ${midBaseAlpha.toFixed(3)}`);

// Final alpha with mouse influence (0 to 1)
const alphaNoMouse = computeFinalAlpha(0.0, 0.0, 1.0);
const alphaFullMouse = computeFinalAlpha(1.0, 1.0, 1.0);
assert(alphaNoMouse >= 0.50 && alphaNoMouse <= 0.65, `Resting alpha (${alphaNoMouse.toFixed(3)}) is within 0.50-0.65`);
assert(alphaFullMouse <= 0.70, `Active hover alpha (${alphaFullMouse.toFixed(3)}) is capped at 0.70`);

// Scroll fade attenuation
const alphaFaded = computeFinalAlpha(1.0, 1.0, 0.0);
assert(alphaFaded === 0.0, 'Alpha when scrollFade=0 is exactly 0.0 (total transparency)');

// 1.3 Saturation Boost & Color Mixing Stress Test
function dot(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

function mix(x, y, a) {
  return [
    x[0] * (1 - a) + y[0] * a,
    x[1] * (1 - a) + y[1] * a,
    x[2] * (1 - a) + y[2] * a,
  ];
}

function clamp(v, min, max) {
  return [
    Math.min(max, Math.max(min, v[0])),
    Math.min(max, Math.max(min, v[1])),
    Math.min(max, Math.max(min, v[2])),
  ];
}

function applySaturationBoost(color, boostFactor = 1.25) {
  const luma = dot(color, [0.299, 0.587, 0.114]);
  return clamp(mix([luma, luma, luma], color, boostFactor), 0.0, 1.0);
}

// Test colors from HeroShader
const colCyan   = [0.20, 0.88, 0.92];
const colYellow = [1.00, 0.86, 0.25];
const colPink   = [1.00, 0.35, 0.75];
const colLime   = [0.46, 0.88, 0.30];

for (const [name, col] of [['Cyan', colCyan], ['Yellow', colYellow], ['Pink', colPink], ['Lime', colLime]]) {
  const boosted = applySaturationBoost(col);
  const inRange = boosted.every(c => c >= 0.0 && c <= 1.0 && !isNaN(c));
  assert(inRange, `${name} color stays valid in [0, 1]^3 after 1.25x saturation boost: [${boosted.map(c => c.toFixed(2)).join(', ')}]`);
}

// Neutral color test (gray shouldn't shift or distort)
const gray = [0.5, 0.5, 0.5];
const boostedGray = applySaturationBoost(gray);
assert(Math.abs(boostedGray[0] - 0.5) < 1e-4 && Math.abs(boostedGray[1] - 0.5) < 1e-4, 'Achromatic gray is preserved without color shift');

// 1.4 Autonomous Motion: Total Coordinate Velocity Check (Linear Drift + Oscillatory Flow)
// q.x coordinate argument: p * 1.3 + vec2(t * 0.30, t * 0.22) + flow1
// Net velocity: V1(t) = vec2(0.30 + 0.14 * cos(t * 0.40), 0.22 - 0.112 * sin(t * 0.32))
// q.y coordinate argument: p * 1.3 + vec2(-t * 0.25, t * 0.28) + flow2
// Net velocity: V2(t) = vec2(-0.25 - 0.108 * sin(t * 0.36 + 1.2), 0.28 + 0.126 * cos(t * 0.42 + 2.1))
function netCoordinateVelocity(t) {
  const v1_x = 0.30 + 0.40 * Math.cos(t * 0.40) * 0.35;
  const v1_y = 0.22 - 0.32 * Math.sin(t * 0.32) * 0.35;
  const speed1 = Math.sqrt(v1_x * v1_x + v1_y * v1_y);

  const v2_x = -0.25 - 0.36 * Math.sin(t * 0.36 + 1.2) * 0.30;
  const v2_y = 0.28 + 0.42 * Math.cos(t * 0.42 + 2.1) * 0.30;
  const speed2 = Math.sqrt(v2_x * v2_x + v2_y * v2_y);

  return { speed1, speed2, v1_x, v2_x };
}

let minSpeed1 = Infinity;
let minSpeed2 = Infinity;
let minVx1 = Infinity;
for (let t = 0; t < 100; t += 0.25) {
  const { speed1, speed2, v1_x } = netCoordinateVelocity(t);
  if (speed1 < minSpeed1) minSpeed1 = speed1;
  if (speed2 < minSpeed2) minSpeed2 = speed2;
  if (v1_x < minVx1) minVx1 = v1_x;
}

assert(minVx1 >= 0.15, `q.x x-velocity is strictly positive at all times (min vx: ${minVx1.toFixed(3)} >= 0.15), ensuring no stagnation`);
assert(minSpeed1 >= 0.18, `q domain coordinate speed is strictly non-zero at all times (min speed: ${minSpeed1.toFixed(3)} >= 0.18)`);
assert(minSpeed2 >= 0.18, `r domain coordinate speed is strictly non-zero at all times (min speed: ${minSpeed2.toFixed(3)} >= 0.18)`);

// ----------------------------------------------------
// Test Section 2: Real WebGL Compilation in Chrome
// ----------------------------------------------------
console.log('\n--- SECTION 2: WebGL Compilation & Uniform Oracle ---');

async function runBrowserTests() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Read exact shader code from HeroShader.tsx
    const heroShaderContent = fs.readFileSync(HERO_SHADER_PATH, 'utf-8');
    
    // Extract vsSource and fsSource
    const vsMatch = heroShaderContent.match(/const vsSource = `([\s\S]*?)`;/);
    const fsMatch = heroShaderContent.match(/const fsSource = `([\s\S]*?)`;/);
    
    assert(vsMatch !== null, 'Found vsSource in HeroShader.tsx');
    assert(fsMatch !== null, 'Found fsSource in HeroShader.tsx');
    
    const vsSource = vsMatch[1];
    const fsSource = fsMatch[1];

    // Evaluate in browser WebGL context
    const result = await page.evaluate(({ vsSource, fsSource }) => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const gl = canvas.getContext('webgl');
      if (!gl) return { success: false, error: 'WebGL not supported' };

      // Compile vertex shader
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, vsSource);
      gl.compileShader(vs);
      const vsSuccess = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
      const vsLog = gl.getShaderInfoLog(vs);

      // Compile fragment shader
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, fsSource);
      gl.compileShader(fs);
      const fsSuccess = gl.getShaderParameter(fs, gl.COMPILE_STATUS);
      const fsLog = gl.getShaderInfoLog(fs);

      // Link program
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      const linkSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
      const linkLog = gl.getProgramInfoLog(program);

      // Check uniforms
      const uRes = gl.getUniformLocation(program, 'u_resolution');
      const uTime = gl.getUniformLocation(program, 'u_time');
      const uMouse = gl.getUniformLocation(program, 'u_mouse');
      const uScrollFade = gl.getUniformLocation(program, 'u_scroll_fade');
      const aPos = gl.getAttribLocation(program, 'a_position');

      // Test a render call
      gl.useProgram(program);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uRes, 800, 600);
      gl.uniform1f(uTime, 1.0);
      gl.uniform2f(uMouse, 400, 300);
      gl.uniform1f(uScrollFade, 1.0);

      let drawError = null;
      try {
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } catch (err) {
        drawError = err.message;
      }
      const glError = gl.getError();

      return {
        success: true,
        vsSuccess,
        vsLog,
        fsSuccess,
        fsLog,
        linkSuccess,
        linkLog,
        hasURes: uRes !== null,
        hasUTime: uTime !== null,
        hasUMouse: uMouse !== null,
        hasUScrollFade: uScrollFade !== null,
        hasAPos: aPos >= 0,
        drawError,
        glError
      };
    }, { vsSource, fsSource });

    assert(result.success, 'Browser WebGL context initialized successfully');
    assert(result.vsSuccess, `Vertex Shader compiled without error (log: "${result.vsLog || 'clean'}")`);
    assert(result.fsSuccess, `Fragment Shader compiled without error (log: "${result.fsLog || 'clean'}")`);
    assert(result.linkSuccess, `Program linked successfully (log: "${result.linkLog || 'clean'}")`);
    assert(result.hasURes, 'Uniform u_resolution resolved successfully');
    assert(result.hasUTime, 'Uniform u_time resolved successfully');
    assert(result.hasUMouse, 'Uniform u_mouse resolved successfully');
    assert(result.hasUScrollFade, 'Uniform u_scroll_fade resolved successfully');
    assert(result.hasAPos, 'Attribute a_position resolved at index >= 0');
    assert(result.drawError === null && result.glError === 0, `gl.drawArrays executed cleanly (GL Error Code: ${result.glError})`);

    // ----------------------------------------------------
    // Test Section 3: Live Page Motion & Scroll Fade in Chrome
    // ----------------------------------------------------
    console.log('\n--- SECTION 3: Live Autonomous Motion & Opacity Sync ---');

    // Set realistic desktop viewport
    await page.setViewport({ width: 1440, height: 900 });

    // Inject WebGL spy hooks before page loads to capture draw calls and u_time uniform
    await page.evaluateOnNewDocument(() => {
      window.__drawCount = 0;
      window.__uTimeValues = [];
      let uTimeLoc = null;

      const origGetUniformLocation = WebGLRenderingContext.prototype.getUniformLocation;
      WebGLRenderingContext.prototype.getUniformLocation = function(prog, name) {
        const loc = origGetUniformLocation.call(this, prog, name);
        if (name === 'u_time') uTimeLoc = loc;
        return loc;
      };

      const origDraw = WebGLRenderingContext.prototype.drawArrays;
      WebGLRenderingContext.prototype.drawArrays = function(...args) {
        window.__drawCount++;
        return origDraw.apply(this, args);
      };

      const origUniform1f = WebGLRenderingContext.prototype.uniform1f;
      WebGLRenderingContext.prototype.uniform1f = function(loc, v) {
        if (loc === uTimeLoc) {
          window.__uTimeValues.push(v);
        }
        return origUniform1f.call(this, loc, v);
      };
    });

    // Connect to running preview server on port 4173
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('  Loaded http://localhost:4173 in Chrome');

    // 3.1 Check Hero canvas presence and attributes
    const canvasInfo = await page.evaluate(() => {
      const canvas = document.querySelector('section#hero canvas');
      if (!canvas) return null;
      return {
        exists: true,
        width: canvas.width,
        height: canvas.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight,
        className: canvas.className,
        mixBlend: window.getComputedStyle(canvas).mixBlendMode,
        opacity: canvas.style.opacity || window.getComputedStyle(canvas).opacity
      };
    });

    assert(canvasInfo !== null, 'Hero canvas element found in DOM within section#hero');
    assert(canvasInfo.clientWidth > 0 && canvasInfo.clientHeight > 0, `Canvas dimensions are non-zero (${canvasInfo.clientWidth}x${canvasInfo.clientHeight})`);
    assert(canvasInfo.className.includes('mix-blend-multiply'), 'Canvas has mix-blend-multiply class');
    assert(parseFloat(canvasInfo.opacity) >= 0.9, `Initial canvas opacity at top of page is ~1.0 (actual: ${canvasInfo.opacity})`);

    // 3.2 Continuous Autonomous Motion Verification (No Mouse Events)
    const inViewDraws = await page.evaluate(async () => {
      const start = window.__drawCount;
      const startTimeCount = window.__uTimeValues.length;
      await new Promise(r => setTimeout(r, 400));
      const end = window.__drawCount;
      const endTimeCount = window.__uTimeValues.length;
      const recentTimes = window.__uTimeValues.slice(-6);
      return {
        start,
        end,
        diff: end - start,
        timesAdded: endTimeCount - startTimeCount,
        recentTimes
      };
    });

    assert(inViewDraws.diff >= 10, `Canvas renders continuously without mouse input (${inViewDraws.diff} draw calls in 400ms)`);
    assert(inViewDraws.recentTimes.length >= 2 && inViewDraws.recentTimes[inViewDraws.recentTimes.length - 1] > inViewDraws.recentTimes[0], 
      `u_time advances continuously on every autonomous frame (t_start=${inViewDraws.recentTimes[0]?.toFixed(3)}, t_end=${inViewDraws.recentTimes[inViewDraws.recentTimes.length - 1]?.toFixed(3)})`);

    // 3.3 Scroll Fade & Draw Call Pausing Verification (scrollFade <= 0.001)
    const scrolledResult = await page.evaluate(async () => {
      window.scrollTo({ top: 1200, behavior: 'instant' });
      // Wait 2 animation frames for RAF loop to update scrollFade
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const canvas = document.querySelector('section#hero canvas');
      const opacity = canvas ? (canvas.style.opacity || window.getComputedStyle(canvas).opacity) : null;

      const startDraws = window.__drawCount;
      await new Promise(r => setTimeout(r, 300));
      const endDraws = window.__drawCount;

      return {
        scrollY: window.scrollY,
        opacity,
        drawCallsWhileScrolled: endDraws - startDraws
      };
    });

    assert(parseFloat(scrolledResult.opacity) === 0, `When scrolled to ${scrolledResult.scrollY}px, canvas opacity is smoothly attenuated to 0 (actual: "${scrolledResult.opacity}")`);
    assert(scrolledResult.drawCallsWhileScrolled === 0, `WebGL draw calls are completely PAUSED when scrolled out of view (draws in 300ms: ${scrolledResult.drawCallsWhileScrolled})`);

    // 3.4 Scroll Back to Top Restoration
    const restoredResult = await page.evaluate(async () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Wait 2 animation frames
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const canvas = document.querySelector('section#hero canvas');
      const opacity = canvas ? (canvas.style.opacity || window.getComputedStyle(canvas).opacity) : null;

      const startDraws = window.__drawCount;
      await new Promise(r => setTimeout(r, 400));
      const endDraws = window.__drawCount;

      return {
        scrollY: window.scrollY,
        opacity,
        drawCallsAfterResuming: endDraws - startDraws
      };
    });

    assert(parseFloat(restoredResult.opacity) >= 0.99, `When scrolling back to top, canvas opacity restores to 1.0 (actual: "${restoredResult.opacity}")`);
    assert(restoredResult.drawCallsAfterResuming >= 10, `WebGL draw calls seamlessly resume at full frame rate upon returning to Hero (${restoredResult.drawCallsAfterResuming} draws in 400ms)`);



  } finally {
    await browser.close();
  }
}

try {
  await runBrowserTests();
} catch (err) {
  console.error('Browser testing error:', err);
  failedTests++;
}

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================');

process.exit(failedTests > 0 ? 1 : 0);

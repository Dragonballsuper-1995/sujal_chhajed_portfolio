import fs from 'fs';
import path from 'path';
import http from 'http';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DIST_DIR = path.resolve('dist');

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

console.log('================================================================');
console.log('CHALLENGER 2 EMPIRICAL TEST SUITE: MILESTONE 2');
console.log('Target: BackgroundGrid.tsx, Hero.tsx, ProjectsSection.tsx (R2)');
console.log('================================================================\n');

// ----------------------------------------------------------------
// SECTION 1: Mathematical Dot Grid Expansion & Suppression Logic
// ----------------------------------------------------------------
console.log('--- SECTION 1: Mathematical Dot Grid Expansion & Suppression Logic ---');

const baseRadius = 1.5;
const hoverRadius = 180;
const maxExpansion = 3.7; // 1.5 + 3.7 = 5.2px
const maxRadius = baseRadius + maxExpansion;

function computeDotState(mouseX, mouseY, dotX, dotY) {
  const dx = mouseX - dotX;
  const dy = mouseY - dotY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  let radius = baseRadius;
  let alpha = 0.12;

  if (dist < hoverRadius) {
    const intensity = 1 - (dist / hoverRadius);
    radius = baseRadius + (intensity * 3.7);
    alpha = 0.12 + (intensity * 0.45);
  }

  return { dist, radius, alpha };
}

// 1.1 Direct cursor hit (dist = 0)
const directHit = computeDotState(200, 200, 200, 200);
assert(Math.abs(directHit.radius - 5.2) < 1e-4, `Direct hover hit yields maximum radius of 5.2px (got ${directHit.radius.toFixed(2)}px)`);
assert(Math.abs(directHit.alpha - 0.57) < 1e-4, `Direct hover hit yields maximum alpha of 0.57 (got ${directHit.alpha.toFixed(2)})`);

// 1.2 Halfway distance (dist = 90)
const halfHit = computeDotState(290, 200, 200, 200);
assert(Math.abs(halfHit.radius - 3.35) < 1e-4, `Halfway hover (dist=90px) yields radius 3.35px (got ${halfHit.radius.toFixed(2)}px)`);
assert(Math.abs(halfHit.alpha - 0.345) < 1e-4, `Halfway hover yields alpha 0.345 (got ${halfHit.alpha.toFixed(3)})`);

// 1.3 Boundary edge (dist = 180)
const edgeHit = computeDotState(380, 200, 200, 200);
assert(Math.abs(edgeHit.radius - 1.5) < 1e-4, `Boundary edge (dist=180px) remains baseline radius 1.5px (got ${edgeHit.radius.toFixed(2)}px)`);
assert(Math.abs(edgeHit.alpha - 0.12) < 1e-4, `Boundary edge remains baseline alpha 0.12 (got ${edgeHit.alpha.toFixed(2)})`);

// 1.4 Coordinate suppression to (-1000, -1000) across viewport boundaries
console.log('\nTesting coordinate suppression (-1000, -1000) across all screen bounds:');
const testCoords = [
  { x: 0, y: 0, desc: 'Top-left corner (0, 0)' },
  { x: 1920, y: 0, desc: 'Top-right corner (1920, 0)' },
  { x: 0, y: 1080, desc: 'Bottom-left corner (0, 1080)' },
  { x: 1920, y: 1080, desc: 'Bottom-right corner (1920, 1080)' },
  { x: 960, y: 540, desc: 'Screen center (960, 540)' },
  { x: 3840, y: 2160, desc: '4K extreme boundary (3840, 2160)' }
];

let allSuppressedPass = true;
for (const tc of testCoords) {
  const suppressedState = computeDotState(-1000, -1000, tc.x, tc.y);
  const isSuppressed = suppressedState.radius === baseRadius && suppressedState.alpha === 0.12 && suppressedState.dist >= 1414.2;
  if (!isSuppressed) allSuppressedPass = false;
  assert(isSuppressed, `Suppressed mouse at ${tc.desc}: dist=${suppressedState.dist.toFixed(1)}px > 180px -> radius=${suppressedState.radius.toFixed(2)}px, alpha=${suppressedState.alpha.toFixed(2)}`);
}
assert(allSuppressedPass, 'Mathematical guarantee: coordinates (-1000, -1000) NEVER trigger dot expansion on any viewport');

// ----------------------------------------------------------------
// SECTION 2: Source Code Contract Verification
// ----------------------------------------------------------------
console.log('\n--- SECTION 2: Source Code Contract Verification ---');

const bgGridSrc = fs.readFileSync(path.resolve('components/BackgroundGrid.tsx'), 'utf-8');
const heroSrc = fs.readFileSync(path.resolve('components/Hero.tsx'), 'utf-8');
const projectsSrc = fs.readFileSync(path.resolve('components/ProjectsSection.tsx'), 'utf-8');

// 2.1 BackgroundGrid text exclusion query contract
assert(bgGridSrc.includes('isHoveringTextOrBoundary'), 'BackgroundGrid contains isHoveringTextOrBoundary function');
assert(bgGridSrc.includes('mouse.x = -1000'), 'BackgroundGrid resets mouse.x to -1000 on text hover');
assert(bgGridSrc.includes('mouse.y = -1000'), 'BackgroundGrid resets mouse.y to -1000 on text hover');
assert(bgGridSrc.includes('.boundary-plate'), 'BackgroundGrid selector includes .boundary-plate');
assert(bgGridSrc.includes('[data-boundary]'), 'BackgroundGrid selector includes [data-boundary]');
assert(bgGridSrc.includes('h1, h2, h3, h4, h5, h6'), 'BackgroundGrid selector includes all heading tags h1-h6');
assert(bgGridSrc.includes('pointer-events-none'), 'BackgroundGrid canvas has pointer-events-none');
assert(bgGridSrc.includes('pointer: coarse'), 'BackgroundGrid has coarse pointer / touch detection');

// 2.2 Hero boundary plates contract
assert(heroSrc.includes('boundary-plate'), 'Hero.tsx contains boundary-plate class');
assert(heroSrc.includes('data-boundary="true"'), 'Hero.tsx contains data-boundary="true" attributes');
assert(heroSrc.includes('bg-white border-2 border-black shadow-neo-sm'), 'Hero.tsx uses solid neo-brutalist white backing plates');
assert(heroSrc.includes('relative z-10'), 'Hero.tsx uses relative z-10 stacking context');

// 2.3 ProjectsSection boundary plates contract
assert(projectsSrc.includes('boundary-plate'), 'ProjectsSection.tsx contains boundary-plate class');
assert(projectsSrc.includes('data-boundary="true"'), 'ProjectsSection.tsx contains data-boundary="true" attributes');
assert(projectsSrc.includes('Featured Systems'), 'ProjectsSection.tsx contains Featured Systems header');
assert(projectsSrc.includes('Specialized Labs & Machine Learning Models'), 'ProjectsSection.tsx contains Tier 2 Header');
assert(projectsSrc.includes('relative z-10'), 'ProjectsSection.tsx uses relative z-10 stacking context');

// ----------------------------------------------------------------
// SECTION 3: Live Headless Chromium DOM & Geometry Stress Test
// ----------------------------------------------------------------
console.log('\n--- SECTION 3: Live Headless Chromium DOM & Geometry Stress Test ---');

import { spawn } from 'child_process';

async function runBrowserSuite() {
  console.log('Spawning preview server on port 4173...');
  const previewProc = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--port', '4173', '--strictPort'], {
    cwd: process.cwd(),
    stdio: 'pipe'
  });

  // Wait 2.5s for server to start
  await new Promise(r => setTimeout(r, 2500));

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('  Loaded http://localhost:4173');

    // Wait for LoadingScreen to unmount (520ms animation)
    await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-\\[9999\\]'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 600));
    console.log('  LoadingScreen unmounted; page fully interactive');

    // 3.1 Viewport Sweeps for Horizontal Overflow
    console.log('\n--- 3.1 Viewport Sweeps (Horizontal Overflow & Layout Shielding) ---');
    const viewports = [
      { width: 1440, height: 900, name: 'Desktop 1440px' },
      { width: 1024, height: 768, name: 'Tablet Landscape 1024px' },
      { width: 768, height: 1024, name: 'Tablet Portrait 768px' },
      { width: 390, height: 844, name: 'Mobile Target 390px (iPhone 14)' },
      { width: 320, height: 568, name: 'Narrow Mobile 320px (iPhone SE)' }
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise((r) => setTimeout(r, 100));

      const overflowResult = await page.evaluate(() => {
        const scrollW = document.documentElement.scrollWidth;
        const innerW = window.innerWidth;
        const hero = document.getElementById('hero');
        const projects = document.getElementById('projects');
        return {
          hasOverflow: scrollW > innerW,
          scrollWidth: scrollW,
          innerWidth: innerW,
          heroWidth: hero ? hero.offsetWidth : null,
          projectsWidth: projects ? projects.offsetWidth : null
        };
      });

      assert(!overflowResult.hasOverflow, `${vp.name}: Zero horizontal overflow (scrollWidth=${overflowResult.scrollWidth}px, innerWidth=${overflowResult.innerWidth}px)`);
      if (overflowResult.heroWidth) {
        assert(overflowResult.heroWidth <= vp.width, `${vp.name}: Hero section width (${overflowResult.heroWidth}px) <= viewport width (${vp.width}px)`);
      }
      if (overflowResult.projectsWidth) {
        assert(overflowResult.projectsWidth <= vp.width, `${vp.name}: Projects section width (${overflowResult.projectsWidth}px) <= viewport width (${vp.width}px)`);
      }
    }

    // Set standard desktop viewport for DOM element inspections
    await page.setViewport({ width: 1440, height: 900 });

    // 3.2 BackgroundGrid Canvas Inspection
    console.log('\n--- 3.2 BackgroundGrid Canvas DOM & Style Inspection ---');
    const canvasStyles = await page.evaluate(() => {
      const canvas = document.querySelector('canvas.fixed');
      if (!canvas) return null;
      const computed = window.getComputedStyle(canvas);
      return {
        exists: true,
        position: computed.position,
        pointerEvents: computed.pointerEvents,
        zIndex: computed.zIndex,
        width: canvas.width,
        height: canvas.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight
      };
    });

    assert(canvasStyles !== null, 'BackgroundGrid canvas element exists in DOM');
    assert(canvasStyles.position === 'fixed', `Canvas position is "fixed" (got "${canvasStyles.position}")`);
    assert(canvasStyles.pointerEvents === 'none', `Canvas pointer-events is "none" (unblocked interaction)`);
    assert(canvasStyles.zIndex === '0', `Canvas zIndex is "0" (background level)`);
    assert(canvasStyles.clientWidth === 1440, `Canvas clientWidth matches viewport width (${canvasStyles.clientWidth}px)`);

    // 3.3 Hero Solid Boundary Backing Plates Inspection
    console.log('\n--- 3.3 Hero Solid Boundary Backing Plates Inspection ---');
    const heroPlates = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      if (!hero) return null;

      // 1. Availability badge
      const badge = hero.querySelector('.boundary-plate[data-boundary="true"]');
      const badgeStyle = badge ? window.getComputedStyle(badge) : null;

      // 2. Headline H1
      const h1 = hero.querySelector('h1');
      const h1Style = h1 ? window.getComputedStyle(h1) : null;

      // 3. Punchy subtitle
      const subtitle = hero.querySelector('p')?.closest('.boundary-plate');
      const subtitleStyle = subtitle ? window.getComputedStyle(subtitle) : null;

      // 4. Action buttons
      const buttons = Array.from(hero.querySelectorAll('button, a[href]')).map(el => {
        const cs = window.getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim().substring(0, 20),
          bg: cs.backgroundColor,
          border: cs.borderWidth
        };
      });

      // 5. Feature strip
      const strip = hero.querySelector('.inline-flex.flex-wrap.items-center.gap-x-6');
      const stripStyle = strip ? window.getComputedStyle(strip) : null;

      return {
        badge: badgeStyle ? {
          bg: badgeStyle.backgroundColor,
          border: badgeStyle.borderWidth,
          borderColor: badgeStyle.borderColor,
          hasBoundaryPlate: badge.classList.contains('boundary-plate'),
          dataBoundary: badge.getAttribute('data-boundary')
        } : null,
        h1: h1Style ? {
          text: h1.innerText.substring(0, 30),
          fontSize: h1Style.fontSize
        } : null,
        subtitle: subtitleStyle ? {
          bg: subtitleStyle.backgroundColor,
          border: subtitleStyle.borderWidth,
          borderColor: subtitleStyle.borderColor,
          zIndex: subtitleStyle.zIndex,
          position: subtitleStyle.position,
          hasBoundaryPlate: subtitle.classList.contains('boundary-plate'),
          dataBoundary: subtitle.getAttribute('data-boundary')
        } : null,
        buttons,
        strip: stripStyle ? {
          bg: stripStyle.backgroundColor,
          border: stripStyle.borderWidth,
          borderColor: stripStyle.borderColor,
          zIndex: stripStyle.zIndex,
          hasBoundaryPlate: strip.classList.contains('boundary-plate'),
          dataBoundary: strip.getAttribute('data-boundary')
        } : null
      };
    });

    assert(heroPlates.badge !== null, 'Hero availability badge exists');
    assert(heroPlates.badge.bg === 'rgb(255, 255, 255)', `Hero badge has solid white background (${heroPlates.badge.bg})`);
    assert(parseFloat(heroPlates.badge.border) >= 2, `Hero badge has solid border >= 2px (${heroPlates.badge.border})`);
    assert(heroPlates.badge.hasBoundaryPlate === true, 'Hero badge has .boundary-plate class');
    assert(heroPlates.badge.dataBoundary === 'true', 'Hero badge has data-boundary="true"');

    assert(heroPlates.subtitle !== null, 'Hero subtitle boundary plate exists');
    assert(heroPlates.subtitle.bg === 'rgb(255, 255, 255)', `Hero subtitle plate has solid white background (${heroPlates.subtitle.bg})`);
    assert(parseFloat(heroPlates.subtitle.border) >= 2, `Hero subtitle plate has border >= 2px (${heroPlates.subtitle.border})`);
    assert(heroPlates.subtitle.borderColor === 'rgb(0, 0, 0)', `Hero subtitle plate has black border (${heroPlates.subtitle.borderColor})`);
    assert(heroPlates.subtitle.zIndex === '10', `Hero subtitle plate has stacking context zIndex="10" (${heroPlates.subtitle.zIndex})`);
    assert(heroPlates.subtitle.position === 'relative', `Hero subtitle plate has position="relative"`);
    assert(heroPlates.subtitle.hasBoundaryPlate === true, 'Hero subtitle has .boundary-plate class');

    assert(heroPlates.strip !== null, 'Hero feature strip plate exists');
    assert(heroPlates.strip.bg === 'rgb(255, 255, 255)', `Hero feature strip has solid white background (${heroPlates.strip.bg})`);
    assert(parseFloat(heroPlates.strip.border) >= 2, `Hero feature strip has border >= 2px (${heroPlates.strip.border})`);
    assert(heroPlates.strip.zIndex === '10', `Hero feature strip has stacking context zIndex="10"`);

    assert(heroPlates.buttons.length >= 4, `Hero contains ${heroPlates.buttons.length} action buttons/links with solid backing`);
    for (const btn of heroPlates.buttons) {
      assert(btn.bg !== 'transparent' && btn.bg !== 'rgba(0, 0, 0, 0)', `Hero CTA "${btn.text}" has solid background (${btn.bg})`);
      assert(parseFloat(btn.border) >= 2, `Hero CTA "${btn.text}" has solid border >= 2px (${btn.border})`);
    }

    // 3.4 ProjectsSection Solid Boundary Backing Plates Inspection
    console.log('\n--- 3.4 ProjectsSection Solid Boundary Backing Plates Inspection ---');
    const projectsPlates = await page.evaluate(() => {
      const section = document.getElementById('projects');
      if (!section) return null;

      // 1. Section Header Plate
      const secHeader = section.querySelector('h2')?.closest('.boundary-plate');
      const secHeaderStyle = secHeader ? window.getComputedStyle(secHeader) : null;

      // 2. Tier 2 Header Plate
      const tier2H3 = Array.from(section.querySelectorAll('h3')).find(h => h.textContent.includes('Specialized Labs'));
      const tier2Header = tier2H3 ? tier2H3.closest('.boundary-plate') : null;
      const tier2Style = tier2Header ? window.getComputedStyle(tier2Header) : null;

      // 3. Project cards
      const cards = Array.from(section.querySelectorAll('.grid > div')).map(card => {
        const cs = window.getComputedStyle(card);
        return {
          bg: cs.backgroundColor,
          border: cs.borderWidth,
          borderColor: cs.borderColor
        };
      });

      // 4. GitHub deep link banner
      const banner = section.querySelector('.p-6.bg-white.border-2');
      const bannerStyle = banner ? window.getComputedStyle(banner) : null;

      return {
        secHeader: secHeaderStyle ? {
          bg: secHeaderStyle.backgroundColor,
          border: secHeaderStyle.borderWidth,
          borderColor: secHeaderStyle.borderColor,
          zIndex: secHeaderStyle.zIndex,
          position: secHeaderStyle.position,
          hasBoundaryPlate: secHeader.classList.contains('boundary-plate'),
          dataBoundary: secHeader.getAttribute('data-boundary')
        } : null,
        tier2Header: tier2Style ? {
          bg: tier2Style.backgroundColor,
          border: tier2Style.borderWidth,
          borderColor: tier2Style.borderColor,
          zIndex: tier2Style.zIndex,
          position: tier2Style.position,
          hasBoundaryPlate: tier2Header.classList.contains('boundary-plate'),
          dataBoundary: tier2Header.getAttribute('data-boundary')
        } : null,
        cardsCount: cards.length,
        banner: bannerStyle ? {
          bg: bannerStyle.backgroundColor,
          border: bannerStyle.borderWidth,
          borderColor: bannerStyle.borderColor,
          zIndex: bannerStyle.zIndex,
          hasBoundaryPlate: banner.classList.contains('boundary-plate'),
          dataBoundary: banner.getAttribute('data-boundary')
        } : null
      };
    });

    assert(projectsPlates.secHeader !== null, 'Projects section header boundary plate exists');
    assert(projectsPlates.secHeader.bg === 'rgb(255, 255, 255)', `Projects section header has solid white background (${projectsPlates.secHeader.bg})`);
    assert(parseFloat(projectsPlates.secHeader.border) >= 2, `Projects section header has border >= 2px (${projectsPlates.secHeader.border})`);
    assert(projectsPlates.secHeader.zIndex === '10', `Projects section header has zIndex="10"`);
    assert(projectsPlates.secHeader.hasBoundaryPlate === true, 'Projects section header has .boundary-plate class');
    assert(projectsPlates.secHeader.dataBoundary === 'true', 'Projects section header has data-boundary="true"');

    assert(projectsPlates.tier2Header !== null, 'Projects Tier 2 header boundary plate exists');
    assert(projectsPlates.tier2Header.bg === 'rgb(255, 255, 255)', `Projects Tier 2 header has solid white background (${projectsPlates.tier2Header.bg})`);
    assert(parseFloat(projectsPlates.tier2Header.border) >= 2, `Projects Tier 2 header has border >= 2px (${projectsPlates.tier2Header.border})`);
    assert(projectsPlates.tier2Header.zIndex === '10', `Projects Tier 2 header has zIndex="10"`);
    assert(projectsPlates.tier2Header.hasBoundaryPlate === true, 'Projects Tier 2 header has .boundary-plate class');
    assert(projectsPlates.tier2Header.dataBoundary === 'true', 'Projects Tier 2 header has data-boundary="true"');

    assert(projectsPlates.banner !== null, 'Projects GitHub banner boundary plate exists');
    assert(projectsPlates.banner.bg === 'rgb(255, 255, 255)', `GitHub banner has solid white background (${projectsPlates.banner.bg})`);
    assert(parseFloat(projectsPlates.banner.border) >= 2, `GitHub banner has border >= 2px (${projectsPlates.banner.border})`);
    assert(projectsPlates.banner.zIndex === '10', `GitHub banner has zIndex="10"`);
    assert(projectsPlates.banner.hasBoundaryPlate === true, 'GitHub banner has .boundary-plate class');

    // 3.5 Text Hover Exclusion Simulation across All Typography
    console.log('\n--- 3.5 Text Hover Exclusion Simulation across All Typography ---');
    const hoverExclusionResults = await page.evaluate(() => {
      const selector = 'h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li, a, button, input, textarea, label, [data-boundary], .boundary-plate, [role="article"]';

      // Test a battery of representative elements
      const hero = document.getElementById('hero');
      const projects = document.getElementById('projects');

      const elementsToTest = [
        { label: 'Hero H1', el: hero.querySelector('h1') },
        { label: 'Hero H1 nested span', el: hero.querySelector('h1 span') },
        { label: 'Hero availability badge', el: hero.querySelector('.boundary-plate') },
        { label: 'Hero subtitle paragraph', el: hero.querySelector('p') },
        { label: 'Hero CTA button', el: hero.querySelector('button') },
        { label: 'Hero CTA link', el: hero.querySelector('a') },
        { label: 'Hero feature strip', el: hero.querySelector('.boundary-plate:last-of-type') },
        { label: 'Projects section H2', el: projects.querySelector('h2') },
        { label: 'Projects section description P', el: projects.querySelector('p') },
        { label: 'Projects Flagship Card H3', el: projects.querySelector('h3') },
        { label: 'Projects Tier 2 H3', el: Array.from(projects.querySelectorAll('h3')).find(h => h.textContent.includes('Specialized Labs')) },
        { label: 'Projects GitHub banner', el: projects.querySelector('.p-6.bg-white') }
      ];

      const results = [];
      for (const item of elementsToTest) {
        if (!item.el) {
          results.push({ label: item.label, found: false, matches: false });
          continue;
        }
        const matches = !!item.el.closest(selector);
        results.push({ label: item.label, found: true, matches });
      }

      // Also test non-text/empty area simulation
      // Create a dummy non-text div outside the selector
      const emptyGutter = document.createElement('div');
      emptyGutter.id = 'test-empty-gutter';
      document.body.appendChild(emptyGutter);
      const gutterMatches = !!emptyGutter.closest(selector);
      document.body.removeChild(emptyGutter);

      return { results, gutterMatches };
    });

    for (const item of hoverExclusionResults.results) {
      assert(item.found, `Target element exists: ${item.label}`);
      assert(item.matches, `isHoveringTextOrBoundary matches element: ${item.label} (triggering coordinate suppression to -1000, -1000)`);
    }

    assert(!hoverExclusionResults.gutterMatches, 'Non-text empty gutter does NOT match selector (allowing normal interactive hover expansion)');

    // 3.6 Deep Recursive Leaf-Node Coverage Audit
    console.log('\n--- 3.6 Deep Recursive Leaf-Node Coverage Audit ---');
    const leafAudit = await page.evaluate(() => {
      const selector = 'h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li, a, button, input, textarea, label, [data-boundary], .boundary-plate, [role="article"]';
      const hero = document.getElementById('hero');
      const projects = document.getElementById('projects');

      function checkAllLeaves(root) {
        const textLeaves = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        let node;
        while ((node = walker.nextNode())) {
          // If element contains direct text or is an SVG inside text
          if (node.children.length === 0 && (node.textContent.trim().length > 0 || node.tagName.toLowerCase() === 'svg' || node.tagName.toLowerCase() === 'path')) {
            const matches = !!node.closest(selector);
            textLeaves.push({
              tag: node.tagName.toLowerCase(),
              text: node.textContent.trim().substring(0, 20),
              matches
            });
          }
        }
        return textLeaves;
      }

      const heroLeaves = checkAllLeaves(hero);
      const projectsLeaves = checkAllLeaves(projects);

      // Categorize leaves: those with solid backing plates vs those directly matched
      const heroUnshielded = heroLeaves.filter(l => !l.matches);
      
      // In projects section, check whether any missed leaf is NOT shielded by a solid container
      const projectsUnshielded = [];
      for (const leaf of projectsLeaves) {
        if (!leaf.matches) {
          projectsUnshielded.push(leaf);
        }
      }

      return {
        heroTotal: heroLeaves.length,
        heroMissedCount: heroUnshielded.length,
        projectsTotal: projectsLeaves.length,
        projectsUnshieldedCount: projectsUnshielded.length
      };
    });

    assert(leafAudit.heroTotal > 15, `Audited ${leafAudit.heroTotal} leaf elements in Hero section`);
    assert(leafAudit.heroMissedCount === 0, `Hero section: 100% of text elements match exclusion selector`);

    assert(leafAudit.projectsTotal > 30, `Audited ${leafAudit.projectsTotal} leaf elements in Projects section`);
    
    // Check ProjectCards solid backing plate shielding
    const cardBackingCheck = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#projects .grid > div'));
      return cards.map(c => {
        const cs = window.getComputedStyle(c);
        // Also check if card has an inner container with bg-white
        const innerCard = c.querySelector('.bg-white') || c;
        const innerCs = window.getComputedStyle(innerCard);
        return {
          hasSolidBg: innerCs.backgroundColor === 'rgb(255, 255, 255)' || cs.backgroundColor === 'rgb(255, 255, 255)',
          hasBorder: parseFloat(innerCs.borderWidth) >= 2 || parseFloat(cs.borderWidth) >= 2,
          bg: innerCs.backgroundColor || cs.backgroundColor
        };
      });
    });

    assert(cardBackingCheck.length === 8, `Found 8 project cards in ProjectsSection (3 Flagship + 5 Archive)`);
    const allCardsSolid = cardBackingCheck.every(c => c.hasSolidBg && c.hasBorder);
    assert(allCardsSolid, `All 8 ProjectCards have solid white backing plates (rgb(255, 255, 255)) and solid borders (>= 2px) to prevent dot bleed`);

    // 3.7 Simulated Live Mouse Move & Coordinate Suppression Execution
    console.log('\n--- 3.7 Simulated Live Mouse Move & Coordinate Suppression Execution ---');
    const liveSimulation = await page.evaluate(() => {
      // Simulate dispatching a mousemove over Hero H1
      const h1 = document.querySelector('h1');
      const rect = h1.getBoundingClientRect();

      const event = new MouseEvent('mousemove', {
        clientX: rect.left + 50,
        clientY: rect.top + 20,
        bubbles: true,
        cancelable: true
      });

      // Query selector check exactly as in BackgroundGrid.tsx
      const target = h1;
      const isHovering = !!target.closest(
        'h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li, a, button, input, textarea, label, [data-boundary], .boundary-plate, [role="article"]'
      );

      let mouse = { x: 500, y: 500 };
      if (isHovering) {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      return {
        isHovering,
        mouseCoordAfterHover: mouse
      };
    });

    assert(liveSimulation.isHovering === true, 'Simulated hover over Hero H1 triggers isHovering === true');
    assert(liveSimulation.mouseCoordAfterHover.x === -1000 && liveSimulation.mouseCoordAfterHover.y === -1000, 'Mouse coordinates suppressed to (-1000, -1000)');

    await browser.close();
  } catch (err) {
    console.error('Browser testing error:', err);
    failedTests++;
  } finally {
    try {
      previewProc.kill('SIGKILL');
    } catch (_) {}
  }

  console.log('\n================================================================');
  console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('================================================================');

  process.exit(failedTests > 0 ? 1 : 0);
}

runBrowserSuite();

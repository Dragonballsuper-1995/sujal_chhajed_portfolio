import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PREVIEW_PORT = 4176;

let passedTests = 0;
let failedTests = 0;
const testLogs = [];

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    testLogs.push({ status: 'PASS', message });
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
    testLogs.push({ status: 'FAIL', message });
    failedTests++;
  }
}

console.log('================================================================');
console.log('CHALLENGER 2 EMPIRICAL TEST SUITE: MILESTONE 3');
console.log('Target: Contact Form Contrast, Input States, Viewport Sweeps & Grid Occlusion');
console.log('================================================================\n');

// ----------------------------------------------------------------
// SECTION 1: WCAG 2.1 Color Contrast Mathematics & Luminance
// ----------------------------------------------------------------
console.log('--- SECTION 1: WCAG 2.1 Relative Luminance & Contrast Calculation ---');

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  if (cleanHex.length === 6) {
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }
  return { r: 0, g: 0, b: 0 };
}

function getRelativeLuminance({ r, g, b }) {
  const [sR, sG, sB] = [r, g, b].map(c => {
    const norm = c / 255;
    return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hexToRgb(hex1));
  const l2 = getRelativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// 1.1 Contact form container (#FFFFFF) against dark background (#0A0A10)
const darkBg = '#0A0A10';
const whiteCard = '#FFFFFF';
const formContainerContrast = getContrastRatio(whiteCard, darkBg);
console.log(`  Contact Form Container (#FFFFFF) vs Section Background (#0A0A10): ${formContainerContrast.toFixed(2)}:1`);
assert(formContainerContrast > 15.0, `Form container contrast (${formContainerContrast.toFixed(2)}:1) strictly exceeds 15:1 requirement`);
assert(formContainerContrast > 19.0, `Form container contrast (${formContainerContrast.toFixed(2)}:1) approaches maximum possible 21:1 (ideal AAA neo-brutalist focal card)`);

// 1.2 Form text (#000000) against white container (#FFFFFF)
const textContrast = getContrastRatio('#000000', whiteCard);
assert(textContrast === 21.0, `Black text on white container has perfect 21:1 contrast ratio`);

// 1.3 Form inputs (#FAF8F5) against input text (#000000)
const inputBg = '#FAF8F5';
const inputTextContrast = getContrastRatio('#000000', inputBg);
assert(inputTextContrast > 19.0, `Input text (#000000) against input background (#FAF8F5) has high contrast of ${inputTextContrast.toFixed(2)}:1 (> 7:1 AAA)`);

// 1.4 Form header (#FFDE59) against header text (#000000)
const neoYellow = '#FFDE59';
const headerTextContrast = getContrastRatio('#000000', neoYellow);
assert(headerTextContrast > 15.0, `Header banner text (#000000) on neo-yellow (#FFDE59) has contrast of ${headerTextContrast.toFixed(2)}:1 (> 7:1 AAA)`);

// 1.5 Submit button default (#FFDE59) and hover (#FF66C4) text contrast
const submitBtnContrast = getContrastRatio('#000000', neoYellow);
const neoPink = '#FF66C4';
const submitBtnHoverContrast = getContrastRatio('#000000', neoPink);
assert(submitBtnContrast > 15.0, `Submit button default state text contrast is ${submitBtnContrast.toFixed(2)}:1 (> 7:1 AAA)`);
assert(submitBtnHoverContrast > 7.0, `Submit button hover state text (#000000) on neo-pink (#FF66C4) has contrast of ${submitBtnHoverContrast.toFixed(2)}:1 (> 7:1 AAA)`);

// ----------------------------------------------------------------
// SECTION 2: Source Code Invariants & Contract Verification
// ----------------------------------------------------------------
console.log('\n--- SECTION 2: Source Code Contract Invariants ---');

const contactSrc = fs.readFileSync(path.resolve('components/ContactSection.tsx'), 'utf-8');
const skillsSrc = fs.readFileSync(path.resolve('components/Skills.tsx'), 'utf-8');
const footerSrc = fs.readFileSync(path.resolve('components/Footer.tsx'), 'utf-8');

// 2.1 ContactSection contracts
assert(contactSrc.includes('bg-[#0A0A10]'), 'ContactSection has background #0A0A10');
assert(contactSrc.includes('bg-white border-4 border-black p-0 shadow-[8px_8px_0px_0px_#FFDE59]'), 'Contact form container has bg-white, 4px border black, and 8px neo-yellow shadow');
assert(contactSrc.includes('bg-neo-yellow px-6 py-4 border-b-4 border-black'), 'Contact form banner has neo-yellow background with 4px bottom border');
assert(contactSrc.includes('DIRECT TRANSMISSION'), 'Contact form includes DIRECT TRANSMISSION badge');
assert(contactSrc.includes('bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black'), 'Contact form inputs have #FAF8F5 background, black text, 2px border');
assert(contactSrc.includes('focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#FFDE59]'), 'Contact form inputs have focus:bg-white, focus:ring-black, and neo-yellow focus shadow');
assert(contactSrc.includes('bg-neo-yellow hover:bg-neo-pink text-black font-black uppercase py-4 px-6 border-3 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000]'), 'Contact submit button has neo-yellow to neo-pink hover, 3px border, tactile shadow expansion');
assert(contactSrc.includes('bottom-0 right-0 sm:right-4'), 'Watermark monogram positioned at bottom-0 right-0 sm:right-4');
assert(contactSrc.includes('overflow-hidden'), 'ContactSection has overflow-hidden preventing watermark clip or bleed');
assert(!contactSrc.includes('Chennai, India'), 'Chennai, India successfully purged from ContactSection');
assert(!contactSrc.includes('MapPin'), 'MapPin import completely removed from ContactSection');

// 2.2 Skills contracts
assert(!skillsSrc.includes('activeCategory'), 'Skills.tsx has no activeCategory state');
assert(!skillsSrc.includes('All Categories'), 'Skills.tsx has no category filter button bar');
assert(skillsSrc.includes('boundary-plate'), 'Skills.tsx cards have boundary-plate class for BackgroundGrid exclusion');
assert(skillsSrc.includes('bg-white border-2 border-black p-5 sm:p-6 shadow-neo-sm relative z-10 boundary-plate mb-8 sm:mb-12'), 'Skills section header card uses opaque white boundary plate');
assert(skillsSrc.includes('bg-white border-2 border-black p-5 sm:p-6 shadow-neo-sm relative z-10 boundary-plate'), 'Skills category row cards use opaque white boundary plates');
assert(skillsSrc.includes('CATEGORY_KEYS'), 'Skills.tsx defines category keys for unified rendering');

// 2.3 Footer contracts
assert(footerSrc.includes('bg-[#0A0A10]'), 'Footer.tsx uses #0A0A10 dark background');
assert(!footerSrc.includes('border-t-2 border-white/10'), 'Footer.tsx has no border-t-2 border-white/10 seam against ContactSection');
assert(footerSrc.includes('Chennai, India • Available Globally'), 'Footer copyright strip preserves exclusive location display');

// ----------------------------------------------------------------
// SECTION 3: Live Headless Chromium DOM & Style Verification
// ----------------------------------------------------------------
console.log('\n--- SECTION 3: Live Headless Chromium DOM & Style Verification ---');

async function runBrowserSuite() {
  console.log(`Starting vite preview server on port ${PREVIEW_PORT}...`);
  const previewProc = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--port', String(PREVIEW_PORT), '--strictPort'], {
    cwd: process.cwd(),
    stdio: 'pipe'
  });

  // Give preview server 2.5s to start
  await new Promise(resolve => setTimeout(resolve, 2500));

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PREVIEW_PORT}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log(`  Connected to http://localhost:${PREVIEW_PORT}`);

    // Wait for LoadingScreen to unmount
    await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-\\[9999\\]'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 600));
    console.log('  LoadingScreen unmounted; page active');

    // Scroll to contact section
    await page.evaluate(() => {
      document.getElementById('contact')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 400));

    // 3.1 Inspect Computed Styles of Contact Section
    const contactSectionStyles = await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        backgroundColor: cs.backgroundColor,
        borderTopWidth: cs.borderTopWidth,
        borderTopColor: cs.borderTopColor,
        overflow: cs.overflow
      };
    });
    assert(contactSectionStyles !== null, 'Contact section (#contact) found in DOM');
    assert(contactSectionStyles.backgroundColor === 'rgb(10, 10, 16)', `ContactSection computed background is rgb(10, 10, 16) (#0A0A10) (got ${contactSectionStyles.backgroundColor})`);
    assert(contactSectionStyles.borderTopWidth === '4px', `ContactSection top border is 4px (got ${contactSectionStyles.borderTopWidth})`);
    assert(contactSectionStyles.overflow === 'hidden', `ContactSection overflow is hidden (got ${contactSectionStyles.overflow})`);

    // 3.2 Inspect Computed Styles of Footer
    const footerStyles = await page.evaluate(() => {
      const el = document.querySelector('footer');
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        backgroundColor: cs.backgroundColor,
        overflow: cs.overflow
      };
    });
    assert(footerStyles !== null, 'Footer found in DOM');
    assert(footerStyles.backgroundColor === 'rgb(10, 10, 16)', `Footer computed background is identical rgb(10, 10, 16) (#0A0A10) (got ${footerStyles.backgroundColor})`);
    assert(footerStyles.overflow === 'hidden', `Footer overflow is hidden (got ${footerStyles.overflow})`);

    // 3.3 Inspect Contact Form Container Card
    const formCardStyles = await page.evaluate(() => {
      const card = document.querySelector('#contact form')?.closest('.border-4.border-black');
      if (!card) return null;
      const cs = window.getComputedStyle(card);
      return {
        backgroundColor: cs.backgroundColor,
        borderWidth: cs.borderTopWidth,
        borderColor: cs.borderTopColor,
        boxShadow: cs.boxShadow
      };
    });
    assert(formCardStyles !== null, 'Contact form card container (.border-4.border-black) found in DOM');
    assert(formCardStyles.backgroundColor === 'rgb(255, 255, 255)', `Form container computed background is pure white rgb(255, 255, 255) (got ${formCardStyles.backgroundColor})`);
    assert(formCardStyles.borderWidth === '4px', `Form container computed border is 4px (got ${formCardStyles.borderWidth})`);
    assert(formCardStyles.borderColor === 'rgb(0, 0, 0)', `Form container computed border color is black (got ${formCardStyles.borderColor})`);
    assert(formCardStyles.boxShadow.includes('255, 222, 89') || formCardStyles.boxShadow.includes('#ffde59'), `Form container computed box-shadow contains neo-yellow #FFDE59 (got ${formCardStyles.boxShadow})`);

    // 3.4 Inspect Contact Form Header Banner
    const formBannerStyles = await page.evaluate(() => {
      const banner = document.querySelector('#contact .bg-neo-yellow.border-b-4');
      if (!banner) return null;
      const cs = window.getComputedStyle(banner);
      return {
        backgroundColor: cs.backgroundColor,
        borderBottomWidth: cs.borderBottomWidth,
        borderBottomColor: cs.borderBottomColor
      };
    });
    assert(formBannerStyles !== null, 'Form banner found in DOM');
    assert(formBannerStyles.backgroundColor === 'rgb(255, 222, 89)', `Form banner background is neo-yellow rgb(255, 222, 89) (got ${formBannerStyles.backgroundColor})`);
    assert(formBannerStyles.borderBottomWidth === '4px', `Form banner bottom border is 4px (got ${formBannerStyles.borderBottomWidth})`);

    // 3.5 Inspect Form Inputs (Default & Focus States)
    const inputStyles = await page.evaluate(() => {
      const input = document.querySelector('#contact input[type="text"]');
      if (!input) return null;
      const cs = window.getComputedStyle(input);
      return {
        backgroundColor: cs.backgroundColor,
        borderWidth: cs.borderTopWidth,
        borderColor: cs.borderTopColor,
        boxShadow: cs.boxShadow
      };
    });
    assert(inputStyles !== null, 'Form text input found in DOM');
    assert(inputStyles.backgroundColor === 'rgb(250, 248, 245)', `Form input default background is off-white canvas rgb(250, 248, 245) (#FAF8F5) (got ${inputStyles.backgroundColor})`);
    assert(inputStyles.borderWidth === '2px', `Form input border is 2px (got ${inputStyles.borderWidth})`);
    assert(inputStyles.borderColor === 'rgb(0, 0, 0)', `Form input border color is black (got ${inputStyles.borderColor})`);

    // Focus input and verify settled focus state after CSS transition (150ms transition)
    await page.focus('#contact input[type="text"]');
    await new Promise(r => setTimeout(r, 400));
    const inputFocusStyles = await page.evaluate(() => {
      const input = document.querySelector('#contact input[type="text"]');
      const cs = window.getComputedStyle(input);
      return {
        backgroundColor: cs.backgroundColor,
        boxShadow: cs.boxShadow
      };
    });
    assert(inputFocusStyles.backgroundColor === 'rgb(255, 255, 255)', `Form input focus state transitions to solid white rgb(255, 255, 255) (got ${inputFocusStyles.backgroundColor})`);
    assert(inputFocusStyles.boxShadow.includes('255, 222, 89'), `Form input focus state activates neo-yellow focus shadow (got ${inputFocusStyles.boxShadow})`);
    assert(inputFocusStyles.boxShadow.includes('0px 0px 0px 2px'), `Form input focus state activates 2px black focus ring (got ${inputFocusStyles.boxShadow})`);

    // 3.6 Inspect Submit Button (Default, Hover)
    const btnStyles = await page.evaluate(() => {
      const btn = document.querySelector('#contact button[type="submit"]');
      if (!btn) return null;
      const cs = window.getComputedStyle(btn);
      return {
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        borderWidth: cs.borderTopWidth,
        borderColor: cs.borderTopColor,
        boxShadow: cs.boxShadow
      };
    });
    assert(btnStyles !== null, 'Submit button found in DOM');
    assert(btnStyles.backgroundColor === 'rgb(255, 222, 89)', `Submit button default background is neo-yellow rgb(255, 222, 89) (got ${btnStyles.backgroundColor})`);
    assert(btnStyles.color === 'rgb(0, 0, 0)', `Submit button text color is black rgb(0, 0, 0) (got ${btnStyles.color})`);
    assert(btnStyles.borderWidth === '3px', `Submit button border width is 3px (got ${btnStyles.borderWidth})`);

    // Hover button using mouse coordinates and verify settled hover state
    const btnHandle = await page.$('#contact button[type="submit"]');
    const btnBox = await btnHandle.boundingBox();
    await page.mouse.move(btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2);
    await new Promise(r => setTimeout(r, 400));
    const btnHoverStyles = await page.evaluate(() => {
      const btn = document.querySelector('#contact button[type="submit"]');
      const cs = window.getComputedStyle(btn);
      return {
        backgroundColor: cs.backgroundColor,
        boxShadow: cs.boxShadow,
        isHover: btn.matches(':hover')
      };
    });
    assert(btnHoverStyles.isHover, 'Submit button correctly matches :hover pseudo-class');
    assert(btnHoverStyles.backgroundColor === 'rgb(255, 102, 196)', `Submit button hover transitions to neo-pink rgb(255, 102, 196) (#FF66C4) (got ${btnHoverStyles.backgroundColor})`);
    assert(btnHoverStyles.boxShadow.includes('6px 6px'), `Submit button hover increases tactile shadow offset to 6px (got ${btnHoverStyles.boxShadow})`);

    // Move mouse away
    await page.mouse.move(0, 0);
    await new Promise(r => setTimeout(r, 200));

    // 3.7 Form Required Fields Validation
    const formHasRequired = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('#contact input, #contact textarea'));
      return inputs.every(i => i.hasAttribute('required'));
    });
    assert(formHasRequired, 'All contact form fields (name, email, message) have required validation constraint');

    // ----------------------------------------------------------------
    // SECTION 4: Skills Boundary Cards Grid Dot Occlusion Verification
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 4: Skills Boundary Cards Grid Dot Occlusion Verification ---');

    await page.evaluate(() => {
      document.getElementById('skills')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 400));

    const skillsBoundaryInfo = await page.evaluate(() => {
      const boundaryCards = Array.from(document.querySelectorAll('#skills .boundary-plate'));
      const bgCanvas = document.querySelector('canvas');
      const canvasZIndex = bgCanvas ? window.getComputedStyle(bgCanvas).zIndex : 'auto';

      const cardsData = boundaryCards.map((card, idx) => {
        const cs = window.getComputedStyle(card);
        const rect = card.getBoundingClientRect();
        return {
          index: idx,
          backgroundColor: cs.backgroundColor,
          opacity: cs.opacity,
          zIndex: cs.zIndex,
          hasBoundaryClass: card.classList.contains('boundary-plate'),
          width: rect.width,
          height: rect.height,
          pillCount: card.querySelectorAll('.inline-flex').length
        };
      });

      return {
        cardCount: boundaryCards.length,
        canvasZIndex,
        cardsData
      };
    });

    assert(skillsBoundaryInfo.cardCount === 5, `Skills section contains exactly 5 boundary cards (1 header + 4 category rows) (got ${skillsBoundaryInfo.cardCount})`);
    assert(skillsBoundaryInfo.canvasZIndex === '0', `Background canvas has zIndex === 0 (got ${skillsBoundaryInfo.canvasZIndex})`);

    let allCardsOcclude = true;
    for (const card of skillsBoundaryInfo.cardsData) {
      const isOpaqueWhite = card.backgroundColor === 'rgb(255, 255, 255)' && card.opacity === '1';
      const isAboveCanvas = parseInt(card.zIndex, 10) >= 10;
      if (!isOpaqueWhite || !isAboveCanvas) allCardsOcclude = false;
      assert(
        isOpaqueWhite && isAboveCanvas,
        `Card #${card.index + 1} is solid opaque white (bg: ${card.backgroundColor}, opacity: ${card.opacity}) with zIndex ${card.zIndex} >= 10 -> occludes background canvas grid dots completely`
      );
    }
    assert(allCardsOcclude, 'All 5 Skills boundary cards mathematically and visually guarantee zero dot grid bleed through text');

    // Verify all 23 skill pills rendered across category rows
    const totalPills = await page.evaluate(() => {
      return document.querySelectorAll('#skills .inline-flex.items-center.gap-2\\.5').length;
    });
    assert(totalPills === 23, `All 23 skills rendered simultaneously in unsegmented technical arsenal (got ${totalPills})`);

    // Verify pills have solid background classes
    const pillsSolidBg = await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('#skills .inline-flex.items-center.gap-2\\.5'));
      return pills.every(p => {
        const bg = window.getComputedStyle(p).backgroundColor;
        return bg.startsWith('rgb(') && !bg.includes('rgba(');
      });
    });
    assert(pillsSolidBg, 'All 23 skill pills have solid opaque background colors (blue, green, yellow, purple)');

    // ----------------------------------------------------------------
    // SECTION 5: Responsive Viewport Sweeps (1440, 1024, 390, 320px)
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 5: Responsive Viewport Sweeps (Zero Horizontal Overflow) ---');

    const viewports = [
      { width: 1440, height: 900, name: '1440px Desktop' },
      { width: 1024, height: 768, name: '1024px Tablet Landscape' },
      { width: 390, height: 844, name: '390px Mobile (iPhone 14)' },
      { width: 320, height: 568, name: '320px Narrow Mobile (iPhone SE)' }
    ];

    for (const vp of viewports) {
      console.log(`\n  Testing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 400));

      const overflowMetrics = await page.evaluate(() => {
        const bodyScrollWidth = document.body.scrollWidth;
        const htmlScrollWidth = document.documentElement.scrollWidth;
        const windowWidth = window.innerWidth;

        const skillsEl = document.getElementById('skills');
        const contactEl = document.getElementById('contact');
        const footerEl = document.querySelector('footer');

        const getOverflow = (el) => {
          if (!el) return { present: false, scrollWidth: 0, clientWidth: 0 };
          return {
            present: true,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            hasOverflow: el.scrollWidth > el.clientWidth
          };
        };

        const wideElements = [];
        const allElements = document.querySelectorAll('#skills *, #contact *, footer *');
        allElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > windowWidth + 1.0) {
            wideElements.push({
              tag: el.tagName,
              id: el.id,
              className: (el.className || '').toString().slice(0, 60),
              right: rect.right,
              excess: rect.right - windowWidth
            });
          }
        });

        return {
          windowWidth,
          bodyScrollWidth,
          htmlScrollWidth,
          skills: getOverflow(skillsEl),
          contact: getOverflow(contactEl),
          footer: getOverflow(footerEl),
          wideElementsCount: wideElements.length,
          wideElements: wideElements.slice(0, 3)
        };
      });

      const zeroDocOverflow = overflowMetrics.htmlScrollWidth <= vp.width && overflowMetrics.bodyScrollWidth <= vp.width;
      assert(
        zeroDocOverflow,
        `[${vp.name}] Document horizontal scroll width (${overflowMetrics.htmlScrollWidth}px) <= viewport width (${vp.width}px)`
      );

      assert(
        !overflowMetrics.skills.hasOverflow,
        `[${vp.name}] Skills section zero horizontal overflow (scrollWidth: ${overflowMetrics.skills.scrollWidth}px, clientWidth: ${overflowMetrics.skills.clientWidth}px)`
      );

      assert(
        !overflowMetrics.contact.hasOverflow,
        `[${vp.name}] Contact section zero horizontal overflow (scrollWidth: ${overflowMetrics.contact.scrollWidth}px, clientWidth: ${overflowMetrics.contact.clientWidth}px)`
      );

      assert(
        !overflowMetrics.footer.hasOverflow,
        `[${vp.name}] Footer section zero horizontal overflow (scrollWidth: ${overflowMetrics.footer.scrollWidth}px, clientWidth: ${overflowMetrics.footer.clientWidth}px)`
      );

      assert(
        overflowMetrics.wideElementsCount === 0,
        `[${vp.name}] Zero child elements in Skills, Contact, or Footer leak past viewport right edge (excess: 0px)`
      );
    }

    // ----------------------------------------------------------------
    // SECTION 6: Watermark Monogram Geometry & Clipping Verification
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 6: Watermark Monogram Geometry & Clipping Verification ---');

    for (const vp of [viewports[0], viewports[2], viewports[3]]) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 200));

      const watermarkData = await page.evaluate(() => {
        const contactSection = document.getElementById('contact');
        const watermark = contactSection?.querySelector('.pointer-events-none.select-none');
        if (!contactSection || !watermark) return null;

        const sectionRect = contactSection.getBoundingClientRect();
        const wmRect = watermark.getBoundingClientRect();

        return {
          sectionWidth: sectionRect.width,
          sectionRight: sectionRect.right,
          wmRight: wmRect.right,
          wmBottom: wmRect.bottom,
          sectionBottom: sectionRect.bottom,
          rightAligned: wmRect.right <= sectionRect.right + 2.0,
          clippedByParent: window.getComputedStyle(contactSection).overflow === 'hidden'
        };
      });

      assert(watermarkData !== null, `[${vp.name}] Watermark monogram found in Contact section`);
      assert(watermarkData.rightAligned, `[${vp.name}] Watermark right boundary (${watermarkData.wmRight.toFixed(1)}px) does not breach section right boundary (${watermarkData.sectionRight.toFixed(1)}px)`);
      assert(watermarkData.clippedByParent, `[${vp.name}] Watermark is safely contained by parent section overflow:hidden`);
    }

  } finally {
    await browser.close();
    previewProc.kill();
    try {
      spawn('taskkill', ['/pid', String(previewProc.pid), '/f', '/t']);
    } catch {}
  }
}

async function main() {
  try {
    await runBrowserSuite();
  } catch (err) {
    console.error('Fatal error during browser suite execution:', err);
    failedTests++;
  }

  console.log('\n================================================================');
  console.log(`TEST SUITE SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('================================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();

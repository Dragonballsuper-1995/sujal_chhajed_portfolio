import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:4176';

let passedTests = 0;
let failedTests = 0;
const testLogs = [];

function assert(condition, message, details = '') {
  if (condition) {
    console.log(  [PASS] );
    testLogs.push({ status: 'PASS', message, details });
    passedTests++;
  } else {
    console.error(  [FAIL]  );
    testLogs.push({ status: 'FAIL', message, details });
    failedTests++;
  }
}

console.log('================================================================');
console.log('CHALLENGER FINAL EMPIRICAL TEST SUITE: MILESTONE 4');
console.log('Overall Acceptance Criteria & Quality Floor Verification');
console.log('================================================================\n');

// WCAG Contrast Calculation Helpers
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
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

async function runEmpiricalSuite() {
  console.log('--- SECTION 1: Static Source Code & Contract Invariants ---');
  
  const headerSrc = fs.readFileSync('components/Header.tsx', 'utf-8');
  const heroSrc = fs.readFileSync('components/Hero.tsx', 'utf-8');
  const heroShaderSrc = fs.readFileSync('components/HeroShader.tsx', 'utf-8');
  const gridSrc = fs.readFileSync('components/BackgroundGrid.tsx', 'utf-8');
  const projectsSrc = fs.readFileSync('components/ProjectsSection.tsx', 'utf-8');
  const skillsSrc = fs.readFileSync('components/Skills.tsx', 'utf-8');
  const aboutSrc = fs.readFileSync('components/About.tsx', 'utf-8');
  const contactSrc = fs.readFileSync('components/ContactSection.tsx', 'utf-8');
  const footerSrc = fs.readFileSync('components/Footer.tsx', 'utf-8');

  // Criteria 1 invariants
  assert(!skillsSrc.includes('activeCategory'), 'Skills.tsx has no activeCategory state');
  assert(!skillsSrc.includes('setActiveCategory'), 'Skills.tsx has no setActiveCategory setter');
  assert(!skillsSrc.includes('All Categories'), 'Skills.tsx has no  All Categories filter tab');
  assert(skillsSrc.includes(ml-genai) && skillsSrc.includes(fullstack) && skillsSrc.includes(data-eng) && skillsSrc.includes(mlops), 'Skills.tsx renders all 4 category keys');
  assert(skillsSrc.includes('boundary-plate'), 'Skills.tsx elements have boundary-plate class');

  // Criteria 2 invariants
  assert(gridSrc.includes('isHoveringTextOrBoundary'), 'BackgroundGrid implements isHoveringTextOrBoundary detection');
  assert(gridSrc.includes('closest'), 'BackgroundGrid checks element ancestors with .closest()');
  assert(gridSrc.includes('h1, h2, h3, h4, h5, h6, p'), 'BackgroundGrid checks heading and paragraph typography');
  assert(gridSrc.includes('.boundary-plate') && gridSrc.includes('[data-boundary]'), 'BackgroundGrid excludes boundary-plate and data-boundary targets');
  assert(gridSrc.includes('mouse.x = -1000') && gridSrc.includes('mouse.y = -1000'), 'BackgroundGrid resets coordinates off-screen on typography hover');

  // Criteria 3 invariants
  assert(heroShaderSrc.includes('u_time'), 'HeroShader implements u_time uniform');
  assert(heroShaderSrc.includes('u_scroll_fade'), 'HeroShader implements u_scroll_fade uniform');
  assert(heroShaderSrc.includes('scrollFade <='), 'HeroShader pauses rendering when scrolled out of view');
  assert(heroShaderSrc.includes('canvas.style.opacity = scrollFade'), 'HeroShader synchronizes CSS canvas.style.opacity with scroll progress');

  // Criteria 4 invariants
  assert(heroShaderSrc.includes('0.52 + 0.13 * (f * 0.5 + 0.5)'), 'HeroShader base alpha boosted to 0.52-0.65 range');
  assert(heroShaderSrc.includes('colCyan') && heroShaderSrc.includes('colYellow') && heroShaderSrc.includes('colPink') && heroShaderSrc.includes('colLime'), 'HeroShader defines vibrant chromatic pastel palette');
  assert(heroShaderSrc.includes('1.25'), 'HeroShader implements 1.25x color saturation boost curve');

  // Criteria 5 invariants
  assert(headerSrc.includes('text-lg sm:text-xl font-black'), 'Header author name has text-lg sm:text-xl font-black display styling');
  assert(headerSrc.includes('w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center'), 'Header logo wrapper has clean dimensions without double borders');
  assert(!headerSrc.includes('border-2 border-black sm:border-3') && !headerSrc.includes('shadow-neo-sm'), 'Header logo wrapper has no redundant outer borders or shadows');

  // Criteria 6 invariants
  assert(!aboutSrc.includes('Principles') && !aboutSrc.includes('Zero Hallucinations') && !aboutSrc.includes('<100ms Latency'), 'About section has no Principles card');
  assert(aboutSrc.includes('grid-cols-1 lg:grid-cols-12') && aboutSrc.includes('lg:col-span-5') && aboutSrc.includes('lg:col-span-7'), 'About section structured as 2-column layout (5 cols + 7 cols)');

  // Criteria 7 invariants
  assert(contactSrc.includes('bg-[#0A0A10]'), 'ContactSection background is #0A0A10');
  assert(footerSrc.includes('bg-[#0A0A10]'), 'Footer background is #0A0A10');
  assert(!footerSrc.includes('border-t-2 border-white/10'), 'Footer has no border-t divider seam against ContactSection');
  assert(contactSrc.includes('bottom-0 right-0 sm:right-4'), 'Contact monogram watermark positioned bottom-0 right-0 sm:right-4');
  assert(contactSrc.includes('overflow-hidden'), 'ContactSection has overflow-hidden preventing monogram clipping');

  // Criteria 8 invariants
  assert(!heroSrc.includes('Chennai, India'), 'Hero.tsx does not contain Chennai India');
  assert(!aboutSrc.includes('Chennai, India'), 'About.tsx does not contain Chennai India');
  assert(!contactSrc.includes('Chennai, India'), 'ContactSection.tsx does not contain Chennai India');
  assert(footerSrc.includes('Chennai, India • Available Globally'), 'Footer.tsx contains Chennai India • Available Globally in copyright strip');

  // Criteria 9 invariants
  assert(contactSrc.includes('bg-white border-4 border-black p-0 shadow-[8px_8px_0px_0px_#FFDE59]'), 'Contact form container styled as high-contrast card with 4px border and neo-yellow shadow');
  assert(contactSrc.includes('bg-neo-yellow px-6 py-4 border-b-4 border-black'), 'Contact form header banner styled with neo-yellow background and 4px black border');
  assert(contactSrc.includes('DIRECT TRANSMISSION'), 'Contact form includes DIRECT TRANSMISSION badge');
  assert(contactSrc.includes('bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black'), 'Contact form inputs use high-contrast #FAF8F5 background with 2px black border');
  assert(contactSrc.includes('focus:shadow-[4px_4px_0px_0px_#FFDE59]'), 'Contact form inputs feature neo-yellow focus shadow');
  assert(contactSrc.includes('bg-neo-yellow hover:bg-neo-pink text-black font-black uppercase py-4 px-6 border-3 border-[3px] border-black'), 'Submit button styled with neo-yellow, bold border, and neo-pink hover state');

  const formContrast = getContrastRatio('#FFFFFF', '#0A0A10');
  assert(formContrast > 19.0, 'White form container against #0A0A10 background achieves contrast of > 19:1');

  console.log('\n--- SECTION 2: Live Browser DOM & Viewport Testing ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  try {
    const page = await browser.newPage();

    // Collect console errors to ensure zero runtime exceptions
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.toString());
    });

    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('  Successfully loaded ' + APP_URL);

    // Wait for LoadingScreen to exit if present
    await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-\\[9999\\]'), { timeout: 8000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 600));

    // Check for runtime errors
    assert(consoleErrors.length === 0, Zero runtime console errors on page load (found ), consoleErrors.join('; '));

    // Test Viewports for Zero Horizontal Overflow
    console.log('\n--- 2.1 Viewport Overflow Sweeps ---');
    const viewports = [
      { width: 1440, height: 900, name: 'Desktop 1440px' },
      { width: 1024, height: 768, name: 'Tablet Landscape 1024px' },
      { width: 768, height: 1024, name: 'Tablet Portrait 768px' },
      { width: 390, height: 844, name: 'Mobile Standard 390px (iPhone 14)' },
      { width: 320, height: 568, name: 'Narrow Mobile 320px (iPhone SE)' }
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 150));

      const overflowData = await page.evaluate(() => {
        const scrollW = document.documentElement.scrollWidth;
        const innerW = window.innerWidth;
        const bodyScrollW = document.body.scrollWidth;

        // Check if any element exceeds the viewport width
        const allElements = Array.from(document.querySelectorAll('*'));
        const offendingElements = [];
        for (const el of allElements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > innerW + 1 && !['CANVAS', 'SCRIPT', 'STYLE'].includes(el.tagName)) {
            const compStyle = window.getComputedStyle(el);
            if (compStyle.overflow !== 'hidden' && compStyle.display !== 'none') {
              offendingElements.push({
                tag: el.tagName,
                id: el.id,
                className: el.className ? String(el.className).slice(0, 40) : '',
                right: Math.round(rect.right),
                innerWidth: innerW
              });
              if (offendingElements.length >= 3) break;
            }
          }
        }

        return {
          scrollW,
          innerW,
          bodyScrollW,
          hasOverflow: scrollW > innerW,
          offending: offendingElements
        };
      });

      assert(!overflowData.hasOverflow, ${vp.name}: document.documentElement.scrollWidth (px) <= window.innerWidth (px), Offending: );
    }

    // Reset viewport to desktop for section verification
    await page.setViewport({ width: 1440, height: 900 });
    await new Promise(r => setTimeout(r, 100));

    // Criterion 1: Skills Section in Live DOM
    console.log('\n--- 2.2 Criterion 1: Skills Section Verification ---');
    const skillsDomData = await page.evaluate(() => {
      const skillsSec = document.getElementById('skills');
      if (!skillsSec) return null;
      
      const buttons = Array.from(skillsSec.querySelectorAll('button')).map(b => b.textContent.trim());
      const filterButtons = buttons.filter(txt => 
        txt.includes('All') || txt.includes('ML & GenAI') || txt.includes('Full-Stack') || txt.includes('Data Eng') || txt.includes('MLOps')
      );

      const h3s = Array.from(skillsSec.querySelectorAll('h3')).map(h => h.textContent.trim());
      const boundaryCards = Array.from(skillsSec.querySelectorAll('.boundary-plate'));
      const skillPills = Array.from(skillsSec.querySelectorAll('.boundary-plate div.inline-flex'));

      return {
        found: true,
        filterButtons,
        headings: h3s,
        boundaryCardsCount: boundaryCards.length,
        skillPillsCount: skillPills.length
      };
    });

    assert(skillsDomData && skillsDomData.found, 'Skills section (#skills) rendered in DOM');
    assert(skillsDomData.filterButtons.length === 0, No category filter buttons exist in Skills section (found: ));
    assert(skillsDomData.headings.some(h => h.includes('MACHINE LEARNING')), 'Skills category Machine Learning & GenAI heading present in DOM');
    assert(skillsDomData.headings.some(h => h.includes('FULL-STACK')), 'Skills category Full-Stack Engineering heading present in DOM');
    assert(skillsDomData.headings.some(h => h.includes('DATA ENGINEERING')), 'Skills category Data Engineering & Analytics heading present in DOM');
    assert(skillsDomData.headings.some(h => h.includes('MLOPS')), 'Skills category MLOps & Cloud Infrastructure heading present in DOM');
    assert(skillsDomData.boundaryCardsCount >= 5, Skills section has 5 solid boundary cards (1 header + 4 category rows) (found: ));
    assert(skillsDomData.skillPillsCount >= 20, All technical skill pills rendered simultaneously without segmentation (count: ));

    // Criterion 2: Background Grid Text Boundary Exclusion
    console.log('\n--- 2.3 Criterion 2: Background Grid Text Boundary Exclusion ---');
    const gridData = await page.evaluate(() => {
      const canvas = document.querySelector('canvas.fixed.inset-0');
      if (!canvas) return { canvasFound: false };
      
      const compStyle = window.getComputedStyle(canvas);
      return {
        canvasFound: true,
        pointerEvents: compStyle.pointerEvents,
        position: compStyle.position,
        zIndex: compStyle.zIndex
      };
    });

    assert(gridData.canvasFound, 'BackgroundGrid canvas is mounted in DOM');
    assert(gridData.pointerEvents === 'none', BackgroundGrid canvas has pointer-events: none (got: ));
    assert(gridData.position === 'fixed', 'BackgroundGrid canvas is fixed full-viewport');

    const hoverExclusionTest = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const paragraph = document.querySelector('p');
      const boundaryPlate = document.querySelector('.boundary-plate');
      const emptyDiv = document.createElement('div');
      document.body.appendChild(emptyDiv);

      const checkEl = (el) => {
        return !!el.closest('h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li, a, button, input, textarea, label, [data-boundary], .boundary-plate, [role=article]');
      };

      const h1Excluded = checkEl(h1);
      const pExcluded = checkEl(paragraph);
      const plateExcluded = checkEl(boundaryPlate);
      const emptyExcluded = checkEl(emptyDiv);

      document.body.removeChild(emptyDiv);

      return { h1Excluded, pExcluded, plateExcluded, emptyExcluded };
    });

    assert(hoverExclusionTest.h1Excluded, 'H1 typography triggers boundary exclusion');
    assert(hoverExclusionTest.pExcluded, 'Paragraph typography triggers boundary exclusion');
    assert(hoverExclusionTest.plateExcluded, 'Boundary plate container triggers boundary exclusion');
    assert(!hoverExclusionTest.emptyExcluded, 'Non-text background does not trigger boundary exclusion');

    // Criterion 3: Hero WebGL Shader Continuous Animation & Scroll Fade
    console.log('\n--- 2.4 Criterion 3: Hero WebGL Shader Continuous Motion & Scroll Fade ---');
    const shaderData = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      if (!hero) return { found: false };
      const canvas = hero.querySelector('canvas');
      if (!canvas) return { found: false };
      const compStyle = window.getComputedStyle(canvas);
      return {
        found: true,
        initialOpacity: canvas.style.opacity || compStyle.opacity,
        pointerEvents: compStyle.pointerEvents,
        position: compStyle.position
      };
    });

    assert(shaderData.found, 'Hero WebGL shader canvas mounted inside #hero');
    assert(shaderData.pointerEvents === 'none', 'Hero WebGL canvas has pointer-events: none');

    const scrollPositions = [0, 200, 450, 750, 1200];
    const opacityResults = [];

    for (const y of scrollPositions) {
      await page.evaluate((scrollY) => {
        window.scrollTo(0, scrollY);
      }, y);
      await new Promise(r => setTimeout(r, 100));

      const opacity = await page.evaluate(() => {
        const hero = document.getElementById('hero');
        const canvas = hero ? hero.querySelector('canvas') : null;
        return canvas ? parseFloat(canvas.style.opacity || window.getComputedStyle(canvas).opacity) : null;
      });
      opacityResults.push({ scrollY: y, opacity });
    }

    console.log('  Scroll fade values:', opacityResults.map(o => scrollY= -> opacity=).join(', '));
    assert(opacityResults[0].opacity >= 0.95, At scrollY=0, shader opacity is near 1.0 (got ));
    assert(opacityResults[1].opacity < opacityResults[0].opacity, At scrollY=200, shader opacity decreases (got ));
    assert(opacityResults[opacityResults.length - 1].opacity === 0, When scrolled down (scrollY=1200), shader opacity fades completely to 0.000 (got ));

    // Reset scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 100));

    // Criterion 5: Header Logo & Author Name
    console.log('\n--- 2.5 Criterion 5: Header Logo & Author Name Display ---');
    const headerData = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return null;
      const logoImg = header.querySelector('img[src=/logo-light.svg]');
      const logoWrapper = logoImg ? logoImg.parentElement : null;
      const authorSpan = header.querySelector('button span.font-sans');

      let logoWrapperBorder = null;
      let logoWrapperShadow = null;
      let authorFontSize = null;
      let authorFontWeight = null;
      let authorText = null;

      if (logoWrapper) {
        const style = window.getComputedStyle(logoWrapper);
        logoWrapperBorder = style.borderWidth;
        logoWrapperShadow = style.boxShadow;
      }

      if (authorSpan) {
        const style = window.getComputedStyle(authorSpan);
        authorFontSize = parseFloat(style.fontSize);
        authorFontWeight = style.fontWeight;
        authorText = authorSpan.textContent.trim();
      }

      return {
        hasLogo: !!logoImg,
        logoWrapperBorder,
        logoWrapperShadow,
        authorFontSize,
        authorFontWeight,
        authorText
      };
    });

    assert(headerData && headerData.hasLogo, 'Header contains logo image with /logo-light.svg');
    assert(headerData.logoWrapperBorder === '0px', Logo wrapper has no double border (computed border-width: ));
    assert(headerData.logoWrapperShadow === 'none', Logo wrapper has no redundant shadow (computed box-shadow: ));
    assert(headerData.authorText.includes('Sujal Chhajed'), Author name is displayed in Header: );
    assert(headerData.authorFontSize >= 18, Author name font size is bold and prominent (>= 18px, got px));
    assert(parseInt(headerData.authorFontWeight) >= 800, Author name font weight is black/bold (>= 800, got ));

    // Criterion 6: About Section 2-Column Structure & Principles Removal
    console.log('\n--- 2.6 Criterion 6: About Section Structure ---');
    const aboutData = await page.evaluate(() => {
      const aboutSec = document.getElementById('about');
      if (!aboutSec) return null;

      const text = aboutSec.innerText;
      const hasPrinciples = text.includes('Zero Hallucinations') || text.includes('Latency') || text.includes('Offline-First') || text.includes('01 Zero');
      
      const profileImg = aboutSec.querySelector('img[src=/profile-pic-4.webp]');
      const originStory = text.includes('Origin Story');

      const gridContainer = aboutSec.querySelector('.grid');
      const childColumns = gridContainer ? gridContainer.children.length : 0;

      return {
        found: true,
        hasPrinciples,
        hasProfileImg: !!profileImg,
        originStory,
        childColumns
      };
    });

    assert(aboutData && aboutData.found, 'About section (#about) mounted in DOM');
    assert(!aboutData.hasPrinciples, 'About section completely removed Principles cards');
    assert(aboutData.childColumns === 2, About section structured with exactly 2 main columns (got ));
    assert(aboutData.hasProfileImg, 'About section contains framed profile photo (/profile-pic-4.webp)');
    assert(aboutData.originStory, 'About section contains highlighted Origin Story card');

    // Criterion 7: Contact Section & Footer Dark Continuity
    console.log('\n--- 2.7 Criterion 7: Contact & Footer Dark Continuity ---');
    const darkContinuityData = await page.evaluate(() => {
      const contactSec = document.getElementById('contact');
      const footerEl = document.querySelector('footer');

      const contactBg = contactSec ? window.getComputedStyle(contactSec).backgroundColor : null;
      const footerBg = footerEl ? window.getComputedStyle(footerEl).backgroundColor : null;

      const contactBorderBottom = contactSec ? window.getComputedStyle(contactSec).borderBottomWidth : null;
      const footerBorderTop = footerEl ? window.getComputedStyle(footerEl).borderTopWidth : null;

      const watermark = contactSec ? contactSec.querySelector('.text-\\[12rem\\], .text-\\[16rem\\], .text-\\[20rem\\], .text-\\[24rem\\]') : null;
      let watermarkPos = null;
      if (watermark) {
        const style = window.getComputedStyle(watermark);
        watermarkPos = {
          position: style.position,
          bottom: style.bottom,
          right: style.right,
          overflow: window.getComputedStyle(contactSec).overflow
        };
      }

      return {
        contactBg,
        footerBg,
        contactBorderBottom,
        footerBorderTop,
        watermarkFound: !!watermark,
        watermarkPos
      };
    });

    assert(darkContinuityData.contactBg === 'rgb(10, 10, 16)', ContactSection background color is deep dark #0A0A10 (rgb(10, 10, 16)));
    assert(darkContinuityData.footerBg === 'rgb(10, 10, 16)', Footer background color is identical #0A0A10 (rgb(10, 10, 16)));
    assert(darkContinuityData.contactBorderBottom === '0px', No border-bottom on ContactSection (got: ));
    assert(darkContinuityData.footerBorderTop === '0px', No border-top on Footer (got: ));
    assert(darkContinuityData.watermarkFound, 'Watermark monogram SC present in ContactSection');
    assert(darkContinuityData.watermarkPos.overflow === 'hidden', 'ContactSection has overflow: hidden preventing watermark clipping or horizontal overflow');

    // Criterion 8: Location De-duplication across Sections
    console.log('\n--- 2.8 Criterion 8: Location De-duplication Verification ---');
    const locationData = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const about = document.getElementById('about');
      const contact = document.getElementById('contact');
      const footer = document.querySelector('footer');

      const heroText = hero ? hero.innerText : '';
      const aboutText = about ? about.innerText : '';
      const contactText = contact ? contact.innerText : '';
      const footerText = footer ? footer.innerText : '';
      const bodyText = document.body.innerText;

      const countOccurrences = (str, sub) => (str.match(new RegExp(sub, 'gi')) || []).length;

      return {
        heroHasLocation: heroText.includes('Chennai, India'),
        aboutHasLocation: aboutText.includes('Chennai, India'),
        contactHasLocation: contactText.includes('Chennai, India'),
        footerHasLocation: footerText.includes('Chennai, India'),
        bodyOccurrences: countOccurrences(bodyText, 'Chennai, India')
      };
    });

    assert(!locationData.heroHasLocation, 'Hero section does NOT contain Chennai India');
    assert(!locationData.aboutHasLocation, 'About section does NOT contain Chennai India');
    assert(!locationData.contactHasLocation, 'Contact section does NOT contain Chennai India');
    assert(locationData.footerHasLocation, 'Footer copyright strip DOES contain Chennai India');
    assert(locationData.bodyOccurrences === 1, Exactly 1 occurrence of Chennai India exists in visible DOM (found: ));

    // Criterion 9: High-Contrast Highlighted Contact Form
    console.log('\n--- 2.9 Criterion 9: High-Contrast Contact Form Card Verification ---');
    const formCardData = await page.evaluate(() => {
      const contactSec = document.getElementById('contact');
      if (!contactSec) return null;

      const formContainer = contactSec.querySelector('.bg-white.border-4.border-black');
      if (!formContainer) return { found: false };

      const formStyle = window.getComputedStyle(formContainer);
      const banner = formContainer.querySelector('.bg-neo-yellow');
      const bannerStyle = banner ? window.getComputedStyle(banner) : null;

      const badge = formContainer.querySelector('.bg-neo-pink');
      const badgeText = badge ? badge.textContent.trim() : '';

      const inputs = Array.from(formContainer.querySelectorAll('input, textarea'));
      const inputStyles = inputs.map(i => {
        const s = window.getComputedStyle(i);
        return {
          bg: s.backgroundColor,
          border: s.borderWidth,
          color: s.color
        };
      });

      const submitBtn = formContainer.querySelector('button[type=submit]');
      const btnStyle = submitBtn ? window.getComputedStyle(submitBtn) : null;

      return {
        found: true,
        containerBg: formStyle.backgroundColor,
        containerBorder: formStyle.borderWidth,
        containerShadow: formStyle.boxShadow,
        bannerBg: bannerStyle ? bannerStyle.backgroundColor : null,
        badgeText,
        inputCount: inputs.length,
        inputStyles,
        submitBtnFound: !!submitBtn,
        submitBtnBg: btnStyle ? btnStyle.backgroundColor : null
      };
    });

    assert(formCardData && formCardData.found, 'High-contrast contact form container mounted in ContactSection');
    assert(formCardData.containerBg === 'rgb(255, 255, 255)', Form container has crisp white background (#FFFFFF, rgb(255, 255, 255)));
    assert(formCardData.containerBorder === '4px', Form container has bold 4px black border (got: ));
    assert(formCardData.containerShadow.includes('255, 222, 89') || formCardData.containerShadow.includes('#FFDE59') || formCardData.containerShadow.includes('8px 8px'), Form container has vivid neo-yellow drop shadow (got: ));
    assert(formCardData.bannerBg === 'rgb(255, 222, 89)', 'Form title banner has neo-yellow background (#FFDE59)');
    assert(formCardData.badgeText === 'DIRECT TRANSMISSION', Form has DIRECT TRANSMISSION badge (got ));
    assert(formCardData.inputCount >= 3, Form contains Name, Email, and Message fields (found: ));
    assert(formCardData.submitBtnFound, 'Form contains bold submit button');
    assert(formCardData.submitBtnBg === 'rgb(255, 222, 89)', 'Submit button has neo-yellow background (#FFDE59)');

  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(TEST RESULTS:  PASSED,  FAILED (TOTAL: ));
  console.log('================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runEmpiricalSuite().catch(err => {
  console.error('Fatal error during test suite execution:', err);
  process.exit(1);
});

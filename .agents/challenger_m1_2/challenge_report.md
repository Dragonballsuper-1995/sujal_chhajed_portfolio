# Challenge Report: Milestone 1 (Challenger 2)

**Evaluator**: Challenger 2 (Adversarial Empirical Stress Tester & Accessibility Specialist)  
**Milestone**: M1 (Navigation, Hero Typography & Content Restructure)  
**Target Files**: `components/Header.tsx`, `components/Hero.tsx`, `components/About.tsx`  
**Test Method**: Headless Chromium (Puppeteer-core), DOM geometry extraction, automated viewport sweeps (320px–1920px), WCAG accessibility audit, live build runner.

---

## Challenge Summary

**Overall risk assessment**: **LOW**  
**Verdict**: **APPROVE**

All core requirements assigned to Worker M1 (R5: Header logo & name, R6: About 2-column redesign & Principles excision, R8 Part 1: Location de-duplication in Hero & About) pass empirical stress-testing. Build integrity is pristine (`tsc && vite build`, exit code 0). Zero horizontal page overflow was detected across 13 distinct viewport widths (320px to 1920px). The About photo maintains an exact 1.2500 (4:5) aspect ratio without distortion across all screen sizes. The solid white backing plate (`bg-white border-4 border-black shadow-neo`) provides 100% opacity (`rgb(255, 255, 255)`), preventing background grid dot bleed. 

Two minor accessibility / UX resilience challenges were identified (missing `aria-expanded` on mobile menu toggle, and lack of `Escape` key dismissal for mobile dropdown), which are non-blocking for M1 and recommended for M4 Quality Floor polish.

---

## Challenges

### [Low Risk] Challenge 1: Missing `aria-expanded` on Mobile Menu Toggle Button
- **Assumption challenged**: Assistive technology users can discern whether the mobile navigation dropdown is open or collapsed.
- **Attack scenario**: A screen reader user on mobile (iOS VoiceOver or Android TalkBack) navigates to the hamburger button. In `components/Header.tsx` line 83–89, the button has `aria-label="Toggle menu"` but lacks `aria-expanded`.
- **Empirical Observation**: Evaluated DOM attribute `toggleBtn.getAttribute('aria-expanded')` before and after click. Both returned `null`.
- **Blast radius**: Low. Visual users are unaffected; screen reader users do not receive immediate announcement of state transition when toggling the menu.
- **Mitigation**: Add `aria-expanded={mobileOpen}` and `aria-controls="mobile-nav-dropdown"` to `components/Header.tsx`.

---

### [Low Risk] Challenge 2: Mobile Menu Does Not Dismiss on `Escape` Key
- **Assumption challenged**: Keyboard users can dismiss open disclosure overlays with the standard `Escape` key.
- **Attack scenario**: A user opens the mobile menu on a small viewport or keyboard-emulated mobile browser. When pressing `Escape`, `Header.tsx` has no `keydown` listener, leaving the dropdown open.
- **Empirical Observation**: Script simulated keypress `Escape` with `mobileOpen: true`. Headless evaluation confirmed `dropdownStillExists: true`.
- **Blast radius**: Low. Mobile dropdown links correctly close the menu on selection (`afterWorkClick: false`), and clicking the toggle button closes it.
- **Mitigation**: Add `useEffect` listening for `e.key === 'Escape'` when `mobileOpen === true` to set `setMobileOpen(false)`.

---

### [Low Risk] Challenge 3: Potential Text Wrapping on Author Name Under Browser Font Zoom
- **Assumption challenged**: Author name `Sujal Chhajed.` will never wrap onto two lines in the 64px header.
- **Attack scenario**: On ultra-narrow viewports (320px) under user text scaling (125%+), lack of `whitespace-nowrap` on `Header.tsx:45` could cause the name to wrap to two lines, competing with the 40px logo inside `h-16`.
- **Empirical Observation**: At 100% font scale, single-line width at 320px is 167.94px, leaving 24.06px of clearance before the hamburger button. Unwrapped across 320px–1920px.
- **Blast radius**: Very Low. Only manifests if user overrides root font size above 120% on 320px viewport.
- **Mitigation**: Add `whitespace-nowrap` to `components/Header.tsx:45`.

---

## Stress Test Results

### 1. Viewport Sweep & Horizontal Overflow Test (320px to 1920px)
Tested via automated headless Chromium runner across 13 device viewports:

| Viewport | Device Profile | Page ScrollWidth | Inner Width | Overflow Detected? | Offending Elements |
|:---|:---|:---:|:---:|:---:|:---:|
| **320px** | iPhone SE (1st gen) | 320px | 320px | **PASS (None)** | 0 |
| **360px** | Galaxy S8 / Android standard | 360px | 360px | **PASS (None)** | 0 |
| **375px** | iPhone SE (2nd/3rd gen) | 375px | 375px | **PASS (None)** | 0 |
| **390px** | iPhone 12/13/14 | 390px | 390px | **PASS (None)** | 0 |
| **414px** | iPhone XR / Plus | 414px | 414px | **PASS (None)** | 0 |
| **480px** | Large mobile landscape | 480px | 480px | **PASS (None)** | 0 |
| **600px** | Small tablet portrait | 600px | 600px | **PASS (None)** | 0 |
| **768px** | iPad portrait (`md` breakpoint) | 768px | 768px | **PASS (None)** | 0 |
| **834px** | iPad Air / Pro 11" | 834px | 834px | **PASS (None)** | 0 |
| **1024px**| iPad Pro 12.9" / Laptop (`lg`) | 1024px | 1024px | **PASS (None)** | 0 |
| **1280px**| Small desktop / MacBook | 1280px | 1280px | **PASS (None)** | 0 |
| **1440px**| Standard desktop target | 1440px | 1440px | **PASS (None)** | 0 |
| **1920px**| FHD widescreen monitor | 1920px | 1920px | **PASS (None)** | 0 |

---

### 2. Header Component Stress Test (`components/Header.tsx`)

| Metric | Desktop (1440px) | Mobile (390px) | Narrow Mobile (320px) | Status |
|:---|:---|:---|:---|:---:|
| **Logo Wrapper Width x Height** | 44px x 44px (`sm:w-11 sm:h-11`) | 40px x 40px (`w-10 h-10`) | 40px x 40px | PASS |
| **Logo Double-Boxing Check** | `border: 0px`, `shadow: none`, `bg: transparent` | `border: 0px`, `shadow: none`, `bg: transparent` | `border: 0px`, `shadow: none`, `bg: transparent` | PASS |
| **Logo Shadow Clipping Check** | `overflow: visible` | `overflow: visible` | `overflow: visible` | PASS |
| **Author Name Font Size** | 20px (`text-xl`) | 18px (`text-lg`) | 18px (`text-lg`) | PASS |
| **Author Name Font Family** | "Archivo Black", Verdana, sans-serif | "Archivo Black", Verdana, sans-serif | "Archivo Black", Verdana, sans-serif | PASS |
| **Author Name Font Weight** | 900 (Black) | 900 (Black) | 900 (Black) | PASS |
| **Author Text Wrapping** | No wrap (`width: 186.59px`) | No wrap (`width: 167.94px`) | No wrap (`width: 167.94px`) | PASS |
| **Desktop Nav Visibility** | Visible (`display: flex`) | Hidden (`display: none`) | Hidden (`display: none`) | PASS |
| **Mobile Hamburger Visibility**| Hidden (`display: none`) | Visible (`34px x 34px`) | Visible (`34px x 34px`) | PASS |
| **Clearance to Edge / Toggle** | > 800px | 94.06px | 24.06px | PASS |
| **Dropdown Menu Open Behavior**| N/A | Opens full-width (390px), zero overflow | Opens full-width (320px), zero overflow | PASS |
| **Dropdown Link Click Dismiss**| N/A | Navigates & unmounts dropdown cleanly | Navigates & unmounts dropdown cleanly | PASS |

---

### 3. About Section 2-Column Redesign Stress Test (`components/About.tsx`)

| Metric | Desktop (1440px) | Mobile (390px) | Mobile (320px) | Status |
|:---|:---|:---|:---|:---:|
| **Layout Orientation** | Side-by-side (`lg:col-span-5` / `lg:col-span-7`) | Stacked vertically (Col 1 above Col 2) | Stacked vertically | PASS |
| **Col 1 Width vs Col 2 Width** | Col 1: 434.66px, Col 2: 621.33px | Col 1: 350px, Col 2: 350px | Col 1: 280px, Col 2: 280px | PASS |
| **Col 1 Top vs Col 2 Top** | `Col1.top == Col2.top` (3778.5px) | `Col2.top > Col1.bottom` (+32px gap) | `Col2.top > Col1.bottom` (+32px gap) | PASS |
| **Photo Container Dimensions** | Width: 426.66px, Height: 533.33px | Width: 342.00px, Height: 427.50px | Width: 272.00px, Height: 340.00px | PASS |
| **Photo Aspect Ratio** | **1.2500** (target 5/4 = 1.2500) | **1.2500** (target 5/4 = 1.2500) | **1.2500** (target 5/4 = 1.2500) | PASS |
| **Photo Distort / Squish Check**| Grayscale filter, `object-cover object-top` | Grayscale filter, `object-cover object-top` | Grayscale filter, `object-cover object-top` | PASS |
| **Bio Plate Background Color** | `rgb(255, 255, 255)` (Solid opaque white) | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | PASS |
| **Bio Plate Border & Shadow** | `4px solid rgb(0, 0, 0)`, `shadow-neo` | `4px solid rgb(0, 0, 0)`, `shadow-neo` | `4px solid rgb(0, 0, 0)`, `shadow-neo` | PASS |
| **Background Dot Bleed Protection**| 100% opaque backing plate protects text | 100% opaque backing plate protects text | 100% opaque backing plate protects text | PASS |
| **Principles Card Excision** | 0 occurrences in DOM | 0 occurrences in DOM | 0 occurrences in DOM | PASS |
| **Location String Excision** | "Chennai, India": 0 occurrences | "Chennai, India": 0 occurrences | "Chennai, India": 0 occurrences | PASS |
| **Academic Credential Preserved**| "VIT Chennai": 2 occurrences (photo + bio) | "VIT Chennai": 2 occurrences | "VIT Chennai": 2 occurrences | PASS |

---

### 4. Accessibility & Contrast Verification (WCAG 2.1 AA)

| Element | Foreground | Background | Contrast Ratio | WCAG AA Req | WCAG AAA Req | Pass/Fail |
|:---|:---|:---|:---:|:---:|:---:|:---:|
| Header Author Name | `#000000` | `#FAF8F5` (Canvas) | **19.81:1** | ≥ 4.5:1 | ≥ 7.0:1 | **PASS (AAA)** |
| Header Nav Link (Inactive)| `#5A5A5A` | `#FAF8F5` (Canvas) | **6.51:1** | ≥ 4.5:1 | ≥ 7.0:1 (large: 4.5) | **PASS (AA)** |
| Header Resume Button | `#000000` | `#FFDE59` (Neo-Yellow)| **15.84:1** | ≥ 4.5:1 | ≥ 7.0:1 | **PASS (AAA)** |
| About Heading ("I'm Sujal")| `#000000` | `#FFFFFF` (White) | **21.00:1** | ≥ 4.5:1 | ≥ 7.0:1 | **PASS (AAA)** |
| About Body Text (Muted) | `#5A5A5A` | `#FFFFFF` (White) | **6.90:1** | ≥ 4.5:1 | ≥ 7.0:1 | **PASS (AA)** |
| Origin Story Body Text | `#000000` | `#FFFDF0` (Yellow/15) | **20.50:1** | ≥ 4.5:1 | ≥ 7.0:1 | **PASS (AAA)** |
| Keyboard Focus Ring | `#FF914D` | Global (`*:focus-visible`) | 3px solid | Visible | Visible | **PASS** |

---

### 5. Hero Section Location De-duplication Verification (`components/Hero.tsx`)
- Verified line 48: `8+ Production Deployments • Sub-100ms Target Latency`.
- "Chennai, India" search returned 0 matches in DOM.
- Button layout wraps responsively on mobile without viewport overflow.

---

### 6. Production Build Integrity
- Command: `npm run build` (`tsc && vite build`)
- Result: Exit code 0, completed in 3.58s.
- Transformed modules: 1494. Zero errors, zero warnings.

---

## Unchallenged Areas

- `components/ContactSection.tsx` and `components/Footer.tsx`: Dark background continuity and contact form redesign are owned by Milestone 3 (Worker M3). "Chennai, India" remains on line 126 of `ContactSection.tsx` until M3.
- `components/BackgroundGrid.tsx` and `components/HeroShader.tsx`: WebGL shader loop, continuous motion, scroll fade, and dynamic mouse exclusion algorithm are owned by Milestone 2 (Worker M2).

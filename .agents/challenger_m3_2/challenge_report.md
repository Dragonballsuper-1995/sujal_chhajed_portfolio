# Challenger 2 Report: Contact Form Contrast, Input States, Responsive Viewports & Grid Occlusion (Milestone 3)

**Agent**: Challenger 2 (Empirical Challenger, Critic & Frontend Specialist)  
**Date**: 2026-09-10  
**Target Milestone**: Milestone 3 (Contact Section, Skills Technical Arsenal, Footer)  
**Verdict**: **APPROVE**  
**Risk Assessment**: **LOW**

---

## 1. Challenge Summary

**Overall risk assessment**: **LOW**

Challenger 2 executed an empirical stress test suite (`tests/verify-contact-contrast-m3.mjs`) containing **96 automated assertions** across WCAG 2.1 contrast formulas, AST/source contracts, live headless Chromium DOM styles, interactive focus/hover states, viewport sweeps (1440px desktop, 1024px tablet, 390px mobile, 320px narrow mobile), and canvas grid dot occlusion. 

All 96 assertions passed with zero regressions. The contact form achieves a **19.74:1 contrast ratio** against the `#0A0A10` background (greatly exceeding the >15:1 requirement), horizontal overflow across all sections is strictly 0px across all viewports, and Skills boundary cards provide complete physical and visual dot grid occlusion.

---

## 2. Challenges & Stress Analyses

### Challenge 1 (Low Risk - Verified Robust): Contact Form Container Visibility & Contrast on Deep Dark Canvas
- **Assumption Challenged**: Can a neo-brutalist white form container sustain a high-contrast focal presence on the deep dark `#0A0A10` background without washed-out edges or poor visual hierarchy?
- **Attack Scenario**: If the background color, border color, or box-shadow are semi-transparent or blend with the `#0A0A10` section, the container might blur or fail accessibility thresholds.
- **Empirical Measurement**:
  - Background `#0A0A10` Relative Luminance: $L_2 = 0.00319037$
  - White Container `#FFFFFF` Relative Luminance: $L_1 = 1.00000000$
  - WCAG 2.1 Contrast Ratio: $\frac{1.0 + 0.05}{0.00319037 + 0.05} = 19.7404:1$
  - Contrast Ratio **19.74:1** strictly exceeds the requirement (> 15:1) and approaches the theoretical maximum (21:1).
  - Computed Styles: `backgroundColor: rgb(255, 255, 255)`, `border: 4px solid rgb(0, 0, 0)`, `boxShadow: 8px 8px 0px 0px #FFDE59`.
- **Verdict**: **PASS (Robust)**

### Challenge 2 (Low Risk - Verified Robust): Input States, Tactile Focus Rings & Submit Hover Transitions
- **Assumption Challenged**: Do inputs and buttons remain accessible and distinct in default, focus, hover, and disabled states without clipping or low contrast?
- **Attack Scenario**: If focus ring is low-contrast or if hover transitions cause layout shift or color collision with dark mode, accessibility drops below WCAG AA/AAA.
- **Empirical Measurement**:
  - Input default background: `#FAF8F5` (`rgb(250, 248, 245)`) with 2px black border and black shadow (`rgb(0,0,0) 2px 2px 0px 0px`).
  - Input focus state: Transitions to pure white `#FFFFFF` (`rgb(255, 255, 255)`), 2px solid black focus ring (`rgb(0, 0, 0) 0px 0px 0px 2px`), and neo-yellow focus shadow (`rgb(255, 222, 89) 4px 4px 0px 0px`).
  - Input text contrast: Black text on `#FAF8F5` is **19.8:1** (AAA).
  - Submit button default: `bg-neo-yellow` (`#FFDE59`) with black text -> **15.77:1** (AAA).
  - Submit button hover: Transitions to `bg-neo-pink` (`#FF66C4`) with black text -> **7.95:1** (AAA). Shadow expands from 4px to 6px (`rgb(0, 0, 0) 6px 6px 0px 0px`).
  - Required validation: All inputs enforce native HTML5 `required` attribute and client-side empty string gating.
- **Verdict**: **PASS (Robust)**

### Challenge 3 (Low Risk - Verified Robust): Responsive Viewports & Horizontal Overflow Sweep
- **Assumption Challenged**: Will the 8px neo-yellow box shadow, large typography, or skill pills breach viewport boundaries on small devices?
- **Attack Scenario**: On narrow mobile screens (320px or 390px), right-hand box-shadows or unyielding flex items frequently introduce horizontal scrollbars (`scrollWidth > innerWidth`), degrading mobile usability.
- **Empirical Measurement**:
  - Swept 4 viewports: 1440px (Desktop), 1024px (Tablet Landscape), 390px (iPhone 14), 320px (iPhone SE narrow).
  - `document.documentElement.scrollWidth` strictly equals viewport width on every screen (1440px, 1024px, 390px, 320px).
  - `#skills` element: `scrollWidth === clientWidth` on all viewports (0px overflow).
  - `#contact` element: `scrollWidth === clientWidth` on all viewports (0px overflow).
  - `footer` element: `scrollWidth === clientWidth` on all viewports (0px overflow).
  - Bounding rect inspection: Zero child elements have `rect.right > windowWidth` (0px excess).
- **Verdict**: **PASS (Robust)**

### Challenge 4 (Low Risk - Verified Robust): Skills Boundary Cards Dotted Grid Occlusion
- **Assumption Challenged**: Does the fixed interactive canvas dotted grid from `BackgroundGrid.tsx` bleed underneath the technical arsenal cards or distract from badge text?
- **Attack Scenario**: If cards lack solid opaque backgrounds or if mouse movement over badges triggers canvas dot expansion, dots could show through text badges.
- **Empirical Measurement**:
  - 5 boundary cards verified in `#skills` (1 header card + 4 category row cards).
  - All 5 boundary cards have computed `backgroundColor: rgb(255, 255, 255)`, `opacity: 1`, and `zIndex: 10`. Canvas has `zIndex: 0`. The opaque white plate physically blocks the canvas.
  - `BackgroundGrid.tsx` algorithmic exclusion: Mouse hovering over `.boundary-plate` or child typography tags resets mouse coordinates to `(-1000, -1000)`, stopping canvas dot expansion anywhere near the cards.
  - All 23 skill pills across the 4 categories feature solid background plates (`bg-neo-blue`, `bg-neo-green`, `bg-neo-yellow`, `bg-neo-purple`).
- **Verdict**: **PASS (Robust)**

### Challenge 5 (Low Risk - Verified Robust): Monogram Watermark Geometry & Overflow Containment
- **Assumption Challenged**: Does the decorative watermark monogram (`SC`) clip awkwardly or cause layout expansion?
- **Attack Scenario**: Negative positioning (`-bottom-16`, `-right-12`) previously clipped glyphs and created potential horizontal overflow risks.
- **Empirical Measurement**:
  - Monogram repositioned to `bottom-0 right-0 sm:right-4`.
  - Parent section `#contact` has `relative overflow-hidden`.
  - At 1440px: Watermark right edge is 1424.0px <= section right edge 1440.0px.
  - At 390px: Watermark right edge is 390.0px <= section right edge 390.0px.
  - At 320px: Watermark right edge is 320.0px <= section right edge 320.0px.
  - Zero cutoff of glyph curves within the container, and zero horizontal overflow.
- **Verdict**: **PASS (Robust)**

---

## 3. Stress Test Results Summary

| Test Category | Suite / Method | Invariant / Target | Result | Status |
|---|---|---|---|---|
| **Form Container Contrast** | WCAG 2.1 Formula | `#FFFFFF` vs `#0A0A10` > 15:1 | **19.74:1** | **PASS** |
| **Input Text Contrast** | WCAG 2.1 Formula | Black text on `#FAF8F5` > 7:1 | **19.80:1** | **PASS** |
| **Banner Title Contrast** | WCAG 2.1 Formula | Black text on `#FFDE59` > 7:1 | **15.77:1** | **PASS** |
| **Submit Button Contrast** | WCAG 2.1 Formula | Default on `#FFDE59` / Hover on `#FF66C4` | **15.77:1** / **7.95:1** | **PASS** |
| **Form Container Styles** | Live Puppeteer DOM | `bg: rgb(255,255,255)`, `border: 4px solid #000`, `shadow: #FFDE59` | Matched exact tokens | **PASS** |
| **Form Input States** | Live Puppeteer DOM | Focus: `bg: rgb(255,255,255)`, 2px ring, 4px yellow shadow | Verified post-transition | **PASS** |
| **Submit Hover State** | Live Puppeteer DOM | Hover: `bg: rgb(255,102,196)`, 6px black shadow | Verified post-transition | **PASS** |
| **Form Validation** | DOM Attributes | All inputs have `required` attribute | 3/3 inputs verified | **PASS** |
| **Skills Cards Occlusion** | Live Puppeteer DOM | 5 cards, `bg: rgb(255,255,255)`, `opacity: 1`, `z-index: 10 >= 0` | 5/5 cards occlude | **PASS** |
| **Skills Arsenal Count** | DOM Query | All 4 categories unsegmented, 23 total tools | 23 tools verified | **PASS** |
| **Desktop 1440px Overflow** | Viewport Sweep | `scrollWidth === 1440px`, zero excess | 1440px / 0px excess | **PASS** |
| **Tablet 1024px Overflow** | Viewport Sweep | `scrollWidth === 1024px`, zero excess | 1024px / 0px excess | **PASS** |
| **Mobile 390px Overflow** | Viewport Sweep | `scrollWidth === 390px`, zero excess | 390px / 0px excess | **PASS** |
| **Narrow Mobile 320px Overflow** | Viewport Sweep | `scrollWidth === 320px`, zero excess | 320px / 0px excess | **PASS** |
| **Watermark Placement** | Live Bounding Box | Monogram within `#contact` bounds | 0px overflow | **PASS** |
| **Production Build** | `npm run build` | 0 TS errors, 0 Vite errors | Clean build (2.02s) | **PASS** |

**Total Programmatic Assertions**: 96 Passed, 0 Failed (100% Pass Rate).

---

## 4. Unchallenged Areas

- **Viewports < 320px**: Viewports below 320px (e.g. 280px Galaxy Fold cover in folded mode) were not formally benchmarked, as 320px is the recognized responsive floor for standard web development.
- **External Formspree API Ingestion**: Live form POST transmission to the remote Formspree endpoint (`https://formspree.io/f/xqagjnpj`) was not executed against production to prevent polluting the portfolio owner's live inbox with test messages.

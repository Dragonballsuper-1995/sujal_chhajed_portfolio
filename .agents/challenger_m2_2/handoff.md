# Handoff Report — Challenger M2-2: Empirical Background Grid & Boundary Plate Stress Testing

**Challenger**: Challenger 2 (critic, specialist)  
**Date**: 2026-09-10  
**Milestone**: M2 (WebGL Fluid Shader & Background Grid Hard Boundaries)  
**Target Scope**: Requirement R2 (`components/BackgroundGrid.tsx`, `components/Hero.tsx`, `components/ProjectsSection.tsx`, and content boundary plates)  
**Verdict**: **APPROVE**

---

## 1. Observation

### 1.1 Implementation Code State
- In `components/BackgroundGrid.tsx`:
  - Lines 106–112: Implements `isHoveringTextOrBoundary(e: MouseEvent)` with `target.closest('h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li, a, button, input, textarea, label, [data-boundary], .boundary-plate, [role="article"]')`.
  - Lines 128–135: If `isHoveringTextOrBoundary(e)` evaluates to `true`, coordinates are reset:
    ```ts
    if (mouse.x !== -1000 || mouse.y !== -1000) {
      mouse.x = -1000;
      mouse.y = -1000;
      requestDraw();
    }
    return;
    ```
  - Lines 63–73: When `mouse = { x: -1000, y: -1000 }`, distance `dist` to any dot `(x, y)` on screen is `>= sqrt((-1000 - 0)^2 + (-1000 - 0)^2) = 1414.2px`. Since `hoverRadius = 180`, the expansion condition `dist < hoverRadius` evaluates to `false` everywhere on the viewport.
  - Line 176: Canvas is styled as `className="fixed inset-0 z-0 pointer-events-none"`.
  - Lines 11–13, 120, 154–163: Coarse pointer detection (`window.matchMedia('(pointer: coarse)')`) disables hover listeners on touch devices.

- In `components/Hero.tsx`:
  - Line 20: Content container wrapped with `relative z-10`.
  - Line 22: Availability badge styled with `bg-white border-2 border-black shadow-neo-sm mb-6 select-none animate-fadeIn boundary-plate` and `data-boundary="true"`.
  - Line 43: Punchy subtitle wrapped in `max-w-2xl mb-10 p-5 sm:p-6 bg-white border-2 border-black shadow-neo-sm relative z-10 boundary-plate` and `data-boundary="true"`.
  - Lines 54–129: All action buttons and links styled with solid backgrounds (`bg-neo-yellow`, `bg-white`, `bg-ink`) and `border-2 border-black`.
  - Line 132: Bottom feature strip wrapped in `p-3 sm:p-3.5 bg-white border-2 border-black shadow-neo-sm inline-flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink relative z-10 boundary-plate` and `data-boundary="true"`.

- In `components/ProjectsSection.tsx`:
  - Line 13: Section container has `relative z-10 border-t-4 border-black`.
  - Line 17: Section header wrapped in `bg-white border-2 border-black shadow-neo-sm p-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10 boundary-plate` and `data-boundary="true"`.
  - Line 49: Tier 2 header wrapped in `bg-white border-2 border-black shadow-neo-sm p-5 sm:p-6 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 boundary-plate` and `data-boundary="true"`.
  - Line 77: GitHub deep-link banner wrapped in `p-6 bg-white border-2 border-black shadow-neo flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 boundary-plate` and `data-boundary="true"`.
  - Lines 37–46 and 64–74: All 8 project cards render on solid white backing plates (`bg-white border-4 border-black` for Flagships, `bg-white border-2 border-black` for Archives) in `z-10` stacking context.

### 1.2 Automated Tool Runs & Empirical Evidence
- **Build Verification**:
  - Command: `npm run build`
  - Output: `✓ 1494 modules transformed. ✓ built in 6.45s`, exit code: 0. Zero TypeScript or Vite bundling errors.
- **Empirical Test Suite Execution**:
  - Command: `node tests/verify-grid-boundaries-m2.mjs`
  - Output: `TEST RESULTS: 126 PASSED, 0 FAILED`, exit code: 0.
  - Viewport sweep (1440px, 1024px, 768px, 390px, 320px): Zero horizontal page overflow across all viewports (`scrollWidth === innerWidth`).
  - Computed styles in Chromium: All boundary plates and cards evaluate to `backgroundColor: "rgb(255, 255, 255)"`, `borderWidth: "2px"` or `"4px"`, `borderColor: "rgb(0, 0, 0)"`, `zIndex: "10"`.
  - Simulated `mousemove` over text: `isHovering === true`, coordinates set to `(-1000, -1000)`, dot radius remains `1.50px` (baseline).

---

## 2. Logic Chain

1. **Suppression Mechanism Prevents Dot Bleed Over Typography**:
   - *Observation*: `BackgroundGrid.tsx:128–135` checks `isHoveringTextOrBoundary(e)` and resets `mouse.x = -1000; mouse.y = -1000;`.
   - *Logic*: Because on-screen dots reside within `x in [0, width]` and `y in [0, height]`, the Euclidean distance from `(-1000, -1000)` to any on-screen dot is at minimum `sqrt(1000^2 + 1000^2) = 1414.2px`. Because the hover expansion threshold is `180px`, no dot on the visible canvas can satisfy `dist < 180`. Therefore, radius is locked to `baseRadius = 1.5px` and alpha is locked to `0.12`. Dots never expand to `5.2px` under or over text.

2. **Solid Backing Plates & Stacking Context Prevent Background Dot Visibility**:
   - *Observation*: `Hero.tsx` (lines 22, 43, 132) and `ProjectsSection.tsx` (lines 17, 49, 77) apply `bg-white border-2 border-black shadow-neo-sm relative z-10 boundary-plate`. ProjectCards apply `bg-white border-4 border-black` / `border-2`.
   - *Logic*: The background canvas sits at `z-0` (`fixed inset-0 z-0 pointer-events-none`). Content containers sit in a higher stacking context at `relative z-10` with opaque `bg-white` (`rgb(255, 255, 255)`). Under CSS alpha compositing rules, a 100% opaque surface completely occludes any canvas pixels rendered in lower stacking planes. Even if dots were expanded beneath the card, zero alpha or luminance would transmit through the card.

3. **Responsive Stability & Clean Production Compilation**:
   - *Observation*: Headless Chrome sweep across 5 viewports (1440px desktop down to 320px narrow mobile) recorded `scrollWidth === innerWidth`. `npm run build` completed with 0 errors.
   - *Logic*: Layout containers properly utilize Tailwind responsive classes (`max-w-6xl mx-auto px-5 md:px-8`, `flex-col sm:flex-row`, `overflow-hidden` on Hero), preventing horizontal scrollbars or clipping.

---

## 3. Caveats

- **Standalone `<span>` tags inside `ProjectCard`**: Standalone tech tags and badges inside `ProjectCard.tsx` do not directly trigger `isHoveringTextOrBoundary` (because `span` is not in the selector list and `ProjectCard` lacks `.boundary-plate`). However, because `ProjectCard` itself is 100% opaque `bg-white` at `z-10`, background dots are completely occluded by the card. Recommendation for M4 quality floor: add `[data-boundary="true"]` to the card wrapper divs in `ProjectsSection.tsx`.
- Coarse touch devices (`pointer: coarse`) intentionally bypass hover-expansion altogether.

---

## 4. Conclusion

Requirement R2 is empirically satisfied.
- Hovering over typography elements and boundary plates suppresses mouse coordinates to `(-1000, -1000)` and restores calm baseline dot dimensions (`1.5px`).
- Content in Hero and ProjectsSection sits cleanly on solid white neo-brutalist boundary plates with solid borders and `relative z-10` stacking context.
- Zero horizontal overflow across all viewports from 320px to 1440px.
- Independent clean production build verified (`npm run build` exits 0).

**Hard Verdict**: **APPROVE**

---

## 5. Verification Method

To independently verify these findings:

1. **Run Production Build**:
   ```bash
   npm run build
   ```
   *Expected outcome*: Exits with code 0; transforms 1494+ modules; emits clean production bundles to `dist/` with 0 errors.

2. **Run Empirical Verification Suite**:
   ```bash
   node tests/verify-grid-boundaries-m2.mjs
   ```
   *Expected outcome*: Exits with code 0; reports `TEST RESULTS: 126 PASSED, 0 FAILED`. Confirms coordinate suppression, backing plate styles, zero horizontal overflow across 5 viewports, and leaf node coverage.

3. **Invalidation Conditions**:
   - Any failure or non-zero exit code in `npm run build`.
   - Any dot grid expansion (> 1.5px) when hovering typography elements in `BackgroundGrid.tsx`.
   - Any non-white or translucent background on boundary plates in `Hero.tsx` or `ProjectsSection.tsx`.

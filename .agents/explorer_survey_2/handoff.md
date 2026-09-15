# Handoff Report: Explorer 2 (Shader & Grid Specialist)

**Agent**: Explorer 2  
**Working Directory**: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_2`  
**Date**: 2026-09-10  
**Status**: Hard Handoff (Investigation & Survey Complete)  
**Deliverable**: Comprehensive Survey Report at `.agents/explorer_survey_2/survey_report.md`

---

## 1. Observation

1. **`components/HeroShader.tsx`**:
   - Lines 71–77: Fluid animation time factor is `float t = u_time * 0.22;` and coordinate offset is `p * 1.5 + vec2(t * 0.25, t * 0.18)`. This yields `0.055` noise coordinate change per second, appearing static to the naked eye when the cursor is motionless.
   - Line 90: Alpha clamping is:
     ```glsl
     float alpha = clamp(0.18 + 0.12 * (n1 * 0.5 + 0.5) + mouseInfluence * 0.25, 0.0, 0.55);
     ```
     Baseline alpha without mouse influence is `0.18–0.30` (mean ~0.24). Combined with CSS `mix-blend-multiply` in line 208 (`className="... mix-blend-multiply ..."`), colors against `#FAF8F5` are pale and washed out.
   - Lines 141–193: The RAF render loop only sets `u_resolution`, `u_time`, and `u_mouse`. There are **no scroll event listeners, no scroll calculations, and no `u_scroll_fade` uniform**. The shader runs at constant opacity regardless of scroll position.

2. **`components/BackgroundGrid.tsx`**:
   - Lines 53–74: Dot proximity expansion logic:
     ```ts
     const baseRadius = 1.5;
     const hoverRadius = 180;
     ...
     if (dist < hoverRadius) {
       const intensity = 1 - (dist / hoverRadius);
       radius = baseRadius + (intensity * 3.7);
       alpha = 0.12 + (intensity * 0.45);
     }
     ```
     Dots within 180px expand up to `5.2px` radius (`10.4px` diameter) with `rgba(5, 5, 5, 0.57)`.
   - Lines 114–122: Mouse tracking is unconstrained:
     ```ts
     handleMouseMove = (e: MouseEvent) => {
       const now = performance.now();
       if (now - lastMoveTime < THROTTLE_MS) return;
       lastMoveTime = now;
       mouse.x = e.clientX;
       mouse.y = e.clientY;
       requestDraw();
     };
     ```
   - Lines 156–162: Canvas element has `fixed inset-0 z-0 pointer-events-none`.

3. **Content Containers & Section Backgrounds**:
   - `components/Hero.tsx` line 15: `<section id={NavSection.HERO} className="... bg-transparent">`
   - `components/Hero.tsx` lines 31 & 43: Main headline `h1` and subtitle `p` sit directly on transparent backgrounds without solid boundary plates.
   - `components/ProjectsSection.tsx` line 13: `<section id={NavSection.PROJECTS} className="... bg-transparent">`
   - `components/Skills.tsx` line 85: `<section id={NavSection.SKILLS} className="... bg-transparent">`
   - `components/About.tsx` line 8: `<section id={NavSection.ABOUT} className="... bg-transparent">`
   - `components/About.tsx` line 59: Bio and narrative paragraphs sit directly on transparent backgrounds without a backing plate.

4. **Build & Quality Check**:
   - Running `npm run build` succeeds cleanly with exit code 0 (`tsc && vite build` built 1494 modules in 3.17s).

---

## 2. Logic Chain

1. **R3 (Continuous Animation)**: From Observation 1 (lines 71–77), the current noise translation rate (`0.055` units/s) is too slow to produce visible continuous movement, and movement is solely linear. By increasing the base time evolution to `u_time * 0.55` and introducing multi-octave domain warping with trigonometric curl flow (`vec2(sin(t*0.4), cos(t*0.35))`), the fluid continuously swirls in real time independent of cursor movement.
2. **R3 (Scroll-Based Fade)**: From Observation 1 (lines 141–193), the absence of scroll uniforms causes the shader to persist indefinitely. By tracking `window.scrollY` relative to Hero height (`heroHeight * 0.75`), computing `scrollFade = Math.max(0, Math.min(1, 1 - (scrollY / fadeDistance)))`, passing `u_scroll_fade` to the fragment shader, and setting `canvas.style.opacity = scrollFade`, the shader smoothly reaches 0 opacity before `ProjectsSection` begins, providing a 100% clean `#FAF8F5` canvas transition. Halting draw calls when `scrollFade <= 0.001` eliminates GPU overhead while browsing other sections.
3. **R4 (Intensity & Saturation Boost)**: From Observation 1 (line 90), baseline alpha is only `~0.24`, which is washed out under `mix-blend-multiply`. Boosting baseline alpha to `0.52 + 0.13 * pattern` (`0.50–0.65` range), enriching palette vectors (cyan `#33E0EB`, pink `#FF59BF`, yellow `#FFDC40`, lime `#76E04D`), and adding a GLSL saturation multiplier (`1.25x`) makes the iridescent fluid vibrant and immediately eye-catching.
4. **R2 (Hard Boundaries for Dotted Grid)**: From Observation 2 (lines 53–74, 114–122) and Observation 3, hovering over typography tracks mouse coordinates directly over transparent text, causing 10.4px black dots to expand through the letters. This is resolved by a dual-layer strategy:
   - *Algorithmic Exclusion*: In `handleMouseMove`, querying `e.target.closest('h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li, a, button, input, textarea, label, [data-boundary], .boundary-plate')` and suppressing `mouse.x, mouse.y` to `-1000` when over text ensures dots never blow up near typography.
   - *Solid Background Plates*: Wrapping text blocks and cards across `Hero.tsx`, `ProjectsSection.tsx`, `Skills.tsx`, and `About.tsx` in solid background plates (`bg-canvas` `#FAF8F5` or `bg-white` with borders/shadows) physically blocks baseline dots from showing through text.

---

## 3. Caveats

1. **Touch / Mobile Viewports**: On coarse pointer devices (`(pointer: coarse)`), `BackgroundGrid.tsx` already disables hover listeners. The hard boundary exclusion is specifically active on fine pointers (desktops/laptops).
2. **Accessibility**: Reduced motion users (`prefers-reduced-motion: reduce`) should receive a slowed time multiplier (`0.05`) in `HeroShader.tsx` to prevent motion sickness while preserving the chromatic pastel aesthetic.
3. **Other Requirements Out of Scope**: Requirements R1 (Skills filter removal), R5 (Header logo/font), R6 (About 2-column layout), R7 (Contact/Footer dark unity), R8 (Location de-duplication), and R9 (Contact form contrast) are handled by peer investigators and will integrate seamlessly with these grid/shader boundaries.

---

## 4. Conclusion

Requirements R2, R3, and R4 have clear root causes and robust, production-grade solutions:
- **HeroShader**: Replace the static noise formula with continuous multi-octave domain warping (`u_time * 0.55`), boost alpha to `0.50–0.65` with `1.25x` saturation, and add `u_scroll_fade` with RAF scroll computation and draw pausing.
- **BackgroundGrid**: Add `isHoveringTextOrBoundary` DOM check in `handleMouseMove` to suppress dot expansion under typography, and apply solid background boundary plates across all content containers.

The full design and exact code snippets are detailed in `.agents/explorer_survey_2/survey_report.md`.

---

## 5. Verification Method

1. **Production Build Verification**:
   ```bash
   npm run build
   ```
   Must pass with exit code 0 and zero TypeScript or Vite errors.
2. **Shader Verification**:
   - Inspect Hero on page load without moving cursor: fluid motion must continuously animate and swirl.
   - Scroll down: HeroShader opacity must visibly fade and reach 0 before `ProjectsSection` (`border-t-4 border-black`) arrives.
   - Inspect color palette: cyan, pink, yellow, and lime must be vividly noticeable with alpha in the `0.50–0.65` range.
3. **Grid Hard Boundary Verification**:
   - Move mouse over Hero headline, Hero subtitle, Projects section header, Project cards, Skills pills, and About narrative bio.
   - Dots must NOT expand into 5.2px circles under or over any text elements; typography must remain 100% crisp and readable.

# Review Report — Milestone 2: Background Grid Hard Boundaries & Solid Backing Plates

**Reviewer**: Reviewer 2 (reviewer, critic)  
**Date**: 2026-09-10  
**Milestone**: M2 (WebGL Fluid Shader & Background Grid Hard Boundaries)  
**Target Files**:
- `components/BackgroundGrid.tsx`
- `components/Hero.tsx`
- `components/ProjectsSection.tsx`

---

## 1. Review Summary

**Verdict**: **APPROVE**  
**Integrity Status**: **VERIFIED CLEAN** (Zero integrity violations; no facades, hardcoded mocks, or shortcuts detected).  
**Build Status**: **PASSED** (`tsc && vite build` exited with code 0; 1494 modules transformed in 5.76s).

Worker M2 has implemented Requirement R2 with dual-layered architectural rigor:
1. **Algorithmic Exclusion Layer (`BackgroundGrid.tsx`)**: An efficient `isHoveringTextOrBoundary` mousemove evaluator that intercepts typography tags (`h1..h6`, `p`, `blockquote`, `pre`, `code`, `ul`, `ol`, `li`, `a`, `button`, `input`, `textarea`, `label`, `[role="article"]`) and custom boundary selectors (`[data-boundary]`, `.boundary-plate`). When detected, coordinates are reset to `(-1000, -1000)`, preventing dot expansion or alpha boost within the hover radius.
2. **Physical Occlusion Layer (`Hero.tsx`, `ProjectsSection.tsx`)**: Hard neo-brutalist boundary plates (`bg-white` or `bg-canvas` with `border-2 border-black shadow-neo-sm relative z-10 boundary-plate`) enclose content blocks, completely occluding the canvas background layer (`z-0`) underneath text and cards.

---

## 2. Findings

### [Minor] Finding 1: Standalone Text Elements Without Ancestor Semantic Tags
- **What**: The selector in `isHoveringTextOrBoundary` covers semantic text tags (`h1`–`h6`, `p`, `blockquote`, `pre`, `code`, `ul`, `ol`, `li`, `a`, `button`, etc.) and boundary classes (`.boundary-plate`, `[data-boundary]`), but does not explicitly list bare `span` or `div`.
- **Where**: `components/BackgroundGrid.tsx`, lines 109–111.
- **Why**: If a future component mounts a standalone `<span>` text badge that is not wrapped in `p`, `button`, `a`, or `.boundary-plate`, hovering over the badge text would not trigger coordinate suppression.
- **Current Mitigation**: In `Hero.tsx` and `ProjectsSection.tsx`, all badges and text chips are either wrapped inside `.boundary-plate` containers (`data-boundary="true"`), inside semantic headings/paragraphs, or inside buttons/links. Furthermore, all card containers have solid opaque backgrounds (`bg-white`), preventing visual dot bleed.
- **Suggestion**: For future milestones (M3/M4), ensure newly added badges or text chips in `Skills.tsx` or `ContactSection.tsx` carry `.boundary-plate` or `data-boundary="true"`, or add `[data-badge]` to the selector.

---

## 3. Adversarial Challenges & Stress Testing

### Challenge 1: Mouse Traversing Dense Typography at High Speed
- **Assumption**: Rapid cursor movement across text elements could cause delayed suppression due to the 16ms throttle (`THROTTLE_MS = 16`).
- **Attack Scenario**: Rapidly sweep the cursor from empty canvas over the Hero subtitle card.
- **Analysis & Result**:
  - The throttle interval is 16ms (matches 60 FPS frame time). Within 16ms of entering the text element, `isHoveringTextOrBoundary` fires.
  - Furthermore, the subtitle is rendered on a solid opaque plate (`bg-white relative z-10`). The canvas is physically stationed at `fixed inset-0 z-0`.
  - **Verdict**: PASS. Dual-layer defense prevents any visual glitch even during the 16ms transition.

### Challenge 2: Redundant RAF Draw Calls During Text Hover
- **Assumption**: Continuously moving the cursor over a multi-line paragraph could fire repeated `requestDraw()` calls, draining CPU.
- **Attack Scenario**: Move cursor continuously inside `p` or across `h1`.
- **Analysis & Result**:
  - In `handleMouseMove`:
    ```ts
    if (isHoveringTextOrBoundary(e)) {
      if (mouse.x !== -1000 || mouse.y !== -1000) {
        mouse.x = -1000;
        mouse.y = -1000;
        requestDraw();
      }
      return;
    }
    ```
  - On the first tick entering text, `mouse` is set to `(-1000, -1000)` and one draw call is scheduled.
  - On subsequent ticks while still hovering text, `mouse.x !== -1000` evaluates to `false`. The function immediately returns without invoking `requestDraw()`.
  - **Verdict**: PASS. Zero redundant redraws; CPU/GPU idle during text interaction.

### Challenge 3: Coarse Pointer & Touch Screen Behavior
- **Assumption**: On mobile devices and tablets, touch events could trigger coordinate jumps or hover anomalies.
- **Analysis & Result**:
  - `BackgroundGrid.tsx` listens to `window.matchMedia('(pointer: coarse)')`.
  - On coarse pointer devices (`isCoarsePointer = true`), pointer event listeners (`mousemove`, `mouseleave`) are completely omitted.
  - Canvas renders static baseline dots (`radius = 1.5`, `alpha = 0.12`) with zero hover animations.
  - Responsive change listener (`coarseMql.addEventListener('change', ...)`) correctly re-evaluates if a device docks/undocks a mouse.
  - **Verdict**: PASS. Highly performant and touch-safe.

### Challenge 4: WebGL & Canvas Stacking Context
- **Assumption**: Fluid WebGL canvas from `HeroShader` and 2D canvas from `BackgroundGrid` might fight for stacking priority or cause text occlusion.
- **Analysis & Result**:
  - `BackgroundGrid.tsx`: `<canvas className="fixed inset-0 z-0 pointer-events-none" />`
  - `HeroShader.tsx`: `<canvas className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply" />`
  - `Hero.tsx` Content: `<div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10 w-full">`
  - `ProjectsSection.tsx`: `<section className="... relative z-10">` with children at `relative z-10`
  - Header: `fixed top-0 z-50`
  - Typography and boundary plates sit firmly at `z-10` or higher, comfortably above both canvases (`z-0`).
  - **Verdict**: PASS. Clean hierarchy without layering conflicts.

---

## 4. Verified Claims Matrix

| Claim from Worker M2 | Verification Method | Result | Notes |
|----------------------|---------------------|--------|-------|
| `isHoveringTextOrBoundary` resets mouse to `(-1000, -1000)` | Inspected `BackgroundGrid.tsx` lines 106–135 | **PASS** | Evaluates typography tags and boundary classes; sets `mouse = {-1000, -1000}`. |
| Background dots do not expand under text | Calculated distance formula in `BackgroundGrid.tsx` lines 61–74 | **PASS** | Distance from `(-1000, -1000)` to viewport `(x, y)` is `> 1400px`, vastly exceeding `hoverRadius = 180px`. Radius stays `1.5px`, alpha stays `0.12`. |
| Hero subtitle sits on solid boundary plate | Inspected `Hero.tsx` lines 42–51 | **PASS** | Container has `bg-white border-2 border-black shadow-neo-sm relative z-10 boundary-plate data-boundary="true"`. |
| Hero bottom feature strip sits on solid boundary plate | Inspected `Hero.tsx` lines 131–141 | **PASS** | Container has `bg-white border-2 border-black shadow-neo-sm relative z-10 boundary-plate data-boundary="true"`. |
| ProjectsSection Section Header sits on solid boundary plate | Inspected `ProjectsSection.tsx` lines 16–34 | **PASS** | Container has `bg-white border-2 border-black shadow-neo-sm relative z-10 boundary-plate data-boundary="true"`. |
| ProjectsSection Tier 2 Header sits on solid boundary plate | Inspected `ProjectsSection.tsx` lines 48–61 | **PASS** | Container has `bg-white border-2 border-black shadow-neo-sm relative z-10 boundary-plate data-boundary="true"`. |
| ProjectsSection GitHub Banner sits on solid boundary plate | Inspected `ProjectsSection.tsx` lines 76–93 | **PASS** | Container has `bg-white border-2 border-black shadow-neo relative z-10 boundary-plate data-boundary="true"`. |
| Independent clean build passes | Ran `npm run build` | **PASS** | Exited code 0, 1494 modules transformed in 5.76s, 0 TS errors, 0 Vite errors. |

---

## 5. Coverage Gaps & Unverified Items

- **Coverage Gaps**: None within Milestone 2 scope. Milestone 3 components (`Skills.tsx`, `ContactSection.tsx`, `Footer.tsx`) will be reviewed during M3.
- **Unverified Items**: None. All R2 claims independently inspected and build-verified.

---

## 6. Conclusion

Milestone 2 implementation of Requirement R2 satisfies all correctness, quality, and visual boundary specifications. The implementation is robust against edge cases, respects accessibility guidelines, and maintains a clean production build.

**Final Verdict**: **APPROVE**

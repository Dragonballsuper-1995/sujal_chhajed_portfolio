## Milestone 2 Implementation Assignment: Worker M2

### Scope
- Requirements:
  - R3: Hero Live Continuous Moving Shader & Scroll-Based Fade (`components/HeroShader.tsx`)
  - R4: Increased Shader Intensity & Vibrant Visibility (`components/HeroShader.tsx`)
  - R2: Hard Boundaries for Background Dotted Grid (`components/BackgroundGrid.tsx`, `components/Hero.tsx`, `components/ProjectsSection.tsx`)
- Exclusive File Ownership:
  - `components/HeroShader.tsx`
  - `components/BackgroundGrid.tsx`
  - `components/Hero.tsx`
  - `components/ProjectsSection.tsx`
  *(Do NOT modify any other files in this milestone)*

### Reference Documents
- Original Request: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\ORIGINAL_REQUEST.md`
- Project Plan: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\PROJECT.md`
- Explorer 2 Survey Report: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_2\survey_report.md`
- Explorer 2 Handoff: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_2\handoff.md`

### Implementation Tasks
1. **`components/HeroShader.tsx`**:
   - **Continuous Real-Time Motion (R3)**:
     - In fragment shader, implement multi-octave domain warping with trigonometric curl/harmonic flow (`u_time * 0.55` time factor, `vec2(sin(t*0.4), cos(t*0.35))` offset), replacing the imperceptible 0.055 units/s translation so the fluid swirls dynamically without requiring cursor movement.
     - Include reduced-motion accessibility handling (`window.matchMedia('(prefers-reduced-motion: reduce)')`) slowing motion factor to `0.05`.
   - **Scroll-Based Opacity Fading (R3)**:
     - Add `u_scroll_fade` uniform to fragment shader.
     - In RAF loop or scroll listener, compute:
       `scrollFade = Math.max(0, Math.min(1, 1 - (window.scrollY / (heroHeight * 0.75))))`.
     - Synchronize with `canvas.style.opacity = scrollFade.toString()`.
     - When `scrollFade <= 0.001`, pause WebGL draw calls to conserve GPU resources while browsing lower sections. Ensure seamless transition to `#FAF8F5` background.
   - **Saturation & Alpha Intensity Boost (R4)**:
     - Raise baseline alpha from ~0.24 to vibrant `0.50–0.65` range (`0.52 + 0.13 * pattern`).
     - Enrich chromatic pastel color vectors: cyan `#33E0EB` (`vec3(0.20, 0.88, 0.92)`), pink `#FF59BF` (`vec3(1.00, 0.35, 0.75)`), yellow `#FFDC40` (`vec3(1.00, 0.86, 0.25)`), lime `#76E04D` (`vec3(0.46, 0.88, 0.30)`).
     - Add a `1.25x` GLSL saturation curve boost so the fluid motion is immediately vivid and eye-catching upon landing.

2. **`components/BackgroundGrid.tsx` & Section Containers (R2)**:
   - In `BackgroundGrid.tsx`:
     - In `handleMouseMove`, detect typography elements:
       `const isHoveringText = (e.target as HTMLElement)?.closest?.('h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li, a, button, input, textarea, label, [data-boundary], .boundary-plate');`
     - When `isHoveringText` is true, suppress mouse coordinates (`mouse.x = -1000; mouse.y = -1000;`) so dots do not expand or distort typography under or over text elements.
   - In `components/Hero.tsx` & `components/ProjectsSection.tsx`:
     - Ensure text blocks sit on solid background plates (`bg-canvas` `#FAF8F5` or `bg-white`) with neo borders/shadows and `relative z-10` so text is physically shielded from underlying canvas dots.

3. **Build & Quality Check**:
   - Execute `npm run build` to ensure 0 TypeScript compiler errors and 0 Vite build errors.
   - Write your handoff report to `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\worker_m2\handoff.md` and notify via `send_message`.

## 2026-09-10T14:00:30Z
Worker M2 Invocation:
- R3 in components/HeroShader.tsx: continuous real-time multi-octave domain warping curl flow; scroll-based opacity fading with canvas.style.opacity synchronization and draw call halting when scrollFade <= 0.001.
- R4 in components/HeroShader.tsx: boost shader color saturation and baseline alpha to vibrant 0.50–0.65 range with chromatic pastel vectors (cyan, pink, yellow, lime) and 1.25x saturation boost.
- R2 in components/BackgroundGrid.tsx & section containers: hard boundary detection in handleMouseMove suppressing dot expansion when hovering text/boundary plates; solid background boundary plates with relative z-10 in Hero.tsx and ProjectsSection.tsx.
- Build verification: npm run build with 0 TS and 0 Vite errors.
- Output handoff report and notify parent via send_message.

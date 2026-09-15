## Survey Assignment: Explorer 2 (WebGL Shader & Interactive Background Grid)

### Scope
- Requirements: R2 (Hard Boundaries for Background Dotted Grid), R3 (Hero Live Moving Shader & Scroll-Based Fade), R4 (Shader Intensity & Vibrant Visibility).
- Files to examine:
  - `components/HeroShader.tsx`
  - `components/Hero.tsx`
  - `components/BackgroundGrid.tsx`
  - Any shader utils, shaders, or canvas wrapping styles.

### Objectives
1. Analyze `components/HeroShader.tsx`:
   - Current animation mechanism (is it mouse dependent? How to make it continuously animate fluidly in real time independent of cursor?).
   - Scroll-based opacity fading: how scroll events or window scroll are handled; how to smoothly fade opacity to 0 before the next section begins (`#FAF8F5` canvas transition).
   - Color saturation, opacity/alpha uniforms: current values (~0.20) and how to boost to ~0.50–0.65 for vivid chromatic pastel fluid motion (cyan, pink, yellow, lime).
2. Analyze `components/BackgroundGrid.tsx`:
   - How the interactive dotted grid is rendered (canvas, SVG, CSS, mouse proximity distortion/expansion).
   - Why grid dots bleed or blow up over/under text elements.
   - How to implement hard boundaries: ensuring text blocks and cards sit cleanly on solid background boundary plates (`bg-[#FAF8F5]`, z-index, clipping, or mouse event exclusion) so typography is protected.
3. Write your report to `.agents/explorer_survey_2/survey_report.md` and your handoff to `.agents/explorer_survey_2/handoff.md`.

## 2026-09-10T13:40:30Z
User Request:
You are Explorer 2 (Shader & Grid Specialist).
Working directory: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_2
Workspace root: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul
Original Request file: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\ORIGINAL_REQUEST.md
Dispatch assignment: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_2\DISPATCH.md

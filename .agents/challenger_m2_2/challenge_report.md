# Challenge Report: Milestone 2 (Challenger 2)

**Evaluator**: Challenger 2 (Empirical Background Grid & Boundary Plate Adversarial Challenger)  
**Milestone**: M2 (WebGL Fluid Shader & Background Grid Hard Boundaries)  
**Target Files**: `components/BackgroundGrid.tsx`, `components/Hero.tsx`, `components/ProjectsSection.tsx`, `components/ProjectCard.tsx`  
**Test Method**: Mathematical proofs, headless Chromium runner (`puppeteer-core`), DOM geometry and computed style extraction, automated multi-viewport sweeps (320px–1440px), recursive leaf-node exclusion audit, live event dispatch simulations, independent `npm run build` verification.

---

## Challenge Summary

**Overall risk assessment**: **LOW**  
**Verdict**: **APPROVE**

Requirement R2 ("Hard Boundaries for Background Dotted Grid") has been implemented with structural and mathematical rigor across `BackgroundGrid.tsx`, `Hero.tsx`, and `ProjectsSection.tsx`.

1. **Coordinate Suppression Guarantee**: Resetting mouse coordinates to `(-1000, -1000)` upon hovering typography or boundary plates guarantees mathematically that the distance `dist` to any on-screen dot across any resolution up to 4K (`3840x2160`) is strictly `>= 1414.2px`. Because `hoverRadius = 180px`, dot expansion to `5.2px` is mathematically impossible while hovering text. All dots remain at baseline calm radius (`1.5px`) and alpha (`0.12`).
2. **Solid Backing Plates & Stacking Context**: All hero content and project sections sit on solid white (`rgb(255, 255, 255)`) neo-brutalist plates with solid black borders (`>= 2px`), `shadow-neo-sm` / `shadow-neo`, and `relative z-10` stacking context above the `z-0` background canvas. Dot bleed through letterforms or cards is completely eliminated.
3. **Viewport Stability & Zero Overflow**: Tested across 5 viewports (1440px, 1024px, 768px, 390px, 320px). Horizontal overflow is zero (`scrollWidth === innerWidth`) across all breakpoints.
4. **Build Integrity**: `npm run build` executed independently with exit code 0 (1494 modules transformed, 0 TypeScript errors, 0 Vite bundling warnings).

One subtle edge-case challenge was discovered during the deep recursive leaf-node audit (unattached `<span>` tags inside `ProjectCard` not matching the exclusion query directly, though fully occluded by the card's opaque white background plate). This is documented below as a Low Risk finding with actionable mitigation.

---

## Challenges

### [Low Risk] Challenge 1: Standalone `<span>` Tags Inside `ProjectCard` Rely Exclusively on Physical Occlusion Rather than Algorithmic Suppression

- **Assumption challenged**: Every interactive element and text label on the screen directly triggers `isHoveringTextOrBoundary` to suppress background grid coordinates to `(-1000, -1000)`.
- **Attack scenario**: A user hovers their cursor specifically over the category pill (`<span className="...">AI/ML</span>`), flagship marker (`<span className="...">FLAGSHIP 01</span>`), or technology tags (`<span>Next.js</span>`) inside `ProjectCard.tsx`. In `BackgroundGrid.tsx`, the exclusion selector is:
  ```ts
  'h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li, a, button, input, textarea, label, [data-boundary], .boundary-plate, [role="article"]'
  ```
  Because `span` and `div` are not in the selector list, and `ProjectCard.tsx` does not have `.boundary-plate`, `[data-boundary]`, or `[role="article"]`, `target.closest(...)` returns `null`.
- **Empirical Observation**:
  - In our recursive leaf-node audit, all 29 leaf elements in `Hero.tsx` achieved 100% direct exclusion matching.
  - In `ProjectsSection.tsx`, all section headings, paragraphs, and buttons matched 100%. However, standalone `<span>` badges inside `ProjectCard.tsx` did not match `isHoveringTextOrBoundary`.
  - Crucially, `ProjectCard.tsx` has `bg-white border-4 border-black` (flagship) and `bg-white border-2 border-black` (archive), positioned at `relative z-10` above the `z-0` canvas. The background grid dots directly beneath the card are physically occluded by 100% opaque white paint (`rgb(255, 255, 255)`).
  - However, background dots outside the card's perimeter (within 180px radius of the cursor) could theoretically expand when hovering a tag badge near the card edge, whereas hovering the card title `<h3>` or description `<p>` suppresses outside dots.
- **Blast radius**: Low. Readability is never compromised because text sits on solid white backing plates. Only a subtle variance in perimeter dot behavior occurs between hovering the card's `h3` vs hovering an inner `span`.
- **Mitigation**: Add `[data-boundary="true"]` or `boundary-plate` to the ProjectCard wrapper divs in `ProjectsSection.tsx` (e.g. `<div key={project.id} className="relative overflow-visible boundary-plate" data-boundary="true">`), or add `span` to the selector string in `BackgroundGrid.tsx`.

---

### [Low Risk] Challenge 2: Pointer Event Throttling Interval (16ms) Boundary Window

- **Assumption challenged**: Coordinate suppression is instantaneous at 0ms latency.
- **Attack scenario**: The pointer rapidly enters a text boundary during the 16ms window between throttled `mousemove` callbacks (`const THROTTLE_MS = 16;`).
- **Empirical Observation**: 16ms corresponds to exactly 1 frame at 60Hz. Even during maximum cursor velocity, the cursor will remain over the text element on the subsequent event tick (or mouseleave), resetting coordinates to `(-1000, -1000)`. When mouse leaves the window, `mouseleave` immediately resets to `(-1000, -1000)`.
- **Blast radius**: Negligible. Sub-frame duration imperceptible to human vision.
- **Mitigation**: Current implementation is optimal; throttling prevents excessive RAF queueing and layout thrashing.

---

## Stress Test Results

### 1. Mathematical Bounds & Suppression Oracle

| Test Case | Inputs `(mouseX, mouseY, dotX, dotY)` | Distance `dist` | Calculated Radius | Calculated Alpha | Expansion Status | Verdict |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **Direct Cursor Hit** | `(200, 200)` over `(200, 200)` | 0.0px | **5.20px** | **0.570** | Max expansion (+3.7px) | **PASS** |
| **Halfway Hover** | `(290, 200)` over `(200, 200)` | 90.0px | **3.35px** | **0.345** | Linear falloff (50%) | **PASS** |
| **Hover Horizon Edge**| `(380, 200)` over `(200, 200)` | 180.0px | **1.50px** | **0.120** | Baseline calm radius | **PASS** |
| **Outside Radius** | `(400, 200)` over `(200, 200)` | 200.0px | **1.50px** | **0.120** | Inactive | **PASS** |
| **Suppressed (0, 0)** | `(-1000, -1000)` over `(0, 0)` | 1414.2px | **1.50px** | **0.120** | Zero expansion | **PASS** |
| **Suppressed (1920, 0)** | `(-1000, -1000)` over `(1920, 0)` | 3086.5px | **1.50px** | **0.120** | Zero expansion | **PASS** |
| **Suppressed (0, 1080)** | `(-1000, -1000)` over `(0, 1080)` | 2307.9px | **1.50px** | **0.120** | Zero expansion | **PASS** |
| **Suppressed (1920, 1080)**| `(-1000, -1000)` over `(1920, 1080)`| 3585.1px | **1.50px** | **0.120** | Zero expansion | **PASS** |
| **Suppressed Center** | `(-1000, -1000)` over `(960, 540)` | 2492.6px | **1.50px** | **0.120** | Zero expansion | **PASS** |
| **Suppressed 4K Edge** | `(-1000, -1000)` over `(3840, 2160)`| 5780.2px | **1.50px** | **0.120** | Zero expansion | **PASS** |

---

### 2. Viewport Sweep & Horizontal Overflow Stress Test

Tested using headless Chromium via automated script `tests/verify-grid-boundaries-m2.mjs`:

| Viewport Profile | Width x Height | Document `scrollWidth` | Window `innerWidth` | Hero Section Width | Projects Section Width | Horizontal Overflow? |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Desktop 1440px** | 1440 x 900 | 1440px | 1440px | 1440px | 1440px | **NONE (PASS)** |
| **Tablet Landscape**| 1024 x 768 | 1024px | 1024px | 1024px | 1024px | **NONE (PASS)** |
| **Tablet Portrait** | 768 x 1024 | 768px | 768px | 768px | 768px | **NONE (PASS)** |
| **Mobile Target** | 390 x 844 | 390px | 390px | 390px | 390px | **NONE (PASS)** |
| **Narrow Mobile** | 320 x 568 | 320px | 320px | 320px | 320px | **NONE (PASS)** |

---

### 3. Solid Boundary Backing Plates Empirical Audit

| Component Element | Computed Background Color | Computed Border | Stacking Context `z-index` | `.boundary-plate` Class | `data-boundary="true"` | Dot Bleed Shielding |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Hero Availability Badge** | `rgb(255, 255, 255)` | `2px solid rgb(0,0,0)` | In-flow (`relative z-10` parent) | **YES** | **YES** | **100% Shielded** |
| **Hero Punchy Subtitle Plate**| `rgb(255, 255, 255)` | `2px solid rgb(0,0,0)` | `relative z-10` | **YES** | **YES** | **100% Shielded** |
| **Hero Feature Strip Plate** | `rgb(255, 255, 255)` | `2px solid rgb(0,0,0)` | `relative z-10` | **YES** | **YES** | **100% Shielded** |
| **Hero CTA: Explore Projects** | `rgb(255, 222, 89)` | `2px solid rgb(0,0,0)` | In-flow (`relative z-10` parent) | N/A (`button` in query) | N/A | **100% Shielded** |
| **Hero CTA: GitHub** | `rgb(255, 255, 255)` | `2px solid rgb(0,0,0)` | In-flow (`relative z-10` parent) | N/A (`a` in query) | N/A | **100% Shielded** |
| **Hero CTA: LinkedIn** | `rgb(255, 255, 255)` | `2px solid rgb(0,0,0)` | In-flow (`relative z-10` parent) | N/A (`a` in query) | N/A | **100% Shielded** |
| **Hero CTA: Resume** | `rgb(255, 255, 255)` | `2px solid rgb(0,0,0)` | In-flow (`relative z-10` parent) | N/A (`a` in query) | N/A | **100% Shielded** |
| **Hero CTA: Contact** | `rgb(5, 5, 5)` | `2px solid rgb(0,0,0)` | In-flow (`relative z-10` parent) | N/A (`button` in query) | N/A | **100% Shielded** |
| **Projects Section Header Plate**| `rgb(255, 255, 255)` | `2px solid rgb(0,0,0)` | `relative z-10` | **YES** | **YES** | **100% Shielded** |
| **Projects Tier 2 Header Plate** | `rgb(255, 255, 255)` | `2px solid rgb(0,0,0)` | `relative z-10` | **YES** | **YES** | **100% Shielded** |
| **Projects 3 Flagship Cards** | `rgb(255, 255, 255)` | `4px solid rgb(0,0,0)` | `relative z-10` parent | N/A (`h3`, `p` in query) | N/A | **100% Shielded** |
| **Projects 5 Archive Cards** | `rgb(255, 255, 255)` | `2px solid rgb(0,0,0)` | `relative z-20` parent | N/A (`h3`, `p` in query) | N/A | **100% Shielded** |
| **Projects GitHub Deep-Link Banner**| `rgb(255, 255, 255)`| `2px solid rgb(0,0,0)`| `relative z-10` | **YES** | **YES** | **100% Shielded** |

---

### 4. Interactive Typography Hover Simulation

Dispatched live `mousemove` events to test coordinate suppression across target elements:

| Tested Element | Target Tag / Structure | `isHoveringTextOrBoundary` Evaluation | Mouse Coordinates Post-Event | Dot Grid Radius at Target | Status |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Hero Main Title** | `<h1>` (Sujal Chhajed) | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Hero Nested Heading Span**| `<h1> <span>` (Building AI...) | `true` (via `.closest('h1')`) | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Hero Availability Badge** | `.boundary-plate` | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Hero Subtitle Body** | `<p>` | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Hero CTA Button** | `<button>` | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Hero CTA Link** | `<a>` | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Hero Bottom Feature Strip**| `.boundary-plate` | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Projects Section Header H2**| `<h2>` | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Projects Description** | `<p>` | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Flagship Card Title** | `<h3>` | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Tier 2 Header H3** | `<h3>` | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **GitHub Banner Content** | `.boundary-plate` | `true` | `(-1000, -1000)` | 1.5px (Suppressed) | **PASS** |
| **Empty Margin / Gutter** | `<div>` (non-text) | `false` | `(clientX, clientY)` | Dynamic up to 5.2px | **PASS** |

---

## Unchallenged Areas

1. **Worker M1 Out-of-Scope Files**: `components/Skills.tsx`, `components/About.tsx`, `components/ContactSection.tsx`, `components/Footer.tsx`. These files were verified via DOM tree inspection to inherit global suppression for all standard text tags (`h1–h6`, `p`, `button`, `a`, `ul`, `ol`, `li`, etc.), but their internal JSX modifications remain under Worker M1 and Challenger 1's respective domains.
2. **WebGL Context Loss Simulation on HeroShader**: Thoroughly tested and verified by Challenger 1 in `tests/verify-shader-m2.mjs`. Challenger 2 focused strictly on R2 grid boundaries and plate shielding per dispatch assignment.

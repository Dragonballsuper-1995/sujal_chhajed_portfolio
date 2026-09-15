# Architectural Survey & Implementation Blueprint: WebGL Fluid Shader & Interactive Background Grid

**Explorer**: Explorer 2 (Shader & Grid Specialist)  
**Date**: 2026-09-10  
**Scope**: Requirements R2, R3, R4  
**Primary Files**:
- `components/HeroShader.tsx`
- `components/Hero.tsx`
- `components/BackgroundGrid.tsx`
- Content sections: `components/ProjectsSection.tsx`, `components/Skills.tsx`, `components/About.tsx`, `components/ContactSection.tsx`

---

## 1. Executive Summary

This survey analyzes the WebGL background fluid shader and interactive dotted background grid in the neo-brutalist portfolio. 

### Core Findings
1. **Hero WebGL Fluid Shader (`components/HeroShader.tsx`)**:
   - **Current State**: Uses a single-frequency pseudo-simplex noise translation running at an imperceptibly slow effective speed (`elapsed * 0.055` units/s). Without cursor movement, the animation appears almost completely frozen. The color alpha is clamped between `0.18` and `0.32` (with cursor boost up to 0.55), which when blended via `mix-blend-multiply` against the `#FAF8F5` canvas background produces a faint, washed-out appearance. Furthermore, there is **zero scroll handling** in `HeroShader.tsx`; the canvas remains active and visible regardless of scroll offset, causing color artifacts at the boundary of subsequent sections.
   - **Required Solution (R3 & R4)**:
     1. Upgrade the GLSL fragment shader to implement continuous, multi-octave domain warping (e.g., Inigo Quilez curl/flow domain warp) running on an autonomous time loop (`u_time * 0.55`) with trigonometric directional drifting (`vec2(sin(t*0.4), cos(t*0.35))`). Mouse interaction becomes an organic liquid displacement wave rather than a prerequisite for visible animation.
     2. Boost baseline alpha to `0.50–0.65` (e.g. `0.52 + 0.13 * pattern`), deepen chromatic pastel palette vectors (cyan `#33E0EB`, pink `#FF59BF`, yellow `#FFDC40`, lime `#76E04D`), and introduce a GLSL saturation boost function (`clamp(mix(vec3(luma), color, 1.25), 0.0, 1.0)`).
     3. Introduce a scroll fade uniform `u_scroll_fade` calculated in RAF as `Math.max(0, Math.min(1, 1 - (window.scrollY / (heroHeight * 0.75))))`. Synchronously set `canvas.style.opacity = scrollFade.toString()` and skip WebGL draw calls when `scrollFade <= 0.001` to guarantee a 100% clean `#FAF8F5` transition and zero GPU overhead outside the Hero section.

2. **Interactive Background Grid (`components/BackgroundGrid.tsx`) & Content Containers**:
   - **Current State**: Renders an interactive 2D HTML5 canvas (`space = 36px`, `baseRadius = 1.5px`, `hoverRadius = 180px`). Mouse tracking is unconstrained via `window.addEventListener('mousemove')`. When hovering anywhere within 180px, dots balloon up to `5.2px` with alpha `0.57` (`rgba(5, 5, 5, 0.57)`). Because sections (`Hero`, `ProjectsSection`, `Skills`, `About`) and their text blocks (`h1`, `h2`, `p`, bio narrative) have `bg-transparent`, these massive 10.4px diameter black dots render directly between and under typography, severely degrading readability.
   - **Required Solution (R2)**:
     1. **Algorithmic Mouse Exclusion in `BackgroundGrid.tsx`**: In `handleMouseMove(e)`, inspect `e.target` using `element.closest('h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li, a, button, input, textarea, label, [data-boundary], .boundary-plate')`. If hovering over typography or a protected container, set `mouse.x = -1000, mouse.y = -1000` (or ease `hoverIntensity` to 0). This prevents grid dots from expanding near typography.
     2. **Solid Background Boundary Plates in Content Containers**: Ensure that all text blocks, headers, and cards across `Hero.tsx`, `ProjectsSection.tsx`, `Skills.tsx`, and `About.tsx` sit on solid background plates (`bg-canvas` `#FAF8F5` or `bg-white` with neo-brutalist borders/shadows) with proper stacking context (`relative z-10`). This physically occludes baseline dots under typography.

---

## 2. Deep Dive: Hero WebGL Shader (`components/HeroShader.tsx` & `components/Hero.tsx`)

### 2.1 Current Implementation Breakdown

**File**: `components/HeroShader.tsx` (Lines 25–94, 141–193, 205–212)

```glsl
// Lines 65-77: Noise sampling & slow translation
vec2 mouse = u_mouse / u_resolution;
mouse.x *= aspect;
float mouseDist = length(p - mouse);
float mouseInfluence = smoothstep(0.45, 0.0, mouseDist) * 0.35;

float t = u_time * 0.22;

// Multi-layered fluid domain warp
float n1 = snoise(p * 1.5 + vec2(t * 0.25, t * 0.18) + mouseInfluence);
float n2 = snoise(p * 2.2 - vec2(t * 0.2, -t * 0.28) + vec2(n1 * 0.6));
float n3 = snoise(p * 3.0 + vec2(n2 * 0.45, t * 0.12));
```

```glsl
// Lines 78-93: Palette and low alpha clamp
vec3 colCyan   = vec3(0.36, 0.88, 0.90);
vec3 colYellow = vec3(1.00, 0.87, 0.35);
vec3 colPink   = vec3(1.00, 0.40, 0.77);
vec3 colLime   = vec3(0.49, 0.85, 0.34);

vec3 color = mix(colYellow, colCyan, smoothstep(-0.5, 0.5, n1));
color = mix(color, colPink, smoothstep(-0.3, 0.6, n2));
color = mix(color, colLime, smoothstep(0.1, 0.8, n3 * 0.5 + 0.5));

// Enhanced visibility: alpha between 0.18 and 0.32, with cursor brightness boost
float alpha = clamp(0.18 + 0.12 * (n1 * 0.5 + 0.5) + mouseInfluence * 0.25, 0.0, 0.55);

gl_FragColor = vec4(color, alpha);
```

```tsx
// Lines 175-190: Render loop without scroll awareness
const render = (time: number) => {
  resize();
  
  // Smooth mouse follow
  currentMouseX += (mouseX - currentMouseX) * 0.05;
  currentMouseY += (mouseY - currentMouseY) * 0.05;

  const elapsed = (time - startTime) * 0.001;

  gl.uniform2f(uResolution, canvas.width, canvas.height);
  gl.uniform1f(uTime, elapsed);
  gl.uniform2f(uMouse, currentMouseX, currentMouseY);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  animationFrameId = requestAnimationFrame(render);
};
```

### 2.2 Detailed Gap Analysis

| Requirement | Current Defect | Exact Root Cause | Impact |
|---|---|---|---|
| **R3: Continuous Autonomous Motion** | Shader appears static when mouse is still. | `t = u_time * 0.22`, noise coordinate offset `t * 0.25 = elapsed * 0.055`. Takes ~20s for a single noise cycle. No rotational or turbulent flow vector. | Hero background looks like a motionless static texture rather than live fluid. |
| **R3: Scroll-Based Opacity Fading** | Shader does not fade on scroll; remains at 95% opacity indefinitely. | Zero scroll listeners, no `u_scroll_fade` uniform, no CSS opacity adjustment based on scroll position. | Shader bleeds past Hero; transition to `#FAF8F5` at `ProjectsSection` border is abrupt or obscured. |
| **R4: Vibrant Chromatic Saturation & Alpha** | Fluid colors look washed-out, pale, and barely noticeable. | `alpha` clamped to `0.18 + 0.12 * [...]` (~0.24 baseline). Combined with `mix-blend-multiply` against cream `#FAF8F5`, low alpha produces near-zero contrast difference. | Fails requirement to make chromatic pastel motion immediately noticeable upon landing. |

---

### 2.3 Concrete Proposed Solution for HeroShader

#### A. Fragment Shader Architecture (Autonomous Flow + Saturation Boost + Scroll Fade)
```glsl
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll_fade; // Added uniform for smooth scroll fading [0.0 .. 1.0]

// Simplex-style pseudo noise functions (mod289, permute, snoise unchanged)
...

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Autonomous continuous time evolution (3x faster, multi-speed harmonics)
  float t = u_time * 0.55;

  // Interactive mouse coordinates with smooth falloff
  vec2 mouse = u_mouse / u_resolution;
  mouse.x *= aspect;
  vec2 mouseDelta = p - mouse;
  float mouseDist = length(mouseDelta);
  float mouseInfluence = smoothstep(0.42, 0.0, mouseDist);
  vec2 mouseWarp = (mouseDist > 0.001) ? (mouseDelta / mouseDist) * mouseInfluence * 0.28 : vec2(0.0);

  // Autonomous rotational/trigonometric flow vectors independent of cursor
  vec2 flow1 = vec2(sin(t * 0.40) * 0.35, cos(t * 0.32) * 0.35);
  vec2 flow2 = vec2(cos(t * 0.36 + 1.2) * 0.30, sin(t * 0.42 + 2.1) * 0.30);

  // Multi-octave domain warping (creates rich rolling fluid motion)
  vec2 q = vec2(
    snoise(p * 1.3 + vec2(t * 0.30, t * 0.22) + flow1 + mouseWarp * 0.5),
    snoise(p * 1.3 + vec2(-t * 0.25, t * 0.28) + flow2 + vec2(5.2, 1.3))
  );

  vec2 r = vec2(
    snoise(p * 2.1 + 1.6 * q + vec2(t * 0.18, -t * 0.22) + vec2(1.7, 9.2)),
    snoise(p * 2.1 + 1.6 * q + vec2(-t * 0.22, t * 0.16) + vec2(8.3, 2.8))
  );

  float f = snoise(p * 2.6 + 2.0 * r + mouseWarp);

  // Vibrant Neo-Brutalist Chromatic Pastel Palette
  // Cyan (#33E0EB), Yellow (#FFDC40), Pink (#FF59BF), Lime (#76E04D)
  vec3 colCyan   = vec3(0.20, 0.88, 0.92);
  vec3 colYellow = vec3(1.00, 0.86, 0.25);
  vec3 colPink   = vec3(1.00, 0.35, 0.75);
  vec3 colLime   = vec3(0.46, 0.88, 0.30);

  // Dynamic chromatic mixing
  vec3 color = colYellow;
  color = mix(color, colCyan, smoothstep(-0.35, 0.35, q.x));
  color = mix(color, colPink, smoothstep(-0.40, 0.50, r.y));
  color = mix(color, colLime, smoothstep(-0.20, 0.60, f));

  // Color Saturation Boost (R4): keeps pastels punchy and vivid
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  color = clamp(mix(vec3(luma), color, 1.25), 0.0, 1.0);

  // Alpha Boost (R4): baseline raised from ~0.20 to ~0.50–0.65 range
  float baseAlpha = 0.52 + 0.13 * (f * 0.5 + 0.5);
  float alpha = clamp(baseAlpha + mouseInfluence * 0.10, 0.48, 0.70);

  // Scroll-based opacity fade (R3): smoothly attenuates alpha to 0.0
  alpha *= u_scroll_fade;

  gl_FragColor = vec4(color, alpha);
}
```

#### B. TypeScript Component Implementation (Scroll Tracking & Performance Guard)
In `components/HeroShader.tsx`:
```tsx
const uScrollFade = gl.getUniformLocation(program, 'u_scroll_fade');

// Scroll fade computation inside render loop
const render = (time: number) => {
  resize();

  // Calculate scroll fade progress
  const heroEl = canvas.parentElement;
  const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
  const scrollY = window.scrollY || window.pageYOffset;
  
  // Smoothly fade to 0 opacity before reaching 75% of Hero section
  const fadeDistance = heroHeight * 0.75;
  const scrollFade = Math.max(0, Math.min(1, 1 - (scrollY / fadeDistance)));

  // Synchronize CSS opacity for total browser compositor transparency cutoff
  canvas.style.opacity = scrollFade.toFixed(3);

  // Performance Guard: Skip WebGL draw calls when Hero is scrolled out of view
  if (scrollFade <= 0.001) {
    animationFrameId = requestAnimationFrame(render);
    return;
  }

  currentMouseX += (mouseX - currentMouseX) * 0.05;
  currentMouseY += (mouseY - currentMouseY) * 0.05;
  const elapsed = (time - startTime) * 0.001;

  gl.uniform2f(uResolution, canvas.width, canvas.height);
  gl.uniform1f(uTime, elapsed);
  gl.uniform2f(uMouse, currentMouseX, currentMouseY);
  gl.uniform1f(uScrollFade, scrollFade);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  animationFrameId = requestAnimationFrame(render);
};
```

---

## 3. Deep Dive: Interactive Background Dotted Grid (`components/BackgroundGrid.tsx` & Content Containers)

### 3.1 Current Implementation Breakdown

**File**: `components/BackgroundGrid.tsx` (Lines 42–81, 114–132, 156–162)

```ts
// Lines 53-79: Dot drawing and hover calculation
const baseRadius = 1.5;
const hoverRadius = 180;

for (let r = 0; r <= rows; r++) {
  for (let c = 0; c <= cols; c++) {
    const x = offsetX + c * space;
    const y = offsetY + r * space;

    const dx = mouse.x - x;
    const dy = mouse.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let radius = baseRadius;
    let alpha = 0.12;

    if (dist < hoverRadius) {
      const intensity = 1 - (dist / hoverRadius);
      // Grows smoothly up to ~5.2px within circular radius
      radius = baseRadius + (intensity * 3.7);
      alpha = 0.12 + (intensity * 0.45); // Becomes richer on hover
    }

    ctx.fillStyle = `rgba(5, 5, 5, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
```

```ts
// Lines 114-122: Unconstrained mouse tracking
handleMouseMove = (e: MouseEvent) => {
  const now = performance.now();
  if (now - lastMoveTime < THROTTLE_MS) return;
  lastMoveTime = now;

  mouse.x = e.clientX;
  mouse.y = e.clientY;
  requestDraw();
};
```

### 3.2 Root Cause Analysis

1. **Unconstrained Proximity Field**: `handleMouseMove` tracks the raw viewport coordinates `(e.clientX, e.clientY)`. Whenever a user hovers over paragraph text, headlines, or cards, the mouse coordinate is centered on the text. The 180px radius expands dots directly underneath the text letters.
2. **Transparent Section Containers**:
   - `Hero.tsx` line 15: `bg-transparent`
   - `ProjectsSection.tsx` line 13: `bg-transparent`
   - `Skills.tsx` line 85: `bg-transparent`
   - `About.tsx` line 8: `bg-transparent`
3. **Transparent Typography Blocks**:
   - Hero headline (`h1`) and punchy subtitle (`p`) have no background plate.
   - Section headers in `ProjectsSection` and `Skills` have no background plate.
   - Narrative bio paragraphs in `About.tsx` (Column 2, line 59) have no background card.
   When the user hovers over text to read it, dark dots balloon to 5.2px radius (over 10px diameter) directly behind the black letterforms, creating severe visual noise and readability disruption.

---

### 3.3 Concrete Hard Boundary Architecture (Dual-Layer Protection)

#### Layer 1: Algorithmic Mouse Exclusion in `components/BackgroundGrid.tsx`
Because `canvas` has `pointer-events-none`, `handleMouseMove(e)` receives the actual DOM element under the cursor in `e.target`. We can query whether `e.target` is or is inside a typography element, link, button, or container tagged with a boundary attribute.

```ts
// Helper function to detect text typography and boundary plates
const isHoveringTextOrBoundary = (e: MouseEvent): boolean => {
  const target = e.target as HTMLElement | null;
  if (!target) return false;
  
  return !!target.closest(
    'h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li, a, button, input, textarea, label, [data-boundary], .boundary-plate, [role="article"]'
  );
};
```

In `bindPointerListeners`:
```ts
handleMouseMove = (e: MouseEvent) => {
  const now = performance.now();
  if (now - lastMoveTime < THROTTLE_MS) return;
  lastMoveTime = now;

  // HARD BOUNDARY CHECK: Suppress dot expansion under typography
  if (isHoveringTextOrBoundary(e)) {
    if (mouse.x !== -1000 || mouse.y !== -1000) {
      mouse.x = -1000;
      mouse.y = -1000;
      requestDraw();
    }
    return;
  }

  mouse.x = e.clientX;
  mouse.y = e.clientY;
  requestDraw();
};
```

**Result**: Moving the mouse over any heading, paragraph, button, badge, or card across the entire site instantly suppresses dot expansion, keeping all grid dots at their calm baseline (`1.5px` radius, `0.12` alpha).

#### Layer 2: Solid Background Boundary Plates across Content Containers
To protect readability even at the baseline `1.5px` dot radius, all text blocks and cards must sit on solid background plates (`bg-canvas` `#FAF8F5` or `bg-white`) with explicit relative z-index (`z-10`).

1. **Hero Section (`components/Hero.tsx`)**:
   - Subtitle container (line 43):
     ```tsx
     <div className="max-w-2xl mb-10 p-5 bg-white border-2 border-black shadow-neo-sm">
       <p className="font-mono text-base md:text-lg text-ink font-medium leading-relaxed mb-3">
         AI/ML Engineer & Full-Stack Developer specializing in fine-tuned LLM architectures, real-time inference optimization, and resilient full-stack systems.
       </p>
       <p className="font-mono text-xs md:text-sm text-muted">
         8+ Production Deployments • Sub-100ms Target Latency
       </p>
     </div>
     ```
     *(Note: Location de-duplicated per R8).*
   - Bottom feature strip (line 131):
     Add `bg-canvas/90 px-4 py-2 border-2 border-black/10 shadow-neo-sm inline-flex` or solid plate backing.

2. **Projects Section (`components/ProjectsSection.tsx`)**:
   - Section Header (lines 17–34): Wrap the header in a neo-brutalist boundary plate:
     ```tsx
     <div className="bg-white border-2 border-black shadow-neo-sm p-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
       ...
     </div>
     ```
   - Tier 2 Archive Header (lines 49–61): Wrap in a solid plate:
     ```tsx
     <div className="bg-white border-2 border-black shadow-neo-sm p-5 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
       ...
     </div>
     ```
   *(Cards are already solid white plates `bg-white border-4 border-black`).*

3. **Skills Section (`components/Skills.tsx`)**:
   - Section Header (lines 89–100): Wrap in a solid plate `bg-white border-2 border-black shadow-neo-sm p-6 mb-12`.
   - Category Rows (line 141): Style each category row as a solid card panel:
     ```tsx
     <div
       key={catKey}
       className="bg-white border-2 border-black shadow-neo-sm p-5 sm:p-6 border-l-8"
       style={{ borderLeftColor: meta.color }}
     >
       ...
     </div>
     ```

4. **About Section (`components/About.tsx`)**:
   - Narrative Bio & Origin Story (Column 2): Restructure into a prominent neo-brutalist card matching R6:
     ```tsx
     <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-neo space-y-4">
       <h3 className="font-sans text-xl font-black uppercase text-black border-b-2 border-black pb-2">
         Engineering Philosophy & Origin
       </h3>
       <div className="space-y-4 font-mono text-sm leading-relaxed text-ink">
         ...
       </div>
     </div>
     ```

---

## 4. Cross-Requirement Synergies & Edge Cases

1. **Performance & Frame Budget**:
   - `HeroShader`: Halting `gl.drawArrays` when `scrollFade <= 0.001` frees up the GPU completely once the user scrolls into Projects, Skills, About, or Contact.
   - `BackgroundGrid`: Throttled to 16ms (60fps) and only issues `requestDraw()` when mouse moves or leaves.
   - Device pixel ratio capped at `Math.min(window.devicePixelRatio || 1, 2)` across both canvases prevents fill-rate bottlenecks on 3x Retina/mobile screens.
2. **Reduced Motion (`prefers-reduced-motion`)**:
   - In `HeroShader.tsx`, detect `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. If true, slow the time multiplier to `0.05` to provide a subtle static pastel gradient without rapid fluid movement.
3. **Mobile & Touch Viewports (`pointer: coarse`)**:
   - `BackgroundGrid.tsx` already detects `window.matchMedia('(pointer: coarse)')`. On coarse pointers (phones/tablets), interactive mouse hover listeners are omitted; the grid renders static crisp baseline dots.
4. **Dark Sections Continuity (Contact & Footer)**:
   - Contact (`#0A0A10` / `#09090E`) and Footer (`#0A0A10` / `#050505`) have solid dark backgrounds and `relative z-10`. They naturally occlude the fixed background grid canvas, preventing any dot visibility in the dark monolith.

---

## 5. Implementation Roadmap for Refactoring Phase

1. **Step 1: Update `components/HeroShader.tsx`**:
   - Rewrite fragment shader with multi-octave domain warping, vibrant chromatic palette vectors, and saturation boost.
   - Add `u_scroll_fade` uniform and connect scroll tracking in the RAF render loop.
   - Add performance cutoff (`if (scrollFade <= 0.001) return;`).
2. **Step 2: Update `components/BackgroundGrid.tsx`**:
   - Implement `isHoveringTextOrBoundary` DOM check in `handleMouseMove`.
   - Set mouse coordinates to `(-1000, -1000)` on text hover to prevent dot expansion.
3. **Step 3: Update Content Containers for Solid Boundary Plates**:
   - In `Hero.tsx`: Wrap subtitle in a solid boundary plate (`bg-white` or `bg-canvas`). Remove "Chennai, India" string.
   - In `ProjectsSection.tsx`: Add solid plates to Section Header and Tier 2 Header.
   - In `Skills.tsx`: Add solid plates to Section Header and category rows.
   - In `About.tsx`: Wrap narrative bio in a solid 2-column card (`bg-white border-4 border-black shadow-neo`).
4. **Step 4: Build Verification**:
   - Execute `npm run build` to verify zero TypeScript errors and successful production bundling.

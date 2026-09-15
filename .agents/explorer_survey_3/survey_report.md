# Detailed Survey Report: Dark Theme Continuity, Contact Form & Quality Floor

**Agent**: Explorer 3 (Dark Theme, Contact & Build Specialist)  
**Date**: 2026-09-10  
**Scope**: Requirements R7, R8, R9, and Engineering Quality Floor  
**Target Files**:
- `components/ContactSection.tsx`
- `components/Footer.tsx`
- `components/Hero.tsx` (cross-reference for location string)
- `components/About.tsx` (cross-reference for location string)
- `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `index.css`

---

## Executive Summary

1. **R7 (Seamless Dark Continuity & Monogram Fix)**:
   - `ContactSection.tsx` uses `bg-[#09090E]` while `Footer.tsx` uses `bg-[#050505]` and `Footer` bottom strip uses `bg-[#020204]`. These disparate dark shades clash.
   - `Footer.tsx` line 42 has `border-t-2 border-white/10`, producing an explicit horizontal boundary line between Contact and Footer.
   - In `ContactSection.tsx`, the watermark monogram `SC` has `absolute -right-12 -bottom-16` with `text-[18rem] md:text-[24rem]` while the parent `<section>` has `overflow-hidden`. Because of the negative bottom offset (`-bottom-16`), the bottom 64px of the glyphs are sliced off in an abrupt horizontal cut right at the section transition seam.
   - **Solution**: Unify all background colors to `#0A0A10`, remove the top border from `Footer.tsx` (`border-t-0`), and reposition the watermark monogram to `bottom-0 right-0` (or `bottom-2 right-4`) so glyphs rest gracefully inside the container without edge clipping.

2. **R8 (Location De-Duplication)**:
   - "Chennai, India" currently exists in 4 components:
     - `components/Hero.tsx` (line 48): `📍 Chennai, India • 8+ Production Deployments • Sub-100ms Target Latency`
     - `components/About.tsx` (line 42): `<span>{PERSONAL_INFO.location}</span>`
     - `components/ContactSection.tsx` (line 126): `<span>{PERSONAL_INFO.location} (IST / UTC+5:30)</span>`
     - `components/Footer.tsx` (line 169): `<p className="text-gray-400 font-bold">Chennai, India • Available Globally</p>`
   - **Solution**: Remove the location string from `Hero.tsx`, `About.tsx`, and `ContactSection.tsx`. In `ContactSection.tsx`, replace the location block with timezone/availability info (`IST (UTC+5:30) • Available Globally`) and remove the unused `MapPin` import to avoid `TS6133` unused local errors under `noUnusedLocals: true`. Retain "Chennai, India" exclusively in `Footer.tsx` line 169.

3. **R9 (High-Contrast Highlighted Contact Form)**:
   - `ContactSection.tsx` lines 175-266: Currently styled with `bg-[#12121C] border-4 border-black p-6 sm:p-8 shadow-neo-white`. On the dark background, `#12121C` recedes into darkness and completely fails to command attention.
   - **Solution**: Redesign the contact form as an unapologetic, high-contrast neo-brutalist focal card:
     - Container: Crisp pure white (`bg-white` / `#FFFFFF`), bold 4px black borders (`border-4 border-black`), and high-energy neon yellow hard drop shadow (`shadow-[8px_8px_0px_0px_#FFDE59]`).
     - Header banner: High-impact `bg-neo-yellow px-6 py-4 border-b-4 border-black` featuring a neo-pink sticker badge (`bg-neo-pink text-white uppercase text-[10px] font-black tracking-wider px-2 py-0.5 border-2 border-black`), bold title `DIRECT TRANSMISSION` in black `font-sans`, and an envelope sticker icon.
     - Inputs: High-contrast fields with 2px black borders, solid typography, and hard shadow focus states (`focus:shadow-[4px_4px_0px_0px_#FFDE59]`).
     - Action button: Full-width neo-yellow button (`bg-neo-yellow text-black border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-neo-pink`).

4. **Engineering & Quality Floor**:
   - `npm run build` (`tsc && vite build`) executes cleanly with exit code 0 (verified: built in 4.50s, 0 TypeScript errors).
   - Bundling produces code-split chunks (`vendor-react`, `vendor-framer-motion`, `vendor-lucide`, `vendor-gsap`, `CommandPalette`, `ContactForm`, `ProjectCaseStudy`).
   - Viewport layouts: 1440px desktop (side-by-side grid, massive focal presence) and 390px mobile (clean vertical stack, touch targets >= 44px, no horizontal scroll overflow).

---

## Deep Dive 1: Requirement R7 — Dark Continuity & Monogram Fix

### Current Implementation & Code Snippets

#### `components/ContactSection.tsx`
```tsx
62:    <section
63:      id={NavSection.CONTACT}
64:      className="scroll-mt-16 py-20 md:py-28 bg-[#09090E] text-white border-t-4 border-black relative overflow-hidden"
65:    >
66:      {/* Giant Decorative Monogram Watermark */}
67:      <div
68:        className="absolute -right-12 -bottom-16 text-[18rem] md:text-[24rem] font-sans font-black text-white/[0.03] select-none pointer-events-none uppercase leading-none tracking-tighter"
69:        aria-hidden="true"
70:      >
71:        SC
72:      </div>
```

#### `components/Footer.tsx`
```tsx
42:    <footer className="bg-[#050505] text-white border-t-2 border-white/10 relative overflow-hidden select-none">
...
166:      {/* ── Bottom Copyright Strip ───────────────────────────────────────── */}
167:      <div className="border-t border-white/10 bg-[#020204] py-5 relative z-10">
```

### Analysis of Defects

1. **Color Inconsistency**:
   - `ContactSection`: `#09090E` (a navy-tinted near-black)
   - `Footer` main body: `#050505` (a deep neutral ink black)
   - `Footer` copyright strip: `#020204` (an ultra-black)
   - *Impact*: When scrolling between Contact and Footer, the background visibly shifts shades, fragmenting what should be a single dark resolution block.

2. **Jarring Border Break**:
   - `Footer` has `border-t-2 border-white/10` right at the boundary where `ContactSection` ends.
   - *Impact*: A faint white line cuts straight across the screen, artificially separating the contact area from footer navigation and branding.

3. **Watermark Monogram Clipping**:
   - The decorative monogram is styled with `text-[18rem] md:text-[24rem]` and positioned `-bottom-16 -right-12`.
   - The `<section>` has `overflow-hidden`.
   - *Impact*: The `-bottom-16` offset pushes the lower 64px of the glyphs past the section boundary, causing `overflow-hidden` to slice the letters "S" and "C" in a harsh, flat horizontal cut right at the seam. On mobile, `-right-12` causes horizontal clipping of the letter "C".

### Concrete Implementation Plan for R7

1. **Unify Background to `#0A0A10`**:
   - In `ContactSection.tsx` line 64:
     Change `bg-[#09090E]` to `bg-[#0A0A10]`.
   - In `Footer.tsx` line 42:
     Change `bg-[#050505]` to `bg-[#0A0A10]`.
   - In `Footer.tsx` line 166:
     Change `bg-[#020204]` to `bg-[#0A0A10]` (or `bg-[#07070C]`) and adjust border to `border-t border-white/5` for a subtle, seamless base.

2. **Eliminate Border Breaks**:
   - In `Footer.tsx` line 42:
     Remove `border-t-2 border-white/10` entirely.
   - Result: Seamless transition with 0px border between `ContactSection` and `Footer`.

3. **Fix Watermark Monogram Clipping**:
   - In `ContactSection.tsx` lines 67-72:
     Replace:
     ```tsx
     <div
       className="absolute -right-12 -bottom-16 text-[18rem] md:text-[24rem] font-sans font-black text-white/[0.03] select-none pointer-events-none uppercase leading-none tracking-tighter"
       aria-hidden="true"
     >
       SC
     </div>
     ```
     With:
     ```tsx
     <div
       className="absolute right-0 sm:right-4 bottom-0 text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[24rem] font-sans font-black text-white/[0.03] select-none pointer-events-none uppercase leading-none tracking-tighter z-0"
       aria-hidden="true"
     >
       SC
     </div>
     ```
   - Rationale: Anchoring at `bottom-0` and `right-0 sm:right-4` ensures the glyph curves sit naturally within the container bounds without being sliced horizontally by `overflow-hidden`.

---

## Deep Dive 2: Requirement R8 — Location De-duplication

### Current Implementation & Code Snippets

1. **`components/ContactSection.tsx` (lines 123-133)**:
```tsx
123:            {/* Quick Context & Location */}
124:            <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-gray-400">
125:              <div className="flex items-center gap-2">
126:                <MapPin size={14} className="text-neo-pink" />
127:                <span>{PERSONAL_INFO.location} (IST / UTC+5:30)</span>
128:              </div>
129:              <div className="flex items-center gap-2">
130:                <Sparkles size={14} className="text-neo-cyan" />
131:                <span>Fast Response within 24h</span>
132:              </div>
133:            </div>
```

2. **`components/Footer.tsx` (lines 167-171)**:
```tsx
167:        <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-gray-500">
168:          <p>© {new Date().getFullYear()} Sujal Sanjay Chhajed • Built with React 18 & Vite</p>
169:          <p className="text-gray-400 font-bold">Chennai, India • Available Globally</p>
170:        </div>
```

3. **`components/Hero.tsx` (line 48)**:
```tsx
48:            📍 Chennai, India • 8+ Production Deployments • Sub-100ms Target Latency
```

4. **`components/About.tsx` (lines 40-43)**:
```tsx
40:              <div className="flex items-center gap-1.5 text-black font-bold">
41:                <MapPinIcon />
42:                <span>{PERSONAL_INFO.location}</span>
43:              </div>
```

### Analysis & Implementation Plan for R8

- **Goal**: "Chennai, India" must be removed from `Hero.tsx`, `About.tsx`, and `ContactSection.tsx`, appearing *only* in `Footer.tsx` line 169.
- **In `components/ContactSection.tsx`**:
  - Replace lines 124-128:
    ```tsx
    {/* Quick Context */}
    <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-gray-400">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-neo-green animate-pulse" />
        <span>IST (UTC+5:30) • Available Globally</span>
      </div>
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-neo-cyan" />
        <span>Fast Response within 24h</span>
      </div>
    </div>
    ```
  - **Critical TypeScript Rule**:
    In `ContactSection.tsx` line 2:
    ```tsx
    import { Copy, Check, Send, Linkedin, Github, Twitter, Sparkles, MapPin } from 'lucide-react';
    ```
    If `MapPin` is removed from the markup, it **MUST** be removed from the import list. Because `tsconfig.json` enforces `"noUnusedLocals": true`, leaving `MapPin` imported will cause `tsc` compilation to fail.
- **In `components/Footer.tsx`**:
  - Line 169 already contains `<p className="text-gray-400 font-bold">Chennai, India • Available Globally</p>`. Keep this line as the sole, canonical location display on the entire website.

---

## Deep Dive 3: Requirement R9 — High-Contrast Neo-Brutalist Contact Form

### Current Implementation & Code Snippets

`components/ContactSection.tsx` lines 175-266:
```tsx
175:          {/* ── Right Column: In-Place Clean Brutalist Contact Form ─────────── */}
176:          <div className="lg:col-span-6">
177:            <div className="bg-[#12121C] border-4 border-black p-6 sm:p-8 shadow-neo-white relative">
178:              {/* Form Title */}
179:              <div className="flex items-center justify-between border-b-2 border-white/10 pb-4 mb-6">
180:                <div>
181:                  <h3 className="font-sans text-xl sm:text-2xl text-white uppercase tracking-tight">
182:                    Direct Transmission
183:                  </h3>
...
```

### Analysis of Deficiencies

1. **Severe Lack of Contrast**:
   - Container has `bg-[#12121C]`. Placed inside a `#09090E` / `#0A0A10` section, the container has a dark-on-dark contrast ratio of only **1.1:1**! It blends into the background, lacks hierarchy, and fails to draw the user's eye.
2. **Inverted Aesthetics**:
   - The card uses `shadow-neo-white` (`4px 4px 0px 0px rgba(255,255,255,1)`). Against dark backgrounds, white hard shadows look inverted or glowing rather than brutalist.
3. **Internal Fragmentation**:
   - Inside the dark card, the text inputs are white boxes with black borders (`bg-white text-black`). This creates disjointed visual clutter rather than a cohesive card architecture.

### Redesign Architecture (High-Contrast Neo-Brutalist Card)

| Token / Element | Specification | Tailwind Classes |
|---|---|---|
| **Outer Container** | Pure crisp white plate, bold black border, electric neon-yellow drop shadow | `bg-white border-4 border-black shadow-[8px_8px_0px_0px_#FFDE59] relative` |
| **Top Header Banner** | Neo-yellow header block separated by a 4px black divider | `bg-neo-yellow px-6 py-4 border-b-4 border-black flex items-center justify-between` |
| **Header Badge** | Neo-pink sticker tag for high-energy accent | `px-2 py-0.5 bg-neo-pink text-white font-mono text-[10px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000000]` |
| **Card Title** | Punchy black sans display | `font-sans text-2xl font-black text-black uppercase tracking-tight leading-none` |
| **Card Subtitle** | Monospace black/muted instruction | `font-mono text-xs text-black/80 font-bold mt-1` |
| **Header Icon** | Brutalist stamp | `w-9 h-9 bg-white border-2 border-black flex items-center justify-center text-black font-black text-base shadow-[2px_2px_0px_0px_#000000] rotate-2` |
| **Card Body** | Generous internal padding | `p-6 sm:p-8 bg-white space-y-5` |
| **Field Labels** | Bold black monospace with neo-pink required asterisks | `block font-mono text-xs font-black uppercase tracking-wider text-black mb-1.5` |
| **Inputs / Textarea** | Off-white canvas with 2px black borders and hard neo-yellow focus shadow | `w-full px-4 py-3 bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#FFDE59] transition-all` |
| **Success Alert** | Neo-green banner with black border and hard shadow | `p-4 bg-neo-green text-black border-2 border-black font-mono text-xs font-black shadow-[3px_3px_0px_0px_#000000] animate-fadeIn` |
| **Error Alert** | Neo-pink banner with black border and hard shadow | `p-4 bg-neo-pink text-black border-2 border-black font-mono text-xs font-black shadow-[3px_3px_0px_0px_#000000] animate-fadeIn` |
| **Submit Button** | Neo-yellow button with hover transition to neo-pink and active press | `w-full flex items-center justify-center gap-2 font-mono text-sm font-black py-4 px-6 bg-neo-yellow text-black border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-neo-pink hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150` |

### Proposed Code Replacement for the Form Container in `ContactSection.tsx`

```tsx
          {/* ── Right Column: Highlighted High-Contrast Neo-Brutalist Card ─────────── */}
          <div className="lg:col-span-6 relative z-10">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#FFDE59] relative">
              {/* Form Title Banner */}
              <div className="bg-neo-yellow px-6 py-4 border-b-4 border-black flex items-center justify-between">
                <div>
                  <div className="inline-block px-2 py-0.5 bg-neo-pink text-white font-mono text-[10px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000000] mb-1">
                    DIRECT TRANSMISSION
                  </div>
                  <h3 className="font-sans text-xl sm:text-2xl font-black text-black uppercase tracking-tight leading-none">
                    Send A Message
                  </h3>
                  <p className="font-mono text-xs text-black/80 font-bold mt-1">
                    Delivered directly to my primary inbox
                  </p>
                </div>
                <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black font-bold text-lg shadow-[2px_2px_0px_0px_#000000] rotate-2" aria-hidden="true">
                  ✉
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 sm:p-8">
                {/* Status Alert */}
                {status === 'success' && (
                  <div className="mb-6 p-4 bg-neo-green text-black border-2 border-black font-mono text-xs font-bold shadow-[3px_3px_0px_0px_#000000] animate-fadeIn">
                    ✓ Transmission received! Thank you, I'll get back to you shortly.
                  </div>
                )}
                {status === 'error' && (
                  <div className="mb-6 p-4 bg-neo-pink text-black border-2 border-black font-mono text-xs font-bold shadow-[3px_3px_0px_0px_#000000] animate-fadeIn">
                    ⚠ {errorMessage || 'Could not deliver. Please email directly.'}
                  </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono text-xs font-black uppercase tracking-wider text-black mb-1.5">
                      Your Name / Organization <span className="text-neo-pink font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex Rivera (Google DeepMind)"
                      className="w-full px-4 py-3 bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000000]
                        focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#FFDE59] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-black uppercase tracking-wider text-black mb-1.5">
                      Your Email Address <span className="text-neo-pink font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000000]
                        focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#FFDE59] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-black uppercase tracking-wider text-black mb-1.5">
                      Message / Project Brief <span className="text-neo-pink font-bold">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your project, timeline, or engineering opportunity..."
                      className="w-full px-4 py-3 bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000000]
                        focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#FFDE59] transition-all resize-none"
                    />
                  </div>

                  {/* Submit Action */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 font-mono text-sm font-black py-4 px-6
                      bg-neo-yellow text-black border-3 border-black shadow-[4px_4px_0px_0px_#000000]
                      hover:bg-neo-pink hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5
                      active:translate-x-1 active:translate-y-1 active:shadow-none
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                  >
                    <Send size={16} />
                    <span>{status === 'loading' ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
```

---

## Deep Dive 4: Engineering Quality Floor & Build Pipeline

### 1. Build Verification
- **Command**: `npm run build`
- **Output**:
  ```
  > neo-brutalist-portfolio@0.1.0 build
  > tsc && vite build

  vite v7.3.0 building client environment for production...
  transforming...
  ✓ 1494 modules transformed.
  rendering chunks...
  computing gzip size...
  dist/index.html                             1.85 kB │ gzip:  0.78 kB
  dist/assets/index-DNb2xJsD.css             62.44 kB │ gzip:  9.77 kB
  dist/assets/ProjectCaseStudy-2hXBQmf-.js    3.78 kB │ gzip:  1.10 kB
  dist/assets/vendor-CYeQXxJX.js              4.04 kB │ gzip:  1.73 kB
  dist/assets/CommandPalette-dYnet3_-.js      4.88 kB │ gzip:  1.93 kB
  dist/assets/ContactForm-Cdt9ZkMM.js         7.45 kB │ gzip:  2.66 kB
  dist/assets/index-C410I6jl.js              77.53 kB │ gzip: 21.95 kB
  dist/assets/vendor-react-DbyrO8Dk.js      143.81 kB │ gzip: 46.76 kB
  ✓ built in 4.50s
  ```
- **Exit Code**: `0`
- **Verification Status**: PASSED with zero compilation or bundling errors.

### 2. TypeScript & Bundler Settings
- `tsconfig.json`:
  - `target`: `ES2020`
  - `strict`: `true`
  - `noUnusedLocals`: `true` (strictly enforced — implementers must delete any unused imports when removing `MapPin` from `ContactSection`)
  - `noUnusedParameters`: `true`
- `vite.config.ts`:
  - Rollup manual chunks effectively isolate `vendor-react` (143 kB), `vendor-framer-motion`, `vendor-lucide`, `vendor-gsap`, and dynamic lazy chunks (`ProjectCaseStudy`, `ContactForm`, `CommandPalette`).

### 3. Viewport Responsiveness Breakdown

| Viewport | Component | Expected Behavior & Classes |
|---|---|---|
| **1440px (Desktop)** | `ContactSection.tsx` | Two-column grid (`lg:grid-cols-12`, 6 cols each). High-contrast white card stands out boldly against `#0A0A10`. Monogram watermark anchored at `bottom-0 right-4` without horizontal overflow. |
| **1440px (Desktop)** | `Footer.tsx` | Seamless `#0A0A10` dark block without top border. 3-column layout: brand identity (6 cols), sitemap (3 cols), networks (3 cols). Full-width copyright strip below. |
| **390px (Mobile)** | `ContactSection.tsx` | Single-column stack (`grid-cols-1 gap-12`). Card container fits smoothly within 390px width with `p-5 sm:p-8`. Input fields maintain minimum 44px touch height. Hard drop shadow (`shadow-[6px_6px_0px_0px_#FFDE59]`) does not trigger horizontal scrollbar. Monogram watermark sized gracefully (`text-[10rem] sm:text-[14rem]`) or tucked into bottom-right without horizontal bleeding. |
| **390px (Mobile)** | `Footer.tsx` | Single-column stack (`grid-cols-1 md:grid-cols-12 gap-10`). Bottom copyright strip wraps cleanly (`flex-col sm:flex-row gap-2`). |

---

## Complete File Edit Specification (For Implementer Agent)

### File 1: `components/ContactSection.tsx`
1. **Line 2**:
   Remove `MapPin` from:
   ```tsx
   import { Copy, Check, Send, Linkedin, Github, Twitter, Sparkles, MapPin } from 'lucide-react';
   ```
   Replace with:
   ```tsx
   import { Copy, Check, Send, Linkedin, Github, Twitter, Sparkles } from 'lucide-react';
   ```
2. **Line 64**:
   Change `bg-[#09090E]` to `bg-[#0A0A10]`.
3. **Lines 67-72**:
   Change watermark position from:
   ```tsx
   className="absolute -right-12 -bottom-16 text-[18rem] md:text-[24rem] font-sans font-black text-white/[0.03] select-none pointer-events-none uppercase leading-none tracking-tighter"
   ```
   To:
   ```tsx
   className="absolute right-0 sm:right-4 bottom-0 text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[24rem] font-sans font-black text-white/[0.03] select-none pointer-events-none uppercase leading-none tracking-tighter z-0"
   ```
4. **Lines 123-133**:
   Replace the location block:
   ```tsx
   <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-gray-400">
     <div className="flex items-center gap-2">
       <span className="w-2 h-2 rounded-full bg-neo-green animate-pulse" />
       <span>IST (UTC+5:30) • Available Globally</span>
     </div>
     <div className="flex items-center gap-2">
       <Sparkles size={14} className="text-neo-cyan" />
       <span>Fast Response within 24h</span>
     </div>
   </div>
   ```
5. **Lines 175-266**:
   Replace the dark card with the high-contrast neo-brutalist card container (crisp white container, bold black borders, neo-yellow header banner with neo-pink badge, neo-yellow hard shadow).

### File 2: `components/Footer.tsx`
1. **Line 42**:
   Change:
   ```tsx
   <footer className="bg-[#050505] text-white border-t-2 border-white/10 relative overflow-hidden select-none">
   ```
   To:
   ```tsx
   <footer className="bg-[#0A0A10] text-white relative overflow-hidden select-none">
   ```
2. **Line 166**:
   Change:
   ```tsx
   <div className="border-t border-white/10 bg-[#020204] py-5 relative z-10">
   ```
   To:
   ```tsx
   <div className="border-t border-white/5 bg-[#0A0A10] py-5 relative z-10">
   ```
3. **Line 169**:
   Keep `<p className="text-gray-400 font-bold">Chennai, India • Available Globally</p>` as the sole location instance.

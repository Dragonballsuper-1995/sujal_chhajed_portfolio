# Milestone 1 Challenge Report: Empirical Build, String Search & Structural Stress-Testing

**Challenger**: Challenger 1 (Milestone 1 — Critic & Specialist)  
**Date**: 2026-09-10  
**Target Scope**: Milestone 1 Implementation (`components/Header.tsx`, `components/Hero.tsx`, `components/About.tsx`)  
**Requirements Audited**:
- R5: Header Logo Alignment & Name Font Size (`components/Header.tsx`)
- R6: About Section 2-Column Redesign & Principles Removal (`components/About.tsx`)
- R8 Part 1: Location De-duplication in Hero and About (`components/Hero.tsx`, `components/About.tsx`)

---

## Challenge Summary

**Overall risk assessment**: **LOW**

All empirical tests, string pattern searches, build scripts, and structural audits passed with zero failures. Worker M1 has strictly and accurately satisfied requirements R5, R6, and R8 Part 1 without regressing build integrity, types, or responsive layouts.

---

## Challenges & Stress-Test Analyses

### [Low Risk] Challenge 1: Logo SVG ViewBox Clipping vs Outer Wrapper Sizing
- **Assumption challenged**: Removing `border-2`, `shadow-[2px_2px_0px_0px_#000]`, and `overflow-hidden` from the logo wrapper in `components/Header.tsx` might cause sizing or alignment issues if the SVG viewBox relies on container clipping.
- **Attack scenario**: `public/logo-light.svg` has internal coordinates up to (54, 54) on a `0 0 60 60` viewBox with an internal 6px drop shadow (`<rect x="6" y="6" ... fill="#050505"/>`) and 2px stroke border (`<rect x="0" y="0" ... stroke="#050505" stroke-width="2"/>`). If the outer wrapper was previously clipping this shadow or constraining aspect ratios incorrectly, removing the wrapper properties could cause misalignment or bleed.
- **Empirical observation**:
  - Inspected `public/logo-light.svg`: The internal box is 48x48 with its shadow extending from (6,6) to (54,54), entirely enclosed within the 60x60 viewBox.
  - The previous outer wrapper had its own `border-2 border-black` AND `overflow-hidden`, which forced double-boxing and sliced the native SVG shadow.
  - In `components/Header.tsx` lines 38–44, the new wrapper is:
    ```tsx
    <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
      <img
        src="/logo-light.svg"
        alt="Sujal Chhajed Logo"
        className="w-full h-full object-contain"
      />
    </div>
    ```
  - The SVG renders with natural internal shadow and clean borders, with zero double-boxing or clipping.
- **Blast radius**: None.
- **Mitigation**: Wrapper sizing (`w-10 h-10 sm:w-11 sm:h-11`) and `object-contain` preserve perfect 1:1 proportion on desktop and mobile.

---

### [Low Risk] Challenge 2: Mobile Navbar Horizontal Width Pressure
- **Assumption challenged**: Enlarging the author's name to `font-sans text-lg sm:text-xl font-black text-black uppercase tracking-tight` might overflow or wrap onto multiple lines on small mobile viewports (e.g. 390px iPhone 12/13/14 or 360px Android devices).
- **Attack scenario**: On a 390px mobile viewport with `px-5` container padding (20px left, 20px right), available width is 350px. The header contains:
  - 40px logo container (`w-10 h-10`)
  - 12px gap (`gap-3`)
  - "SUJAL CHHAJED." rendered in Archivo Black `text-lg` (~145px)
  - Hamburger toggle button (`p-1.5 border-2 border-black bg-neo-yellow`, ~32px)
  - Total required width: 40 + 12 + 145 + 32 = ~229px.
- **Empirical observation**:
  - Total element width (~229px) is well below the 350px available boundary, leaving over 120px of safety margin.
  - No wrapping or horizontal overflow occurs.
- **Blast radius**: None.
- **Mitigation**: Already protected by flex `justify-between` and `items-center`.

---

### [Low Risk] Challenge 3: Location De-duplication Scope Separation (R8 Part 1 vs R8 Part 2)
- **Assumption challenged**: Did removing "Chennai, India" from `Hero.tsx` and `About.tsx` accidentally strip the candidate's university degree citation ("VIT Chennai") or leave lingering location strings in M1 files?
- **Attack scenario**:
  - A naive find-and-replace for "Chennai" would strip "VIT Chennai" from `About.tsx`, damaging educational credentials.
  - Conversely, failing to remove geographical tags would violate R8 Part 1.
- **Empirical observation**:
  - Executed node-based exact regex audit on `components/Header.tsx`, `components/Hero.tsx`, and `components/About.tsx`.
  - "Chennai, India": 0 matches across all three M1 files.
  - "Chennai" in `Header.tsx`: 0 matches.
  - "Chennai" in `Hero.tsx`: 0 matches.
  - "VIT Chennai" in `About.tsx`: Exactly 2 matches:
    - Line 35: `<span className="text-neo-yellow text-xs font-bold">VIT Chennai</span>` (photo caption bar)
    - Line 68: `Currently completing my undergraduate engineering degree at VIT Chennai.` (narrative bio)
  - "Chennai, India" remains on `components/Footer.tsx:169` (the sole designated display per R8) and `components/ContactSection.tsx:126` (explicitly scoped to Milestone 3 / Worker M3 per `PROJECT.md`).
- **Blast radius**: None.
- **Mitigation**: Verified distinction between academic alma mater and geographical metadata.

---

### [Low Risk] Challenge 4: Solid Boundary Plate Dot Bleed Protection (R2 / R6 Alignment)
- **Assumption challenged**: Restructuring `components/About.tsx` into a 2-column layout might expose bio text blocks to dot bleed from `BackgroundGrid.tsx` if containers lack solid backgrounds.
- **Attack scenario**: Background grid dots expanding behind text with transparent backings would degrade readability.
- **Empirical observation**:
  - Column 1 (`lg:col-span-5`):
    - Profile photo card is backed with `bg-white border-4 border-black shadow-neo`.
    - Quick contact card is backed with `p-4 bg-white border-2 border-black shadow-neo-sm`.
  - Column 2 (`lg:col-span-7`):
    - Narrative bio is housed in a solid neo-brutalist boundary plate: `bg-white border-4 border-black p-6 sm:p-8 shadow-neo space-y-6`.
    - Origin story card is nested in `p-5 bg-neo-yellow/15 border-2 border-black shadow-neo-sm`.
  - Both columns sit on solid white `#FFFFFF` plates, completely preventing dot bleed.
- **Blast radius**: None.
- **Mitigation**: Complete conformance with R2 and neo-brutalist aesthetics.

---

## Stress Test Results

| Test ID | Test Scenario | Expected Behavior | Actual Behavior | Result |
|---|---|---|---|---|
| **ST-01** | Production Build Execution (`npm run build`) | `tsc && vite build` exits with code 0; 0 TS errors, 0 Vite errors | Exit code 0, 1494 modules transformed, built in 3.30s | **PASS** |
| **ST-02** | TypeScript Strict Verification (`npx tsc --noEmit`) | Strict type checking passes with 0 diagnostic errors | Exit code 0, 0 errors | **PASS** |
| **ST-03** | String Search: "Chennai, India" in `Header.tsx` | 0 matches | 0 matches | **PASS** |
| **ST-04** | String Search: "Chennai, India" in `Hero.tsx` | 0 matches | 0 matches | **PASS** |
| **ST-05** | String Search: "Chennai, India" in `About.tsx` | 0 matches | 0 matches | **PASS** |
| **ST-06** | String Search: "VIT Chennai" in `About.tsx` | Preserved in photo caption & bio text (>= 2 matches) | Exactly 2 matches (lines 35, 68) | **PASS** |
| **ST-07** | Principles Card Removal in `About.tsx` | "Principles", "Zero Hallucinations", "02 <100ms Latency" absent | 0 matches | **PASS** |
| **ST-08** | Header Logo Wrapper Classes | No `border-2`, no `border-black`, no `shadow-`, no `overflow-hidden`, no `bg-` | Wrapper has only flex, dimension, and hover transform classes | **PASS** |
| **ST-09** | Header Author Name Display Styling | Bold uppercase neo-brutalist display font `text-lg` or `text-xl` | Classes: `font-sans text-lg sm:text-xl font-black text-black uppercase tracking-tight` | **PASS** |
| **ST-10** | About Layout Grid Architecture | Balanced 2-column responsive layout with solid boundary plate | `grid grid-cols-1 lg:grid-cols-12 gap-8`, `lg:col-span-5` and `lg:col-span-7` with `bg-white border-4 border-black` | **PASS** |
| **ST-11** | Asset Availability Check | `public/logo-light.svg` and `public/profile-pic-4.webp` exist and resolve | Both files exist and are valid assets | **PASS** |
| **ST-12** | Dist Bundle Output Audit | Production bundles compile cleanly with expected token counts | Bundles built, `dist/index.html` valid | **PASS** |

---

## Unchallenged Areas

- **`components/HeroShader.tsx` & `components/BackgroundGrid.tsx`**: Scoped to Milestone 2 (Worker M2) per `PROJECT.md`.
- **`components/Skills.tsx` & `components/ContactSection.tsx`**: Scoped to Milestone 3 (Worker M3) per `PROJECT.md`.
- **`components/Footer.tsx`**: Sole location container per R8; scoped to M3/M4 verification.

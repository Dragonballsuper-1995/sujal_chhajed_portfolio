# Architectural Survey Report: UI Structure, Navigation, Content & Typography

**Explorer**: Explorer 1 (UI & Content Specialist)  
**Date**: 2026-09-10  
**Target Milestone**: M1 (Exploratory Survey & Solution Design)  
**Scope**: Requirements R1 (Skills Unification), R5 (Header Logo & Name), R6 (About 2-Column Redesign & Principles Removal), R8 (Location De-duplication)  
**Target Files**:
- `components/Skills.tsx`
- `components/Header.tsx`
- `components/About.tsx`
- `components/Hero.tsx`
- `public/logo-light.svg`
- Cross-cutting: `components/ContactSection.tsx`, `components/Footer.tsx`, `constants.ts`

---

## 1. Executive Summary

This survey provides an exhaustive technical and design analysis for refactoring the UI navigation, skills presentation, biographical narrative, and geographic metadata.

Key findings:
1. **R1 (Skills Section)**: The category filter button bar (`All Categories`, `ML & GenAI`, etc.) at lines 102–131 of `components/Skills.tsx` creates artificial fragmentation and empty header whitespace. Removing interactive filter state and displaying all 4 categories (`ML & GenAI`, `Full-Stack`, `Data Eng`, `MLOps`) as stacked, full-width solid-plate cards delivers an unsegmented technical arsenal that also creates protective boundary plates against background grid dot bleed (R2 synergy).
2. **R5 (Header Logo & Author Masthead)**: In `components/Header.tsx`, the logo wrapper at line 38 applies `border-2 border-black`, `shadow-[2px_2px_0px_0px_#000]`, and `overflow-hidden`. However, `public/logo-light.svg` already contains its own native black border (`stroke="#050505" stroke-width="2"`), its own hard neo-shadow (`fill="#050505"` at offset x=6, y=6), and its own `#FFDE59` background. This causes severe double-boxing and edge clipping. Removing redundant wrapper borders and enlarging the author's name from `text-xs sm:text-sm` to a bold neo-brutalist display size (`text-lg sm:text-xl font-bold uppercase`) anchors the header masthead cleanly.
3. **R6 (About 2-Column Redesign)**: In `components/About.tsx`, the 3-column grid (`md:col-span-4`, `md:col-span-5`, `md:col-span-3`) compresses the biographical narrative and redundantly displays "Principles" (which duplicates Hero feature strips). Removing the Principles card (lines 84–121) and transitioning to an asymmetric 2-column layout (5-column Photo/Contact + 7-column Bio/Origin Story on a 12-column grid) creates a balanced, comfortable typographic hierarchy.
4. **R8 (Location De-duplication)**: "Chennai, India" currently appears in 4 different components: `Hero.tsx` (line 48), `About.tsx` (line 42), `ContactSection.tsx` (line 126), and `Footer.tsx` (line 169). It will be removed from Hero, About, and Contact, and displayed exclusively in the bottom copyright strip of `Footer.tsx`. Academic credentials mentioning "VIT Chennai" (About.tsx lines 35 & 67) are preserved.

---

## 2. Requirement R1: Skills Section Unification

### Current Implementation & AST Analysis
- **File**: `components/Skills.tsx`
- **State**:
  ```tsx
  // Line 78
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const visibleCategories = activeCategory === 'all'
    ? CATEGORY_KEYS
    : CATEGORY_KEYS.filter(c => c === activeCategory);
  ```
- **Filter Tabs Markup** (lines 102–131):
  - Contains 5 buttons (`All Categories`, `ML & GenAI`, `Full-Stack`, `Data Eng`, `MLOps`) inside a `flex flex-wrap gap-2` container positioned on the right side of the section header (`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12`).
- **Category Rows** (lines 135–171):
  - Currently mapped over `visibleCategories`. Each category row has a subtle left border (`border-l-4 pl-4 sm:pl-6 py-1` with inline `style={{ borderColor: meta.color }}`) and renders individual `SkillPill` components.
- **Skill Inventory** (from `constants.ts`):
  - `ml-genai` (6 tools): PyTorch, Hugging Face, scikit-learn, OpenCV, LLM Fine-Tuning, RAG / Embeddings
  - `fullstack` (8 tools): React, Next.js, TypeScript, Tailwind CSS, FastAPI, Node.js, Kotlin, Python
  - `data-eng` (5 tools): Pandas, PostgreSQL, Supabase, XGBoost, NumPy
  - `mlops` (4 tools): Docker, GitHub Actions, Cloudflare, Git
  - Total: 23 production skills across 4 categories.

### Identified Deficiencies
1. **Artificial Interaction Barrier**: Recruiters and hiring managers must click 4 different tabs or scroll through a segmented list to understand the candidate's complete breadth.
2. **Asymmetric Whitespace**: When filter buttons are removed from `justify-between`, leaving only the left text block creates awkward balance unless the header is centered or anchored with a confident, full-width neo-brutalist intro.
3. **Weak Boundary Plate**: The existing `border-l-4` without a background card plate allows background interactive canvas elements (such as `BackgroundGrid.tsx` dots) to bleed under skill text, conflicting with R2 requirements.

### Concrete Implementation Plan for R1
1. **Remove Filter State & Markup**:
   - Delete `activeCategory` state (`useState<string>('all')`) and `visibleCategories`.
   - Delete lines 102–131 containing the filter tab buttons.
   - Clean up imports if `useState` is only needed in `SkillPill`.
2. **Re-anchor Section Header**:
   - Replace the split `flex justify-between` layout with an authoritative left-aligned block:
   ```tsx
   <div className="mb-12 md:mb-14">
     <div className="inline-block px-3 py-1 bg-black text-neo-yellow font-mono text-xs font-bold uppercase tracking-widest mb-3 shadow-neo-sm">
       Capabilities & Toolchain
     </div>
     <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl text-ink leading-tight uppercase">
       Technical Arsenal
     </h2>
     <p className="font-mono text-sm sm:text-base text-muted max-w-2xl mt-3 leading-relaxed">
       Production tools and frameworks battle-tested across live machine learning systems and high-throughput web apps.
     </p>
   </div>
   ```
3. **Structured 4-Category Layout (Unsegmented Arsenal)**:
   - Iterate over `CATEGORY_KEYS` (`['ml-genai', 'fullstack', 'data-eng', 'mlops']`).
   - Wrap each category in a solid neo-brutalist boundary card (`bg-white border-2 border-black p-5 sm:p-6 shadow-neo-sm transition-all hover:shadow-neo`).
   - Card Header: Category indicator swatch (`meta.color`), uppercase category title (`font-sans text-base sm:text-lg font-black uppercase text-black`), and tool count badge (`font-mono text-xs font-bold px-2 py-0.5 bg-black text-white`).
   - Card Body: `flex flex-wrap gap-2.5 sm:gap-3` holding the `SkillPill` components.
   - Spacing: `space-y-6 md:space-y-8` between category cards.
4. **Responsive Behavior**:
   - Desktop (1440px): 1152px max container width. Each card spans full width, displaying 4–8 pills across 1–2 comfortable horizontal rows.
   - Mobile (390px): Padding adjusts to `px-4 sm:px-5`. Pills wrap naturally with `gap-2 sm:gap-2.5`. No horizontal overflow.

---

## 3. Requirement R5: Header Logo Alignment & Name Font Size

### Current Implementation & AST Analysis
- **File**: `components/Header.tsx`
- **Lines 32–49**:
  ```tsx
  {/* Logo with logo-light.svg */}
  <button
    onClick={() => scrollToSection(NavSection.HERO)}
    aria-label="Back to top"
    className="flex items-center gap-3 group focus:outline-none"
  >
    <div className="w-9 h-9 border-2 border-black shadow-[2px_2px_0px_0px_#000] group-hover:scale-105 group-hover:shadow-[3px_3px_0px_0px_#000] transition-all bg-[#FFDE59] flex items-center justify-center overflow-hidden">
      <img
        src="/logo-light.svg"
        alt="Sujal Chhajed Logo"
        className="w-full h-full object-contain"
      />
    </div>
    <span className="font-mono text-xs sm:text-sm font-bold text-black uppercase tracking-tight group-hover:text-neo-pink transition-colors">
      Sujal Chhajed<span className="text-neo-pink">.</span>
    </span>
  </button>
  ```

### Logo SVG Anatomy (`public/logo-light.svg`)
- `viewBox="0 0 60 60"`
- Line 9: `<rect x="6" y="6" width="48" height="48" fill="#050505"/>` (Native Neo-brutalist shadow)
- Line 14: `<rect x="0" y="0" width="48" height="48" fill="#FFDE59"/>` (Native yellow plate)
- Line 56: `<rect x="0" y="0" width="48" height="48" fill="none" stroke="#050505" stroke-width="2"/>` (Native black border)
- Graphic contents: Formula 1 chequered strip + Spa-Francorchamps track layout + "SC" monogram.

### Root Cause of Double-Boxing & Clipping
1. **Double Border**: The wrapper div applies `border-2 border-black`. Inside it, the SVG renders its own `stroke="#050505" stroke-width="2"`. The result is a nested double box.
2. **Double Shadow**: The wrapper div applies `shadow-[2px_2px_0px_0px_#000]`. Inside it, the SVG renders its own 6px drop shadow at `x="6" y="6"`.
3. **Clipping Artifacts**: The wrapper div applies `overflow-hidden`. Because the SVG viewBox is `60x60` while the content box is `48x48` with a shadow extending to `(54, 54)`, forcing `overflow-hidden` with `object-contain` on a `36x36px` (`w-9 h-9`) div clips the shadow edges or causes unequal subpixel borders.
4. **Name Under-scaling**: The author's name is rendered at `font-mono text-xs sm:text-sm font-bold`. At 12–14px, it looks tiny compared to standard neo-brutalist navbars and lacks visual weight.

### Concrete Implementation Plan for R5
1. **Clean Logo Wrapper**:
   - Strip `border-2 border-black`, `shadow-[2px_2px_0px_0px_#000]`, `group-hover:shadow-[3px_3px_0px_0px_#000]`, `bg-[#FFDE59]`, and `overflow-hidden` from the wrapper div.
   - Refactor to a clean scaling container:
     ```tsx
     <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
       <img
         src="/logo-light.svg"
         alt="Sujal Chhajed Logo"
         className="w-full h-full object-contain"
       />
     </div>
     ```
   - This allows `public/logo-light.svg` to render its own border and shadow cleanly without double-boxing or edge clipping.
2. **Enlarge Author's Name Typography**:
   - Increase font size to neo-brutalist display scale:
     ```tsx
     <span className="font-sans text-lg sm:text-xl font-black text-black uppercase tracking-tight group-hover:text-neo-pink transition-colors">
       Sujal Chhajed<span className="text-neo-pink">.</span>
     </span>
     ```
     *(Alternative using monospace if strict mono brand is preferred)*:
     ```tsx
     <span className="font-mono text-lg sm:text-xl font-bold text-black uppercase tracking-tight group-hover:text-neo-pink transition-colors">
       Sujal Chhajed<span className="text-neo-pink">.</span>
     </span>
     ```
     *Recommendation*: `font-sans text-lg sm:text-xl font-black` (Archivo Black) matches the bold headlines across Hero and section headers, anchoring the masthead.
3. **Responsive Spacing Verification**:
   - Header height is `h-16` (64px). A `40px` logo and `text-xl` font fit with vertical breathing room (`py-3`).
   - On 390px mobile viewports: Logo (40px) + Gap (12px) + Name (~160px) + Hamburger button (36px) = ~248px out of 350px available width. No wrapping or layout collision.

---

## 4. Requirement R6: About Section 2-Column Redesign & Principles Removal

### Current Implementation & AST Analysis
- **File**: `components/About.tsx`
- **Lines 22–124**:
  - `grid grid-cols-1 md:grid-cols-12 gap-8 items-start`
  - Column 1 (`md:col-span-4`): Profile photo card (`aspect-[4/5]`) + mini contact/location card.
  - Column 2 (`md:col-span-5`): Bio text + origin story highlight.
  - Column 3 (`md:col-span-3`): "Principles" card (01 Zero Hallucinations, 02 <100ms Latency, 03 Offline-First).

### Rationale for Principles Removal & 2-Column Restructuring
1. **Redundancy**: The 3 principles ("Zero Hallucinations", "<100ms Latency", "Offline-First") are already featured verbatim in `Hero.tsx` lines 130–139 ("100% Deterministic Constraint Grounding", "Offline-First LWW Cross-Device Sync") and in the project case studies. Having an entire third column dedicated to generic principles dilutes the biographical narrative.
2. **Layout Squeeze**: Dividing a 1152px container into 4-col (photo), 5-col (bio), and 3-col (principles) leaves the bio column cramped at ~460px width, causing dense multi-line paragraphs.
3. **Visual Balance**: Removing the 3rd column enables an asymmetric 2-column pairing:
   - **Left Column** (5/12 width, ~460px): Framed profile photograph and contact/availability status.
   - **Right Column** (7/12 width, ~650px): Comprehensive narrative bio and origin story card sitting on a solid boundary plate.

### Concrete Implementation Plan for R6
1. **Eliminate Principles Column**:
   - Delete lines 84–121 (`{/* Column 3: Guiding Principles Card */}`) in their entirety.
2. **Restructure Grid to 2 Columns**:
   - Update grid container:
     ```tsx
     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
     ```
3. **Column 1: Framed Profile Card & Status (5 Columns)**:
   ```tsx
   <div className="lg:col-span-5 space-y-4">
     {/* Framed Photo Card */}
     <div className="relative group bg-white border-4 border-black shadow-neo overflow-hidden">
       <img
         src="/profile-pic-4.webp"
         alt="Sujal Sanjay Chhajed"
         className="w-full aspect-[4/5] object-cover object-top filter grayscale contrast-115 group-hover:filter-none transition-all duration-300"
       />
       <div className="p-3.5 bg-black text-white border-t-2 border-black font-mono text-xs flex items-center justify-between">
         <span className="font-bold uppercase tracking-wider">Sujal Chhajed</span>
         <span className="text-neo-yellow text-xs font-bold">VIT Chennai</span>
       </div>
     </div>

     {/* Status & Contact Card (Location removed per R8) */}
     <div className="p-4 bg-white border-2 border-black shadow-neo-sm space-y-2 font-mono text-xs">
       <div>
         <a
           href={`mailto:${PERSONAL_INFO.email}`}
           className="text-black font-bold hover:underline underline-offset-4 decoration-neo-pink break-all flex items-center gap-2"
         >
           <span className="text-neo-pink">✉</span>
           <span>{PERSONAL_INFO.email}</span>
         </a>
       </div>
       <div className="text-neo-green font-bold pt-2 border-t border-black/10 flex items-center gap-2">
         <span className="w-2.5 h-2.5 rounded-full bg-neo-green animate-pulse inline-block" />
         <span>Open to Relocation / Remote Roles Globally</span>
       </div>
     </div>
   </div>
   ```
4. **Column 2: Narrative Bio & Highlighted Origin Story Card (7 Columns)**:
   ```tsx
   <div className="lg:col-span-7 space-y-6">
     <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-neo space-y-6">
       <div className="space-y-4 font-mono text-sm sm:text-base leading-relaxed text-ink">
         <p className="font-bold text-lg sm:text-xl text-black leading-snug">
           I’m Sujal — an AI/ML Engineer and Full-Stack Developer specializing in building end-to-end intelligent systems.
         </p>
         <p className="text-muted leading-relaxed">
           I care about verified inference latency, mathematical constraint satisfaction, and writing clean, deterministic code that runs reliably in production environments.
         </p>
         <p className="text-muted leading-relaxed">
           Currently completing my undergraduate engineering degree at VIT Chennai. From fine-tuning open-source LLM weights (Phi-4, Llama 3.1) and compiling to GGUF, to designing two-stage recommendation engines with XGBoost and crafting offline-first PWA sync protocols, I focus on the bridge between machine learning research and real software product.
         </p>
       </div>

       {/* Origin Story Card */}
       <div className="p-5 bg-neo-yellow/15 border-2 border-black shadow-neo-sm">
         <div className="flex items-start gap-3">
           <Sparkles size={20} className="text-neo-pink shrink-0 mt-1" />
           <div className="space-y-1">
             <span className="font-mono text-xs font-black uppercase tracking-wider text-black bg-neo-yellow px-2 py-0.5 border border-black inline-block">
               Origin Story
             </span>
             <p className="font-mono text-xs sm:text-sm text-black font-medium leading-relaxed pt-1">
               {PERSONAL_INFO.funFact}
             </p>
           </div>
         </div>
       </div>
     </div>
   </div>
   ```
5. **Grid Boundary Protection (R2 Synergy)**:
   - Wrapping both Column 1 and Column 2 in solid white neo-brutalist boundary plates (`bg-white border-2 border-black shadow-neo`) ensures that background interactive grid dots cannot render or distort behind the text.

---

## 5. Requirement R8: Location De-duplication

### Audit of "Chennai, India" Across the Codebase
A systematic audit was conducted across all files for occurrences of the location string:

| File | Line(s) | Current Snippet | Required Action |
|------|---------|-----------------|-----------------|
| `components/Hero.tsx` | 48 | `📍 Chennai, India • 8+ Production Deployments • Sub-100ms Target Latency` | **REMOVE** "📍 Chennai, India • " |
| `components/About.tsx` | 40–43 | `<MapPinIcon /> <span>{PERSONAL_INFO.location}</span>` | **REMOVE** location div and `MapPinIcon` |
| `components/ContactSection.tsx` | 124–127 | `<MapPin ... /> <span>{PERSONAL_INFO.location} (IST / UTC+5:30)</span>` | **REMOVE** location item (Explorer 2 / implementer scope) |
| `components/Footer.tsx` | 169 | `<p className="text-gray-400 font-bold">Chennai, India • Available Globally</p>` | **RETAIN** (Sole designated location display) |

### Important Distinction: "VIT Chennai" vs "Chennai, India"
- `About.tsx` line 35 (`<span className="text-neo-yellow text-[10px]">VIT Chennai</span>`) and line 67 (`Currently completing my undergraduate engineering degree at VIT Chennai.`) reference the university name (**Vellore Institute of Technology, Chennai campus**).
- This is an academic credential, not a location string. R8 states: *"Remove the location string ("Chennai, India") from the Hero, About, and Contact sections. Display the location exclusively in the bottom copyright strip of Footer.tsx."*
- Therefore, university degree references to "VIT Chennai" MUST be retained.

### Specific Code Snippets for R8

#### 1. `components/Hero.tsx` Line 48
**Before**:
```tsx
<p className="font-mono text-xs md:text-sm text-muted">
  📍 Chennai, India • 8+ Production Deployments • Sub-100ms Target Latency
</p>
```
**After**:
```tsx
<p className="font-mono text-xs md:text-sm text-muted flex items-center gap-2 flex-wrap">
  <span className="inline-block w-2 h-2 rounded-full bg-neo-green animate-pulse" />
  <span>8+ Production Deployments</span>
  <span className="opacity-40">•</span>
  <span>Sub-100ms Target Latency</span>
</p>
```

#### 2. `components/About.tsx` Lines 40–43 & 129–134
**Before**:
```tsx
<div className="flex items-center gap-1.5 text-black font-bold">
  <MapPinIcon />
  <span>{PERSONAL_INFO.location}</span>
</div>
...
const MapPinIcon = () => ( ... );
```
**After**:
- Remove the entire `div` containing `MapPinIcon` and `PERSONAL_INFO.location`.
- Remove the `MapPinIcon` component declaration.

#### 3. `components/ContactSection.tsx` Lines 124–127 (Coordination Note for Explorer 2 / Orchestrator)
**Before**:
```tsx
<div className="flex items-center gap-2">
  <MapPin size={14} className="text-neo-pink" />
  <span>{PERSONAL_INFO.location} (IST / UTC+5:30)</span>
</div>
```
**After**:
- Remove the location item. Keep only response time or timezone:
```tsx
<div className="flex items-center gap-2">
  <Sparkles size={14} className="text-neo-cyan" />
  <span>Fast Response within 24h • Available Globally</span>
</div>
```

---

## 6. Verification and Acceptance Matrix

| Requirement | Acceptance Criteria | Verification Method |
|---|---|---|
| **R1** | Category filter tabs (`All Categories`, `ML & GenAI`, etc.) are completely removed; all 4 categories display as unsegmented technical arsenal. | Inspect `components/Skills.tsx`: zero filter buttons, no `activeCategory` state, all 4 categories mapped statically with solid boundary plates. Run `npm run build`. |
| **R5** | Header logo renders without double-boxing or clipping; author's name is larger and bold (`text-lg`/`text-xl`). | Inspect `components/Header.tsx`: no `border-2`, `shadow`, or `overflow-hidden` on logo wrapper; SVG renders cleanly; author name has `font-black text-lg sm:text-xl uppercase`. |
| **R6** | Principles card is completely removed from About; layout is restructured into 2 columns. | Inspect `components/About.tsx`: no Principles card; grid uses `grid-cols-1 lg:grid-cols-12` with 5-col photo and 7-col bio/origin story. |
| **R8** | "Chennai, India" appears only in the Footer; removed from Hero, About, and Contact. | Run `grep_search` across `components/` for `"Chennai, India"`; exactly 1 occurrence found in `components/Footer.tsx:169`. |
| **Quality** | Production build passes with zero errors; layout responsive at 1440px and 390px. | `npm run build` exits code 0; responsive test verifies zero layout shifts or horizontal clipping. |

---

## 7. Next Steps for Implementation Phase (M2)
1. Apply the R1 refactoring to `components/Skills.tsx`.
2. Apply the R5 refactoring to `components/Header.tsx`.
3. Apply the R6 and R8 refactoring to `components/About.tsx`.
4. Apply the R8 refactoring to `components/Hero.tsx`.
5. Coordinate with Explorer 2 / Implementer for R8 de-duplication in `components/ContactSection.tsx`.
6. Verify production build via `npm run build`.

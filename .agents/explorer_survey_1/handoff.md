# Handoff Report: UI Structure, Navigation, Content & Typography

**Agent**: Explorer 1 (UI & Content Specialist)  
**Task**: Survey and Solution Design for R1, R5, R6, R8  
**Date**: 2026-09-10  
**Handoff Type**: Hard (Task complete)  
**Associated Report**: `.agents/explorer_survey_1/survey_report.md`

---

## 1. Observation

1. **`components/Skills.tsx`**:
   - **Line 78**: `const [activeCategory, setActiveCategory] = useState<string>('all');`
   - **Lines 80–82**:
     ```tsx
     const visibleCategories = activeCategory === 'all'
       ? CATEGORY_KEYS
       : CATEGORY_KEYS.filter(c => c === activeCategory);
     ```
   - **Lines 102–131**: Render 5 filter buttons (`All Categories`, `ML & GenAI`, `Full-Stack`, `Data Eng`, `MLOps`) inside a `flex flex-wrap gap-2` on the right side of `flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12`.
   - **Lines 135–171**: 4 categories (`ml-genai`, `fullstack`, `data-eng`, `mlops`) mapped sequentially with `border-l-4 pl-4 sm:pl-6 py-1` without solid background plates.

2. **`components/Header.tsx` & `public/logo-light.svg`**:
   - **`Header.tsx` Lines 38–44**:
     ```tsx
     <div className="w-9 h-9 border-2 border-black shadow-[2px_2px_0px_0px_#000] group-hover:scale-105 group-hover:shadow-[3px_3px_0px_0px_#000] transition-all bg-[#FFDE59] flex items-center justify-center overflow-hidden">
       <img
         src="/logo-light.svg"
         alt="Sujal Chhajed Logo"
         className="w-full h-full object-contain"
       />
     </div>
     ```
   - **`public/logo-light.svg`**:
     - Line 1: `viewBox="0 0 60 60"`
     - Line 9: `<rect x="6" y="6" width="48" height="48" fill="#050505"/>` (Native drop shadow)
     - Line 14: `<rect x="0" y="0" width="48" height="48" fill="#FFDE59"/>` (Native yellow plate)
     - Line 56: `<rect x="0" y="0" width="48" height="48" fill="none" stroke="#050505" stroke-width="2"/>` (Native black border)
   - **`Header.tsx` Lines 45–47**:
     ```tsx
     <span className="font-mono text-xs sm:text-sm font-bold text-black uppercase tracking-tight group-hover:text-neo-pink transition-colors">
       Sujal Chhajed<span className="text-neo-pink">.</span>
     </span>
     ```

3. **`components/About.tsx`**:
   - **Line 23**: `<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">`
   - **Lines 26–56**: Column 1 (`md:col-span-4`) with profile picture (`aspect-[4/5]`) and mini-card containing location at line 42: `<span>{PERSONAL_INFO.location}</span>`.
   - **Lines 58–82**: Column 2 (`md:col-span-5`) with bio text and origin story card.
   - **Lines 84–121**: Column 3 (`md:col-span-3`) containing the "Principles" card (01 Zero Hallucinations, 02 <100ms Latency, 03 Offline-First).
   - **Lines 129–134**: Dedicated `MapPinIcon` component helper.

4. **Location String ("Chennai, India") Occurrences**:
   - `Hero.tsx:48`: `📍 Chennai, India • 8+ Production Deployments • Sub-100ms Target Latency`
   - `About.tsx:42`: `<span>{PERSONAL_INFO.location}</span>`
   - `ContactSection.tsx:126`: `<span>{PERSONAL_INFO.location} (IST / UTC+5:30)</span>`
   - `Footer.tsx:169`: `<p className="text-gray-400 font-bold">Chennai, India • Available Globally</p>`

5. **Build Baseline**:
   - Executed `npm run build`:
     `✓ built in 3.31s`
     Exited with code 0 (zero TypeScript and zero Vite build errors).

---

## 2. Logic Chain

1. **R1 (Skills Section Unification)**:
   - *Observation 1* shows filter buttons at lines 102–131 and category state at line 78.
   - Requirement R1 demands removing the category filtering buttons and displaying all four categories as a balanced, unsegmented technical arsenal.
   - Removing lines 102–131 and `activeCategory` state simplifies the component to a static iteration over `CATEGORY_KEYS`.
   - Transforming the rows into solid white boundary cards (`bg-white border-2 border-black p-5 sm:p-6 shadow-neo-sm`) eliminates empty whitespace on the right and provides hard boundary plates that prevent background grid dots from bleeding underneath the text (addressing R2).

2. **R5 (Header Logo & Name Font Size)**:
   - *Observation 2* shows `logo-light.svg` already possesses an internal black border (`stroke-width="2"`), a hard shadow (`rect x="6" y="6"`), and a yellow fill (`#FFDE59`).
   - The wrapper `div` in `Header.tsx` redundantly applies `border-2 border-black`, `shadow-[2px_2px_0px_0px_#000]`, and `overflow-hidden`.
   - Wrapping an already bordered and shadowed SVG inside another bordered, shadowed, and overflow-hidden div directly produces double-boxing and edge clipping.
   - Removing `border-2 border-black`, `shadow`, `bg-[#FFDE59]`, and `overflow-hidden` from the wrapper allows the SVG to render natively with clean, unclipped borders and shadow.
   - Scaling the author's name from `text-xs sm:text-sm font-bold` to `text-lg sm:text-xl font-black` (Archivo Black) fulfills R5 and balances the 40px logo masthead.

3. **R6 (About Section 2-Column Redesign & Principles Removal)**:
   - *Observation 3* shows the 3-column layout (`md:col-span-4`, `md:col-span-5`, `md:col-span-3`).
   - The third column contains the "Principles" card (lines 84–121), which duplicates claims already present in `Hero.tsx` lines 130–139 ("100% Deterministic Constraint Grounding", "Offline-First LWW Cross-Device Sync").
   - Removing lines 84–121 frees up horizontal space.
   - Restructuring the grid to a 2-column layout (`lg:col-span-5` for photo/contact and `lg:col-span-7` for bio narrative & origin story) creates a balanced, comfortable typographic rhythm (~65–75 characters per line).

4. **R8 (Location De-duplication)**:
   - *Observation 4* shows 4 occurrences of "Chennai, India".
   - Requirement R8 specifies: "Remove the location string ("Chennai, India") from the Hero, About, and Contact sections. Display the location exclusively in the bottom copyright strip of Footer.tsx."
   - Removing "Chennai, India" from `Hero.tsx:48`, `About.tsx:42`, and `ContactSection.tsx:126` leaves `Footer.tsx:169` as the exclusive location display, fulfilling R8 with exact precision.
   - References to "VIT Chennai" (About.tsx lines 35 & 67) represent the university name and are preserved as academic qualifications.

---

## 3. Caveats

1. **ContactSection.tsx Coordination**: `ContactSection.tsx` contains one of the occurrences of `PERSONAL_INFO.location` at line 126. While ContactSection is primarily in Explorer 2 / Implementer's scope (R7, R9), the location removal must be coordinated to ensure complete acceptance for R8.
2. **Font Family Selection for Header Name**: The author's name in `Header.tsx` currently uses `font-mono`. Switching to `font-sans` (`Archivo Black`) provides maximal neo-brutalist impact matching Hero headlines; if the team prefers strictly monospace navigation, `font-mono text-lg sm:text-xl font-bold` is an equivalent valid option documented in `survey_report.md`.
3. **No Code Implementation**: In accordance with the Explorer archetype rules, no production source code files have been modified during this phase. All proposals are documented in `survey_report.md` with complete before/after snippets.

---

## 4. Conclusion

All requirements within the scope of Explorer 1 (R1, R5, R6, R8) have been fully surveyed, root-caused, and architected:
- **R1**: Remove filter state and tabs; render 4 unsegmented stacked category cards with solid white plates.
- **R5**: Strip outer borders, shadows, and overflow-hidden from logo wrapper in `Header.tsx`; enlarge author name to `text-lg sm:text-xl font-black uppercase`.
- **R6**: Delete Principles card (lines 84–121); convert `About.tsx` to 2-column 5/7 grid pairing photo with narrative bio and origin story card.
- **R8**: Delete "Chennai, India" from `Hero.tsx:48` and `About.tsx:42` (and coordinate `ContactSection.tsx:126`), leaving `Footer.tsx:169` as the sole location display. Preserve "VIT Chennai" degree credentials.

---

## 5. Verification Method

1. **Static Inspection**:
   - Verify `components/Skills.tsx` contains 0 filter buttons and no `activeCategory` state.
   - Verify `components/Header.tsx` logo wrapper div does not contain `border-2`, `shadow`, or `overflow-hidden`, and author name uses `text-lg sm:text-xl`.
   - Verify `components/About.tsx` contains no "Principles" card and is structured as a 2-column layout.
   - Run ripgrep for `"Chennai, India"` across the codebase to ensure it only appears in `components/Footer.tsx`.
2. **Build Command**:
   ```bash
   npm run build
   ```
   Must pass with zero TypeScript errors and zero Vite bundle errors.
3. **Viewport Responsiveness**:
   - Desktop: 1440px viewport (no horizontal scroll, balanced 2-column layouts).
   - Mobile: 390px viewport (header logo + name + hamburger fit within 358px without wrapping; skills wrap comfortably).

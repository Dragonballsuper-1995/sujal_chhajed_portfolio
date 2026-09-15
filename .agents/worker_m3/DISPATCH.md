## Milestone 3 Implementation Assignment: Worker M3

### Scope
- Requirements:
  - R1: Skills Section Unification (`components/Skills.tsx`)
  - R7: Seamless Contact & Footer Dark Continuity & Monogram Fix (`components/ContactSection.tsx`, `components/Footer.tsx`)
  - R8 Part 2: Location De-duplication in ContactSection (`components/ContactSection.tsx`, `components/Footer.tsx`)
  - R9: High-Contrast Highlighted Contact Form (`components/ContactSection.tsx`)
- Exclusive File Ownership:
  - `components/Skills.tsx`
  - `components/ContactSection.tsx`
  - `components/Footer.tsx`
  *(Do NOT modify any other files)*

### Reference Documents
- Original Request: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\ORIGINAL_REQUEST.md`
- Project Plan: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\PROJECT.md`
- Explorer 1 Survey Report: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_1\survey_report.md`
- Explorer 3 Survey Report: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_3\survey_report.md`

### Implementation Tasks
1. **`components/Skills.tsx` (R1)**:
   - Completely remove the category filter buttons (lines 102–131) and `activeCategory` state / `setActiveCategory`.
   - Adjust title typography and layout: wrap the section header in a solid neo-brutalist boundary plate (`bg-white border-2 border-black shadow-neo-sm p-6 mb-12 relative z-10 boundary-plate`).
   - Iterate over all 4 categories (`ml-genai`, `fullstack`, `data-eng`, `mlops`) as an unsegmented technical arsenal.
   - Wrap each category row in solid neo-brutalist boundary cards (`bg-white border-2 border-black p-5 sm:p-6 shadow-neo-sm relative z-10 boundary-plate mb-6`) to provide hard boundaries against background grid dots.

2. **`components/ContactSection.tsx` & `components/Footer.tsx` (R7 & R8 Part 2)**:
   - **Dark Continuity (R7)**:
     - In `ContactSection.tsx`, set section background to `#0A0A10` (line 64).
     - In `Footer.tsx`, set footer background to `#0A0A10` (line 42) and copyright strip background to `#0A0A10` (line 166).
     - Remove the `border-t-2 border-white/10` divider from `Footer.tsx` line 42 so Contact and Footer join seamlessly into a single monolithic dark block.
   - **Monogram Watermark Clipping Fix (R7)**:
     - In `ContactSection.tsx`, reposition the decorative monogram watermark (`SC`) from `-bottom-16` to `bottom-0 right-0 sm:right-4` with responsive typography (`text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[24rem] font-sans font-black text-white/[0.03] select-none pointer-events-none uppercase leading-none tracking-tighter`). Ensure the glyph curves are intact and not clipped by section `overflow-hidden`.
   - **Location De-duplication (R8 Part 2)**:
     - In `ContactSection.tsx` line 126, remove `{PERSONAL_INFO.location}` ("Chennai, India"). Replace the line with `IST (UTC+5:30) • Available Globally`.
     - Remove `MapPin` from `import { ... } from 'lucide-react'` in `ContactSection.tsx` to satisfy `noUnusedLocals: true`.
     - In `Footer.tsx` line 169, ensure `<p className="text-gray-400 font-bold">Chennai, India • Available Globally</p>` is preserved as the sole location display in the portfolio.

3. **`components/ContactSection.tsx` (R9 - High-Contrast Neo-Brutalist Form)**:
   - Redesign the direct transmission form container (lines 175–266):
     - Outer container: replace `#12121C` with crisp white `bg-white border-4 border-black p-0 shadow-[8px_8px_0px_0px_#FFDE59] relative overflow-hidden`.
     - Header banner: `bg-neo-yellow px-6 py-4 border-b-4 border-black flex items-center justify-between` featuring a neo-pink sticker badge (`bg-neo-pink text-white font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border-2 border-black`) and envelope stamp indicator.
     - Inner form body: `p-6 sm:p-8 space-y-5 bg-white text-black`.
     - Form input fields (name, email, message): `bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000000] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#FFDE59] placeholder:text-gray-500`.
     - Labels: `font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center justify-between`.
     - Submit button: `w-full bg-neo-yellow hover:bg-neo-pink text-black font-black uppercase tracking-wider py-4 px-6 border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-3`.
     - Status alerts: high-contrast neo-brutalist alert boxes with black borders and bold text. Preserve Formspree submission handler and status logic.

4. **Build Verification**:
   - Run `npm run build` to verify 0 TypeScript and 0 Vite bundling errors.
   - Write your handoff report to `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\worker_m3\handoff.md` and notify via `send_message`.

## 2026-09-10T14:24:29Z
You are Worker M3 (Skills Technical Arsenal, Contact & Footer Specialist).
Working directory: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\worker_m3
Workspace root: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul
Original Request file: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\ORIGINAL_REQUEST.md
Project Plan: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\PROJECT.md
Dispatch assignment: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\worker_m3\DISPATCH.md
Explorer 1 Survey Report: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_1\survey_report.md
Explorer 3 Survey Report: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_3\survey_report.md

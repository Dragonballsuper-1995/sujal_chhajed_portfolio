## Milestone 1 Implementation Assignment: Worker M1

### Scope
- Requirements:
  - R5: Header Logo Alignment & Name Font Size (`components/Header.tsx`)
  - R6: About Section 2-Column Redesign & Principles Removal (`components/About.tsx`)
  - R8 Part 1: Location De-duplication in Hero and About (`components/Hero.tsx`, `components/About.tsx`)
- Exclusive File Ownership:
  - `components/Header.tsx`
  - `components/Hero.tsx`
  - `components/About.tsx`
  *(Do NOT modify any other files in this milestone)*

### Reference Documents
- Original Request: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\ORIGINAL_REQUEST.md`
- Project Plan: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\PROJECT.md`
- Explorer 1 Survey Report: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_1\survey_report.md`
- Explorer 1 Handoff: `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\explorer_survey_1\handoff.md`

### Implementation Tasks
1. **`components/Header.tsx`**:
   - In lines 38–44, remove redundant wrapper styling on `div` wrapping `/logo-light.svg`. Remove `border-2 border-black`, `shadow-[2px_2px_0px_0px_#000]`, `bg-[#FFDE59]`, and `overflow-hidden`. Keep it clean so `logo-light.svg` renders its native vector borders and shadow cleanly without double-boxing or edge clipping.
   - In lines 45–47, update the author name typography: change from `text-xs sm:text-sm` to a bold, prominent neo-brutalist display size (`text-lg sm:text-xl font-black uppercase tracking-tight`).
2. **`components/Hero.tsx`**:
   - In line 48, remove `"📍 Chennai, India • "` from the secondary status/credential strip. Keep the rest (`8+ Production Deployments • Sub-100ms Target Latency`) intact on its background plate.
3. **`components/About.tsx`**:
   - Completely remove the redundant "Principles" card (lines 84–121: 01 Zero Hallucinations, 02 <100ms Latency, 03 Offline-First).
   - In line 42, remove `{PERSONAL_INFO.location}` and clean up the `MapPinIcon` helper/usage from the profile mini-card so "Chennai, India" is removed. (Retain university credentials "VIT Chennai" on lines 35 and 67).
   - Restructure the section into a balanced 2-column layout (`grid-cols-1 lg:grid-cols-12 gap-8 items-start`):
     - Column 1 (`lg:col-span-5`): Framed profile photo and quick facts/contact card.
     - Column 2 (`lg:col-span-7`): Narrative bio paragraphs and highlighted origin story card on a solid boundary plate (`bg-white border-3 border-black p-6 shadow-neo`).
4. **Verification & Quality Floor**:
   - Run `npm run build` to verify clean build with 0 TypeScript and 0 Vite errors.
   - Write your handoff report to `C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul\.agents\worker_m1\handoff.md` and notify via `send_message`.

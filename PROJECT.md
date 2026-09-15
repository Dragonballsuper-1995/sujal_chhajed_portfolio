# Project: Neo-Brutalist Portfolio Production Refactor & Overhaul

## Architecture
- **Tech Stack**: React 18, TypeScript (strict mode: `noUnusedLocals`, `noUnusedParameters`), Vite, Tailwind CSS with neo-brutalist preset (`border-black`, `shadow-neo`, neo color palette: `#FFDE59` yellow, `#FF59BF` pink, `#33E0EB` cyan, `#76E04D` lime, canvas `#FAF8F5`, dark `#0A0A10`).
- **Core Components**:
  - Navigation: `components/Header.tsx`
  - Hero Section: `components/Hero.tsx`, `components/HeroShader.tsx` (WebGL fluid canvas)
  - Background: `components/BackgroundGrid.tsx` (Interactive 2D dotted canvas)
  - Content Sections: `components/ProjectsSection.tsx`, `components/Skills.tsx`, `components/About.tsx`
  - Contact & Footer: `components/ContactSection.tsx`, `components/Footer.tsx`

## Feature Inventory
Every requirement from ORIGINAL_REQUEST.md is enumerated below with an assigned milestone:
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | R1: Skills Section Unification | Remove filter buttons and activeCategory state; render 4 categories as balanced unsegmented technical arsenal with solid boundary cards | M3 | ORIGINAL_REQUEST §R1 |
| 2 | R2: Hard Boundaries for Background Grid | Implement algorithmic exclusion on text hover in BackgroundGrid.tsx; wrap text and cards in solid background boundary plates across sections | M2 | ORIGINAL_REQUEST §R2 |
| 3 | R3: Hero WebGL Continuous Animation & Scroll Fade | Real-time continuous fluid domain warping independent of cursor; scroll-based opacity fade to 0 before ProjectsSection with draw pausing | M2 | ORIGINAL_REQUEST §R3 |
| 4 | R4: Shader Saturation & Alpha Boost | Boost baseline alpha to 0.50–0.65; enrich chromatic pastel vectors and add 1.25x saturation boost curve | M2 | ORIGINAL_REQUEST §R4 |
| 5 | R5: Header Logo & Name Display | Remove redundant wrapper borders, shadows, and overflow-hidden from logo-light.svg; enlarge author name to bold display text-lg/text-xl | M1 | ORIGINAL_REQUEST §R5 |
| 6 | R6: About 2-Column Redesign & Principles Removal | Delete Principles card; restructure into 2-column layout pairing framed photo with bio and highlighted origin story card | M1 | ORIGINAL_REQUEST §R6 |
| 7 | R7: Contact & Footer Dark Continuity & Monogram Fix | Unify backgrounds to #0A0A10, remove white border divider, eliminate monogram clipping by repositioning to bottom-0 right-0 | M3 | ORIGINAL_REQUEST §R7 |
| 8 | R8: Location De-duplication | Remove "Chennai, India" from Hero, About, and ContactSection; clean up unused MapPin import; display exclusively in Footer copyright strip | M1, M3 | ORIGINAL_REQUEST §R8 |
| 9 | R9: High-Contrast Contact Form Redesign | Redesign form container into high-contrast white neo-brutalist card with neo-yellow header, neo-pink badge, and tactile inputs | M3 | ORIGINAL_REQUEST §R9 |
| 10| QF: Quality Floor & Build Integrity | Clean npm run build (0 TS errors, 0 Vite errors), responsive layout verified on 1440px desktop and 390px mobile | M4 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Navigation, Hero Typography & Content Restructure | R5 (Header logo & name), R6 (About 2-col & Principles removal), R8 Part 1 (Hero & About location removal) | None | DONE |
| M2 | WebGL Fluid Shader Motion & Grid Hard Boundaries | R3 (Continuous animation & scroll fade), R4 (Shader vibrancy & alpha), R2 (Grid text hover exclusion & boundary plates) | M1 | DONE |
| M3 | Skills Arsenal Unification & Monolithic Dark Block | R1 (Skills unsegmented layout), R7 (Dark continuity & monogram fix), R8 Part 2 (Contact location & import cleanup), R9 (High-contrast contact form) | M2 | DONE |
| M4 | Final E2E Quality Floor & Adversarial Audit | Full production build verification, visual & interactive acceptance criteria verification across viewports, comprehensive audit | M3 | IN_PROGRESS |

## Interface Contracts
### Header ↔ Page Navigation
- `Header.tsx` maintains fixed navigation bar (`z-50`), hamburger menu toggle on mobile, and smooth scrolling to section anchors (`#hero`, `#projects`, `#skills`, `#about`, `#contact`).
- Logo container preserves SVG native aspect ratio without extra border/shadow wrapping.
- Author name maintains `uppercase` tracking and responsive sizing (`text-lg sm:text-xl font-black font-sans`).

### Hero & Content ↔ BackgroundGrid & HeroShader
- `HeroShader.tsx` renders in fixed/absolute container within `#hero`, dynamically adjusting opacity via `canvas.style.opacity = scrollFade` based on `window.scrollY`.
- `BackgroundGrid.tsx` listens for mouse move on `window`; checks `e.target.closest(...)` against typography tags and `.boundary-plate`; resets mouse coordinates off-screen (`-1000, -1000`) when over typography.
- All typography in `Hero.tsx`, `About.tsx`, `Skills.tsx`, and `ProjectsSection.tsx` sits on solid backing plates (`bg-canvas` `#FAF8F5` or `bg-white`) with `z-10`.

### ContactSection ↔ Footer
- Both components share background color `#0A0A10`.
- No border divider between ContactSection bottom and Footer top.
- Monogram watermark in ContactSection sits at `bottom-0 right-0 sm:right-4` with no negative overflow.
- Location string `Chennai, India` appears exclusively in `Footer.tsx` line 169.
- Formspree transmission endpoint in `ContactSection.tsx` (`https://formspree.io/f/xqagjnpj`) is preserved.

## Code Layout
- `components/Header.tsx`: Navigation bar, logo, author title, navigation links, mobile menu.
- `components/Hero.tsx`: Hero headline, subtitle, action buttons, metrics.
- `components/HeroShader.tsx`: WebGL fluid shader canvas, vertex/fragment shaders, RAF loop.
- `components/BackgroundGrid.tsx`: Canvas 2D interactive dotted background grid.
- `components/ProjectsSection.tsx`: Project cards, case studies, filter tabs.
- `components/Skills.tsx`: 4-category technical arsenal, badges, proficiency indicators.
- `components/About.tsx`: Framed photo, narrative bio, origin story card.
- `components/ContactSection.tsx`: Direct transmission form, social links, monogram watermark.
- `components/Footer.tsx`: Monolithic dark footer, copyright strip, exclusive location text.
- `constants.ts`: Personal info, navigation links, skill categories.
- `public/logo-light.svg`: Standalone vector logo asset with internal borders and shadow.

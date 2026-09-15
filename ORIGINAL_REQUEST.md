# Original User Request

## 2026-09-10T13:38:53Z

Refactor and polish the neo-brutalist portfolio website across 6 components to enhance visual balance, typography hierarchy, live WebGL motion, grid boundary protection, and seamless contrast.

Working directory: C:\Users\sujal\.gemini\antigravity\worktrees\sujal_chhajed_portfolio\portfolio_production_refactor_overhaul
Integrity mode: development

## Requirements

### R1. Skills Section Unification
Remove the category filtering buttons from `components/Skills.tsx`. Adjust the title typography, spacing, and row layouts so that all four technology categories (`ML & GenAI`, `Full-Stack`, `Data Eng`, `MLOps`) display as a balanced, unsegmented technical arsenal.

### R2. Hard Boundaries for Background Dotted Grid
In `components/BackgroundGrid.tsx` and content containers, implement hard boundaries for the interactive dotted grid when hovering over text. The dots must not expand, bleed, or distort readability under or over text elements. Text blocks and cards must sit cleanly on solid background boundary plates.

### R3. Hero Live Continuous Moving Shader & Scroll-Based Fade
In `components/HeroShader.tsx`, make the WebGL fluid shader continuously animate in real time via a continuous time loop (independent of cursor movement). Implement scroll-based opacity fading so that as the user scrolls down through the Hero, the shader smoothly fades to 0 opacity before the next section begins, ensuring a seamless `#FAF8F5` canvas transition.

### R4. Increased Shader Intensity & Vibrant Visibility
Boost the shader's color saturation and opacity/alpha (from the current subtle ~0.20 to a vibrant ~0.50–0.65) so the chromatic pastel fluid motion (cyan, pink, yellow, lime) is immediately noticeable upon landing.

### R5. Header Logo Alignment & Name Font Size
In `components/Header.tsx`, correct the placement of `public/logo-light.svg` by removing redundant outer wrapper borders and shadows that cause double-boxing. Enlarge the font size of the author's name (`SUJAL CHHAJED.`) to a bold, prominent neo-brutalist display size (`text-lg` or `text-xl`).

### R6. About Section 2-Column Redesign & Principles Removal
In `components/About.tsx`, completely remove the "Principles" card (01 Zero Hallucinations, 02 <100ms Latency, 03 Offline-First). Restructure the section from 3 columns into a 2-column layout that pairs the framed profile photo with the narrative bio and origin story card.

### R7. Seamless Contact & Footer Dark Continuity
Unify the background colors of `components/ContactSection.tsx` and `components/Footer.tsx` (using identical deep dark tone `#0A0A10`), remove the clipping artifact on the watermark monogram, and eliminate any jarring border breaks so both sections form a single monolithic dark block.

### R8. Location De-duplication
Remove the location string ("Chennai, India") from the Hero (`components/Hero.tsx`), About (`components/About.tsx`), and Contact (`components/ContactSection.tsx`) sections. Display the location exclusively in the bottom copyright strip of `components/Footer.tsx`.

### R9. High-Contrast Highlighted Contact Form
Redesign the direct transmission contact form container in `components/ContactSection.tsx` so it does not blend into the dark background. Style it as a highlighted, high-contrast neo-brutalist card (crisp white container, bold black borders, neo-yellow/pink accents) that immediately commands attention.

## Acceptance Criteria

### Visual & Interactive Behavior
- [ ] Category filter tabs (`All Categories`, `ML & GenAI`, etc.) are completely removed from the Skills section.
- [ ] Moving the mouse over text elements across the page does not cause grid dots to blow up or obscure typography.
- [ ] Hero WebGL shader continuously animates fluidly on page load and visibly fades to zero opacity as the user scrolls down.
- [ ] Hero shader colors are prominently visible and vibrant without requiring close inspection.
- [ ] Header logo renders cleanly without double borders or clipping, and author's name is larger and bold.
- [ ] About section has no Principles card and is cleanly structured as a 2-column layout.
- [ ] Contact section and Footer share a seamless identical dark background with no awkward border seams.
- [ ] "Chennai, India" appears only in the Footer and is removed from Hero, About, and Contact.
- [ ] Contact form is rendered with a high-contrast highlighted card style that pops vividly against the dark section.

### Engineering & Quality Floor
- [ ] Production build passes with zero TypeScript or Vite errors (`npm run build`).
- [ ] Responsive layout verified on both desktop (1440px) and mobile (390px) viewports.

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('STRATEGIC PORTFOLIO UPGRADES VERIFICATION SUITE');
console.log('================================================================\n');

// 1. Dead Code Removal
console.log('--- 1. Dead Code Removal ---');
assert(!fs.existsSync('components/CommandPalette.tsx'), 'CommandPalette.tsx has been deleted');
assert(!fs.existsSync('components/ChatAssistant.tsx'), 'ChatAssistant.tsx has been deleted');
assert(!fs.existsSync('services/geminiService.ts'), 'geminiService.ts has been deleted');
assert(!fs.existsSync('components/LiveStatus.tsx'), 'LiveStatus.tsx has been deleted');
assert(!fs.existsSync('components/MobileNavBar.tsx'), 'MobileNavBar.tsx has been deleted');
assert(!fs.existsSync('components/ProjectSkeleton.tsx'), 'ProjectSkeleton.tsx has been deleted');

const appSrc = fs.readFileSync('App.tsx', 'utf-8');
assert(!appSrc.includes('CommandPalette'), 'App.tsx has no CommandPalette references');
assert(!appSrc.includes('isCmdPaletteOpen'), 'App.tsx has no isCmdPaletteOpen state');
assert(!appSrc.includes('handleGlobalKeyDown'), 'App.tsx has no global Cmd+K keyboard listener');
assert(!appSrc.includes('isChatOpen'), 'App.tsx has no isChatOpen backdrop/state');

// 2. Custom Cursor Retrieval & Integration
console.log('\n--- 2. Custom Cursor Integration ---');
assert(fs.existsSync('components/CustomCursor.tsx'), 'CustomCursor.tsx is preserved');
assert(appSrc.includes("import CustomCursor from './components/CustomCursor'"), 'App.tsx imports CustomCursor');
assert(appSrc.includes('<CustomCursor />'), 'App.tsx renders <CustomCursor />');

// 3. Complete Loader Removal & Clean Entrance Animation
console.log('\n--- 3. Complete Loader Removal & Clean Entrance Animation ---');
assert(!fs.existsSync('components/LoadingScreen.tsx'), 'LoadingScreen.tsx has been completely deleted');
assert(!appSrc.includes('LoadingScreen'), 'App.tsx has no LoadingScreen references');
assert(appSrc.includes('animate-[fadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)]'), 'App.tsx main element has smooth entrance animation');

// 4. In-Portfolio Resume Modal
console.log('\n--- 4. In-Portfolio Resume Modal ---');
assert(fs.existsSync('components/ResumeModal.tsx'), 'ResumeModal.tsx exists');
const resumeModalSrc = fs.readFileSync('components/ResumeModal.tsx', 'utf-8');
assert(resumeModalSrc.includes('1IZu6KY1qTSuwFVJevxrT5JkJPtKgP54t') && resumeModalSrc.includes('/preview'), 'ResumeModal embeds Google Drive preview');
assert(resumeModalSrc.includes('export=download&id='), 'ResumeModal provides direct download button');
assert(appSrc.includes("import ResumeModal from './components/ResumeModal'"), 'App.tsx imports ResumeModal');
assert(appSrc.includes('<ResumeModal'), 'App.tsx renders <ResumeModal />');

const headerSrc = fs.readFileSync('components/Header.tsx', 'utf-8');
assert(headerSrc.includes('openResumeModal'), 'Header.tsx receives and uses openResumeModal');
const heroAboutSrc = fs.readFileSync('components/HeroAboutStage.tsx', 'utf-8');
assert(heroAboutSrc.includes('openResumeModal'), 'HeroAboutStage.tsx receives and uses openResumeModal');
const footerSrc = fs.readFileSync('components/Footer.tsx', 'utf-8');
assert(footerSrc.includes('openResumeModal'), 'Footer.tsx receives and uses openResumeModal');

// 5. Projects Role Filter Tabs & Responsive Archive Cards
console.log('\n--- 5. Projects Section Role Filter & Archive Cards ---');
const projectsSrc = fs.readFileSync('components/ProjectsSection.tsx', 'utf-8');
assert(projectsSrc.includes('ROLE_OPTIONS'), 'ProjectsSection.tsx defines ROLE_OPTIONS');
assert(projectsSrc.includes('setRoleFilter'), 'ProjectsSection.tsx wires setRoleFilter to buttons');
assert(projectsSrc.includes('grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'), 'ProjectsSection.tsx uses responsive 2/3 column layout for archive');

const projectCardSrc = fs.readFileSync('components/ProjectCard.tsx', 'utf-8');
assert(!projectCardSrc.includes("bottom-[calc(100%+8px)]"), 'ProjectCard.tsx has no floating hover popover in archive');
assert(projectCardSrc.includes('project.description'), 'ProjectCard.tsx archive variant displays description directly on card');
assert(projectCardSrc.includes('project.tags.slice') && projectCardSrc.includes('.map'), 'ProjectCard.tsx archive variant displays tags directly on card');

// 6. Production SEO & Social Sharing
console.log('\n--- 6. Production SEO & Social Sharing Previews ---');
const indexHtml = fs.readFileSync('index.html', 'utf-8');
assert(indexHtml.includes('Sujal Chhajed | AI/ML Engineer &amp; Full-Stack Developer'), 'index.html has full name & title');
assert(indexHtml.includes('meta name="description"'), 'index.html has meta description');
assert(indexHtml.includes('meta property="og:title"'), 'index.html has OpenGraph title');
assert(indexHtml.includes('meta property="og:description"'), 'index.html has OpenGraph description');
assert(indexHtml.includes('meta property="og:image"'), 'index.html has OpenGraph image');
assert(indexHtml.includes('meta name="twitter:card"'), 'index.html has Twitter Card');
assert(indexHtml.includes('application/ld+json'), 'index.html has JSON-LD Person schema');
assert(!indexHtml.includes('https://esm.sh/'), 'index.html has no obsolete esm.sh CDN importmap');

// 7. Production Build Artifacts
console.log('\n--- 7. Production Build Verification ---');
assert(fs.existsSync('dist/index.html'), 'dist/index.html exists');
const distHtml = fs.readFileSync('dist/index.html', 'utf-8');
assert(distHtml.includes('Sujal Chhajed | AI/ML Engineer &amp; Full-Stack Developer'), 'dist/index.html contains production title');
assert(distHtml.includes('meta property="og:title"'), 'dist/index.html contains production OpenGraph tags');

console.log('\n================================================================');
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

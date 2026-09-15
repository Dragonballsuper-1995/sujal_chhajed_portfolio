import fs from 'fs';

const skills = fs.readFileSync('components/Skills.tsx', 'utf8');
const contact = fs.readFileSync('components/ContactSection.tsx', 'utf8');

const results = [];

function check(title, condition, detail = '') {
  results.push({ title, pass: Boolean(condition), detail });
  console.log(`${condition ? '✓ PASS' : '✗ FAIL'}: ${title} ${detail ? `(${detail})` : ''}`);
}

// R1 Checks
check('R1.1 No activeCategory state', !skills.includes('activeCategory'));
check('R1.2 No setActiveCategory calls', !skills.includes('setActiveCategory'));
check('R1.3 No "All Categories" filter tab', !skills.includes('All Categories'));
check('R1.4 Category keys contains ml-genai', skills.includes("'ml-genai'"));
check('R1.5 Category keys contains fullstack', skills.includes("'fullstack'"));
check('R1.6 Category keys contains data-eng', skills.includes("'data-eng'"));
check('R1.7 Category keys contains mlops', skills.includes("'mlops'"));
check('R1.8 Section header has boundary-plate', skills.includes('boundary-plate mb-8 sm:mb-12'));
check('R1.9 Section header has solid bg-white', skills.includes('bg-white border-2 border-black p-5 sm:p-6 shadow-neo-sm relative z-10'));
check('R1.10 Category cards have boundary-plate', skills.includes('p-5 sm:p-6 shadow-neo-sm relative z-10 boundary-plate'));
check('R1.11 Skill pills have interactive states', skills.includes('hover:-translate-x-0.5') && skills.includes('hover:shadow-neo'));

// R9 Checks
check('R9.1 Form container crisp white', contact.includes('bg-white border-4 border-black p-0 shadow-[8px_8px_0px_0px_#FFDE59]'));
check('R9.2 Form banner neo-yellow with black border', contact.includes('bg-neo-yellow px-6 py-4 border-b-4 border-black'));
check('R9.3 DIRECT TRANSMISSION badge neo-pink', contact.includes('bg-neo-pink text-white font-mono text-[10px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000000]'));
check('R9.4 High-contrast inputs with #FAF8F5 background', contact.includes('bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000000]'));
check('R9.5 Focus states on inputs with neo-yellow shadow', contact.includes('focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#FFDE59]'));
check('R9.6 Submit button bold neo-brutalist styling', contact.includes('w-full bg-neo-yellow hover:bg-neo-pink text-black font-black uppercase py-4 px-6 border-3 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000]'));
check('R9.7 Formspree submission preserved', contact.includes('https://formspree.io/f/xqagjnpj'));
check('R9.8 Form fields (name, email, message) present with validation', contact.includes('form.name') && contact.includes('form.email') && contact.includes('form.message') && contact.includes('handleSubmit'));

const failed = results.filter(r => !r.pass);
if (failed.length > 0) {
  console.error(`\nFAILED ${failed.length} of ${results.length} checks!`);
  process.exit(1);
} else {
  console.log(`\nALL ${results.length} CHECKS PASSED PERFECTLY!`);
}

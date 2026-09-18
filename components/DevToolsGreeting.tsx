import React, { useEffect } from 'react';
import { PERSONAL_INFO, SKILLS, PROJECTS } from '../constants';

let hasFiredGreeting = false;

/**
 * Fires a styled console greeting for developers/recruiters
 * who inspect the source. Called once on app mount.
 */
function fireDevToolsGreeting(): void {
  if (typeof window === 'undefined' || hasFiredGreeting) return;
  hasFiredGreeting = true;

  // 1. Headline banner
  console.log(
    "%c⚡ SUJAL.DEV — Looking under the hood?",
    "background: #FFDE59; color: #000; font-size: 14px; font-weight: bold; border: 2px solid #000; padding: 4px;"
  );

  // 2. Sub-info row (dark pill with yellow text - crisp on both light and dark backgrounds)
  console.log(
    '%c  AI/ML Engineer · Full-Stack Developer · VIT Chennai  ',
    'background: #000000; color: #FFDE59; font-size: 11px; font-weight: 700; font-family: monospace; padding: 3px 16px; border: 1px solid #FFDE59; margin-top: 2px;'
  );

  // 3. Separator
  console.log(
    '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'color: #FFDE59; font-family: monospace;'
  );

  // 4. Info lines (green badge with black text + theme-adaptive value text via color: inherit)
  const lines = [
    ['Stack', 'React 18 + TypeScript + Vite + Tailwind + GSAP + Framer Motion'],
    ['AI', 'Gemini 2.0 Flash · RAG pipeline · Gemini Embeddings'],
    ['GitHub', 'https://github.com/Dragonballsuper-1995'],
    ['Email', 'sujalchhajed925@gmail.com'],
    ['LinkedIn', 'https://linkedin.com/in/sujalchhajed925'],
  ];

  lines.forEach(([key, val]) => {
    console.log(
      `%c ${key.padEnd(8)} %c ${val}`,
      'background: #7ED957; color: #000000; font-weight: 800; font-family: monospace; padding: 1px 6px; font-size: 11px; border: 1px solid #000;',
      'font-family: monospace; font-size: 11px; font-weight: 500; color: inherit;'
    );
  });

  // 5. Footer nudge
  console.log(
    '%c  Hiring? Press Ctrl+K to open the terminal or hit the Recruiter Mode toggle ↗  ',
    'background: #5CE1E6; color: #000000; font-size: 11px; font-weight: 700; font-family: monospace; padding: 3px 16px; margin-top: 4px; border: 1px solid #000;'
  );

  // 6. Interactive Commands Guide (high-contrast header & per-command rows with color: inherit)
  console.log(
    '%c\n🎮 INTERACTIVE CONSOLE COMMANDS',
    'background: #000000; color: #FFDE59; font-weight: 900; font-family: monospace; font-size: 12px; padding: 3px 10px; border: 1px solid #FFDE59;'
  );
  console.log(
    '%cType any command below directly in this console (or via sujal.<command>()):',
    'font-family: monospace; font-size: 11px; color: inherit; opacity: 0.85; margin: 4px 0;'
  );

  const interactiveCommands = [
    ['projects()', 'View table of flagship systems, live metrics & URLs'],
    ['skills()',   'View categorized technical proficiencies'],
    ['contact()',  'Contact details & auto-copies email to clipboard'],
    ['resume()',   'Open PDF resume in a new tab'],
    ['help()',     'Redisplay this interactive guide'],
  ];

  interactiveCommands.forEach(([cmd, desc]) => {
    console.log(
      `%c • %c${cmd.padEnd(12)}%c ${desc}`,
      'color: #FFDE59; font-weight: 900; font-size: 12px;',
      'background: #FFDE59; color: #000000; font-weight: 800; font-family: monospace; font-size: 11px; padding: 1px 6px; border: 1px solid #000;',
      'font-family: monospace; font-size: 11px; color: inherit; font-weight: 500;'
    );
  });

  registerInteractiveCommands();
}

function registerInteractiveCommands(): void {
  if (typeof window === 'undefined') return;

  const showProjects = () => {
    console.log('%c🚀 PROJECTS & FLAGSHIP SYSTEMS', 'background: #FFDE59; color: #000; font-weight: bold; padding: 2px 8px; border: 1px solid #000;');
    const tableData = PROJECTS.map(p => ({
      ID: p.id,
      Title: p.title,
      Category: p.category,
      PrimaryMetric: p.primaryMetric,
      Tags: p.tags.join(', '),
      LiveDemo: p.link || 'N/A',
      GitHub: p.github || 'N/A',
    }));
    console.table(tableData);
    return `✓ Displayed ${PROJECTS.length} projects. Type sujal.project(id) for full details.`;
  };

  const showSkills = () => {
    console.log('%c⚡ TECHNICAL SKILLSET', 'background: #33E0EB; color: #000; font-weight: bold; padding: 2px 8px; border: 1px solid #000;');
    const tableData = SKILLS.map(s => ({
      Skill: s.name,
      Category: s.category,
    }));
    console.table(tableData);
    return `✓ Displayed ${SKILLS.length} technologies.`;
  };

  const showContact = () => {
    console.log('%c📫 GET IN TOUCH', 'background: #FF59BF; color: #000000; font-weight: 800; padding: 2px 8px; border: 1px solid #000;');
    console.log(`%cEmail:    %c${PERSONAL_INFO.email}`, 'font-weight: bold; color: inherit;', 'color: inherit; font-family: monospace;');
    console.log(`%cLinkedIn: %c${PERSONAL_INFO.linkedin}`, 'font-weight: bold; color: inherit;', 'color: inherit; font-family: monospace;');
    console.log(`%cGitHub:   %c${PERSONAL_INFO.github}`, 'font-weight: bold; color: inherit;', 'color: inherit; font-family: monospace;');
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(PERSONAL_INFO.email);
        console.log('%c✓ Copied email to clipboard!', 'color: #10b981; font-weight: bold;');
      }
    } catch {
      // Ignore clipboard permission errors
    }
    return `Email: ${PERSONAL_INFO.email} · Phone: ${PERSONAL_INFO.phone}`;
  };

  const openResume = () => {
    console.log('%c📄 Opening Resume in a new tab...', 'background: #7ED957; color: #000000; font-weight: 800; padding: 2px 8px; border: 1px solid #000;');
    window.open(PERSONAL_INFO.resumeLink, '_blank');
    return PERSONAL_INFO.resumeLink;
  };

  const showHelp = () => {
    console.log(
      '%cAvailable commands:%c projects(), skills(), contact(), resume(), help()',
      'font-weight: bold; color: inherit;',
      'background: #FFDE59; color: #000000; font-weight: 800; font-family: monospace; font-size: 11px; padding: 1px 6px; border: 1px solid #000; margin-left: 6px;'
    );
    return 'Tip: You can also inspect the sujal object directly: window.sujal';
  };

  const sujal = {
    help: showHelp,
    projects: showProjects,
    project: (id: number) => {
      const p = PROJECTS.find(x => x.id === id);
      if (p) {
        console.log(p);
        return p;
      }
      return `Project ID ${id} not found. Valid IDs are 1-${PROJECTS.length}.`;
    },
    skills: showSkills,
    contact: showContact,
    resume: openResume,
    bio: () => {
      console.log(`%c${PERSONAL_INFO.name} — ${PERSONAL_INFO.role}`, 'font-weight: bold; font-size: 13px;');
      console.log(PERSONAL_INFO.bio);
      console.log(PERSONAL_INFO.bio2);
      return PERSONAL_INFO.funFact;
    },
  };

  (window as any).sujal = sujal;

  // Bind top-level shortcuts directly so both sujal.projects() and projects() work
  try {
    (window as any).projects = showProjects;
    (window as any).skills = showSkills;
    (window as any).contact = showContact;
    (window as any).resume = openResume;
    (window as any).help = showHelp;
  } catch {
    // Ignore in restricted environments
  }
}

/**
 * Mount-once component that fires the DevTools greeting.
 * Renders nothing to the DOM.
 */
const DevToolsGreeting: React.FC = () => {
  useEffect(() => {
    fireDevToolsGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty — fire once on mount

  return null;
};

export default DevToolsGreeting;

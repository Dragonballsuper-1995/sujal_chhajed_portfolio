
export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ArchitectureStep {
  step: string;
  title: string;
  detail: string;
}

export interface CaseStudy {
  problem: string;
  solution: string;
  architecture?: ArchitectureStep[];
  metrics?: ProjectMetric[];
  huggingFace?: string;
}

export interface Project {
  id: number;
  title: string;
  tagline?: string;
  description: string;
  tags: string[];         // max 3 shown on card
  link?: string;
  github?: string;
  huggingFace?: string;
  category: 'AI/ML' | 'Fullstack' | 'Data Science' | 'Mobile' | 'Systems' | 'Web Dev';
  image: string;
  accentColor: string;    // per-project signature hex colour
  primaryMetric?: string; // single punchy metric string e.g. "<680ms · Voice-to-Voice"
  featured?: boolean;     // true = flagship tier (top row)
  caseStudy?: CaseStudy;
}

export type SkillCategory = 'ml-genai' | 'fullstack' | 'data-eng' | 'mlops';

export interface Skill {
  name: string;
  svgSlug: string;        // simple-icons slug or devicons name
  fallbackIcon?: string;  // emoji or initials if icon not found
  category: SkillCategory;
}

export interface SocialLink {
  platform: string;
  url: string;
  iconName: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  sources?: { title: string; uri: string }[];
}

export enum NavSection {
  HERO = 'hero',
  ABOUT = 'about',
  SKILLS = 'skills',
  PROJECTS = 'projects',
  CONTACT = 'contact'
}

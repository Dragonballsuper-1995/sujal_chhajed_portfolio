
import React from 'react';
import { ArrowDown } from 'lucide-react';
import Section from './Section';
import NeoButton from './NeoButton';
import TextReveal from './TextReveal';
import { CipherReveal } from './ui/CipherReveal';
import { NavSection } from '../types';
import { PERSONAL_INFO } from '../constants';
import LiveStatus from './LiveStatus';
import ScrollAnimation from './ui/ScrollAnimation';
import Tooltip from './Tooltip';

interface HeroProps {
  scrollToSection: (id: NavSection) => void;
}

const name = PERSONAL_INFO.name;
const lastSpaceIndex = name.lastIndexOf(' ');
const nameLine1 = name.substring(0, lastSpaceIndex);
const nameLine2 = name.substring(lastSpaceIndex + 1);

const PHRASES = [
  "AI DEVELOPER", "ML ENGINEER", "CS ENGINEER", "TECH ENTHUSIAST",
  "NLP EXPERT", "PYTHON WIZARD", "TECHNOLOGY NERD"
];

const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  return (
    <Section
      id={NavSection.HERO}
      className="min-h-svh flex flex-col justify-center items-center text-center relative overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 md:pt-20 flex flex-col items-center">
        
        {/* Feature 1: Live Status Widget - Delayed to appear after loader curtain lifts */}
        <ScrollAnimation variant="fadeIn" delay={0.6} animateOnMount>
          <LiveStatus />
        </ScrollAnimation>

        <div className="relative mb-2">
          {/* Main Name - Delayed further for cascade effect */}
          <ScrollAnimation variant="blur" duration={0.8} delay={0.8} animateOnMount>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tighter text-neo-black dark:text-neo-dark-text mb-2 drop-shadow-[4px_4px_0px_rgba(126,217,87,1)] dark:drop-shadow-[4px_4px_0px_rgba(140,82,255,1)]">
              <span className="block">{nameLine1}</span>
              <span className="block">{nameLine2}</span>
            </h1>
          </ScrollAnimation>
        </div>

        <ScrollAnimation variant="scale" delay={1.0} className="relative mb-10" animateOnMount>
          <div className="inline-block relative">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-mono uppercase bg-white text-black dark:bg-black dark:text-white px-6 py-2 border-4 border-black dark:border-neo-dark-border transform -rotate-1 shadow-neo dark:shadow-neo-dark min-h-[3.5rem] md:min-h-[4.5rem] flex items-center justify-center">
              <CipherReveal texts={PHRASES} wait={1500} />
            </h2>
          </div>
        </ScrollAnimation>
        
        <ScrollAnimation variant="fadeUp" delay={1.2} className="max-w-3xl mx-auto" animateOnMount>
          <div className="text-lg md:text-xl font-mono bg-white dark:bg-neo-dark-surface dark:text-neo-dark-text border-2 border-black dark:border-neo-dark-border p-6 inline-block shadow-neo dark:shadow-neo-dark leading-relaxed hover:shadow-neo-lg dark:hover:shadow-neo-lg-dark transition-all duration-300 hover:-translate-y-1">
            <TextReveal text={PERSONAL_INFO.tagline} mode="word" delay={0.2} />
          </div>
        </ScrollAnimation>
        
        <ScrollAnimation variant="fadeUp" delay={1.4} className="flex flex-col md:flex-row gap-6 justify-center mt-12 no-print w-full max-w-lg md:max-w-none" animateOnMount>
          <NeoButton onClick={() => scrollToSection(NavSection.PROJECTS)} className="text-xl py-4 px-10 w-full md:w-auto">
            View My Work
          </NeoButton>
          <NeoButton variant="accent" onClick={() => scrollToSection(NavSection.CONTACT)} className="text-xl py-4 px-10 w-full md:w-auto">
            Let's Talk
          </NeoButton>
        </ScrollAnimation>

        {/* Scroll Down Button */}
        <ScrollAnimation variant="fadeIn" delay={1.8} className="mt-16 md:mt-24 mb-10 no-print" animateOnMount>
          <Tooltip text="Scroll Down" position="left">
            <button
              aria-label="Scroll to about section"
              onClick={() => scrollToSection(NavSection.ABOUT)}
              className="
                group flex items-center justify-center 
                w-[60px] h-[60px] 
                bg-neo-yellow dark:bg-neo-purple 
                border-4 border-black dark:border-white
                shadow-neo-lg dark:shadow-neo-lg-dark 
                hover:shadow-neo-xl dark:hover:shadow-neo-xl 
                transition-all duration-300 hover:-translate-y-2
                cursor-pointer animate-bounce
              "
            >
              <ArrowDown size={28} strokeWidth={3} className="text-black dark:text-white relative z-10 group-hover:scale-110 transition-transform" />
            </button>
          </Tooltip>
        </ScrollAnimation>
      </div>
    </Section>
  );
};

export default React.memo(Hero);

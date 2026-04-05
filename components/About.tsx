
import React from 'react';
import { Zap, Gamepad2, Coffee, Film } from 'lucide-react';
import Section from './Section';
import { Accordion, AccordionItem } from './ui/Accordion';
import Separator from './ui/Separator';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/HoverCard';
import { DecryptedText } from './ui/DecryptedText';
import { NavSection } from '../types';
import { CHARACTER_TRAITS } from '../constants';
import ScrollAnimation from './ui/ScrollAnimation';

const About: React.FC = () => {

  const renderTraitIcon = (type: string) => {
    switch (type) {
      case 'custom-f1':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 relative z-10">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
            <path d="M4 9h16" />
            <path d="M8 15V3" />
            <path d="M12 15V3" />
            <path d="M16 15V3" />
          </svg>
        );
      case 'custom-anime':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 relative z-10">
            <circle cx="12" cy="12" r="10" />
            <path d="m12 8 1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z" fill="currentColor" />
          </svg>
        );
      case 'lucide-coffee':
        return <Coffee className="mb-4 relative z-10" size={32} />;
      case 'lucide-film':
        return <Film className="mb-4 relative z-10" size={32} />;
      default:
        return <Gamepad2 className="mb-4 relative z-10" size={32} />;
    }
  };

  return (
    <Section id={NavSection.ABOUT} className="border-b-4 border-black dark:border-neo-dark-border">
      {/* Wavy underline animation is now in index.css */}

      <ScrollAnimation variant="fadeUp" className="flex flex-col items-center mb-16">
        <div className="bg-neo-black text-white px-4 py-1 font-mono text-sm font-bold mb-4 uppercase tracking-widest transform -rotate-2">
          File: profile_data.txt
        </div>
        <h2 className="text-5xl md:text-7xl font-black uppercase text-center leading-[0.9] group">
          The <span className="wavy-underline text-neo-pink"><DecryptedText text="MAN" /></span><br />
          Behind The <span className="bg-neo-green text-black px-2 relative z-20"><DecryptedText text="CODE" /></span>
        </h2>
      </ScrollAnimation>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ScrollAnimation variant="slideRight" delay={0.1}>
            <div className="relative group">
              <div className="absolute inset-0 bg-neo-purple translate-x-4 translate-y-4 border-4 border-black transition-transform group-hover:translate-x-8 group-hover:translate-y-8"></div>
              <div className="relative border-4 border-black bg-white p-2 z-10 transform transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2">
                <div className="aspect-[4/5] overflow-hidden border-2 border-black relative">
                  <img
                    src="/profile-pic-4.webp"
                    alt="Sujal Chhajed"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="1000"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black/80 p-2 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-mono text-xs text-center"> &gt; SYSTEM.ROOT.USER </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-neo-yellow border-4 border-black p-4 rounded-full shadow-neo z-20 hidden md:block group-hover:animate-[spin_2s_linear_infinite] transition-transform" style={{ transform: 'translateZ(50px)' }}>
                <Zap size={32} className="text-black" />
              </div>
            </div>
          </ScrollAnimation>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-8">
          <ScrollAnimation variant="slideLeft" delay={0.2}>
            <div className="bg-white dark:bg-neo-dark-surface p-8 border-l-8 border-neo-purple shadow-sm border-y-4 border-r-4 border-black dark:border-neo-dark-border">
              <h3 className="font-black text-3xl uppercase mb-6">
                Code, Caffeine & <span className="text-neo-purple"><DecryptedText text="Chaos" /></span>.
              </h3>
              <div className="prose dark:prose-invert font-mono text-lg leading-relaxed opacity-90">
                <p className="mb-4">
                  I’m <span className="font-bold bg-neo-yellow text-black px-1">Sujal Sanjay Chhajed</span>, a Computer Science student who treats code like a competitive sport. Whether it's training ML models or debugging a full-stack app, I bring that same intensity as the final lap of an F1 race.
                </p>
                <p>
                  I don't just build software; I craft digital experiences. My philosophy? <span className="italic font-bold">"Tech Nerd with a Human Touch."</span> I believe the best code doesn't just work—it resonates.
                </p>
              </div>
            </div>
          </ScrollAnimation>

          {/* Accordion Section for structured data */}
          <ScrollAnimation variant="fadeUp" delay={0.3}>
            <Accordion className="mt-4">
              <AccordionItem title="Education">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">B.Tech Computer Science (AI & ML)</h4>
                  <span className="bg-black text-white text-xs px-2 py-1 dark:bg-white dark:text-black">2021 - Present</span>
                </div>
                <p className="mb-2 text-neo-purple font-bold">VIT Chennai</p>
                <p className="opacity-80">Specializing in Artificial Intelligence and Machine Learning algorithms, with a focus on Deep Learning and Computer Vision.</p>
              </AccordionItem>
              <AccordionItem title="Technical Arsenal">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 border border-gray-200 dark:border-zinc-800">
                    <strong className="block mb-1 text-neo-blue">Languages</strong>
                    Python, JavaScript, TypeScript, C++, SQL
                  </div>
                  <div className="p-2 border border-gray-200 dark:border-zinc-800">
                    <strong className="block mb-1 text-neo-green">Frameworks</strong>
                    React, Next.js, TensorFlow, PyTorch, Tailwind
                  </div>
                  <div className="p-2 border border-gray-200 dark:border-zinc-800">
                    <strong className="block mb-1 text-neo-orange">Tools</strong>
                    Docker, Git, AWS, Vercel, Figma
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem title="Experience">
                <div className="mb-4 border-b border-gray-200 dark:border-zinc-700 pb-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold">AI/ML Developer</h4>
                    <span className="text-xs font-bold opacity-60">Freelance</span>
                  </div>
                  <p className="text-sm mt-1">Building custom NLP solutions and automating workflows for clients.</p>
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold">Full Stack Developer</h4>
                    <span className="text-xs font-bold opacity-60">Projects</span>
                  </div>
                  <p className="text-sm mt-1">Developed multiple high-performance web applications featured in my portfolio.</p>
                </div>
              </AccordionItem>
            </Accordion>
          </ScrollAnimation>
        </div>
      </div>

      <Separator className="my-12 opacity-50" />

      <div>
        <ScrollAnimation variant="fadeUp" className="flex items-center gap-4 mb-8">
          <h3 className="font-black text-xl uppercase bg-white dark:bg-neo-dark-surface border-4 border-black dark:border-neo-dark-border px-4 py-2 inline-flex items-center gap-2 shadow-neo-sm">
            <Gamepad2 size={24} /> Character Traits
          </h3>
          <div className="h-1 flex-grow bg-black dark:bg-white/20"></div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CHARACTER_TRAITS.map((trait, index) => (
            <ScrollAnimation key={trait.id} variant="scale" delay={index * 0.1}>
              <HoverCard className="relative block h-full w-full">
                <HoverCardTrigger className="h-full w-full">
                  <div className={`${trait.bgClass} ${trait.textColor} p-6 border-4 border-black dark:border-neo-dark-border shadow-neo hover:-translate-y-2 hover:shadow-neo-lg transition-all group h-full flex flex-col justify-between relative overflow-hidden`}>
                    <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 select-none pointer-events-none transform -rotate-12 transition-all duration-500 ease-out group-hover:scale-75">
                      <span className={`${trait.rotateTextSize} font-black whitespace-nowrap`}>
                        {trait.rotateText}
                      </span>
                    </div>
                    {renderTraitIcon(trait.iconType)}
                    <div className="relative z-10">
                      <p className="font-black uppercase text-xl tracking-tighter">{trait.title}</p>
                      <p className="text-xs font-mono opacity-90 mt-1 font-bold">{trait.subtitle}</p>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-60">
                  <p className="font-bold text-sm leading-tight">
                    {trait.description}
                  </p>
                </HoverCardContent>
              </HoverCard>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default React.memo(About);

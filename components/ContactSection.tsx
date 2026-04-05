
import React from 'react';
import { Mail, Copy, ArrowRight } from 'lucide-react';
import Section from './Section';
import NeoButton from './NeoButton';
import Tooltip from './Tooltip';
import { NavSection } from '../types';
import { PERSONAL_INFO, SOCIALS } from '../constants';
import { DecryptedText } from './ui/DecryptedText';
import ScrollAnimation from './ui/ScrollAnimation';

interface ContactSectionProps {
  setIsContactOpen: (isOpen: boolean) => void;
  copyToClipboard: (text: string, type: string) => void;
}

const getSocialHoverClass = (platform: string) => {
  switch(platform.toLowerCase()) {
    case 'github': return 'hover:text-black'; // Always black on hover for contrast against purple bg
    case 'linkedin': return 'hover:text-[#0077b5]';
    case 'instagram': return 'hover:text-[#E4405F]';
    case 'twitter': return 'hover:text-[#1DA1F2]';
    default: return 'hover:text-neo-green';
  }
};

const ContactSection: React.FC<ContactSectionProps> = ({ setIsContactOpen, copyToClipboard }) => (
  <Section id={NavSection.CONTACT}>
    <ScrollAnimation variant="scale" duration={0.6}>
      <div className="grid grid-cols-1 lg:grid-cols-5 border-4 border-black dark:border-neo-dark-border bg-white dark:bg-neo-dark-surface shadow-neo-xl dark:shadow-neo-lg-dark">
        {/* Left Column: Contact Info */}
        <div className="lg:col-span-2 bg-neo-purple p-8 md:p-10 flex flex-col justify-between text-white border-b-4 lg:border-b-0 lg:border-r-4 border-black dark:border-neo-dark-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all duration-500 ease-out transform group-hover:scale-75">
            <Mail size={180} />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-none mb-6">
              <DecryptedText text="Ready to" /> <br /><span className="text-neo-green"><DecryptedText text="Start?" /></span>
            </h2>
            <p className="font-mono text-base mb-8 opacity-90 leading-relaxed">
              I'm currently available for freelance projects and open to full-time opportunities.
            </p>
          </div>
          <div className="space-y-6 relative z-10">
            <div>
              <p className="font-bold font-mono text-xs uppercase opacity-70 mb-1">Email</p>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="min-w-0 flex-1 shrink font-black hover:underline underline-offset-4 decoration-2 whitespace-nowrap leading-none tracking-tight text-[clamp(0.6rem,3.6vw,1.25rem)]"
                >
                  {PERSONAL_INFO.email}
                </a>
                <Tooltip text="Copy Email">
                  <button onClick={() => copyToClipboard(PERSONAL_INFO.email, 'email')} className="p-1.5 sm:p-2 bg-white/10 hover:bg-white hover:text-neo-purple border-2 border-transparent hover:border-black transition-colors rounded-none" aria-label="Copy Email">
                    <Copy size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>
            <div>
              <p className="font-bold font-mono text-xs uppercase opacity-70 mb-1">Phone</p>
              <div className="flex items-center gap-3 min-w-0">
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="min-w-0 flex-1 text-xl font-black hover:underline underline-offset-4 decoration-2 whitespace-nowrap"
                >
                  {PERSONAL_INFO.phone}
                </a>
                <Tooltip text="Copy Phone">
                  <button onClick={() => copyToClipboard(PERSONAL_INFO.phone, 'phone')} className="p-2 bg-white/10 hover:bg-white hover:text-neo-purple border-2 border-transparent hover:border-black transition-colors rounded-none" aria-label="Copy Phone Number">
                    <Copy size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t-2 border-white/20">
              <p className="font-bold font-mono text-xs uppercase opacity-70 mb-3">Connect</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {SOCIALS.map(social => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-lg font-black inline-flex items-center gap-1 group/social transition-colors ${getSocialHoverClass(social.platform)}`}
                  >
                    {social.platform}
                    <ArrowRight size={14} className="-rotate-45 opacity-0 -translate-x-2 group-hover/social:opacity-100 group-hover/social:translate-x-0 transition-all duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Contact CTA */}
        <div className="lg:col-span-3 p-8 md:p-10 bg-white dark:bg-neo-dark-surface flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
          <div className="relative z-10 max-w-md space-y-8">
            <div className="inline-block p-4 border-4 border-black dark:border-neo-dark-border rounded-full bg-neo-yellow shadow-neo mb-4">
              <Mail size={48} className="text-black" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-4 whitespace-nowrap">
                <DecryptedText text="Let's Collabor" />
                <span className="text-neo-pink"><DecryptedText text="ate" /></span>
              </h3>
              <p className="font-mono text-gray-600 dark:text-neo-dark-text-muted">
                Have a project in mind or just want to say hi? Hit the button below to open a direct channel.
              </p>
            </div>
            <NeoButton
              onClick={() => setIsContactOpen(true)}
              className="text-xl py-4 px-10 w-full md:w-auto"
            >
              INITIATE CONTACT
            </NeoButton>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  </Section>
);

export default React.memo(ContactSection);

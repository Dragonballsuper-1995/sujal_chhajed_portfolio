import React, { useState, useCallback } from 'react';
import { Copy, Check, Send, Linkedin, Github, Instagram, Sparkles } from 'lucide-react';
import { XIcon } from './XIcon';
import { NavSection } from '../types';
import { PERSONAL_INFO } from '../constants';

interface ContactSectionProps {
  setIsContactOpen?: (isOpen: boolean) => void;
  copyToClipboard: (text: string, type: string) => void;
}

const FORMSPREE_URL = 'https://formspree.io/f/xqagjnpj';

const ContactSection: React.FC<ContactSectionProps> = ({ copyToClipboard }) => {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    copyToClipboard(PERSONAL_INFO.email, 'email');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage('Please fill in all fields.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        const data = await response.json();
        setErrorMessage(data.errors?.[0]?.message || 'Failed to deliver message.');
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setErrorMessage('Network error. Please try direct email.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [form]);

  return (
    <section
      id={NavSection.CONTACT}
      className="scroll-mt-16 py-20 md:py-28 bg-transparent text-ink border-t-4 border-black relative overflow-hidden"
    >
      {/* Giant Decorative Monogram Watermark */}
      <div
        className="absolute bottom-0 right-0 sm:right-4 text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[24rem] font-sans font-black text-black/[0.03] select-none pointer-events-none uppercase leading-none tracking-tighter z-0"
        aria-hidden="true"
      >
        SC
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── Left Column: Contact Identity & Direct Channels ────────────── */}
          <div className="lg:col-span-6 space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neo-green text-black border-2 border-black font-mono text-xs font-bold uppercase tracking-wider shadow-neo-sm">
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              <span>Available For High-Impact Roles</span>
            </div>

            {/* Headline */}
            <div>
              <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] text-ink mb-4">
                Get In <br />
                <span className="inline-block bg-neo-yellow text-black px-3 py-0.5 mt-2 border-3 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000]">
                  Touch.
                </span>
              </h2>
              <p className="font-mono text-sm sm:text-base text-gray-700 max-w-md leading-relaxed">
                Have an AI/ML system to design, a production pipeline to optimize, or an engineering role to discuss? Reach out directly.
              </p>
            </div>

            {/* Direct Email Card */}
            <div className="p-5 bg-white border-4 border-black shadow-neo">
              <span className="font-mono text-xs uppercase font-bold text-black/70 block mb-1">
                Direct Inquiries
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="font-mono text-sm sm:text-base font-bold text-black hover:text-neo-pink hover:underline transition-colors break-all"
                >
                  {PERSONAL_INFO.email}
                </a>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-1.5 font-mono text-xs font-bold px-3.5 py-2
                    bg-neo-yellow text-black border-2 border-black hover:bg-neo-pink transition-all shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 whitespace-nowrap"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check size={14} className="text-black" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Context & Availability */}
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neo-green border border-black animate-pulse" />
                <span>IST (UTC+5:30) • Available Globally</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-black" />
                <span>Fast Response within 24h</span>
              </div>
            </div>

            {/* Social Grid */}
            <div className="pt-4 border-t-2 border-black/10">
              <p className="font-mono text-xs font-bold text-black/70 uppercase mb-3">
                Social Profiles & Networks
              </p>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold px-3.5 py-2
                    bg-white text-[#181717] border-2 border-black shadow-neo-sm hover:bg-[#181717] hover:text-white hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
                >
                  <Github size={14} className="text-[#181717] group-hover:text-white transition-colors" />
                  <span>GitHub</span>
                </a>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold px-3.5 py-2
                    bg-white text-[#0A66C2] border-2 border-black shadow-neo-sm hover:bg-[#0A66C2] hover:text-white hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
                >
                  <Linkedin size={14} className="text-[#0A66C2] group-hover:text-white transition-colors" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://x.com/sujal_chhajed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold px-3.5 py-2
                    bg-white text-black border-2 border-black shadow-neo-sm hover:bg-black hover:text-white hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
                >
                  <XIcon size={14} className="text-black group-hover:text-white transition-colors" />
                  <span>X (Twitter)</span>
                </a>
                <a
                  href="https://www.instagram.com/sujalchhajed925/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold px-3.5 py-2
                    bg-white text-[#E4405F] border-2 border-black shadow-neo-sm hover:bg-[#E4405F] hover:text-white hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
                >
                  <Instagram size={14} className="text-[#E4405F] group-hover:text-white transition-colors" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── Right Column: Highlighted High-Contrast Neo-Brutalist Card ─────────── */}
          <div className="lg:col-span-6 relative z-10">
            <div className="bg-white border-4 border-black p-0 shadow-[8px_8px_0px_0px_#FFDE59] relative overflow-hidden">
              {/* Form Title Banner */}
              <div className="bg-neo-yellow px-6 py-4 border-b-4 border-black flex items-center justify-between">
                <div>
                  <div className="inline-block px-2 py-0.5 bg-neo-pink text-white font-mono text-[10px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000000] mb-1.5">
                    DIRECT TRANSMISSION
                  </div>
                  <h3 className="font-sans text-xl sm:text-2xl font-black text-black uppercase tracking-tight leading-none">
                    Send A Message
                  </h3>
                  <p className="font-mono text-xs text-black/80 font-bold mt-1">
                    Delivered directly to my primary inbox
                  </p>
                </div>
                <div
                  className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black font-bold text-lg shadow-[2px_2px_0px_0px_#000000] rotate-2 flex-shrink-0"
                  aria-hidden="true"
                >
                  ✉
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 sm:p-8 space-y-5 bg-white text-black">
                {/* Status Alert */}
                {status === 'success' && (
                  <div className="p-4 bg-neo-green text-black border-2 border-black font-mono text-xs font-bold shadow-[3px_3px_0px_0px_#000000] animate-fadeIn">
                    ✓ Transmission received! Thank you, I'll get back to you shortly.
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-4 bg-neo-pink text-black border-2 border-black font-mono text-xs font-bold shadow-[3px_3px_0px_0px_#000000] animate-fadeIn">
                    ⚠ {errorMessage || 'Could not deliver. Please email directly.'}
                  </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center justify-between mb-1.5">
                      <span>Your Name / Organization</span>
                      <span className="text-neo-pink font-black">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex Rivera (Google DeepMind)"
                      className="w-full bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000000] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#FFDE59] placeholder:text-gray-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center justify-between mb-1.5">
                      <span>Your Email Address</span>
                      <span className="text-neo-pink font-black">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000000] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#FFDE59] placeholder:text-gray-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center justify-between mb-1.5">
                      <span>Message / Project Brief</span>
                      <span className="text-neo-pink font-black">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your project, timeline, or engineering opportunity..."
                      className="w-full bg-[#FAF8F5] text-black font-mono text-sm border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000000] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:shadow-[4px_4px_0px_0px_#FFDE59] placeholder:text-gray-500 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Action */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-neo-yellow hover:bg-neo-pink text-black font-black uppercase py-4 px-6 border-3 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    <span>{status === 'loading' ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default React.memo(ContactSection);

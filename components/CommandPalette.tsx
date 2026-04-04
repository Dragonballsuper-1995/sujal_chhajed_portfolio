import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  Home, User, Zap, Briefcase, Phone,
  Sun, Moon, Send, Bot, Terminal, X,
  LucideIcon
} from 'lucide-react';
import { NavSection } from '../types';

// ============================================
// Types
// ============================================
interface CommandPaletteProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  scrollToSection: (id: NavSection) => void;
  setIsContactOpen: (isOpen: boolean) => void;
  setIsChatOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
}

interface Action {
  id: string;
  label: string;
  Icon: LucideIcon;
  action: () => void;
}

// ============================================
// Navigation Config
// ============================================
const NAV_SECTIONS: { id: string; label: string; section: NavSection; Icon: LucideIcon }[] = [
  { id: 'home', label: 'GO TO HOME', section: NavSection.HERO, Icon: Home },
  { id: 'about', label: 'GO TO ABOUT', section: NavSection.ABOUT, Icon: User },
  { id: 'skills', label: 'GO TO SKILLS', section: NavSection.SKILLS, Icon: Zap },
  { id: 'projects', label: 'GO TO PROJECTS', section: NavSection.PROJECTS, Icon: Briefcase },
  { id: 'contact', label: 'GO TO CONTACT', section: NavSection.CONTACT, Icon: Phone },
];

// ============================================
// Component
// ============================================
const CommandPalette: React.FC<CommandPaletteProps> = ({
  theme,
  toggleTheme,
  scrollToSection,
  setIsContactOpen,
  setIsChatOpen,
  isOpen,
  setIsOpen
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build actions from config + dynamic theme action
  const actions: Action[] = useMemo(() => [
    // Navigation actions from config
    ...NAV_SECTIONS.map(({ id, label, section, Icon }) => ({
      id,
      label,
      Icon,
      action: () => scrollToSection(section),
    })),
    // Theme toggle
    {
      id: 'theme',
      label: `SWITCH TO ${theme === 'light' ? 'DARK' : 'LIGHT'} MODE`,
      Icon: theme === 'light' ? Moon : Sun,
      action: toggleTheme,
    },
    // Contact form
    { id: 'message', label: 'OPEN CONTACT FORM', Icon: Send, action: () => setIsContactOpen(true) },
    // AI chat
    { id: 'ai', label: 'ASK AI ASSISTANT', Icon: Bot, action: () => setIsChatOpen(true) },
  ], [theme, toggleTheme, scrollToSection, setIsContactOpen, setIsChatOpen]);

  // Filter actions based on query
  const filteredActions = useMemo(() => {
    if (!query) return actions;
    return actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
  }, [query, actions]);

  // Reset selection when query changes or palette opens
  useEffect(() => setSelectedIndex(0), [query, isOpen]);

  // Focus input and manage body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Keyboard navigation within palette
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filteredActions[selectedIndex]?.action();
      setIsOpen(false);
    }

    // Number hotkeys 1-8
    const key = parseInt(e.key);
    if (key >= 1 && key <= 8 && key - 1 < filteredActions.length) {
      e.preventDefault();
      filteredActions[key - 1].action();
      setIsOpen(false);
    }
  }, [filteredActions, selectedIndex, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={() => setIsOpen(false)}
      />

      {/* Terminal Window */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-black border-4 border-black dark:border-white shadow-neo-xl dark:shadow-neo-lg-dark animate-[scaleIn_0.2s_ease-out] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gray-200 dark:bg-zinc-900 border-b-4 border-black dark:border-white p-3 flex justify-between items-center select-none shrink-0">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-neo-pink border-2 border-black" />
            <div className="w-4 h-4 bg-neo-yellow border-2 border-black" />
            <div className="w-4 h-4 bg-neo-green border-2 border-black" />
          </div>
          <div className="font-mono font-bold text-sm uppercase flex items-center gap-2 text-black dark:text-white">
            <Terminal size={16} />
            <span>COMMAND_PALETTE.exe</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-black dark:text-white hover:bg-neo-pink hover:text-black p-1 border-2 border-transparent hover:border-black dark:hover:border-white transition-all"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-2 font-mono flex-1 overflow-hidden flex flex-col">
          <div className="mb-2 px-2 py-3 text-sm flex items-center border-b-4 border-black dark:border-white">
            <span className="text-gray-500 dark:text-gray-400 mr-2 shrink-0">user@sujal.dev:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 font-bold text-black dark:text-white placeholder-gray-400 uppercase"
              placeholder="type_command..."
              autoComplete="off"
            />
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {filteredActions.length > 0 ? (
              filteredActions.map((action, idx) => (
                <button
                  key={action.id}
                  onClick={() => { action.action(); setIsOpen(false); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`
                    w-full flex items-center gap-4 p-3 transition-colors text-left
                    border-b-2 border-dashed border-gray-300 dark:border-zinc-800 last:border-0
                    ${idx === selectedIndex
                      ? 'bg-neo-yellow dark:bg-zinc-800 text-black dark:text-white'
                      : 'text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-900'}
                  `}
                >
                  {/* Keycap */}
                  <div className={`
                    w-8 h-8 flex items-center justify-center font-black text-lg border-2 transition-colors shrink-0
                    ${idx === selectedIndex
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-gray-400 bg-gray-100 text-gray-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-gray-400'}
                  `}>
                    {idx + 1}
                  </div>

                  <span className="font-bold uppercase tracking-wider flex-grow">{action.label}</span>

                  <div className={idx === selectedIndex ? 'opacity-100' : 'opacity-50'}>
                    <action.Icon size={20} />
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 font-bold uppercase border-2 border-dashed border-gray-300 dark:border-zinc-800 m-2">
                No commands found for "{query}"
              </div>
            )}
          </div>

          <div className="mt-2 px-4 py-2 text-xs text-gray-400 dark:text-gray-500 text-center uppercase tracking-widest border-t-2 border-dashed border-gray-300 dark:border-zinc-800 pt-3">
            [↑/↓] Navigate • [Enter] Select • [1-8] Quick Select
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CommandPalette;

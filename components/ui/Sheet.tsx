
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export const Sheet: React.FC<SheetProps> = ({ children, open, onOpenChange }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <SheetContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

export const SheetTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const context = useContext(SheetContext);
  if (!context) throw new Error("SheetTrigger must be used within Sheet");
  
  return (
    <div onClick={() => context.setOpen(true)} className={className}>
      {children}
    </div>
  );
};

export const SheetContent: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
}> = ({ children, className = "", side = "right" }) => {
  const context = useContext(SheetContext);
  if (!context) throw new Error("SheetContent must be used within Sheet");

  const [render, setRender] = useState(false);
  const [animate, setAnimate] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Animation & Focus Management Lifecycle
  useEffect(() => {
    if (context.open) {
      setRender(true);
      // Double requestAnimationFrame ensures the DOM is painted with the "closed" state before switching to "open" for animation
      requestAnimationFrame(() => {
         requestAnimationFrame(() => setAnimate(true));
      });
      document.body.style.overflow = "hidden";
      
      // Save currently focused element to restore later
      previousFocus.current = document.activeElement as HTMLElement;

      // Focus the first interactive element inside the sheet
      setTimeout(() => {
         const firstFocusable = contentRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
         firstFocusable?.focus();
      }, 50);

    } else {
      setAnimate(false); // Trigger close animation
      document.body.style.overflow = "";
      
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => {
        setRender(false);
        // Restore focus to the element that opened the sheet
        previousFocus.current?.focus();
      }, 500); // Matches duration-500
      
      return () => clearTimeout(timer);
    }
  }, [context.open]);

  // Keyboard Trap (Tab Loop & Escape)
  useEffect(() => {
    if (!context.open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
       // Close on Escape
       if (e.key === 'Escape') {
          context.setOpen(false);
          return;
       }

       // Trap Focus on Tab
       if (e.key === 'Tab') {
          if (!contentRef.current) return;
          const focusableElements = contentRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
             if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
             }
          } else {
             if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
             }
          }
       }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [context.open, context]);

  if (!render) return null;

  const sideClasses = {
    right: "inset-y-0 right-0 h-full border-l-4",
    left: "inset-y-0 left-0 h-full border-r-4",
    top: "inset-x-0 top-0 border-b-4",
    bottom: "inset-x-0 bottom-0 border-t-4",
  };

  const getTransformClass = () => {
      if (animate) return 'translate-x-0 translate-y-0';
      
      switch(side) {
          case 'right': return 'translate-x-full';
          case 'left': return '-translate-x-full';
          case 'top': return '-translate-y-full';
          case 'bottom': return 'translate-y-full';
      }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => context.setOpen(false)}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div 
        ref={contentRef}
        className={`
          relative z-[2001] bg-white dark:bg-neo-dark-surface 
          border-black dark:border-neo-dark-border shadow-neo-xl 
          transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${sideClasses[side]} 
          ${getTransformClass()}
          w-full max-w-lg md:max-w-2xl lg:max-w-3xl
          flex flex-col
          ${className}
        `}
      >
        <button 
          onClick={() => context.setOpen(false)}
          className="absolute right-4 top-4 p-2 bg-white dark:bg-black border-2 border-black dark:border-white hover:bg-neo-pink dark:hover:bg-neo-pink hover:text-black transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export const SheetHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>
    {children}
  </div>
);

export const SheetTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <h2 className={`text-xl font-black uppercase tracking-wider text-black dark:text-white ${className}`}>
    {children}
  </h2>
);

export const SheetDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 font-mono ${className}`}>
    {children}
  </p>
);

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type RoleFilter = 'all' | 'ai-ml' | 'fullstack' | 'data-eng';

export interface RecruiterContextType {
  isRecruiterMode: boolean;
  toggleRecruiterMode: () => void;
  setRecruiterMode: (val: boolean) => void;
  enableRecruiterMode: () => void;
  disableRecruiterMode: () => void;
  roleFilter: RoleFilter;
  setRoleFilter: (filter: RoleFilter) => void;
}

const STORAGE_KEY = 'portfolio:recruiter-mode';
const ROLE_STORAGE_KEY = 'portfolio:recruiter-role-filter';

const RecruiterContext = createContext<RecruiterContextType | undefined>(undefined);

export const RecruiterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRecruiterMode, setIsRecruiterModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('portfolio:recruiter-mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [roleFilter, setRoleFilterState] = useState<RoleFilter>(() => {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY);
      if (saved === 'ai-ml' || saved === 'fullstack' || saved === 'data-eng') {
        return saved;
      }
      return 'all';
    } catch {
      return 'all';
    }
  });

  // Synchronize with DOM classes and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, isRecruiterMode ? 'true' : 'false');
    } catch {
      // Ignore storage errors in restricted environments
    }

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('recruiter-mode', isRecruiterMode);
      document.body.classList.toggle('recruiter-mode', isRecruiterMode);
    }
  }, [isRecruiterMode]);

  useEffect(() => {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, roleFilter);
    } catch {
      // Ignore storage errors
    }
  }, [roleFilter]);

  const toggleRecruiterMode = useCallback(() => {
    setIsRecruiterModeState(prev => !prev);
  }, []);

  const setRecruiterMode = useCallback((val: boolean) => {
    setIsRecruiterModeState(val);
  }, []);

  const enableRecruiterMode = useCallback(() => {
    setIsRecruiterModeState(true);
  }, []);

  const disableRecruiterMode = useCallback(() => {
    setIsRecruiterModeState(false);
  }, []);

  const setRoleFilter = useCallback((filter: RoleFilter) => {
    setRoleFilterState(filter);
  }, []);

  const value: RecruiterContextType = {
    isRecruiterMode,
    toggleRecruiterMode,
    setRecruiterMode,
    enableRecruiterMode,
    disableRecruiterMode,
    roleFilter,
    setRoleFilter,
  };

  return (
    <RecruiterContext.Provider value={value}>
      {children}
    </RecruiterContext.Provider>
  );
};

export const useRecruiter = (): RecruiterContextType => {
  const context = useContext(RecruiterContext);
  if (!context) {
    throw new Error('useRecruiter must be used within a RecruiterProvider');
  }
  return context;
};

// Alias for backwards/multi-spec compatibility
export const useRecruiterMode = useRecruiter;

export default RecruiterContext;

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { ShortcutDifficulty } from '../types';

interface UIContextType {
  showSetup: boolean;
  isQuizMode: boolean;
  quizApp: string | null;
  setShowSetup: (show: boolean) => void;
  setIsQuizMode: (mode: boolean) => void;
  setQuizApp: (app: string | null) => void;
  setShowLandingVisualizer: (show: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Sets showSetup to true by default (session-based)
  const [showSetup, setShowSetupState] = useState(true);
  const [isQuizMode, setIsQuizModeState] = useState(false);
  const [quizApp, setQuizAppState] = useState<string | null>(null);

  const setShowSetup = useCallback((show: boolean) => {
    setShowSetupState(show);
  }, []);

  const setIsQuizMode = useCallback((mode: boolean) => {
    setIsQuizModeState(mode);
  }, []);

  const setQuizApp = useCallback((app: string | null) => {
    setQuizAppState(app);
  }, []);

  const setShowLandingVisualizer = useCallback(() => {
    // No-op as it's moved to SettingsContext
  }, []);

  const value = useMemo(() => ({
    showSetup,
    isQuizMode,
    quizApp,
    setShowSetup,
    setIsQuizMode,
    setQuizApp,
    setShowLandingVisualizer,
  }), [showSetup, isQuizMode, quizApp, setShowSetup, setIsQuizMode, setQuizApp, setShowLandingVisualizer]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
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
  const [showSetup, setShowSetup] = useState(true);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizApp, setQuizApp] = useState<string | null>(null);

  const value = useMemo(() => ({
    showSetup,
    isQuizMode,
    quizApp,
    setShowSetup,
    setIsQuizMode,
    setQuizApp,
    setShowLandingVisualizer: () => {}, // No-op as it's moved to SettingsContext
  }), [showSetup, isQuizMode, quizApp]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

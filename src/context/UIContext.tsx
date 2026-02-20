import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { ShortcutDifficulty } from '../types';

interface UIContextType {
  showSetup: boolean;
  isQuizMode: boolean;
  quizApp: string | null;
  quizDifficulty: ShortcutDifficulty | null;
  showLandingVisualizer: boolean;
  setShowSetup: (show: boolean) => void;
  setIsQuizMode: (mode: boolean) => void;
  setQuizApp: (app: string | null) => void;
  setQuizDifficulty: (difficulty: ShortcutDifficulty | null) => void;
  setShowLandingVisualizer: (show: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Sets showSetup to true by default (session-based)
  const [showSetup, setShowSetup] = useState(true);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizApp, setQuizApp] = useState<string | null>(null);
  const [quizDifficulty, setQuizDifficulty] = useState<ShortcutDifficulty | null>(null);
  const [showLandingVisualizer, setShowLandingVisualizer] = useState(true);

  const value = useMemo(() => ({
    showSetup,
    isQuizMode,
    quizApp,
    quizDifficulty,
    showLandingVisualizer,
    setShowSetup,
    setIsQuizMode,
    setQuizApp,
    setQuizDifficulty,
    setShowLandingVisualizer,
  }), [showSetup, isQuizMode, quizApp, quizDifficulty, showLandingVisualizer]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

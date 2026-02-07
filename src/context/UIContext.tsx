import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  showSetup: boolean;
  isQuizMode: boolean;
  quizApp: string | null;
  quizDifficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' | null;
  setShowSetup: (show: boolean) => void;
  setIsQuizMode: (mode: boolean) => void;
  setQuizApp: (app: string | null) => void;
  setQuizDifficulty: (difficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Sets showSetup to true by default (session-based)
  const [showSetup, setShowSetup] = useState(true);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizApp, setQuizApp] = useState<string | null>(null);
  const [quizDifficulty, setQuizDifficulty] = useState<'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' | null>(null);

  const value = {
    showSetup,
    isQuizMode,
    quizApp,
    quizDifficulty,
    setShowSetup,
    setIsQuizMode,
    setQuizApp,
    setQuizDifficulty,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

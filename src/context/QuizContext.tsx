import React, { createContext, useContext, ReactNode, Dispatch } from 'react';
import { useQuizGame } from '../hooks/useQuizGame';
import { ShortcutDifficulty } from '../types';
import {
  QuizState,
  QuizAction,
} from './QuizReducer';

export type { QuizState, QuizAction };

interface QuizContextType {
  quizState: QuizState;
  dispatch: Dispatch<QuizAction>;
  startQuiz: (app: string, isFullscreen: boolean, keyboardLayout: string, difficulty?: ShortcutDifficulty) => void;
  getNextQuestion: () => void;
  updateFullscreen: (isFullscreen: boolean) => void;
  handleKeyPress: (pressedKeys: Set<string>) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
  const quizGame = useQuizGame();

  return (
    <QuizContext.Provider value={quizGame}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}

import React, { createContext, useContext, useMemo, ReactNode, Dispatch } from 'react';
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
  startQuiz: (app: string, isFullscreen: boolean, keyboardLayout: string, difficulty?: ShortcutDifficulty, customShortcutIds?: number[]) => void;
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

  const value = useMemo(
    () => quizGame,
    [quizGame.quizState, quizGame.dispatch, quizGame.startQuiz, quizGame.getNextQuestion, quizGame.updateFullscreen, quizGame.handleKeyPress]
  );

  return (
    <QuizContext.Provider value={value}>
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

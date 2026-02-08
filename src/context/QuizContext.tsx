import React, { createContext, useReducer, useContext, useCallback, ReactNode, Dispatch, useEffect } from 'react';
import { generateQuestion, getCompatibleApps, isShortcutSafe } from '../utils/quizEngine';
import { useShortcutData } from './ShortcutContext';
import { useQuizInputHandler } from '../hooks/useQuizInputHandler';
import { useQuizProgress } from '../hooks/useQuizProgress';
import { QuizQuestion } from '../types';
import { 
  QuizState, 
  QuizAction, 
  quizReducer, 
  initialQuizState 
} from './QuizReducer';

interface QuizContextType {
  quizState: QuizState;
  dispatch: Dispatch<QuizAction>;
  startQuiz: (app: string, isFullscreen: boolean, keyboardLayout: string, difficulty?: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange') => void;
  getNextQuestion: () => void;
  updateFullscreen: (isFullscreen: boolean) => void;
  handleKeyPress: (pressedKeys: Set<string>) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
  const { allShortcuts, richShortcuts, apps } = useShortcutData();
  const [quizState, dispatch] = useReducer(quizReducer, initialQuizState);
  const { startQuizSession, completeQuizSession } = useQuizProgress();

  // ★ タイマーロジック
  useEffect(() => {
    if (quizState.status !== 'playing' || !quizState.currentQuestion || quizState.showAnswer) {
      return;
    }

    const timer = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 100);

    return () => clearInterval(timer);
  }, [quizState.status, quizState.currentQuestion, quizState.showAnswer]);

  const getAndSetNextQuestion = useCallback((
    currentUsedShortcuts: Set<string>,
    quizMode: 'default' | 'hardcore',
    keyboardLayout: string,
    selectedApp: string | null,
    isFullscreen: boolean,
    difficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange',
    allowRetry = true
  ) => {
    if (!allShortcuts || !keyboardLayout) {
      console.error('Cannot generate question: missing allShortcuts or keyboardLayout');
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }

    let compatibleApps = getCompatibleApps(keyboardLayout, apps || []);

    if (selectedApp) {
      const selectedApps = selectedApp.split(',').filter(a => a && a !== 'random');
      if (selectedApps.length > 0) {
        compatibleApps = compatibleApps.filter(a => selectedApps.includes(a));
      }
    }

    const newQuestion = generateQuestion(
      allShortcuts,
      compatibleApps,
      quizMode,
      isFullscreen,
      currentUsedShortcuts,
      difficulty,
      richShortcuts || [],
      apps || []
    );

    if (newQuestion) {
      dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion as QuizQuestion } });
    } else if (allowRetry && currentUsedShortcuts.size > 0) {
      dispatch({ type: 'CLEAR_USED_SHORTCUTS' });
      setTimeout(() => {
        getAndSetNextQuestion(new Set(), quizMode, keyboardLayout, selectedApp, isFullscreen, difficulty, false);
      }, 0);
    } else {
      dispatch({ type: 'FINISH_QUIZ' });
    }
  }, [allShortcuts, richShortcuts, apps]);


  const handleKeyPress = useCallback((pressedKeys: Set<string>) => {
    dispatch({ type: 'UPDATE_PRESSED_KEYS', payload: pressedKeys });
  }, []);

  const getNextQuestion = useCallback(() => {
    if (quizState.quizHistory.length >= quizState.settings.totalQuestions) {
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }
    dispatch({ type: 'NEXT_QUESTION' });
    getAndSetNextQuestion(
      quizState.usedShortcuts,
      quizState.settings.quizMode,
      quizState.keyboardLayout!,
      quizState.selectedApp,
      quizState.settings.isFullscreen,
      quizState.settings.difficulty
    );
  }, [quizState.quizHistory.length, quizState.settings, quizState.usedShortcuts, quizState.keyboardLayout, quizState.selectedApp, getAndSetNextQuestion]);

  const startQuiz = useCallback(async (app: string, isFullscreen: boolean, keyboardLayout: string, difficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' = 'standard') => {
    if (!allShortcuts) {
      console.error('Shortcuts data not loaded yet');
      return;
    }
    dispatch({ type: 'START_QUIZ', payload: { app, isFullscreen, keyboardLayout, difficulty } });
    await startQuizSession(app, difficulty);

    setTimeout(() => {
      getAndSetNextQuestion(new Set(), 'default', keyboardLayout, app, isFullscreen, difficulty, true);
    }, 0);
  }, [allShortcuts, startQuizSession, getAndSetNextQuestion]);

  const updateFullscreen = useCallback((isFullscreen: boolean) => {
    dispatch({ type: 'UPDATE_FULLSCREEN', payload: { isFullscreen } });
    if (quizState.status === 'playing' && quizState.currentQuestion) {
      const shortcut = quizState.currentQuestion.correctShortcut;
      if (!isShortcutSafe(shortcut, quizState.settings.quizMode, isFullscreen)) {
        getNextQuestion();
      }
    }
  }, [quizState.status, quizState.currentQuestion, getNextQuestion, quizState.settings.quizMode]);

  // ★ →キーまたはEnterキーで次の問題へ進む
  useEffect(() => {
    if (quizState.status !== 'playing' || !quizState.showAnswer) {
      return;
    }

    const handleKeyPressEvent = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault();
        getNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyPressEvent);
    return () => window.removeEventListener('keydown', handleKeyPressEvent);
  }, [quizState.status, quizState.showAnswer, getNextQuestion]);

  // クイズ完了時にセッションを保存
  useEffect(() => {
    if (quizState.status === 'finished' && quizState.quizHistory.length > 0) {
      const totalQuestions = quizState.quizHistory.length;
      const correctAnswers = quizState.quizHistory.filter(h => h.isCorrect).length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      completeQuizSession(score, totalQuestions, correctAnswers);
    }
  }, [quizState.status, quizState.quizHistory, completeQuizSession]);

  useQuizInputHandler({ quizState, dispatch, getNextQuestion, richShortcuts: richShortcuts || [] });

  const value = {
    quizState,
    dispatch,
    startQuiz,
    getNextQuestion,
    updateFullscreen,
    handleKeyPress,
  };

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

import { useReducer, useCallback, useEffect, Dispatch } from 'react';
import { generateQuestion, getCompatibleApps, isShortcutSafe } from '../utils/quizEngine';
import { useShortcutData } from '../context/ShortcutContext';
import { useQuizInputHandler } from './useQuizInputHandler';
import { useQuizProgress } from './useQuizProgress';
import { useLanguage } from '../context/LanguageContext';
import { QuizQuestion, ShortcutDifficulty } from '../types';
import { analytics } from '../utils/analytics';
import { TIMINGS } from '../constants/timings';
import {
  QuizState,
  QuizAction,
  quizReducer,
  initialQuizState
} from '../context/QuizReducer';

export function useQuizGame() {
  const { allShortcuts, richShortcuts, apps } = useShortcutData();
  const [quizState, dispatch] = useReducer(quizReducer, initialQuizState);
  const { startQuizSession, completeQuizSession } = useQuizProgress();
  const { t, language } = useLanguage();

  // ★ Timer Logic
  useEffect(() => {
    if (quizState.status !== 'playing' || !quizState.currentQuestion || quizState.showAnswer) {
      return;
    }

    const timer = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, TIMINGS.QUIZ_TIMER_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [quizState.status, quizState.currentQuestion, quizState.showAnswer]);

  const getAndSetNextQuestion = useCallback((
    currentUsedShortcuts: Set<string>,
    quizMode: 'default' | 'hardcore',
    keyboardLayout: string,
    selectedApp: string | null,
    isFullscreen: boolean,
    difficulty: ShortcutDifficulty,
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
      apps || [],
      t.quiz.questionFormat,
      language
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
  }, [allShortcuts, richShortcuts, apps, language, t.quiz.questionFormat]);


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

  const startQuiz = useCallback(async (app: string, isFullscreen: boolean, keyboardLayout: string, difficulty: ShortcutDifficulty = 'standard') => {
    if (!allShortcuts) {
      console.error('Shortcuts data not loaded yet');
      return;
    }
    dispatch({ type: 'START_QUIZ', payload: { app, isFullscreen, keyboardLayout, difficulty } });
    await startQuizSession(app, difficulty);
    
    // Analytics
    analytics.quizStarted(app, difficulty);

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

  // Save session on completion
  useEffect(() => {
    if (quizState.status === 'finished' && quizState.quizHistory.length > 0) {
      const totalQuestions = quizState.quizHistory.length;
      const correctAnswers = quizState.quizHistory.filter(h => h.isCorrect).length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      completeQuizSession(score, totalQuestions, correctAnswers);
      
      // Analytics
      analytics.quizCompleted(
        quizState.selectedApp || 'unknown',
        score,
        correctAnswers / totalQuestions
      );
    }
  }, [quizState.status, quizState.quizHistory, completeQuizSession, quizState.selectedApp]);

  // Use the input handler
  useQuizInputHandler({ quizState, dispatch, getNextQuestion, richShortcuts: richShortcuts || [] });

  return {
    quizState,
    dispatch,
    startQuiz,
    getNextQuestion,
    updateFullscreen,
    handleKeyPress,
  };
}

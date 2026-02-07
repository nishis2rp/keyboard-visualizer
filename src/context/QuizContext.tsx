import React, { createContext, useReducer, useContext, useCallback, ReactNode, Dispatch, useRef, useEffect } from 'react';
import { generateQuestion, checkAnswer, normalizePressedKeys, getCompatibleApps, normalizeShortcut, isShortcutSafe } from '../utils/quizEngine';
import { isModifierKey, isWindowsKey } from '../utils/keyUtils';
import { SequentialKeyRecorder, getSequentialKeys } from '../utils/sequentialShortcuts';
import { useAppContext } from './AppContext';
import { useQuizInputHandler } from '../hooks/useQuizInputHandler'; // 追加
import { useQuizProgress } from '../hooks/useQuizProgress'; // 追加
import { QuizQuestion } from '../types';


interface QuizSettings {
  quizMode: 'default' | 'hardcore';
  difficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange';
  timeLimit: number;
  totalQuestions: number;
  isFullscreen: boolean;
}

interface QuizHistoryEntry {
  question: string;
  correctShortcut: string;
  userAnswer: string;
  isCorrect: boolean;
  answerTimeMs?: number;
  speedCategory?: 'fast' | 'normal' | 'slow';
}

export interface QuizState {
  status: 'idle' | 'playing' | 'paused' | 'finished';
  selectedApp: string | null;
  keyboardLayout: string | null;
  currentQuestion: QuizQuestion | null;
  questionStartTime: number | null;
  timeRemaining: number;
  lastAnswerResult: 'correct' | 'incorrect' | null;
  lastWrongAnswer: string | null; // ★ 追加: 間違った回答を記録
  showAnswer: boolean; // 正解を表示するかどうか
  score: number;
  quizHistory: QuizHistoryEntry[];
  usedShortcuts: Set<string>; // 出題済みショートカットを記録
  startTime: number | null;
  endTime: number | null;
  settings: QuizSettings;
  pressedKeys: Set<string>; // ★ 追加: 現在押されているキー
  currentSequentialProgress: string[]; // ★ 追加: 順押しショートカットの途中経過
}

export type QuizAction =
  | { type: 'START_QUIZ'; payload: { app: string; keyboardLayout: string; isFullscreen: boolean; difficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' } }
  | { type: 'SET_QUESTION'; payload: { question: QuizQuestion } }
  | { type: 'ANSWER_QUESTION'; payload: { userAnswer: string; isCorrect: boolean; answerTimeMs: number } }
  | { type: 'SKIP_QUESTION' }
  | { type: 'TICK_TIMER' }
  | { type: 'PAUSE_QUIZ' }
  | { type: 'RESUME_QUIZ' }
  | { type: 'END_QUIZ' }
  | { type: 'RESET_QUIZ' }
  | { type: 'UPDATE_FULLSCREEN'; payload: { isFullscreen: boolean } }
  | { type: 'FINISH_QUIZ' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'UPDATE_PRESSED_KEYS'; payload: Set<string> } // ★ 追加
  | { type: 'UPDATE_SEQUENTIAL_PROGRESS'; payload: string[] } // ★ 追加: 順押し途中経過を更新
  | { type: 'CLEAR_USED_SHORTCUTS' }; // ★ 追加: 出題済みショートカットをクリア

interface QuizContextType {
  quizState: QuizState;
  dispatch: Dispatch<QuizAction>;
  startQuiz: (app: string, isFullscreen: boolean, keyboardLayout: string, difficulty?: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange') => void;
  getNextQuestion: () => void;
  updateFullscreen: (isFullscreen: boolean) => void;
  handleKeyPress: (pressedKeys: Set<string>) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const initialQuizState: QuizState = {
  status: 'idle',
  selectedApp: null,
  keyboardLayout: null,
  currentQuestion: null,
  questionStartTime: null,
  timeRemaining: 10,
  lastAnswerResult: null,
  lastWrongAnswer: null, // ★ 追加
  showAnswer: false,
  score: 0,
  quizHistory: [],
  usedShortcuts: new Set(),
  startTime: null,
  endTime: null,
  settings: {
    quizMode: 'default',
    difficulty: 'standard',
    timeLimit: 10,
    totalQuestions: 10,
    isFullscreen: false,
  },
  pressedKeys: new Set(), // ★ 追加
  currentSequentialProgress: [], // ★ 追加: 順押しショートカットの途中経過
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialQuizState,
        status: 'playing',
        selectedApp: action.payload.app,
        keyboardLayout: action.payload.keyboardLayout,
        settings: {
          ...state.settings,
          isFullscreen: action.payload.isFullscreen,
          difficulty: action.payload.difficulty,
        },
        startTime: Date.now(),
      };
    case 'SET_QUESTION': {
      const newUsedShortcuts = new Set(state.usedShortcuts);
      if (action.payload.question) {
        newUsedShortcuts.add(action.payload.question.normalizedCorrectShortcut);
      }
      return {
        ...state,
        currentQuestion: action.payload.question,
        questionStartTime: Date.now(),
        timeRemaining: state.settings.timeLimit,
        lastAnswerResult: null,
        showAnswer: false,
        usedShortcuts: newUsedShortcuts,
      };
    }
    case 'ANSWER_QUESTION': {
      const { userAnswer, isCorrect, answerTimeMs } = action.payload;

      const newScore = state.score + (isCorrect ? 1 : 0);

      const getSpeedCategory = (timeMs: number): 'fast' | 'normal' | 'slow' => {
        if (timeMs < 1000) return 'fast';
        if (timeMs < 3000) return 'normal';
        return 'slow';
      };

      const historyEntry = {
        question: state.currentQuestion ? state.currentQuestion.question : '',
        correctShortcut: state.currentQuestion ? state.currentQuestion.correctShortcut : '',
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        answerTimeMs: answerTimeMs,
        speedCategory: getSpeedCategory(answerTimeMs),
      };

      return {
        ...state,
        score: newScore,
        lastAnswerResult: isCorrect ? 'correct' : 'incorrect',
        lastWrongAnswer: isCorrect ? null : userAnswer, // ★ 追加: 間違った回答を記録
        showAnswer: true,
        quizHistory: [...state.quizHistory, historyEntry],
        pressedKeys: new Set(), // 回答後はキーをクリア
        currentSequentialProgress: [], // ★ 追加: 回答後は途中経過をクリア
      };
    }
    case 'FINISH_QUIZ':
      return {
        ...state,
        status: 'finished',
        endTime: Date.now(),
      };
    case 'PAUSE_QUIZ':
      return {
        ...state,
        status: 'paused',
      };
    case 'RESUME_QUIZ':
      return {
        ...state,
        status: 'playing',
      };
    case 'RESET_QUIZ':
      return initialQuizState;
    case 'UPDATE_FULLSCREEN':
      return {
        ...state,
        settings: {
          ...state.settings,
          isFullscreen: action.payload.isFullscreen,
        },
      };
    case 'TICK_TIMER': {
      const newTime = Math.max(0, state.timeRemaining - 0.1);
      if (newTime > 0) {
        return { ...state, timeRemaining: newTime };
      }
      // Time is out
      return {
        ...state,
        timeRemaining: 0,
        showAnswer: true,
        lastAnswerResult: 'incorrect',
        lastWrongAnswer: '（時間切れ）',
        quizHistory: [
          ...state.quizHistory,
          {
            question: state.currentQuestion?.question || '',
            correctShortcut: state.currentQuestion?.correctShortcut || '',
            userAnswer: '（時間切れ）',
            isCorrect: false,
          },
        ],
      };
    }
    case 'NEXT_QUESTION':
      return {
        ...state,
        showAnswer: false,
        lastAnswerResult: null,
        lastWrongAnswer: null, // ★ 追加
        pressedKeys: new Set(), // 次の問題へ進む前にキーをクリア
        currentSequentialProgress: [], // ★ 追加: 次の問題へ進む前に途中経過をクリア
      };
    case 'UPDATE_PRESSED_KEYS': // ★ 追加
      return {
        ...state,
        pressedKeys: action.payload,
      };
    case 'UPDATE_SEQUENTIAL_PROGRESS': // ★ 追加: 順押し途中経過を更新
      return {
        ...state,
        currentSequentialProgress: action.payload,
      };
    case 'CLEAR_USED_SHORTCUTS': // ★ 追加: 出題済みショートカットをクリア
      return {
        ...state,
        usedShortcuts: new Set(),
      };
    default:
      return state;
  }
}



interface QuizProviderProps {
  children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
  // AppContextからショートカットデータを取得
  const { allShortcuts, richShortcuts, apps } = useAppContext();

  const [quizState, dispatch] = useReducer(quizReducer, initialQuizState);

  // クイズ進捗保存機能
  const { startQuizSession, recordAnswer, completeQuizSession } = useQuizProgress();
  

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

  // getAndSetNextQuestion helper function
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
      dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion } });
    } else if (allowRetry && currentUsedShortcuts.size > 0) {
      // 問題が生成できない場合、usedShortcuts をクリアして再試行
      dispatch({ type: 'CLEAR_USED_SHORTCUTS' });
      // 次のフレームで再試行（無限ループを避けるため）
      setTimeout(() => {
        getAndSetNextQuestion(new Set(), quizMode, keyboardLayout, selectedApp, isFullscreen, difficulty, false);
      }, 0);
    } else {
      console.error('Could not generate question even after clearing used shortcuts');
      dispatch({ type: 'FINISH_QUIZ' });
    }
  }, [allShortcuts, richShortcuts]);


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
  }, [quizState.quizHistory.length, quizState.settings.totalQuestions, quizState.usedShortcuts, quizState.settings.quizMode, quizState.keyboardLayout, quizState.selectedApp, quizState.settings.isFullscreen, quizState.settings.difficulty, getAndSetNextQuestion]);

  const startQuiz = useCallback(async (app: string, isFullscreen: boolean, keyboardLayout: string, difficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' = 'standard') => {
    if (!allShortcuts) {
      console.error('Shortcuts data not loaded yet');
      return;
    }
    dispatch({ type: 'START_QUIZ', payload: { app, isFullscreen, keyboardLayout, difficulty } });

    // Start quiz session in database if user is logged in
    await startQuizSession(app, difficulty);

    // クイズ開始時は新しいセットとデフォルトモードで1問目を生成
    // 次のフレームで実行して、START_QUIZ が完了してから実行されるようにする
    setTimeout(() => {
      getAndSetNextQuestion(new Set(), 'default', keyboardLayout, app, isFullscreen, difficulty, true);
    }, 0);
  }, [allShortcuts, getAndSetNextQuestion, startQuizSession]);

  // ★ このuseEffectは削除（startQuiz内で問題を生成するため、重複を避ける）
  // useEffect(() => {
  //   if (quizState.status === 'playing' && !quizState.currentQuestion) {
  //     getAndSetNextQuestion(new Set(), quizState.settings.quizMode);
  //   }
  // }, [quizState.status, quizState.currentQuestion, quizState.settings.quizMode, getAndSetNextQuestion]);
  const updateFullscreen = useCallback((isFullscreen: boolean) => {
    dispatch({ type: 'UPDATE_FULLSCREEN', payload: { isFullscreen } });
    if (quizState.status === 'playing' && quizState.currentQuestion) {
      const shortcut = quizState.currentQuestion.correctShortcut; // isShortcutSafeは正規化されていないショートカットを期待
      if (!isShortcutSafe(shortcut, quizState.settings.quizMode, isFullscreen)) {
        // 保護されたショートカットが質問として安全でなくなった場合、次の問題へ
        getNextQuestion();
      }
    }
  }, [quizState.status, quizState.currentQuestion, getNextQuestion, quizState.settings.quizMode]);

  // ★ →キーまたはEnterキーで次の問題へ進む
  useEffect(() => {
    if (quizState.status !== 'playing' || !quizState.showAnswer) {
      return;
    }

    const handleKeyPressEvent = (event) => {
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

  // クイズ入力ハンドラーを使用（キーボード入力から正誤判定を行う）
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

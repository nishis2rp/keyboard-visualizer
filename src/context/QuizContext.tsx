import React, { createContext, useReducer, useContext, useCallback, ReactNode, Dispatch, useRef, useEffect } from 'react';
import { generateQuestion, checkAnswer, normalizePressedKeys, getCompatibleApps, normalizeShortcut, isShortcutSafe } from '../utils/quizEngine';
import { isModifierKey, isWindowsKey } from '../utils/keyUtils';
import { isSequentialShortcut, SequentialKeyRecorder, getSequentialKeys } from '../utils/sequentialShortcuts'; // Updated import
import { useAppContext } from './AppContext';
import { useQuizInputHandler } from '../hooks/useQuizInputHandler'; // 追加


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

interface QuizState {
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

type QuizAction =
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
  | { type: 'UPDATE_SEQUENTIAL_PROGRESS'; payload: string[] }; // ★ 追加: 順押し途中経過を更新

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
    default:
      return state;
  }
}



interface QuizProviderProps {
  children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
  // AppContextからショートカットデータを取得
  const { allShortcuts } = useAppContext();

  const [quizState, dispatch] = useReducer(quizReducer, initialQuizState);
  

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
  const getAndSetNextQuestion = useCallback((currentUsedShortcuts: Set<string>, quizMode: 'default' | 'hardcore') => {
    if (!allShortcuts || !quizState.keyboardLayout) {
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }

    let compatibleApps = getCompatibleApps(quizState.keyboardLayout);

    if (quizState.selectedApp) {
      const selectedApps = quizState.selectedApp.split(',').filter(a => a && a !== 'random');
      if (selectedApps.length > 0) {
        compatibleApps = compatibleApps.filter(a => selectedApps.includes(a));
      }
    }

    const newQuestion = generateQuestion(
      allShortcuts,
      compatibleApps,
      quizMode, // quizMode を渡す
      quizState.settings.isFullscreen,
      currentUsedShortcuts,
      quizState.settings.difficulty
    );

    if (newQuestion) {
      dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion } });
    } else {
      dispatch({ type: 'FINISH_QUIZ' });
    }
  }, [allShortcuts, quizState.keyboardLayout, quizState.selectedApp, quizState.settings.quizMode, quizState.settings.isFullscreen, quizState.settings.difficulty]);


  const handleKeyPress = useCallback((pressedKeys: Set<string>) => {
    dispatch({ type: 'UPDATE_PRESSED_KEYS', payload: pressedKeys });
  }, []);

  const getNextQuestion = useCallback(() => {
    if (quizState.quizHistory.length >= quizState.settings.totalQuestions) {
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }
    dispatch({ type: 'NEXT_QUESTION' });
    getAndSetNextQuestion(quizState.usedShortcuts, quizState.settings.quizMode);
  }, [quizState.quizHistory.length, quizState.settings.totalQuestions, quizState.usedShortcuts, quizState.settings.quizMode, getAndSetNextQuestion]);

  const startQuiz = useCallback((app: string, isFullscreen: boolean, keyboardLayout: string, difficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' = 'standard') => {
    if (!allShortcuts) {
      console.error('Shortcuts data not loaded yet');
      return;
    }
    dispatch({ type: 'START_QUIZ', payload: { app, isFullscreen, keyboardLayout, difficulty } });
    getAndSetNextQuestion(new Set(), 'default'); // クイズ開始時は新しいセットとデフォルトモード
  }, [allShortcuts, getAndSetNextQuestion]);

  // ★ クイズ開始時に最初の問題を取得する (useEffect を変更)
  useEffect(() => {
    if (quizState.status === 'playing' && !quizState.currentQuestion) {
      getAndSetNextQuestion(new Set(), quizState.settings.quizMode); // quizMode を渡す
    }
  }, [quizState.status, quizState.currentQuestion, quizState.settings.quizMode, getAndSetNextQuestion]);
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

import React, { createContext, useReducer, useContext, useCallback, ReactNode, Dispatch } from 'react';
import { generateQuestion, checkAnswer, normalizePressedKeys, getCompatibleApps } from '../utils/quizEngine';
import { allShortcuts } from '../data/shortcuts';
import { QuizQuestion, QuizStats, QuizResult } from '../types';

interface QuizSettings {
  quizMode: 'default' | 'hardcore';
  timeLimit: number;
  totalQuestions: number;
  isFullscreen: boolean;
}

interface QuizState {
  status: 'idle' | 'playing' | 'paused' | 'finished';
  selectedApp: string | null;
  keyboardLayout: string | null;
  currentQuestion: QuizQuestion | null;
  questionStartTime: number | null;
  timeRemaining: number;
  lastAnswerResult: 'correct' | 'incorrect' | null;
  score: number;
  combo: number;
  maxCombo: number;
  mistakes: number;
  quizHistory: any[];
  startTime: number | null;
  endTime: number | null;
  settings: QuizSettings;
}

type QuizAction =
  | { type: 'START_QUIZ'; payload: { app: string; keyboardLayout: string; isFullscreen: boolean } }
  | { type: 'SET_QUESTION'; payload: { question: QuizQuestion } }
  | { type: 'ANSWER_QUESTION'; payload: { userAnswer: string; isCorrect: boolean; answerTimeMs: number } }
  | { type: 'SKIP_QUESTION' }
  | { type: 'TICK_TIMER' }
  | { type: 'PAUSE_QUIZ' }
  | { type: 'RESUME_QUIZ' }
  | { type: 'END_QUIZ' }
  | { type: 'RESET_QUIZ' }
  | { type: 'UPDATE_FULLSCREEN'; payload: { isFullscreen: boolean } };

interface QuizContextType {
  state: QuizState;
  dispatch: Dispatch<QuizAction>;
  startQuiz: (app: string, keyboardLayout: string, isFullscreen: boolean) => void;
  answerQuestion: (pressedCodes: Set<string>) => void;
  skipQuestion: () => void;
  pauseQuiz: () => void;
  resumeQuiz: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
  updateFullscreen: (isFullscreen: boolean) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

// --- 2. 初期状態の定義 ---
const initialQuizState: QuizState = {
  status: 'idle',
  selectedApp: null,
  keyboardLayout: null,
  currentQuestion: null,
  questionStartTime: null,
  timeRemaining: 10,
  lastAnswerResult: null,
  score: 0,
  combo: 0,
  maxCombo: 0,
  mistakes: 0,
  quizHistory: [],
  startTime: null,
  endTime: null,
  settings: {
    quizMode: 'default',
    timeLimit: 10,
    totalQuestions: 10,
    isFullscreen: false,
  },
};

// --- 3. Reducer関数の定義 ---
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialQuizState, // 初期状態に戻す
        status: 'playing',
        selectedApp: action.payload.app,
        keyboardLayout: action.payload.keyboardLayout,
        settings: {
          ...state.settings,
          isFullscreen: action.payload.isFullscreen, // 現在のフルスクリーン状態を反映
        },
        startTime: Date.now(),
      };
    case 'SET_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload.question,
        questionStartTime: Date.now(),
        timeRemaining: state.settings.timeLimit,
        lastAnswerResult: null,
      };
    case 'ANSWER_QUESTION': {
      const { userAnswer, isCorrect, answerTimeMs } = action.payload;

      // Speed bonus calculation
      const calculateSpeedBonus = (timeMs) => {
        if (timeMs < 1000) return 2; // Fast: 2 points bonus
        if (timeMs < 3000) return 1; // Normal: 1 point bonus
        return 0; // Slow: no bonus
      };

      const speedBonus = isCorrect ? calculateSpeedBonus(answerTimeMs) : 0;
      const newScore = state.score + (isCorrect ? 1 : 0) + speedBonus;
      const newMistakes = state.mistakes + (isCorrect ? 0 : 1);
      const newCombo = isCorrect ? state.combo + 1 : 0;
      const newMaxCombo = Math.max(state.maxCombo, newCombo);

      // Categorize answer speed
      const getSpeedCategory = (timeMs) => {
        if (timeMs < 1000) return 'fast';
        if (timeMs < 3000) return 'normal';
        return 'slow';
      };

      const historyEntry = {
        question: state.currentQuestion.question,
        correctShortcut: state.currentQuestion.correctShortcut,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        answerTimeMs: answerTimeMs,
        speedCategory: getSpeedCategory(answerTimeMs),
      };

      return {
        ...state,
        score: newScore,
        mistakes: newMistakes,
        combo: newCombo,
        maxCombo: newMaxCombo,
        lastAnswerResult: isCorrect ? 'correct' : 'incorrect',
        quizHistory: [...state.quizHistory, historyEntry],
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
    case 'TOGGLE_QUIZ_MODE': // 'default' <-> 'hardcore'
      return {
        ...state,
        settings: {
          ...state.settings,
          quizMode: state.settings.quizMode === 'default' ? 'hardcore' : 'default',
        },
      };
    case 'SET_FULLSCREEN_MODE':
      return {
        ...state,
        settings: {
          ...state.settings,
          isFullscreen: action.payload,
        },
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timeRemaining: action.payload,
      };
    case 'TIMEOUT':
      // 時間切れで不正解扱い
      return {
        ...state,
        mistakes: state.mistakes + 1,
        combo: 0,
        quizHistory: [
          ...state.quizHistory,
          {
            question: state.currentQuestion?.question || '',
            userAnswer: '（時間切れ）',
            correctAnswer: state.currentQuestion?.correctShortcut || '',
            isCorrect: false,
          },
        ],
      };
    default:
      return state;
  }
}

// --- 4. Providerコンポーネント ---
interface QuizProviderProps {
  children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
  const [quizState, dispatch] = useReducer(quizReducer, initialQuizState);

  // 次の問題を生成してセットする関数
  const getNextQuestion = useCallback(() => {
    if (!quizState.keyboardLayout) {
      console.warn("[QuizContext] キーボードレイアウトが選択されていません。");
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }

    // キーボードレイアウトに基づいて互換性のあるアプリを取得
    const compatibleApps = getCompatibleApps(quizState.keyboardLayout);
    console.log('[QuizContext] Getting next question for compatible apps:', compatibleApps);

    const newQuestion = generateQuestion(
      allShortcuts,
      compatibleApps,
      'default', // デフォルトモードを使用
      quizState.settings.isFullscreen
    );
    console.log('[QuizContext] Next question:', newQuestion);

    if (newQuestion) {
      dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion } });
    } else {
      // 問題が生成できない場合、クイズを終了
      console.warn('[QuizContext] No more questions available, finishing quiz');
      dispatch({ type: 'FINISH_QUIZ' });
    }
  }, [quizState.keyboardLayout, quizState.settings.isFullscreen]);


  // クイズを開始する
  const startQuiz = useCallback((app, isFullscreen, keyboardLayout) => {
    console.log('[QuizContext] Starting quiz:', { app, isFullscreen, keyboardLayout });

    dispatch({ type: 'START_QUIZ', payload: { app, isFullscreen, keyboardLayout } });

    // キーボードレイアウトに基づいて互換性のあるアプリを取得
    const compatibleApps = getCompatibleApps(keyboardLayout);
    console.log('[QuizContext] Compatible apps for layout:', compatibleApps);

    // state更新が反映されるのを待つ
    setTimeout(() => {
      const newQuestion = generateQuestion(
        allShortcuts,
        compatibleApps,
        'default', // デフォルトモードを使用
        isFullscreen
      );
      console.log('[QuizContext] Generated question:', newQuestion);

      if (newQuestion) {
        dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion } });
      } else {
        console.warn('[QuizContext] Failed to generate question');
        dispatch({ type: 'FINISH_QUIZ' });
      }
    }, 0);
  }, []); // 依存配列を空にして常に最新の値を使用


  // 回答を処理する
  const handleAnswer = useCallback((pressedKeys) => {
    console.log('[QuizContext] handleAnswer called:', {
      status: quizState.status,
      hasQuestion: !!quizState.currentQuestion,
      pressedKeys: Array.from(pressedKeys)
    });

    if (quizState.status !== 'playing' || !quizState.currentQuestion) {
      console.warn('[QuizContext] Cannot answer - quiz not playing or no question');
      return;
    }

    // Calculate answer time
    const answerTimeMs = Date.now() - quizState.questionStartTime;

    const userAnswer = normalizePressedKeys(pressedKeys);
    const isCorrect = checkAnswer(userAnswer, quizState.currentQuestion.normalizedCorrectShortcut);

    console.log('[QuizContext] Answer result:', {
      userAnswer,
      correctAnswer: quizState.currentQuestion.normalizedCorrectShortcut,
      isCorrect,
      answerTimeMs
    });

    dispatch({ type: 'ANSWER_QUESTION', payload: { userAnswer, isCorrect, answerTimeMs } });

    // 次の問題へ（少し遅延を入れてフィードバックを表示）
    setTimeout(() => {
      getNextQuestion();
    }, 500);
  }, [quizState.status, quizState.currentQuestion, quizState.questionStartTime, getNextQuestion]);

  // コンテキストに渡す値
  const value = {
    quizState,
    dispatch,
    startQuiz,
    handleAnswer,
    getNextQuestion, // 外部からも次問取得できるようにエクスポート
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

// --- 5. Contextを使用するためのカスタムフック ---
export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}

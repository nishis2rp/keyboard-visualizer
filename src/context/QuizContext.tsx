import React, { createContext, useReducer, useContext, useCallback, ReactNode, Dispatch } from 'react';
import { generateQuestion, checkAnswer, normalizePressedKeys, getCompatibleApps, normalizeShortcut } from '../utils/quizEngine';
import { allShortcuts } from '../data/shortcuts';
import { QuizQuestion, QuizStats, QuizResult } from '../types';
import { ALWAYS_PROTECTED_SHORTCUTS, FULLSCREEN_PREVENTABLE_SHORTCUTS } from '../constants/systemProtectedShortcuts';

interface QuizSettings {
  quizMode: 'default' | 'hardcore';
  difficulty: 'basic' | 'standard' | 'madmax';
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
  showAnswer: boolean; // 正解を表示するかどうか
  score: number;
  quizHistory: QuizHistoryEntry[];
  usedShortcuts: Set<string>; // 出題済みショートカットを記録
  startTime: number | null;
  endTime: number | null;
  settings: QuizSettings;
}

type QuizAction =
  | { type: 'START_QUIZ'; payload: { app: string; keyboardLayout: string; isFullscreen: boolean; difficulty: string } }
  | { type: 'SET_QUESTION'; payload: { question: QuizQuestion } }
  | { type: 'ANSWER_QUESTION'; payload: { userAnswer: string; isCorrect: boolean; answerTimeMs: number } }
  | { type: 'SKIP_QUESTION' }
  | { type: 'TICK_TIMER' }
  | { type: 'PAUSE_QUIZ' }
  | { type: 'RESUME_QUIZ' }
  | { type: 'END_QUIZ' }
  | { type: 'RESET_QUIZ' }
  | { type: 'UPDATE_FULLSCREEN'; payload: { isFullscreen: boolean } }
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'TIMEOUT' }
  | { type: 'FINISH_QUIZ' }
  | { type: 'NEXT_QUESTION' };

interface QuizContextType {
  quizState: QuizState;
  dispatch: Dispatch<QuizAction>;
  startQuiz: (app: string, isFullscreen: boolean, keyboardLayout: string, difficulty?: 'basic' | 'standard' | 'madmax') => void;
  handleAnswer: (pressedCodes: Set<string>) => void;
  getNextQuestion: () => void;
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
          difficulty: action.payload.difficulty as 'basic' | 'standard' | 'madmax', // 難易度を設定
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
        lastAnswerResult: isCorrect ? 'correct' : 'incorrect',
        showAnswer: true,
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
    case 'UPDATE_FULLSCREEN':
      return {
        ...state,
        settings: {
          ...state.settings,
          isFullscreen: action.payload.isFullscreen || action.payload,
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
        showAnswer: true,
        lastAnswerResult: 'incorrect',
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
    case 'NEXT_QUESTION':
      // 次の問題へ進む準備（showAnswerをリセット）
      return {
        ...state,
        showAnswer: false,
        lastAnswerResult: null,
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
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }

    // 10問に達したかチェック
    if (quizState.quizHistory.length >= quizState.settings.totalQuestions) {
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }

    // 次の問題へ進む準備
    dispatch({ type: 'NEXT_QUESTION' });

    // キーボードレイアウトに基づいて互換性のあるアプリを取得
    let compatibleApps = getCompatibleApps(quizState.keyboardLayout);

    // selectedAppが'random'でない場合、指定されたアプリのみに絞る
    if (quizState.selectedApp && quizState.selectedApp !== 'random' && compatibleApps.includes(quizState.selectedApp)) {
      compatibleApps = [quizState.selectedApp];
    }


    const newQuestion = generateQuestion(
      allShortcuts,
      compatibleApps,
      'default', // デフォルトモードを使用
      quizState.settings.isFullscreen,
      quizState.usedShortcuts,
      quizState.settings.difficulty // 難易度を渡す
    );

    if (newQuestion) {
      dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion } });
    } else {
      // 問題が生成できない場合、クイズを終了
      dispatch({ type: 'FINISH_QUIZ' });
    }
  }, [quizState.keyboardLayout, quizState.settings.isFullscreen, quizState.selectedApp, quizState.quizHistory.length, quizState.settings.totalQuestions, quizState.usedShortcuts]);


  // クイズを開始する
  const startQuiz = useCallback((app: string, isFullscreen: boolean, keyboardLayout: string, difficulty: 'basic' | 'standard' | 'madmax' = 'standard') => {

    dispatch({ type: 'START_QUIZ', payload: { app, isFullscreen, keyboardLayout, difficulty } });

    // キーボードレイアウトに基づいて互換性のあるアプリを取得
    let compatibleApps = getCompatibleApps(keyboardLayout);

    // appが'random'でない場合、指定されたアプリのみに絞る
    if (app !== 'random' && compatibleApps.includes(app)) {
      compatibleApps = [app];
    }


    // state更新が反映されるのを待つ
    setTimeout(() => {
      const newQuestion = generateQuestion(
        allShortcuts,
        compatibleApps,
        'default', // デフォルトモードを使用
        isFullscreen,
        new Set(), // 最初の問題なので空のSet
        difficulty // 難易度を渡す
      );

      if (newQuestion) {
        dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion } });
      } else {
        dispatch({ type: 'FINISH_QUIZ' });
      }
    }, 0);
  }, []); // 依存配列を空にして常に最新の値を使用


  // 回答を処理する
  const handleAnswer = useCallback((pressedKeys) => {
    if (quizState.status !== 'playing' || !quizState.currentQuestion || quizState.showAnswer) {
      return;
    }

    // Calculate answer time
    const answerTimeMs = Date.now() - quizState.questionStartTime;

    const userAnswer = normalizePressedKeys(pressedKeys);
    const isCorrect = checkAnswer(userAnswer, quizState.currentQuestion.normalizedCorrectShortcut);

    dispatch({ type: 'ANSWER_QUESTION', payload: { userAnswer, isCorrect, answerTimeMs } });
  }, [quizState.status, quizState.currentQuestion, quizState.questionStartTime, quizState.showAnswer]);

  // フルスクリーン状態を更新し、現在の問題が安全かチェック
  const updateFullscreen = useCallback((isFullscreen: boolean) => {

    // フルスクリーン状態を更新
    dispatch({ type: 'UPDATE_FULLSCREEN', payload: { isFullscreen } });

    // 現在プレイ中で問題がある場合、その問題が新しいフルスクリーン状態で安全かチェック
    if (quizState.status === 'playing' && quizState.currentQuestion) {
      const normalizedShortcut = quizState.currentQuestion.normalizedCorrectShortcut;

      // 正規化されたショートカットのセットを作成
      const normalizedAlwaysProtected = new Set(
        Array.from(ALWAYS_PROTECTED_SHORTCUTS).map(s => normalizeShortcut(s))
      );
      const normalizedFullscreenPreventable = new Set(
        Array.from(FULLSCREEN_PREVENTABLE_SHORTCUTS).map(s => normalizeShortcut(s))
      );

      // 常に保護されているショートカットは問題外（これは出題されないはず）
      if (normalizedAlwaysProtected.has(normalizedShortcut)) {
        getNextQuestion();
        return;
      }

      // 全画面でない場合、フルスクリーンで防止可能なショートカットは安全でない
      if (!isFullscreen && normalizedFullscreenPreventable.has(normalizedShortcut)) {
        getNextQuestion();
      }
    }
  }, [quizState.status, quizState.currentQuestion, getNextQuestion]);

  // コンテキストに渡す値
  const value = {
    quizState,
    dispatch,
    startQuiz,
    handleAnswer,
    getNextQuestion, // 外部からも次問取得できるようにエクスポート
    updateFullscreen,
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

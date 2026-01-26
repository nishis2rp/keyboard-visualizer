import React, { createContext, useReducer, useContext, useCallback, ReactNode, Dispatch, useRef, useEffect } from 'react';
import { generateQuestion, checkAnswer, normalizePressedKeys, getCompatibleApps, normalizeShortcut } from '../utils/quizEngine';
import { QuizQuestion, QuizStats, QuizResult, ShortcutData } from '../types';
import { ALWAYS_PROTECTED_SHORTCUTS, FULLSCREEN_PREVENTABLE_SHORTCUTS } from '../constants/systemProtectedShortcuts';
import { isModifierKey } from '../utils/keyUtils';
import { isSequentialShortcut, SequentialKeyRecorder, getSequentialKeys } from '../utils/sequentialShortcuts'; // Updated import
import { useAppContext } from './AppContext';


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
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'TIMEOUT' }
  | { type: 'FINISH_QUIZ' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'UPDATE_PRESSED_KEYS'; payload: Set<string> } // ★ 追加
  | { type: 'UPDATE_SEQUENTIAL_PROGRESS'; payload: string[] }; // ★ 追加: 順押し途中経過を更新

interface QuizContextType {
  quizState: QuizState;
  dispatch: Dispatch<QuizAction>;
  startQuiz: (app: string, isFullscreen: boolean, keyboardLayout: string, difficulty?: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange') => void;
  handleAnswer: (pressedCodes: Set<string>) => void;
  getNextQuestion: () => void;
  updateFullscreen: (isFullscreen: boolean) => void;
  handleKeyPress: (pressedKeys: Set<string>) => void; // ★ 追加
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
        question: state.currentQuestion!.question,
        correctShortcut: state.currentQuestion!.correctShortcut,
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
    case 'UPDATE_TIMER':
      return {
        ...state,
        timeRemaining: action.payload,
      };
    case 'TIMEOUT':
      return {
        ...state,
        showAnswer: true,
        lastAnswerResult: 'incorrect',
        lastWrongAnswer: '（時間切れ）', // ★ 追加
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
  
  // ★ 回答判定のためのロジックをコンテキスト内に移動
  const previousPressedKeysRef = useRef(new Set());
  const cooldownRef = useRef(false);
  const sequentialKeyRecorderRef = useRef(new SequentialKeyRecorder());

  // 回答を処理する
  const handleAnswer = useCallback((pressedKeys) => {
    if (quizState.status !== 'playing' || !quizState.currentQuestion || quizState.showAnswer) {
      return;
    }
    const answerTimeMs = Date.now() - quizState.questionStartTime;
    const userAnswer = normalizePressedKeys(pressedKeys, quizState.keyboardLayout);
    const isCorrect = checkAnswer(userAnswer, quizState.currentQuestion.normalizedCorrectShortcut);
    dispatch({ type: 'ANSWER_QUESTION', payload: { userAnswer, isCorrect, answerTimeMs } });
  }, [quizState.status, quizState.currentQuestion, quizState.questionStartTime, quizState.showAnswer]);

  // ★ キー入力の変更をハンドリングするuseEffect
  useEffect(() => {
    if (quizState.status !== 'playing' || quizState.showAnswer || cooldownRef.current) {
      return;
    }

    const previousKeys = previousPressedKeysRef.current;
    const currentKeys = quizState.pressedKeys;

    if (currentKeys.size > 0) {
      previousPressedKeysRef.current = new Set(currentKeys);
    }

    if (previousKeys.size > 0) {
      const releasedKeys: string[] = (Array.from(previousKeys) as string[]).filter((key: string) => !currentKeys.has(key));

      if (releasedKeys.length > 0) {
        const hasNonModifierReleased = releasedKeys.some((key: string) => !isModifierKey(key));

        if (hasNonModifierReleased) {
          const currentQuestion = quizState.currentQuestion;
          const isSequential = currentQuestion && isSequentialShortcut(currentQuestion.correctShortcut, currentQuestion.appId);

          if (isSequential && currentQuestion && quizState.keyboardLayout) { // Check keyboardLayout is not null
            const correctSequentialKeys = getSequentialKeys(currentQuestion.correctShortcut);
            // Identify the non-modifier key that was released
            const releasedNonModifierKeys: string[] = releasedKeys.filter((key: string) => !isModifierKey(key));

            if (releasedNonModifierKeys.length > 0) {
              // Assuming only one non-modifier key is released at a time for sequential input
              const lastReleasedKey = releasedNonModifierKeys[releasedNonModifierKeys.length - 1];
              // Normalize the released key using normalizePressedKeys for consistency with how shortcuts are stored
              // We create a new Set for the single key to pass to normalizePressedKeys
              const normalizedReleasedKey = normalizePressedKeys(new Set([lastReleasedKey]), quizState.keyboardLayout);

              // Add the normalized key to the sequential recorder
              const currentSequence = sequentialKeyRecorderRef.current.addKey(normalizedReleasedKey);

              // ★ 追加: 途中経過を更新
              dispatch({ type: 'UPDATE_SEQUENTIAL_PROGRESS', payload: currentSequence });

              // Check if the current sequence matches the full correct sequence
              if (sequentialKeyRecorderRef.current.matches(correctSequentialKeys)) {
                const answerTimeMs = Date.now() - (quizState.questionStartTime || Date.now());
                // Correct sequential answer: join the sequence to form the userAnswer string
                const userAnswer = currentSequence.join('+');
                dispatch({ type: 'ANSWER_QUESTION', payload: { userAnswer, isCorrect: true, answerTimeMs } });
                sequentialKeyRecorderRef.current.reset(); // Reset after correct answer
                previousPressedKeysRef.current = new Set(); // Clear pressed keys
              } else if (!sequentialKeyRecorderRef.current.isPartialMatch(correctSequentialKeys)) {
                // If it's not a partial match, the sequence is wrong or too long
                const answerTimeMs = Date.now() - (quizState.questionStartTime || Date.now());
                const userAnswer = currentSequence.join('+');
                dispatch({ type: 'ANSWER_QUESTION', payload: { userAnswer, isCorrect: false, answerTimeMs } });
                sequentialKeyRecorderRef.current.reset(); // Reset after incorrect answer
                previousPressedKeysRef.current = new Set(); // Clear pressed keys
              }
              // If it's a partial match, do nothing and wait for the next key
            }
            previousPressedKeysRef.current = new Set(currentKeys); // Keep tracking for next press
          } else {
            // Standard multi-key shortcut logic (original logic)
            handleAnswer(previousKeys);
            previousPressedKeysRef.current = new Set();
          }
        } else {
          previousPressedKeysRef.current = new Set(currentKeys);
        }
      }
    }
  }, [quizState.pressedKeys, quizState.status, quizState.showAnswer, quizState.currentQuestion, handleAnswer]);
  
  // ★ 問題切り替え時のクールダウン
  useEffect(() => {
    if (quizState.status === 'playing' && quizState.currentQuestion && !quizState.showAnswer) {
      cooldownRef.current = true;
      previousPressedKeysRef.current = new Set();
      dispatch({ type: 'UPDATE_PRESSED_KEYS', payload: new Set() });

      const timer = setTimeout(() => {
        cooldownRef.current = false;
      }, 300);

      return () => clearTimeout(timer);
    }
    // Also reset sequential recorder if quiz is not playing
    sequentialKeyRecorderRef.current.reset();
  }, [quizState.currentQuestion, quizState.showAnswer, quizState.status]);

  // Reset sequential recorder on quiz state changes (new question, quiz end/reset)
  useEffect(() => {
    if (
      quizState.status === 'idle' ||
      quizState.status === 'finished' ||
      quizState.status === 'paused' ||
      (quizState.status === 'playing' && quizState.currentQuestion !== null) // When a new question is set while playing
    ) {
      sequentialKeyRecorderRef.current.reset();
    }
  }, [quizState.status, quizState.currentQuestion]);

  // ★ タイマーロジック
  useEffect(() => {
    if (quizState.status !== 'playing' || !quizState.currentQuestion || quizState.showAnswer) {
      return;
    }

    const timer = setInterval(() => {
      const newTime = Math.max(0, quizState.timeRemaining - 0.1);

      if (newTime <= 0) {
        dispatch({ type: 'TIMEOUT' });
      } else {
        dispatch({ type: 'UPDATE_TIMER', payload: newTime });
      }
    }, 100);

    return () => clearInterval(timer);
  }, [quizState.status, quizState.currentQuestion, quizState.timeRemaining, quizState.showAnswer]);

  const handleKeyPress = useCallback((pressedKeys: Set<string>) => {
    dispatch({ type: 'UPDATE_PRESSED_KEYS', payload: pressedKeys });
  }, []);

  const getNextQuestion = useCallback(() => {
    if (!allShortcuts || !quizState.keyboardLayout) {
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }
    if (quizState.quizHistory.length >= quizState.settings.totalQuestions) {
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }
    dispatch({ type: 'NEXT_QUESTION' });

    let compatibleApps = getCompatibleApps(quizState.keyboardLayout);
    if (quizState.selectedApp && quizState.selectedApp !== 'random' && compatibleApps.includes(quizState.selectedApp)) {
      compatibleApps = [quizState.selectedApp];
    }

    const newQuestion = generateQuestion(
      allShortcuts, compatibleApps, 'default',
      quizState.settings.isFullscreen, quizState.usedShortcuts, quizState.settings.difficulty
    );

    if (newQuestion) {
      dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion } });
    } else {
      dispatch({ type: 'FINISH_QUIZ' });
    }
  }, [allShortcuts, quizState.keyboardLayout, quizState.settings.isFullscreen, quizState.selectedApp, quizState.quizHistory.length, quizState.settings.totalQuestions, quizState.usedShortcuts, quizState.settings.difficulty]);

  const startQuiz = useCallback((app: string, isFullscreen: boolean, keyboardLayout: string, difficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' = 'standard') => {
    if (!allShortcuts) {
      console.error('Shortcuts data not loaded yet');
      return;
    }
    dispatch({ type: 'START_QUIZ', payload: { app, isFullscreen, keyboardLayout, difficulty } });
    setTimeout(() => {
      let compatibleApps = getCompatibleApps(keyboardLayout);
      if (app !== 'random' && compatibleApps.includes(app)) {
        compatibleApps = [app];
      }
      const newQuestion = generateQuestion(
        allShortcuts, compatibleApps, 'default', isFullscreen, new Set(), difficulty
      );
      if (newQuestion) {
        dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion } });
      } else {
        dispatch({ type: 'FINISH_QUIZ' });
      }
    }, 0);
  }, [allShortcuts]);

  const handleAnswerInternal = useCallback((pressedKeys) => {
    if (quizState.status !== 'playing' || !quizState.currentQuestion || quizState.showAnswer) return;
    const answerTimeMs = Date.now() - quizState.questionStartTime;
    const userAnswer = normalizePressedKeys(pressedKeys, quizState.keyboardLayout);
    const isCorrect = checkAnswer(userAnswer, quizState.currentQuestion.normalizedCorrectShortcut);
    dispatch({ type: 'ANSWER_QUESTION', payload: { userAnswer, isCorrect, answerTimeMs } });
  }, [quizState.status, quizState.currentQuestion, quizState.questionStartTime, quizState.showAnswer]);

  const updateFullscreen = useCallback((isFullscreen: boolean) => {
    dispatch({ type: 'UPDATE_FULLSCREEN', payload: { isFullscreen } });
    if (quizState.status === 'playing' && quizState.currentQuestion) {
      const normalizedShortcut = quizState.currentQuestion.normalizedCorrectShortcut;
      const normalizedAlwaysProtected = new Set(Array.from(ALWAYS_PROTECTED_SHORTCUTS).map(s => normalizeShortcut(s)));
      const normalizedFullscreenPreventable = new Set(Array.from(FULLSCREEN_PREVENTABLE_SHORTCUTS).map(s => normalizeShortcut(s)));

      if (normalizedAlwaysProtected.has(normalizedShortcut)) {
        getNextQuestion();
        return;
      }
      if (!isFullscreen && normalizedFullscreenPreventable.has(normalizedShortcut)) {
        getNextQuestion();
      }
    }
  }, [quizState.status, quizState.currentQuestion, getNextQuestion]);

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
    handleAnswer: handleAnswerInternal,
    getNextQuestion,
    updateFullscreen,
    handleKeyPress, // ★ 追加
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

import { QuizQuestion, ShortcutDifficulty } from '../types';
import { TIMINGS } from '../constants/timings';
import { DIFFICULTIES } from '../constants/shortcuts';

export interface QuizSettings {
  quizMode: 'default' | 'hardcore';
  difficulty: ShortcutDifficulty;
  timeLimit: number;
  totalQuestions: number;
  isFullscreen: boolean;
  customShortcutIds?: number[] | null;
}

export interface QuizHistoryEntry {
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
  lastWrongAnswer: string | null;
  showAnswer: boolean;
  score: number;
  quizHistory: QuizHistoryEntry[];
  usedShortcuts: Set<string>;
  startTime: number | null;
  endTime: number | null;
  settings: QuizSettings;
  pressedKeys: Set<string>;
  currentSequentialProgress: string[];
}

export type QuizAction =
  | { type: 'START_QUIZ'; payload: { app: string; keyboardLayout: string; isFullscreen: boolean; difficulty: ShortcutDifficulty; customShortcutIds?: number[] | null } }
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
  | { type: 'UPDATE_PRESSED_KEYS'; payload: Set<string> }
  | { type: 'UPDATE_SEQUENTIAL_PROGRESS'; payload: string[] }
  | { type: 'CLEAR_USED_SHORTCUTS' };

export const initialQuizState: QuizState = {
  status: 'idle',
  selectedApp: null,
  keyboardLayout: null,
  currentQuestion: null,
  questionStartTime: null,
  timeRemaining: TIMINGS.DEFAULT_TIME_LIMIT_S,
  lastAnswerResult: null,
  lastWrongAnswer: null,
  showAnswer: false,
  score: 0,
  quizHistory: [],
  usedShortcuts: new Set(),
  startTime: null,
  endTime: null,
  settings: {
    quizMode: 'default',
    difficulty: DIFFICULTIES.STANDARD,
    timeLimit: TIMINGS.DEFAULT_TIME_LIMIT_S,
    totalQuestions: 10,
    isFullscreen: false,
    customShortcutIds: null,
  },
  pressedKeys: new Set(),
  currentSequentialProgress: [],
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
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
          customShortcutIds: action.payload.customShortcutIds || null,
          totalQuestions: action.payload.customShortcutIds 
            ? action.payload.customShortcutIds.length 
            : state.settings.totalQuestions,
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

      const historyEntry: QuizHistoryEntry = {
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
        lastWrongAnswer: isCorrect ? null : userAnswer,
        showAnswer: true,
        quizHistory: [...state.quizHistory, historyEntry],
        pressedKeys: new Set(),
        currentSequentialProgress: [],
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
        lastWrongAnswer: null,
        pressedKeys: new Set(),
        currentSequentialProgress: [],
      };
    case 'UPDATE_PRESSED_KEYS':
      return {
        ...state,
        pressedKeys: action.payload,
      };
    case 'UPDATE_SEQUENTIAL_PROGRESS':
      return {
        ...state,
        currentSequentialProgress: action.payload,
      };
    case 'CLEAR_USED_SHORTCUTS':
      return {
        ...state,
        usedShortcuts: new Set(),
      };
    default:
      return state;
  }
}

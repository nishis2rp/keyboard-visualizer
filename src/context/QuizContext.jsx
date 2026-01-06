import React, { createContext, useReducer, useContext, useCallback } from 'react';
import { generateQuestion, checkAnswer, normalizePressedKeys } from '../utils/quizEngine';
import { allShortcuts } from '../data/shortcuts'; // 全ショートカットデータ

// --- 1. Contextの作成 ---
const QuizContext = createContext();

// --- 2. 初期状態の定義 ---
const initialQuizState = {
  status: 'idle', // 'idle', 'playing', 'paused', 'finished'
  selectedApp: null,
  currentQuestion: null,
  score: 0,
  combo: 0,
  maxCombo: 0,
  mistakes: 0,
  quizHistory: [], // { question: string, userAnswer: string, correctAnswer: string, isCorrect: boolean }
  startTime: null,
  endTime: null,
  settings: {
    quizMode: 'default', // 'default' or 'hardcore'
    timeLimit: 10000, // 10秒
    isFullscreen: false, // フルスクリーンモードかどうか
  },
  // useKeyboardShortcuts からの pressedKeys と keyNameMap をここで管理しない
  // これらは QuizProvider の外部から渡されるか、useKeyboardShortcutsフック自体が提供する
};

// --- 3. Reducer関数の定義 ---
function quizReducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialQuizState, // 初期状態に戻す
        status: 'playing',
        selectedApp: action.payload.app,
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
      };
    case 'ANSWER_QUESTION': {
      const { userAnswer, isCorrect } = action.payload;
      const newScore = state.score + (isCorrect ? 1 : 0);
      const newMistakes = state.mistakes + (isCorrect ? 0 : 1);
      const newCombo = isCorrect ? state.combo + 1 : 0;
      const newMaxCombo = Math.max(state.maxCombo, newCombo);

      const historyEntry = {
        question: state.currentQuestion.question,
        correctShortcut: state.currentQuestion.correctShortcut,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
      };

      return {
        ...state,
        score: newScore,
        mistakes: newMistakes,
        combo: newCombo,
        maxCombo: newMaxCombo,
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
    default:
      return state;
  }
}

// --- 4. Providerコンポーネント ---
export function QuizProvider({ children }) {
  const [quizState, dispatch] = useReducer(quizReducer, initialQuizState);

  // 次の問題を生成してセットする関数
  const getNextQuestion = useCallback(() => {
    if (!quizState.selectedApp) {
      console.warn("アプリが選択されていません。");
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }
    
    const appShortcuts = allShortcuts[quizState.selectedApp];
    const newQuestion = generateQuestion(
      appShortcuts,
      quizState.settings.quizMode,
      quizState.settings.isFullscreen
    );

    if (newQuestion) {
      dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion } });
    } else {
      // 問題が生成できない場合、クイズを終了
      dispatch({ type: 'FINISH_QUIZ' });
    }
  }, [quizState.selectedApp, quizState.settings.quizMode, quizState.settings.isFullscreen]);


  // クイズを開始する
  const startQuiz = useCallback((app, isFullscreen) => {
    dispatch({ type: 'START_QUIZ', payload: { app, isFullscreen } });
    // 最初の一問を生成
    // startQuiz後にselectedAppが設定されるため、getNextQuestion内でallShortcuts[app]が正しく参照される
    setTimeout(() => { // state更新が反映されるのを待つ
      const appShortcuts = allShortcuts[app];
      const newQuestion = generateQuestion(
        appShortcuts,
        quizState.settings.quizMode,
        isFullscreen
      );
      if (newQuestion) {
        dispatch({ type: 'SET_QUESTION', payload: { question: newQuestion } });
      } else {
        dispatch({ type: 'FINISH_QUIZ' });
      }
    }, 0);
  }, [quizState.settings.quizMode]); // isFullscreenはstartQuizの引数で渡される


  // 回答を処理する
  const handleAnswer = useCallback((pressedKeys, keyNameMap) => {
    if (quizState.status !== 'playing' || !quizState.currentQuestion) {
      return;
    }

    const userAnswer = normalizePressedKeys(pressedKeys, keyNameMap);
    const isCorrect = checkAnswer(userAnswer, quizState.currentQuestion.normalizedCorrectShortcut);

    dispatch({ type: 'ANSWER_QUESTION', payload: { userAnswer, isCorrect } });
    getNextQuestion(); // 次の問題へ
  }, [quizState.status, quizState.currentQuestion, getNextQuestion]);

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

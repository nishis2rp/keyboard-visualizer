import { useEffect, useRef, useCallback } from 'react';
import { isModifierKey, isWindowsKey } from '../utils/keyUtils';
import { SequentialKeyRecorder, getSequentialKeys } from '../utils/sequentialShortcuts';
import { normalizePressedKeys, checkAnswer, normalizeShortcut } from '../utils/quizEngine';
import { QuizAction, QuizState } from '../context/QuizContext';
import { QuizQuestion, RichShortcut } from '../types';

interface UseQuizInputHandlerProps {
  quizState: QuizState; // 型を明確化
  dispatch: React.Dispatch<QuizAction>;
  getNextQuestion: () => void;
  richShortcuts: RichShortcut[]; // 追加
}

export const useQuizInputHandler = ({ quizState, dispatch, getNextQuestion, richShortcuts }: UseQuizInputHandlerProps) => {
  const previousPressedKeysRef = useRef<Set<string>>(new Set());
  const cooldownRef = useRef<boolean>(false);
  const sequentialKeyRecorderRef = useRef<SequentialKeyRecorder>(new SequentialKeyRecorder());

  // ★ 順押しショートカットの処理
  const handleSequentialShortcut = useCallback((releasedKeys: string[], previousKeys: Set<string>) => {
    const { currentQuestion, keyboardLayout, questionStartTime } = quizState;
    if (!currentQuestion || !keyboardLayout || !questionStartTime) return;

    const correctSequentialKeys = getSequentialKeys(currentQuestion.correctShortcut);
    const releasedNonModifierKeys = releasedKeys.filter((key: string) => !isModifierKey(key));

    if (releasedNonModifierKeys.length > 0) {
      const lastReleasedKey = releasedNonModifierKeys[releasedNonModifierKeys.length - 1];
      const normalizedReleasedKey = normalizePressedKeys(new Set([lastReleasedKey]), keyboardLayout);
      const currentSequence = sequentialKeyRecorderRef.current.addKey(normalizedReleasedKey);

      // 途中経過を更新
      dispatch({ type: 'UPDATE_SEQUENTIAL_PROGRESS', payload: currentSequence });

      // 完全一致チェック
      if (sequentialKeyRecorderRef.current.matches(correctSequentialKeys)) {
        const answerTimeMs = Date.now() - questionStartTime;
        const userAnswer = currentSequence.join(' + ');
        dispatch({ type: 'ANSWER_QUESTION', payload: { userAnswer, isCorrect: true, answerTimeMs } });
        sequentialKeyRecorderRef.current.reset();
        previousPressedKeysRef.current = new Set();
      } else if (!sequentialKeyRecorderRef.current.isPartialMatch(correctSequentialKeys)) {
        // 部分一致でない場合は不正解
        const answerTimeMs = Date.now() - questionStartTime;
        const userAnswer = currentSequence.join(' + ');
        dispatch({ type: 'ANSWER_QUESTION', payload: { userAnswer, isCorrect: false, answerTimeMs } });
        sequentialKeyRecorderRef.current.reset();
        previousPressedKeysRef.current = new Set();
      }
    }
  }, [quizState.currentQuestion, quizState.keyboardLayout, quizState.questionStartTime, dispatch]); // dispatchを依存配列に追加

  // ★ 通常ショートカットの処理
  const handleStandardShortcut = useCallback((pressedKeys: Set<string>) => {
    const { currentQuestion, keyboardLayout, questionStartTime } = quizState;
    if (!currentQuestion || !keyboardLayout || !questionStartTime) return;

    const answerTimeMs = Date.now() - questionStartTime;
    const userAnswer = normalizePressedKeys(pressedKeys, keyboardLayout);
    const isCorrect = checkAnswer(userAnswer, currentQuestion.normalizedCorrectShortcut, richShortcuts, keyboardLayout);

    dispatch({ type: 'ANSWER_QUESTION', payload: { userAnswer, isCorrect, answerTimeMs } });
    previousPressedKeysRef.current = new Set();
  }, [quizState.currentQuestion, quizState.keyboardLayout, quizState.questionStartTime, dispatch]); // dispatchを依存配列に追加

  // ★ キー入力の変更をハンドリングするuseEffect
  useEffect(() => {
    // クイズが進行中でなく、回答が表示されている、またはクールダウン中の場合は何もしない
    if (quizState.status !== 'playing' || quizState.showAnswer || cooldownRef.current) {
      return;
    }

    const previousKeys = previousPressedKeysRef.current;
    const currentKeys = quizState.pressedKeys;

    // 現在押されているキーを記録
    if (currentKeys.size > 0) {
      previousPressedKeysRef.current = new Set(currentKeys);
    }

    // キーがリリースされた場合の処理
    if (previousKeys.size > 0) {
      const releasedKeys = Array.from(previousKeys).filter((key: string) => !currentKeys.has(key));

      if (releasedKeys.length > 0) {
        const hasNonModifierReleased = releasedKeys.some((key: string) => !isModifierKey(key));
        const hasWindowsKeyReleased = releasedKeys.some((key: string) => isWindowsKey(key));

        // Winキー単独でリリースされた場合の特別処理
        // ただし、他のキーがまだ押されている場合は組み合わせショートカットなので判定しない
        if (hasWindowsKeyReleased && previousKeys.size === 1 && !hasNonModifierReleased && currentKeys.size === 0) {
          handleStandardShortcut(previousKeys);
          return;
        }

        // 非修飾キーがリリースされた場合
        if (hasNonModifierReleased) {
          const { currentQuestion } = quizState;
          const isSequential = currentQuestion && currentQuestion.press_type === 'sequential';

          if (isSequential) {
            handleSequentialShortcut(releasedKeys, previousKeys);
          } else {
            handleStandardShortcut(previousKeys);
          }
        } else {
          // 修飾キーのみがリリースされた場合は、次のキー入力を待つ
          previousPressedKeysRef.current = new Set(currentKeys);
        }
      }
    }
  }, [quizState.pressedKeys, quizState.status, quizState.showAnswer, quizState.currentQuestion, handleSequentialShortcut, handleStandardShortcut]);
  
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
  }, [quizState.currentQuestion, quizState.showAnswer, quizState.status, dispatch]);

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

};
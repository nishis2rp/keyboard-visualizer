import React, { useEffect, useRef } from 'react';
import QuestionCard from './Quiz/QuestionCard';
import ScoreBoard from './Quiz/ScoreBoard';
import ResultModal from './Quiz/ResultModal';
import SystemShortcutWarning from './SystemShortcutWarning';
import KeyboardLayout from './KeyboardLayout/KeyboardLayout';
import { useQuiz } from '../context/QuizContext';
import { useAppContext } from '../context/AppContext';
import { useKeyboardShortcuts } from '../hooks';
import { useFullscreen } from '../hooks';
import { detectOS } from '../constants';
import { specialKeys } from '../constants/keys';
import { isModifierKey } from '../utils/keyUtils';
import '../styles/quiz.css';

const QuizModeView = () => {
  const { isFullscreenMode } = useFullscreen();
  const { selectedApp, keyboardLayout, shortcutDescriptions, quizApp, quizDifficulty } = useAppContext();
  const { quizState, startQuiz, handleAnswer, getNextQuestion, dispatch, updateFullscreen } = useQuiz();

  const { pressedKeys } = useKeyboardShortcuts(shortcutDescriptions, keyboardLayout, true);

  // 回答判定用: キーが離されたときに判定するため、前回のpressedKeysをキャッシュ
  const previousPressedKeysRef = useRef(new Set());

  // 問題切り替え時のクールダウン（キー入力を一時的に無視）
  const cooldownRef = useRef(false);

  const openMacWarningModalRef = useRef(null);
  const onMacWarningModalRequest = (openModalFunc) => {
    openMacWarningModalRef.current = openModalFunc;
  };

  // 初回マウント時のみクイズを開始
  useEffect(() => {
    const os = detectOS();
    if (os === 'macos' && openMacWarningModalRef.current) {
      openMacWarningModalRef.current();
    }
    // quizAppを渡す（nullの場合はselectedAppを使用）
    startQuiz(quizApp || selectedApp, isFullscreenMode, keyboardLayout, (quizDifficulty as 'basic' | 'standard' | 'madmax') || 'standard');

    return () => {
      dispatch({ type: 'RESET_QUIZ' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // マウント時のみ実行

  // フルスクリーン状態の変更を監視
  useEffect(() => {
    if (quizState.status === 'playing') {
      updateFullscreen(isFullscreenMode);
    }
  }, [isFullscreenMode, quizState.status, updateFullscreen]);


  // handleAnswerとgetNextQuestionをRefに保存して無限ループを防ぐ
  const handleAnswerRef = useRef(handleAnswer);
  const getNextQuestionRef = useRef(getNextQuestion);
  useEffect(() => {
    handleAnswerRef.current = handleAnswer;
    getNextQuestionRef.current = getNextQuestion;
  }, [handleAnswer, getNextQuestion]);

  // 問題が切り替わったときにクールダウンを設定
  useEffect(() => {
    if (quizState.status === 'playing' && quizState.currentQuestion && !quizState.showAnswer) {
      // 新しい問題が表示されたとき、300msのクールダウンを設定
      cooldownRef.current = true;
      previousPressedKeysRef.current = new Set(); // キー状態をクリア

      const timer = setTimeout(() => {
        cooldownRef.current = false;
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [quizState.currentQuestion, quizState.showAnswer, quizState.status]);

  // 回答判定ロジック: 非修飾キーが離されたときに判定
  useEffect(() => {
    if (quizState.status !== 'playing' || quizState.showAnswer || cooldownRef.current) {
      return; // クールダウン中は判定しない
    }

    const previousKeys = previousPressedKeysRef.current;
    const currentKeys = pressedKeys;

    // キーが押されている場合、キャッシュに保存
    if (currentKeys.size > 0) {
      previousPressedKeysRef.current = new Set(currentKeys);
    }

    // キーが離されたかチェック
    if (previousKeys.size > 0) {
      // 前回押されていたキーの中で、今回押されていないキーを探す
      const releasedKeys = Array.from(previousKeys).filter(key => !currentKeys.has(key));

      if (releasedKeys.length > 0) {
        // 離されたキーの中に非修飾キーがあれば判定
        const hasNonModifierReleased = releasedKeys.some(key => !isModifierKey(key));

        if (hasNonModifierReleased) {
          handleAnswerRef.current(previousKeys);
          previousPressedKeysRef.current = new Set(); // キャッシュをクリア
        } else {
          // 修飾キーのみが離された場合は、現在のキーでキャッシュを更新
          previousPressedKeysRef.current = new Set(currentKeys);
        }
      }
    }
  }, [pressedKeys, quizState.status, quizState.showAnswer]);

  // タイマーロジック
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
  }, [quizState.status, quizState.currentQuestion, quizState.timeRemaining, quizState.showAnswer, dispatch]);

  // →キーまたはEnterキーで次の問題へ進む
  useEffect(() => {
    if (quizState.status !== 'playing' || !quizState.showAnswer) {
      return;
    }

    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault();
        // 次の問題に進む前にキーの状態をクリア
        previousPressedKeysRef.current = new Set();
        cooldownRef.current = true; // クールダウンを即座に開始
        getNextQuestionRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [quizState.status, quizState.showAnswer]);

  const pauseQuiz = () => dispatch({ type: 'PAUSE_QUIZ' });
  const resumeQuiz = () => dispatch({ type: 'RESUME_QUIZ' });

  return (
    <>
      <SystemShortcutWarning onOpenRequest={onMacWarningModalRequest} />

      <div className="quiz-container">
        {/* コントロールパネル */}
        {quizState.status === 'playing' && (
          <div className="quiz-controls">
            <button onClick={pauseQuiz} className="quiz-button quiz-button-pause">
              ⏸️ 一時停止
            </button>
          </div>
        )}
        {quizState.status === 'paused' && (
          <div className="quiz-controls">
            <button onClick={resumeQuiz} className="quiz-button quiz-button-resume">
              ▶️ 再開
            </button>
          </div>
        )}

        <ScoreBoard />
        <QuestionCard pressedKeys={pressedKeys} keyboardLayout={keyboardLayout} />

        {/* キーボードビジュアライザー */}
        {(quizState.status === 'playing' || quizState.status === 'paused') && (
          <div className="quiz-keyboard-wrapper">
            <KeyboardLayout
              pressedKeys={pressedKeys}
              specialKeys={specialKeys}
              shortcutDescriptions={shortcutDescriptions}
              keyboardLayout={keyboardLayout}
            />
          </div>
        )}

        {quizState.status === 'paused' && (
          <div className="quiz-pause-overlay">
            <div className="quiz-pause-icon">⏸️</div>
            <div className="quiz-pause-text">一時停止中</div>
          </div>
        )}

        {quizState.status === 'finished' && <ResultModal />}
      </div>
    </>
  );
};

export default QuizModeView;

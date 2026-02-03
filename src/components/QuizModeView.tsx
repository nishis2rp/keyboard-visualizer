import React, { useEffect, useRef } from 'react';
import QuestionCard from './Quiz/QuestionCard';
import ScoreBoard from './Quiz/ScoreBoard';
import QuizProgressBar from './Quiz/QuizProgressBar'; // Import the new component
import ResultModal from './Quiz/ResultModal';
import SystemShortcutWarning from './SystemShortcutWarning';
import KeyboardLayout from './KeyboardLayout/KeyboardLayout';
import { useQuiz } from '../context/QuizContext';
import { useAppContext } from '../context/AppContext';
import { useKeyboardShortcuts } from '../hooks';
import { useFullscreen } from '../hooks';
import { detectOS } from '../constants';
import { specialKeys } from '../constants/keys';
import '../styles/quiz.css';

const QuizModeView = () => {
  const { isFullscreenMode } = useFullscreen();
  const { selectedApp, keyboardLayout, richShortcuts, shortcutDescriptions, quizApp, quizDifficulty } = useAppContext();
  const { quizState, startQuiz, getNextQuestion, dispatch, updateFullscreen, handleKeyPress } = useQuiz();

  const currentRichShortcuts = richShortcuts || [];
  const { pressedKeys } = useKeyboardShortcuts(currentRichShortcuts, keyboardLayout, selectedApp, true);

  const openMacWarningModalRef = useRef(null);
  const onMacWarningModalRequest = (openModalFunc) => {
    openMacWarningModalRef.current = openModalFunc;
  };

  // 初回マウント時のみクイズを開始
  useEffect(() => {
    // クイズがすでに開始されている場合はスキップ（Strict Modeでの重複実行を防ぐ）
    if (quizState.status !== 'idle') {
      return;
    }

    const os = detectOS();
    if (os === 'macos' && openMacWarningModalRef.current) {
      openMacWarningModalRef.current();
    }
    startQuiz(quizApp || selectedApp, isFullscreenMode, keyboardLayout, (quizDifficulty as 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange') || 'standard');

    return () => {
      dispatch({ type: 'RESET_QUIZ' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // フルスクリーン状態の変更を監視
  useEffect(() => {
    if (quizState.status === 'playing') {
      updateFullscreen(isFullscreenMode);
    }
  }, [isFullscreenMode, quizState.status, updateFullscreen]);

  // pressedKeysの変更をContextに通知
  useEffect(() => {
    handleKeyPress(pressedKeys);
  }, [pressedKeys, handleKeyPress]);

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

        <ScoreBoard
          status={quizState.status}
          quizHistory={quizState.quizHistory}
          settings={quizState.settings}
        />
        <QuizProgressBar
          status={quizState.status}
          quizHistory={quizState.quizHistory}
          settings={quizState.settings}
        />
        <QuestionCard pressedKeys={quizState.pressedKeys} keyboardLayout={keyboardLayout} />

        {/* キーボードビジュアライザー */}
        {(quizState.status === 'playing' || quizState.status === 'paused') && (
          <div className="quiz-keyboard-wrapper">
            <KeyboardLayout
              pressedKeys={quizState.pressedKeys}
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

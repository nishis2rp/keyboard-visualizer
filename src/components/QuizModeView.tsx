import React, { useEffect, useRef, useMemo } from 'react';
import QuestionCard from './Quiz/QuestionCard';
import ScoreBoard from './Quiz/ScoreBoard';
import QuizProgressBar from './Quiz/QuizProgressBar'; // Import the new component
import ResultModal from './Quiz/ResultModal';
import SystemShortcutWarning from './SystemShortcutWarning';
import KeyboardLayout from './KeyboardLayout/KeyboardLayout';
import { useQuiz } from '../context/QuizContext';
import { useSettings, useUI, useShortcutData } from '../context';
import { useLanguage } from '../context/LanguageContext';
import { useKeyboardShortcuts } from '../hooks';
import { useFullscreen } from '../hooks';
import { detectOS } from '../constants';
import { specialKeys } from '../constants/keys';
import { ShortcutDifficulty } from '../types';
import '../styles/quiz.css';

const QuizModeView = () => {
  const { isFullscreenMode } = useFullscreen();
  const { selectedApp, keyboardLayout } = useSettings();
  const { quizApp, quizDifficulty } = useUI();
  const { allShortcuts, richShortcuts } = useShortcutData();
  const { quizState, startQuiz, getNextQuestion, dispatch, updateFullscreen, handleKeyPress } = useQuiz();
  const { t } = useLanguage();

  const shortcutDescriptions = useMemo(
    () => allShortcuts?.[selectedApp] || {},
    [allShortcuts, selectedApp]
  );

  const currentRichShortcuts = richShortcuts || [];
  const { pressedKeys } = useKeyboardShortcuts(currentRichShortcuts, keyboardLayout, selectedApp, shortcutDescriptions, true);

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
    startQuiz(quizApp || selectedApp, isFullscreenMode, keyboardLayout, (quizDifficulty as ShortcutDifficulty) || 'standard');

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
          <div className="quiz-controls">
            {quizState.status === 'playing' && (
              <button onClick={pauseQuiz} className="quiz-button quiz-button-pause">
                ⏸️ {t.quiz.pause}
              </button>
            )}
            {quizState.status === 'paused' && (
              <button onClick={resumeQuiz} className="quiz-button quiz-button-resume">
                ▶️ {t.quiz.resume}
              </button>
            )}
          </div>

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

        <QuestionCard />

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
            <div className="quiz-pause-text">{t.quiz.paused}</div>
          </div>
        )}

        {quizState.status === 'finished' && <ResultModal />}
      </div>
    </>
  );
};

export default QuizModeView;

import React, { useEffect, useRef } from 'react';
import QuestionCard from './Quiz/QuestionCard';
import ScoreBoard from './Quiz/ScoreBoard';
import ResultModal from './Quiz/ResultModal';
import SystemShortcutWarning from './SystemShortcutWarning';
import { useQuiz } from '../context/QuizContext';
import { useAppContext } from '../context/AppContext';
import { useKeyboardShortcuts } from '../hooks';
import { useFullscreen } from '../hooks';
import { detectOS } from '../constants';

const QuizModeView = () => {
  const { isFullscreenMode } = useFullscreen();
  const { selectedApp, keyboardLayout } = useAppContext();
  const { quizState, startQuiz, handleAnswer, dispatch } = useQuiz();
  
  const { pressedKeys } = useKeyboardShortcuts(null, keyboardLayout, true);

  const openMacWarningModalRef = useRef(null);
  const onMacWarningModalRequest = (openModalFunc) => {
    openMacWarningModalRef.current = openModalFunc;
  };

  useEffect(() => {
    const os = detectOS();
    if (os === 'macos' && openMacWarningModalRef.current) {
      openMacWarningModalRef.current();
    }
    startQuiz(selectedApp, isFullscreenMode);

    return () => {
      dispatch({ type: 'RESET_QUIZ' });
    };
  }, [selectedApp, isFullscreenMode, startQuiz, dispatch]);

  useEffect(() => {
    if (pressedKeys.size > 0 && quizState.status === 'playing') {
      handleAnswer(pressedKeys, keyboardLayout);
    }
  }, [pressedKeys, keyboardLayout, quizState.status, handleAnswer]);

  return (
    <>
      <SystemShortcutWarning onOpenRequest={onMacWarningModalRequest} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)' }}>
        <ScoreBoard />
        <QuestionCard />
        {quizState.status === 'finished' && <ResultModal />}
      </div>
    </>
  );
};

export default QuizModeView;

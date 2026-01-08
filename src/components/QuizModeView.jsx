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
  const { quizState, startQuiz, handleAnswer, getNextQuestion, dispatch } = useQuiz();
  
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

  // タイマーロジック
  useEffect(() => {
    if (quizState.status !== 'playing' || !quizState.currentQuestion) {
      return;
    }

    const timer = setInterval(() => {
      const newTime = quizState.timeRemaining - 0.1;

      if (newTime <= 0) {
        dispatch({ type: 'TIMEOUT' });
        // 次の問題へ
        setTimeout(() => {
          getNextQuestion();
        }, 500);
      } else {
        dispatch({ type: 'UPDATE_TIMER', payload: newTime });
      }
    }, 100);

    return () => clearInterval(timer);
  }, [quizState.status, quizState.currentQuestion, quizState.timeRemaining, dispatch, getNextQuestion]);

  const pauseQuiz = () => dispatch({ type: 'PAUSE_QUIZ' });
  const resumeQuiz = () => dispatch({ type: 'RESUME_QUIZ' });

  // キー表示用のヘルパー関数
  const getKeyComboText = () => {
    if (pressedKeys.size === 0) return '';
    const keys = Array.from(pressedKeys);
    return keys.map(code => {
      if (code.startsWith('Control')) return 'Ctrl';
      if (code.startsWith('Shift')) return 'Shift';
      if (code.startsWith('Alt')) return 'Alt';
      if (code.startsWith('Meta')) return 'Cmd';
      return code.replace(/^(Key|Digit)/, '');
    }).join(' + ');
  };

  return (
    <>
      <SystemShortcutWarning onOpenRequest={onMacWarningModalRequest} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)', position: 'relative' }}>
        {/* コントロールパネル */}
        {quizState.status === 'playing' && (
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={pauseQuiz}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: '#fbbf24',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ⏸️ 一時停止
            </button>
          </div>
        )}
        {quizState.status === 'paused' && (
          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <button
              onClick={resumeQuiz}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: '#4ade80',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ▶️ 再開
            </button>
          </div>
        )}

        <ScoreBoard />
        <QuestionCard />

        {/* キー入力表示 */}
        {pressedKeys.size > 0 && quizState.status === 'playing' && (
          <div
            style={{
              marginTop: '20px',
              padding: '15px 30px',
              backgroundColor: 'rgba(59, 130, 246, 0.3)',
              border: '2px solid #3b82f6',
              borderRadius: '10px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#3b82f6',
              minWidth: '200px',
              textAlign: 'center',
            }}
          >
            {getKeyComboText()}
          </div>
        )}

        {quizState.status === 'paused' && (
          <div style={{
            fontSize: '2rem',
            color: '#fbbf24',
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: '40px',
          }}>
            ⏸️ 一時停止中
          </div>
        )}

        {quizState.status === 'finished' && <ResultModal />}
      </div>
    </>
  );
};

export default QuizModeView;

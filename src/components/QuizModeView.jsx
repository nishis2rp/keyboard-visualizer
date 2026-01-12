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

const QuizModeView = () => {
  const { isFullscreenMode } = useFullscreen();
  const { selectedApp, keyboardLayout } = useAppContext();
  const { quizState, startQuiz, handleAnswer, getNextQuestion, dispatch } = useQuiz();

  const { pressedKeys } = useKeyboardShortcuts(null, keyboardLayout, true);

  // デバッグ: クイズ状態をログ出力
  useEffect(() => {
    console.log('[QuizModeView] Quiz state updated:', {
      status: quizState.status,
      hasQuestion: !!quizState.currentQuestion,
      question: quizState.currentQuestion?.question,
      score: quizState.score,
      selectedApp: quizState.selectedApp
    });
  }, [quizState]);

  // 回答判定用: キーが離されたときに判定するため、前回のpressedKeysをキャッシュ
  const previousPressedKeysRef = useRef(new Set());

  const openMacWarningModalRef = useRef(null);
  const onMacWarningModalRequest = (openModalFunc) => {
    openMacWarningModalRef.current = openModalFunc;
  };

  useEffect(() => {
    console.log('[QuizModeView] Initializing quiz mode:', { selectedApp, keyboardLayout, isFullscreenMode });
    const os = detectOS();
    if (os === 'macos' && openMacWarningModalRef.current) {
      openMacWarningModalRef.current();
    }
    startQuiz(selectedApp, isFullscreenMode, keyboardLayout);

    return () => {
      console.log('[QuizModeView] Cleanup - resetting quiz');
      dispatch({ type: 'RESET_QUIZ' });
    };
  }, [selectedApp, keyboardLayout, isFullscreenMode, startQuiz, dispatch]);

  // Auto-pause on window blur (focus loss)
  useEffect(() => {
    const handleWindowBlur = () => {
      if (quizState.status === 'playing') {
        dispatch({ type: 'PAUSE_QUIZ' });
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, [quizState.status, dispatch]);

  // 回答判定ロジック: キーが離されたときのみ判定
  useEffect(() => {
    if (quizState.status !== 'playing') {
      return;
    }

    // キーが押されている場合、キャッシュに保存
    if (pressedKeys.size > 0) {
      console.log('[QuizModeView] Keys pressed:', Array.from(pressedKeys));
      previousPressedKeysRef.current = new Set(pressedKeys);
    }
    // 全てのキーが離された場合、キャッシュされたキーで判定
    else if (pressedKeys.size === 0 && previousPressedKeysRef.current.size > 0) {
      console.log('[QuizModeView] Keys released, judging:', Array.from(previousPressedKeysRef.current));
      handleAnswer(previousPressedKeysRef.current);
      previousPressedKeysRef.current = new Set(); // キャッシュをクリア
    }
  }, [pressedKeys, quizState.status, handleAnswer]);

  // タイマーロジック
  useEffect(() => {
    if (quizState.status !== 'playing' || !quizState.currentQuestion) {
      return;
    }

    const timer = setInterval(() => {
      const newTime = Math.max(0, quizState.timeRemaining - 0.1);

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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 60px)',
        position: 'relative',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '20px',
        overflow: 'auto',
      }}>

        {/* デバッグ情報表示 */}
        {quizState.currentQuestion && (
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '10px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#0f0',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            maxWidth: '350px',
            border: '1px solid #0f0',
            zIndex: 1000,
          }}>
            <div style={{ color: '#ff0', marginBottom: '8px', fontWeight: 'bold' }}>DEBUG INFO</div>
            <div>正解: {quizState.currentQuestion.correctShortcut}</div>
            <div>正規化済: {quizState.currentQuestion.normalizedCorrectShortcut}</div>
            {quizState.quizHistory.length > 0 && (
              <>
                <div style={{ marginTop: '8px', color: '#ff0' }}>最後の回答:</div>
                <div>入力: {quizState.quizHistory[quizState.quizHistory.length - 1].userAnswer}</div>
                <div>結果: {quizState.quizHistory[quizState.quizHistory.length - 1].isCorrect ? '✅ 正解' : '❌ 不正解'}</div>
              </>
            )}
          </div>
        )}

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

        {/* キーボードビジュアライザー */}
        {(quizState.status === 'playing' || quizState.status === 'paused') && (
          <div style={{
            marginTop: '24px',
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <KeyboardLayout
              pressedKeys={pressedKeys}
              keyboardLayout={keyboardLayout}
            />
          </div>
        )}

        {/* キー入力表示 */}
        {pressedKeys.size > 0 && quizState.status === 'playing' && (
          <div
            style={{
              marginTop: '24px',
              padding: '24px 48px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '20px',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#60a5fa',
              minWidth: '300px',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
              animation: 'pulse 0.5s ease-in-out',
              textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
              fontFamily: 'monospace',
            }}
          >
            <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
              入力中...
            </div>
            {getKeyComboText()}
          </div>
        )}

        {quizState.status === 'paused' && (
          <div
            style={{
              background: 'rgba(251, 191, 36, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '48px 64px',
              border: '3px solid rgba(251, 191, 36, 0.5)',
              boxShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
            }}
          >
            <div style={{
              fontSize: '72px',
              textAlign: 'center',
              marginBottom: '16px',
            }}>
              ⏸️
            </div>
            <div style={{
              fontSize: '32px',
              color: '#fbbf24',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
            }}>
              一時停止中
            </div>
          </div>
        )}

        {quizState.status === 'finished' && <ResultModal />}
      </div>
    </>
  );
};

export default QuizModeView;

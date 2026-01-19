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

const QuizModeView = () => {
  const { isFullscreenMode } = useFullscreen();
  const { selectedApp, keyboardLayout, shortcutDescriptions, quizApp } = useAppContext();
  const { quizState, startQuiz, handleAnswer, getNextQuestion, dispatch, updateFullscreen } = useQuiz();

  const { pressedKeys } = useKeyboardShortcuts(shortcutDescriptions, keyboardLayout, true);

  // 回答判定用: キーが離されたときに判定するため、前回のpressedKeysをキャッシュ
  const previousPressedKeysRef = useRef(new Set());

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
    startQuiz(quizApp || selectedApp, isFullscreenMode, keyboardLayout);

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

  // 回答判定ロジック: 非修飾キーが離されたときに判定
  useEffect(() => {
    if (quizState.status !== 'playing') {
      return;
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
  }, [pressedKeys, quizState.status]);

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
          getNextQuestionRef.current();
        }, 500);
      } else {
        dispatch({ type: 'UPDATE_TIMER', payload: newTime });
      }
    }, 100);

    return () => clearInterval(timer);
  }, [quizState.status, quizState.currentQuestion, quizState.timeRemaining, dispatch]);

  const pauseQuiz = () => dispatch({ type: 'PAUSE_QUIZ' });
  const resumeQuiz = () => dispatch({ type: 'RESUME_QUIZ' });

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
        padding: '20px',
        overflow: 'auto',
      }}>

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
        <QuestionCard pressedKeys={pressedKeys} keyboardLayout={keyboardLayout} />

        {/* キーボードビジュアライザー */}
        {(quizState.status === 'playing' || quizState.status === 'paused') && (
          <div style={{
            marginTop: '32px',
            width: '100%',
            maxWidth: '1000px',
            display: 'flex',
            justifyContent: 'center',
            transform: 'scale(0.85)',
            transformOrigin: 'top center',
          }}>
            <KeyboardLayout
              pressedKeys={pressedKeys}
              specialKeys={specialKeys}
              shortcutDescriptions={shortcutDescriptions}
              keyboardLayout={keyboardLayout}
            />
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

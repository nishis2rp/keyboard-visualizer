import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { getCodeDisplayName } from '../../utils/keyMapping';

function QuestionCard({ pressedKeys = new Set(), keyboardLayout = 'windows-jis' }) {
  const { quizState } = useQuiz();
  const { currentQuestion, status, timeRemaining, settings, lastAnswerResult } = quizState;

  if (status !== 'playing' || !currentQuestion) {
    return null;
  }

  // タイマーの色を時間に応じて変更
  const getTimerColor = () => {
    const percentage = timeRemaining / settings.timeLimit;
    if (percentage > 0.5) return '#10b981'; // 緑
    if (percentage > 0.25) return '#f59e0b'; // オレンジ
    return '#ef4444'; // 赤
  };

  // プログレスバーの幅
  const getProgressWidth = () => {
    return (timeRemaining / settings.timeLimit) * 100;
  };

  // 背景グラデーションを回答結果に応じて変更
  const getBackgroundGradient = () => {
    if (lastAnswerResult === 'correct') {
      return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    }
    if (lastAnswerResult === 'incorrect') {
      return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    }
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  // キー表示用のヘルパー関数
  const getKeyComboText = () => {
    if (pressedKeys.size === 0) return '';
    const keys = Array.from(pressedKeys);
    const shiftPressed = keys.some(code => code.startsWith('Shift'));

    return keys.map(code => {
      // getCodeDisplayNameを使用してキー表示名を取得
      return getCodeDisplayName(code, null, keyboardLayout, shiftPressed);
    }).join(' + ');
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {/* メインカード */}
      <div
        style={{
          background: getBackgroundGradient(),
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          transition: 'all 0.3s ease',
          transform: lastAnswerResult ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        {/* タイマー表示 */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <span style={{ fontSize: '24px' }}>⏱️</span>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: getTimerColor(),
              fontFamily: 'monospace',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {Math.ceil(timeRemaining)}s
          </span>
        </div>

        {/* プログレスバー */}
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            marginBottom: '32px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${getProgressWidth()}%`,
              height: '100%',
              background: getTimerColor(),
              borderRadius: '4px',
              transition: 'width 0.1s linear, background-color 0.3s ease',
              boxShadow: `0 0 10px ${getTimerColor()}`,
            }}
          />
        </div>

        {/* アプリケーション名バッジ */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '12px 24px',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <span style={{ fontSize: '24px' }}>💻</span>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '1px',
            }}
          >
            {currentQuestion.appName}
          </span>
        </div>

        {/* 問題ヘッダー */}
        <div
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          📝 Question
        </div>

        {/* 問題文 */}
        <div
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            lineHeight: '1.4',
            marginBottom: '32px',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {currentQuestion.question.replace(/^【.*?】/, '')}
        </div>

        {/* 指示テキストと押したキー表示 */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px 24px',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>⌨️</span>
            <span
              style={{
                fontSize: '18px',
                color: 'white',
                fontWeight: '500',
              }}
            >
              正しいショートカットキーを押してください
            </span>
          </div>

          {/* 押したキー表示 */}
          {pressedKeys.size > 0 && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.4) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                padding: '12px 20px',
                border: '2px solid rgba(59, 130, 246, 0.6)',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
              }}
            >
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                入力中...
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#60a5fa',
                  fontFamily: 'monospace',
                  textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                }}
              >
                {getKeyComboText()}
              </div>
            </div>
          )}
        </div>

        {/* フィードバック表示 */}
        {lastAnswerResult && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '120px',
              animation: 'bounce 0.5s ease',
              pointerEvents: 'none',
            }}
          >
            {lastAnswerResult === 'correct' ? '✅' : '❌'}
          </div>
        )}
      </div>
    </div>
  );
}


export default QuestionCard;

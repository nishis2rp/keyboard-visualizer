import React from 'react';
import { useQuiz } from '../../context/QuizContext';

function QuestionCard() {
  const { quizState } = useQuiz();
  const { currentQuestion, status, timeRemaining, settings, lastAnswerResult } = quizState;

  if (status !== 'playing' || !currentQuestion) {
    return null;
  }

  // タイマーの色を時間に応じて変更
  const getTimerColor = () => {
    const percentage = timeRemaining / settings.timeLimit;
    if (percentage > 0.5) return '#4ade80'; // 緑
    if (percentage > 0.25) return '#fbbf24'; // 黄色
    return '#ef4444'; // 赤
  };

  // 背景色を回答結果に応じて変更
  const getBackgroundColor = () => {
    if (lastAnswerResult === 'correct') {
      return 'rgba(34, 197, 94, 0.3)'; // 緑
    }
    if (lastAnswerResult === 'incorrect') {
      return 'rgba(239, 68, 68, 0.3)'; // 赤
    }
    return 'rgba(255, 255, 255, 0.1)'; // デフォルト
  };

  return (
    <div
      style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: getBackgroundColor(),
        borderRadius: '10px',
        margin: '20px auto',
        maxWidth: '600px',
        color: 'white',
        position: 'relative',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: getTimerColor(),
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <span>⏱️</span>
        <span>{Math.ceil(timeRemaining)}</span>
      </div>
      <p style={{ marginTop: '10px' }}>{currentQuestion.question}</p>
    </div>
  );
}

export default QuestionCard;

import React from 'react';
import { useQuiz } from '../../context/QuizContext';

function QuestionCard() {
  const { quizState } = useQuiz();
  const { currentQuestion, status } = quizState;

  if (status !== 'playing' || !currentQuestion) {
    return null; // クイズがプレイ中でないか、問題がない場合は何も表示しない
  }

  return (
    <div
      style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        margin: '20px auto',
        maxWidth: '600px',
        color: 'white',
      }}
    >
      <p>{currentQuestion.question}</p>
    </div>
  );
}

export default QuestionCard;

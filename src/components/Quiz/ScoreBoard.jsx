import React from 'react';
import { useQuiz } from '../../context/QuizContext';

function ScoreBoard() {
  const { quizState } = useQuiz();
  const { score, mistakes, combo, maxCombo, status } = quizState;

  if (status !== 'playing' && status !== 'paused') {
    return null; // クイズがプレイ中または一時停止中でない場合は何も表示しない
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '5px',
        margin: '10px auto',
        maxWidth: '600px',
        color: 'white',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>スコア</div>
        <div style={{ fontSize: '1.5rem', color: '#0f0' }}>{score}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>ミス</div>
        <div style={{ fontSize: '1.5rem', color: '#f00' }}>{mistakes}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>コンボ</div>
        <div style={{ fontSize: '1.5rem', color: '#0ff' }}>{combo}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>最大コンボ</div>
        <div style={{ fontSize: '1.5rem', color: '#ff0' }}>{maxCombo}</div>
      </div>
    </div>
  );
}

export default ScoreBoard;

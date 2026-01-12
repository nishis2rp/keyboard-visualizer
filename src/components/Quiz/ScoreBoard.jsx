import React from 'react';
import { useQuiz } from '../../context/QuizContext';

function ScoreBoard() {
  const { quizState } = useQuiz();
  const { score, mistakes, combo, maxCombo, status, quizHistory, settings } = quizState;

  if (status !== 'playing' && status !== 'paused') {
    return null;
  }

  const totalQuestions = quizHistory.length;
  const correctAnswers = quizHistory.filter(h => h.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const StatCard = ({ icon, label, value, color, subtitle }) => (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '20px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        flex: 1,
        minWidth: '140px',
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
        }}
      >
        <span style={{ fontSize: '32px', marginRight: '8px' }}>{icon}</span>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: color,
          textAlign: 'center',
          textShadow: `0 0 20px ${color}40`,
          fontFamily: 'monospace',
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            marginTop: '8px',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto 24px auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <StatCard
          icon="⭐"
          label="Score"
          value={score}
          color="#fbbf24"
          subtitle={`${totalQuestions}問回答`}
        />
        <StatCard
          icon="🎯"
          label="Accuracy"
          value={`${accuracy}%`}
          color="#10b981"
          subtitle={`${correctAnswers}/${totalQuestions} 正解`}
        />
        <StatCard
          icon="🔥"
          label="Combo"
          value={combo}
          color="#f97316"
          subtitle={`最高 ${maxCombo}`}
        />
        <StatCard
          icon="❌"
          label="Misses"
          value={mistakes}
          color="#ef4444"
        />
      </div>
    </div>
  );
}

export default ScoreBoard;

import React from 'react';
import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  status: 'idle' | 'playing' | 'paused' | 'finished';
  quizHistory: any[]; // A more specific type would be better
  settings: { totalQuestions: number };
}

const StatCard = ({ icon, label, value, colorClass, subtitle }) => (
  <div className={styles.statCard}>
    <div className={styles.statHeader}>
      <span className={styles.statIcon}>{icon}</span>
      <div className={styles.statLabel}>{label}</div>
    </div>
    <div className={`${styles.statValue} ${colorClass}`}>{value}</div>
    {subtitle && <div className={styles.statSubtitle}>{subtitle}</div>}
  </div>
);

const ScoreBoard: React.FC<ScoreBoardProps> = ({ status, quizHistory, settings }) => {
  if (status !== 'playing' && status !== 'paused') {
    return null;
  }

  const totalQuestions = settings.totalQuestions;
  const currentQuestionNumber = quizHistory.length + 1;
  const correctAnswers = quizHistory.filter(h => h.isCorrect).length;

  return (
    <div className={styles.scoreBoardWrapper}>
      <div className={styles.statsContainer}>
        <StatCard
          icon="📝"
          label="問題"
          value={`${currentQuestionNumber}/${totalQuestions}`}
          colorClass={styles.blue}
        />
        <StatCard
          icon="✅"
          label="正解数"
          value={correctAnswers}
          colorClass={styles.green}
        />
      </div>
    </div>
  );
};

export default React.memo(ScoreBoard);

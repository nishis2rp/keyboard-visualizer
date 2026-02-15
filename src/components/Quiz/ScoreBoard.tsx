import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { QuizHistoryEntry } from '../../context/QuizReducer';
import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  status: 'idle' | 'playing' | 'paused' | 'finished';
  quizHistory: QuizHistoryEntry[];
  settings: { totalQuestions: number };
}

interface StatCardProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
  colorClass: string;
  subtitle?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClass, subtitle }) => (
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
  const { t } = useLanguage();

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
          label={t.quiz.question}
          value={`${currentQuestionNumber}/${totalQuestions}`}
          colorClass={styles.blue}
        />
        <StatCard
          icon="✅"
          label={t.quiz.results.correctAnswers}
          value={correctAnswers}
          colorClass={styles.green}
        />
      </div>
    </div>
  );
};

export default React.memo(ScoreBoard);

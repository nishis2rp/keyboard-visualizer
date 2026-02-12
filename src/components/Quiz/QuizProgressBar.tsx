import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './QuizProgressBar.module.css';

interface QuizProgressBarProps {
  status: 'idle' | 'playing' | 'paused' | 'finished';
  quizHistory: any[];
  settings: { totalQuestions: number };
}

const QuizProgressBar: React.FC<QuizProgressBarProps> = ({ status, quizHistory, settings }) => {
  const { t } = useLanguage();

  if (status !== 'playing' && status !== 'paused') {
    return null;
  }

  const currentQuestionNumber = quizHistory.length;
  const totalQuestions = settings.totalQuestions;

  // クイズ開始前は0、終了後は100%にする
  let progressPercentage = (currentQuestionNumber / totalQuestions) * 100;
  if (quizHistory.length === 0 && status === 'playing') {
      // 最初の問題
      progressPercentage = 0;
  }


  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressText}>
        {t.quiz.question} {quizHistory.length + 1} / {totalQuestions}
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default React.memo(QuizProgressBar);

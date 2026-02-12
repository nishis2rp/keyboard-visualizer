import React, { useMemo, useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useUI } from '../../context';
import { useLanguage } from '../../context/LanguageContext';
import { StyledButton } from '../common/StyledButton';
import styles from './ResultModal.module.css';

function ResultModal() {
  const { quizState, dispatch, startQuiz } = useQuiz();
  const { setShowSetup, setIsQuizMode } = useUI();
  const { t } = useLanguage();
  const { status, score, quizHistory, selectedApp, keyboardLayout, startTime, endTime, settings } = quizState;
  const [isCopied, setIsCopied] = useState(false);

  if (status !== 'finished') {
    return null; // クイズが終了していない場合は何も表示しない
  }

  // スコア計算
  const totalQuestions = quizHistory.length;
  const correctAnswers = score;

  const handleShare = () => {
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const shareText = t.quiz.results.shareText
      .replace('{app}', selectedApp)
      .replace('{correctAnswers}', correctAnswers.toString())
      .replace('{totalQuestions}', totalQuestions.toString())
      .replace('{accuracy}', accuracy.toFixed(0));

    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // 苦手なショートカットのリスト
  const difficultShortcuts = useMemo(() => {
    const incorrects = quizHistory.filter(entry => !entry.isCorrect);
    const shortcutCounts: { [key: string]: number } = {};
    incorrects.forEach(entry => {
      shortcutCounts[entry.correctShortcut] = (shortcutCounts[entry.correctShortcut] || 0) + 1;
    });

    return Object.entries(shortcutCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5) // 上位5つ
      .map(([shortcut, count]) => ({ shortcut, count }));
  }, [quizHistory]);

  const handleRetry = () => {
    dispatch({ type: 'RESET_QUIZ' });
    startQuiz(selectedApp, settings.isFullscreen, keyboardLayout);
  };

  const handleSelectOtherQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
    setShowSetup(true);
  };

  const handleBackToStart = () => {
    dispatch({ type: 'RESET_QUIZ' });
    setIsQuizMode(false);
    setShowSetup(true);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{t.quiz.results.quizComplete}</h2>

        {/* スコア詳細 */}
        <div className={styles.scoreDetails}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreLabel}>{t.quiz.results.correctAnswers}</div>
            <div className={styles.scoreValue}>{correctAnswers} / {totalQuestions}</div>
          </div>
        </div>

        {difficultShortcuts.length > 0 && (
          <div className={styles.difficultShortcutsSection}>
            <h3 className={styles.difficultShortcutsTitle}>{t.quiz.results.difficultShortcuts}</h3>
            <ul className={styles.difficultShortcutsList}>
              {difficultShortcuts.map((item, index) => (
                <li key={index} className={styles.difficultShortcutItem}>
                  <div>
                    <span className={styles.difficultShortcutKey}>{item.shortcut}</span>
                    <span style={{ marginLeft: '10px' }}>
                      {quizHistory.find(q => q.correctShortcut === item.shortcut)?.question.replace(' のショートカットは？', '').replace(/^【.*?】/, '')}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--sf-red)' }}>
                    {item.count}{t.quiz.results.mistakesCount}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.actionButtons}>
          <StyledButton
            onClick={handleRetry}
            padding="12px 25px"
            fontSize="1.2rem"
            fontWeight="bold"
            variant="success" // 新しいvariantを使用
          >
            {t.quiz.results.retryQuiz}
          </StyledButton>

          <StyledButton
            onClick={handleShare}
            padding="12px 25px"
            fontSize="1.1rem"
            fontWeight="bold"
            variant="info" // 新しいvariantを使用
          >
            {isCopied ? t.quiz.results.copied : t.quiz.results.shareResults}
          </StyledButton>

          <StyledButton
            onClick={handleSelectOtherQuiz}
            padding="12px 25px"
            fontSize="1.1rem"
            fontWeight="bold"
            variant="primary" // 新しいvariantを使用
          >
            {t.quiz.results.selectOtherQuiz}
          </StyledButton>

          <StyledButton
            onClick={handleBackToStart}
            padding="12px 25px"
            fontSize="1.1rem"
            fontWeight="bold"
            variant="secondary" // 新しいvariantを使用
          >
            {t.quiz.results.backToStart}
          </StyledButton>
        </div>
      </div>
    </div>
  );
}

export default ResultModal;

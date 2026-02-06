import React, { useMemo, useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useAppContext } from '../../context/AppContext';
import { StyledButton } from '../common/StyledButton';
import styles from './ResultModal.module.css';

function ResultModal() {
  const { quizState, dispatch, startQuiz } = useQuiz();
  const { setShowSetup, setIsQuizMode } = useAppContext();
  const { status, score, quizHistory, selectedApp, keyboardLayout, startTime, endTime, settings } = quizState;
  const [isCopied, setIsCopied] = useState(false);

  if (status !== 'finished') {
    return null; // クイズが終了していない場合は何も表示しない
  }
  
  const handleShare = () => {
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const shareText = `キーボード早打ちクイズで【${selectedApp}】のスコアは ${totalQuestions}問中${correctAnswers}問正解でした！ 正答率: ${accuracy.toFixed(0)}% #キーボードビジュアライザー`;

    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // スコア計算
  const totalQuestions = quizHistory.length;
  const correctAnswers = score;

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
        <h2 className={styles.modalTitle}>🎉 クイズ終了！</h2>

        {/* スコア詳細 */}
        <div className={styles.scoreDetails}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreLabel}>正解数</div>
            <div className={styles.scoreValue}>{correctAnswers} / {totalQuestions}</div>
          </div>
        </div>

        {difficultShortcuts.length > 0 && (
          <div className={styles.difficultShortcutsSection}>
            <h3 className={styles.difficultShortcutsTitle}>苦手なショートカット</h3>
            <ul className={styles.difficultShortcutsList}>
              {difficultShortcuts.map((item, index) => (
                <li key={index} className={styles.difficultShortcutItem}>
                  <span className={styles.difficultShortcutKey}>{item.shortcut}</span>: {quizHistory.find(q => q.correctShortcut === item.shortcut)?.question.replace(' のショートカットは？', '')} ({item.count}回間違え)
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
            🔄 もう一度挑戦
          </StyledButton>

          <StyledButton
            onClick={handleShare}
            padding="12px 25px"
            fontSize="1.1rem"
            fontWeight="bold"
            variant="info" // 新しいvariantを使用
          >
            {isCopied ? '✅ コピーしました！' : '🔗 結果をシェア'}
          </StyledButton>

          <StyledButton
            onClick={handleSelectOtherQuiz}
            padding="12px 25px"
            fontSize="1.1rem"
            fontWeight="bold"
            variant="primary" // 新しいvariantを使用
          >
            📝 他のクイズモードを選ぶ
          </StyledButton>

          <StyledButton
            onClick={handleBackToStart}
            padding="12px 25px"
            fontSize="1.1rem"
            fontWeight="bold"
            variant="secondary" // 新しいvariantを使用
          >
            🏠 スタートに戻る
          </StyledButton>
        </div>
      </div>
    </div>
  );
}

export default ResultModal;

import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { getCodeDisplayName } from '../../utils/keyMapping';
import styles from './QuestionCard.module.css';

function QuestionCard({ pressedKeys = new Set(), keyboardLayout = 'windows-jis' }) {
  const { quizState } = useQuiz();
  const { currentQuestion, status, timeRemaining, settings, lastAnswerResult } = quizState;

  if (status !== 'playing' || !currentQuestion) {
    return null;
  }

  // タイマーの色クラスを時間に応じて変更
  const getTimerClass = () => {
    const percentage = timeRemaining / settings.timeLimit;
    if (percentage > 0.5) return styles.high;
    if (percentage > 0.25) return styles.medium;
    return styles.low;
  };

  // プログレスバーの幅とクラス
  const getProgressWidth = () => (timeRemaining / settings.timeLimit) * 100;

  // カードクラスを回答結果に応じて変更
  const getCardClass = () => {
    if (lastAnswerResult === 'correct') return `${styles.questionCard} ${styles.correct}`;
    if (lastAnswerResult === 'incorrect') return `${styles.questionCard} ${styles.incorrect}`;
    return styles.questionCard;
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
    <div className={styles.questionCardWrapper}>
      <div className={getCardClass()}>
        {/* タイマー表示 */}
        <div className={styles.timer}>
          <span className={styles.timerIcon}>⏱️</span>
          <span className={`${styles.timerValue} ${getTimerClass()}`}>
            {Math.ceil(timeRemaining)}s
          </span>
        </div>

        {/* プログレスバー */}
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${getTimerClass()}`}
            style={{ width: `${getProgressWidth()}%` }}
          />
        </div>

        {/* アプリケーション名バッジ */}
        <div className={styles.appBadge}>
          <span className={styles.appIcon}>💻</span>
          <span className={styles.appName}>{currentQuestion.appName}</span>
        </div>

        {/* 問題ヘッダー */}
        <div className={styles.questionHeader}>📝 Question</div>

        {/* 問題文 */}
        <div className={styles.questionText}>
          {currentQuestion.question.replace(/^【.*?】/, '')}
        </div>

        {/* 指示テキストと押したキー表示 */}
        <div className={styles.instructionBox}>
          <div className={styles.instructionText}>
            <span className={styles.instructionIcon}>⌨️</span>
            <span className={styles.instructionLabel}>
              正しいショートカットキーを押してください
            </span>
          </div>

          {/* 押したキー表示 */}
          {pressedKeys.size > 0 && (
            <div className={styles.pressedKeys}>
              <div className={styles.pressedKeysLabel}>入力中...</div>
              <div className={styles.pressedKeysValue}>{getKeyComboText()}</div>
            </div>
          )}
        </div>

        {/* フィードバック表示 */}
        {lastAnswerResult && (
          <div className={styles.feedbackIcon}>
            {lastAnswerResult === 'correct' ? '✅' : '❌'}
          </div>
        )}
      </div>
    </div>
  );
}


export default QuestionCard;

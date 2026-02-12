import React, { useMemo } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useLanguage } from '../../context/LanguageContext';
import { getKeyComboText } from '../../utils/keyboard'; // 追加
import { formatSequentialShortcut, getSequentialKeys } from '../../utils/sequentialShortcuts';
import { getAlternativeShortcuts } from '../../constants/alternativeShortcuts';
import { normalizeShortcut } from '../../utils/quizEngine';
import styles from './QuestionCard.module.css';

function QuestionCard() {
  const { quizState, getNextQuestion } = useQuiz();
  const { currentQuestion, status, timeRemaining, settings, lastAnswerResult, showAnswer, lastWrongAnswer, currentSequentialProgress, pressedKeys, keyboardLayout } = quizState;
  const { t } = useLanguage();

  // 代替ショートカット表示ロジックをuseMemoで抽出（Hooksは条件分岐の前に配置する必要がある）
  const alternativeShortcutsDisplay = useMemo(() => {
    if (!currentQuestion) return null;

    const normalized = normalizeShortcut(currentQuestion.correctShortcut);
    const alternatives = getAlternativeShortcuts(normalized);
    const otherAlternatives = alternatives.filter(alt => alt !== normalized);

    if (otherAlternatives.length > 0) {
      return (
        <div className={styles.alternativeShortcuts}>
          <div className={styles.alternativeLabel}>{t.quiz.otherCorrect}</div>
          <div className={styles.alternativeList}>
            {otherAlternatives.map((alt, idx) => (
              <span key={idx} className={styles.alternativeItem}>{alt}</span>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }, [currentQuestion, t.quiz.otherCorrect]);

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
        <div className={styles.questionHeader}>📝 {t.quiz.question}</div>

        {/* 問題文 */}
        <div className={styles.questionText}>
          {currentQuestion.question.replace(/^【.*?】/, '')}
        </div>

        {/* 順序押しバッジ */}
        {currentQuestion.press_type === 'sequential' && (
          <div className={styles.sequentialBadge}>
            <span className={styles.sequentialIcon}>🔢</span>
            <span className={styles.sequentialText}>{t.quiz.sequential}</span>
            <span className={styles.sequentialExample}>
              {formatSequentialShortcut(currentQuestion.correctShortcut, currentQuestion.appId, currentQuestion.press_type)}
            </span>
          </div>
        )}

        {/* 指示テキストと押したキー表示 */}
        <div className={styles.instructionBox}>
          <div className={styles.instructionText}>
            <span className={styles.instructionIcon}>⌨️</span>
            <span className={styles.instructionLabel}>
              {currentQuestion.press_type === 'sequential'
                ? t.quiz.pressKeysInOrder
                : t.quiz.pressCorrectShortcut
              }
            </span>
          </div>

          {/* 順押しの途中経過表示 */}
          {currentQuestion.press_type === 'sequential' && currentSequentialProgress.length > 0 && (
            <div className={styles.sequentialProgress}>
              <div className={styles.progressLabel}>{t.quiz.typing}</div>
              <div className={styles.progressSequence}>
                {currentSequentialProgress.map((key, index) => {
                  const expectedKeys = getSequentialKeys(currentQuestion.correctShortcut);
                  const isCorrect = key.toLowerCase() === expectedKeys[index]?.toLowerCase();
                  return (
                    <React.Fragment key={index}>
                      {index > 0 && <span className={styles.progressSeparator}>→</span>}
                      <span className={isCorrect ? styles.progressKeyCorrect : styles.progressKeyIncorrect}>
                        {key}
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* 押したキー表示（非順押しの場合のみ） */}
          {currentQuestion.press_type !== 'sequential' && pressedKeys.size > 0 && (
            <div className={styles.pressedKeys}>
              <div className={styles.pressedKeysLabel}>{t.quiz.typing}</div>
              <div className={styles.pressedKeysValue}>{getKeyComboText(Array.from(pressedKeys), keyboardLayout)}</div>
            </div>
          )}
        </div>

        {/* フィードバック表示 */}
        {lastAnswerResult && (
          <div className={styles.feedbackIcon}>
            {lastAnswerResult === 'correct' ? '✅' : '❌'}
          </div>
        )}

        {/* 正解表示と次の問題ボタン */}
        {showAnswer && (
          <div className={styles.answerSection}>
            {/* 間違った回答を表示 */}
            {lastAnswerResult === 'incorrect' && lastWrongAnswer && (
              <div className={styles.wrongAnswer}>
                <div className={styles.wrongAnswerLabel}>{t.quiz.yourAnswer}</div>
                <div className={styles.wrongAnswerValue}>{lastWrongAnswer}</div>
              </div>
            )}

            {/* 正解表示 */}
            <div className={styles.correctAnswer}>
              <div className={styles.correctAnswerLabel}>
                {lastAnswerResult === 'correct' ? t.quiz.correct : t.quiz.correctAnswer}
              </div>
              <div className={styles.correctAnswerValue}>
                {currentQuestion.correctShortcut}
              </div>

              {/* 代替ショートカットを表示 */}
              {alternativeShortcutsDisplay}
            </div>

            <button
              className={styles.nextButton}
              onClick={getNextQuestion}
            >
              {t.quiz.nextQuestion}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export default QuestionCard;

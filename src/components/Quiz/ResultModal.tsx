import React, { useMemo, useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useAppContext } from '../../context/AppContext';
import { StyledButton } from '../common/StyledButton';

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
    const shortcutCounts = {};
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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#222',
          padding: '30px 40px',
          borderRadius: '10px',
          color: 'white',
          textAlign: 'center',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
        }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', color: '#4ade80' }}>🎉 クイズ終了！</h2>

        {/* スコア詳細 */}
        <div style={{
          fontSize: '1.1rem',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
        }}>
          <div style={{
            padding: '20px 30px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            border: '1px solid #4ade80',
            minWidth: '200px',
          }}>
            <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '5px', textAlign: 'center' }}>正解数</div>
            <div style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '2rem', textAlign: 'center' }}>{correctAnswers} / {totalQuestions}</div>
          </div>
        </div>

        {difficultShortcuts.length > 0 && (
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#f88', marginBottom: '10px' }}>苦手なショートカット</h3>
            <ul>
              {difficultShortcuts.map((item, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                  <span style={{ color: '#f00', fontWeight: 'bold' }}>{item.shortcut}</span>: {quizHistory.find(q => q.correctShortcut === item.shortcut)?.question.replace(' のショートカットは？', '')} ({item.count}回間違え)
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
        }}>
          <StyledButton
            onClick={handleRetry}
            backgroundColor="#10b981"
            hoverBackgroundColor="#059669"
            padding="12px 25px"
            fontSize="1.2rem"
            fontWeight="bold"
            variant="color"
          >
            🔄 もう一度挑戦
          </StyledButton>

          <StyledButton
            onClick={handleShare}
            backgroundColor="#0ea5e9"
            hoverBackgroundColor="#0284c7"
            padding="12px 25px"
            fontSize="1.1rem"
            fontWeight="bold"
            variant="color"
          >
            {isCopied ? '✅ コピーしました！' : '🔗 結果をシェア'}
          </StyledButton>

          <StyledButton
            onClick={handleSelectOtherQuiz}
            backgroundColor="#3b82f6"
            hoverBackgroundColor="#2563eb"
            padding="12px 25px"
            fontSize="1.1rem"
            fontWeight="bold"
            variant="color"
          >
            📝 他のクイズモードを選ぶ
          </StyledButton>

          <StyledButton
            onClick={handleBackToStart}
            backgroundColor="#6b7280"
            hoverBackgroundColor="#4b5563"
            padding="12px 25px"
            fontSize="1.1rem"
            fontWeight="bold"
            variant="color"
          >
            🏠 スタートに戻る
          </StyledButton>
        </div>
      </div>
    </div>
  );
}

export default ResultModal;

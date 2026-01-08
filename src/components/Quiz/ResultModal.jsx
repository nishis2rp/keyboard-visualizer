import React, { useMemo } from 'react';
import { useQuiz } from '../../context/QuizContext';

function ResultModal() {
  const { quizState, dispatch, startQuiz } = useQuiz();
  const { status, score, mistakes, maxCombo, quizHistory, selectedApp, startTime, endTime } = quizState;

  if (status !== 'finished') {
    return null; // クイズが終了していない場合は何も表示しない
  }

  // スコア計算
  const totalQuestions = quizHistory.length;
  const correctAnswers = score;
  const accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0;
  const timeTaken = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(1) : 0; // 秒

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

  // 回答速度の統計
  const speedStats = useMemo(() => {
    const correctAnswers = quizHistory.filter(entry => entry.isCorrect && entry.answerTimeMs);
    if (correctAnswers.length === 0) return null;

    const avgTime = correctAnswers.reduce((sum, entry) => sum + entry.answerTimeMs, 0) / correctAnswers.length;
    const fastCount = correctAnswers.filter(entry => entry.speedCategory === 'fast').length;
    const normalCount = correctAnswers.filter(entry => entry.speedCategory === 'normal').length;
    const slowCount = correctAnswers.filter(entry => entry.speedCategory === 'slow').length;

    return {
      avgTime: (avgTime / 1000).toFixed(2),
      fastCount,
      normalCount,
      slowCount,
    };
  }, [quizHistory]);

  // ランク付け
  const getRank = (accuracy) => {
    if (accuracy >= 95) return { rank: 'S', color: '#ffd700', emoji: '🏆' };
    if (accuracy >= 80) return { rank: 'A', color: '#4ade80', emoji: '🌟' };
    if (accuracy >= 60) return { rank: 'B', color: '#3b82f6', emoji: '👍' };
    if (accuracy >= 40) return { rank: 'C', color: '#fbbf24', emoji: '💪' };
    if (accuracy >= 20) return { rank: 'D', color: '#fb923c', emoji: '📚' };
    return { rank: 'F', color: '#ef4444', emoji: '😢' };
  };
  const rankData = getRank(accuracy);

  const handleRetry = () => {
    dispatch({ type: 'RESET_QUIZ' });
    startQuiz(selectedApp, quizState.settings.isFullscreen);
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
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#4ade80' }}>🎉 クイズ終了！</h2>

        {/* ランク表示 */}
        <div style={{
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>
            {rankData.emoji}
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: rankData.color, marginBottom: '10px' }}>
            ランク: {rankData.rank}
          </div>
          <div style={{ fontSize: '2rem', color: '#4ade80', fontWeight: 'bold' }}>
            {accuracy}%
          </div>
        </div>

        {/* スコア詳細 */}
        <div style={{
          fontSize: '1.1rem',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          textAlign: 'left',
        }}>
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            border: '1px solid #4ade80',
          }}>
            <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '5px' }}>正解数</div>
            <div style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1.5rem' }}>{correctAnswers} / {totalQuestions}</div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            border: '1px solid #ef4444',
          }}>
            <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '5px' }}>ミス</div>
            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.5rem' }}>{mistakes}</div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '8px',
            border: '1px solid #06b6d4',
          }}>
            <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '5px' }}>最大コンボ</div>
            <div style={{ color: '#06b6d4', fontWeight: 'bold', fontSize: '1.5rem' }}>🔥 {maxCombo}</div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderRadius: '8px',
            border: '1px solid #a855f7',
          }}>
            <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '5px' }}>経過時間</div>
            <div style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '1.5rem' }}>⏱️ {timeTaken}秒</div>
          </div>
        </div>

        {/* 回答速度統計 */}
        {speedStats && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid #8b5cf6',
          }}>
            <h3 style={{ fontSize: '1.3rem', color: '#a78bfa', marginBottom: '10px' }}>⚡ 回答速度</h3>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-around', fontSize: '0.95rem' }}>
              <div>
                <div style={{ color: '#9ca3af' }}>平均</div>
                <div style={{ color: '#a78bfa', fontWeight: 'bold' }}>{speedStats.avgTime}秒</div>
              </div>
              <div>
                <div style={{ color: '#9ca3af' }}>高速 🚀</div>
                <div style={{ color: '#4ade80', fontWeight: 'bold' }}>{speedStats.fastCount}問</div>
              </div>
              <div>
                <div style={{ color: '#9ca3af' }}>普通 ⏱️</div>
                <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>{speedStats.normalCount}問</div>
              </div>
              <div>
                <div style={{ color: '#9ca3af' }}>遅い 🐢</div>
                <div style={{ color: '#fb923c', fontWeight: 'bold' }}>{speedStats.slowCount}問</div>
              </div>
            </div>
          </div>
        )}

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

        <button
          onClick={handleRetry}
          style={{
            marginTop: '30px',
            padding: '10px 25px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          もう一度挑戦
        </button>
      </div>
    </div>
  );
}

export default ResultModal;

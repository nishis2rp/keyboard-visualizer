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

  // ランク付け (仮実装)
  const getRank = (accuracy) => {
    if (accuracy >= 95) return 'S';
    if (accuracy >= 80) return 'A';
    if (accuracy >= 60) return 'B';
    if (accuracy >= 40) return 'C';
    if (accuracy >= 20) return 'D';
    return 'F';
  };
  const rank = getRank(accuracy);

  const handleRetry = () => {
    dispatch({ type: 'RESET_QUIZ' });
    // クイズ開始時のisFullscreen状態はApp.jsxから渡されるので、ここではデフォルトでfalseを渡すか、
    // useQuiz() にisFullscreen状態を渡すメカニズムが必要。
    // 仮にcurrentFullscreenModeを渡す (要修正)
    startQuiz(selectedApp, quizState.settings.isFullscreen); // isFullscreenを渡すように修正
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
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#0f0' }}>クイズ終了！</h2>
        <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          <p>正解数: <span style={{ color: '#0f0', fontWeight: 'bold' }}>{correctAnswers}</span> / {totalQuestions}</p>
          <p>正答率: <span style={{ color: '#0f0', fontWeight: 'bold' }}>{accuracy}%</span></p>
          <p>ランク: <span style={{ color: '#ff0', fontWeight: 'bold', fontSize: '1.5rem' }}>{rank}</span></p>
          <p>最大コンボ: <span style={{ color: '#0ff', fontWeight: 'bold' }}>{maxCombo}</span></p>
          <p>経過時間: <span style={{ color: '#fff', fontWeight: 'bold' }}>{timeTaken}秒</span></p>
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

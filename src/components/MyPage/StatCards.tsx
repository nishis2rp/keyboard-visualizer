import React from 'react';

interface StatCardsProps {
  overallAccuracy: string;
  overallCorrect: number;
  overallQuestions: number;
  totalSessions: number;
}

const StatCards: React.FC<StatCardsProps> = ({
  overallAccuracy,
  overallCorrect,
  overallQuestions,
  totalSessions,
}) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">🎯</div>
        <h4>総合正解率</h4>
        <p className="stat-value">{overallAccuracy}%</p>
        <div className="stat-progress-bg">
          <div 
            className="stat-progress-bar" 
            style={{ width: `${overallAccuracy}%` }}
          ></div>
        </div>
        <p className="stat-detail">{overallCorrect} / {overallQuestions} 正解</p>
      </div>

      <div className="stat-card stat-card-blue">
        <div className="stat-icon">🔥</div>
        <h4>総セッション数</h4>
        <p className="stat-value">{totalSessions}</p>
        <p className="stat-detail">完了したクイズ数</p>
      </div>

      <div className="stat-card stat-card-purple">
        <div className="stat-icon">⚡</div>
        <h4>回答総数</h4>
        <p className="stat-value">{overallQuestions}</p>
        <p className="stat-detail">これまでに解いた問題</p>
      </div>
    </div>
  );
};

export default StatCards;

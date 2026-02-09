import React from 'react';
import { UserQuizStats } from '../../types';
import { APP_DISPLAY_NAMES } from '../../constants/app';

interface AppStatsTableProps {
  stats: UserQuizStats[];
}

const AppStatsTable: React.FC<AppStatsTableProps> = ({ stats }) => {
  if (stats.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <p className="empty-state-text">まだクイズをプレイしていません。</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>アプリケーション</th>
            <th>正解率</th>
            <th>正解数 / 問題数</th>
            <th>セッション</th>
            <th>最終プレイ</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => {
            const displayName = APP_DISPLAY_NAMES[stat.application] || stat.application;
            return (
              <tr key={index}>
                <td className="td-app">
                  <span className="app-icon-mini">
                    {/* アイコンがあればここに追加できる */}
                  </span>
                  <strong>{displayName}</strong>
                </td>
                <td>
                  <div className="accuracy-cell">
                    <span className="accuracy-value">{stat.overall_accuracy.toFixed(1)}%</span>
                    <div className="mini-progress-bg">
                      <div 
                        className="mini-progress-bar" 
                        style={{ width: `${stat.overall_accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>{stat.total_correct} / {stat.total_questions}</td>
                <td>{stat.total_sessions}</td>
                <td className="td-date">{new Date(stat.last_quiz_date).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppStatsTable;

import React from 'react';
import { UserQuizStats } from '../../types';
import { APP_DISPLAY_NAMES } from '../../constants/app';

interface AppStatsTableProps {
  stats: UserQuizStats[];
}

const AppStatsTable: React.FC<AppStatsTableProps> = ({ stats }) => {
  if (stats.length === 0) {
    return (
      <div className="text-center py-8 bg-sf-green-ultralight/30 rounded-apple-lg border border-sf-green-light/20">
        <div className="text-3xl mb-2">📝</div>
        <p className="text-sf-gray-dark font-medium">まだクイズをプレイしていません。</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="apple-table">
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
              <tr key={index} className="hover:bg-sf-gray-ultralight transition-colors">
                <td className="font-semibold text-sf-primary">
                  {displayName}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="min-w-[45px] font-bold">{stat.overall_accuracy.toFixed(1)}%</span>
                    <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sf-blue rounded-full" 
                        style={{ width: `${stat.overall_accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="text-sf-gray font-medium">{stat.total_correct} / {stat.total_questions}</td>
                <td className="text-sf-gray">{stat.total_sessions}</td>
                <td className="text-[11px] text-sf-gray font-medium uppercase tracking-tighter">
                  {new Date(stat.last_quiz_date).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppStatsTable;

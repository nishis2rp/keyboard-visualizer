import React from 'react';
import { QuizSession, ShortcutDifficulty } from '../../types';
import { APP_DISPLAY_NAMES } from '../../constants/app';

interface RecentSessionsProps {
  sessions: QuizSession[];
  onSelectSession: (sessionId: number) => void;
}

const RecentSessions: React.FC<RecentSessionsProps> = ({ sessions, onSelectSession }) => {
  const getDifficultyBadgeColor = (difficulty: ShortcutDifficulty | null) => {
    switch (difficulty) {
      case 'Basic': return 'bg-sf-blue-ultralight text-sf-blue border-sf-blue/20';
      case 'Standard': return 'bg-sf-green-ultralight text-sf-green border-sf-green/20';
      case 'Hard': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Madmax': return 'bg-sf-red-light/10 text-sf-red border-sf-red/20';
      default: return 'bg-sf-gray-light text-sf-gray border-gray-200';
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 bg-sf-gray-ultralight rounded-apple-lg border border-gray-100">
        <div className="text-3xl mb-2">🎮</div>
        <p className="text-sf-gray font-medium">最近のクイズセッションはありません。</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="apple-table">
        <thead>
          <tr>
            <th>アプリ</th>
            <th>難易度</th>
            <th>スコア</th>
            <th>正解数</th>
            <th>日時</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr 
              key={session.id} 
              onClick={() => onSelectSession(session.id)}
              className="hover:bg-sf-gray-ultralight transition-colors cursor-pointer"
            >
              <td className="font-semibold text-sf-primary">
                {APP_DISPLAY_NAMES[session.application] || session.application}
              </td>
              <td>
                <span className={`apple-badge ${getDifficultyBadgeColor(session.difficulty)}`}>
                  {session.difficulty || 'N/A'}
                </span>
              </td>
              <td className="font-bold text-sf-blue">{session.score}</td>
              <td className="text-sf-gray font-medium">{session.correct_answers} / {session.total_questions}</td>
              <td className="text-[11px] text-sf-gray font-medium">
                {session.completed_at
                  ? new Date(session.completed_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : '進行中'}
              </td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSession(session.id);
                  }}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-apple-xs text-[11px] font-bold text-sf-gray hover:bg-sf-blue hover:text-white hover:border-sf-blue transition-all"
                >
                  詳細
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentSessions;

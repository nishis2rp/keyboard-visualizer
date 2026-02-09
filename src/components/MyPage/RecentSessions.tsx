import React from 'react';
import { QuizSession, ShortcutDifficulty } from '../../types';
import { APP_DISPLAY_NAMES } from '../../constants/app';

interface RecentSessionsProps {
  sessions: QuizSession[];
  onSelectSession: (sessionId: number) => void;
}

const RecentSessions: React.FC<RecentSessionsProps> = ({ sessions, onSelectSession }) => {
  const getDifficultyBadgeClass = (difficulty: ShortcutDifficulty | null) => {
    if (!difficulty) return 'difficulty-badge';
    return `difficulty-badge difficulty-${difficulty}`;
  };

  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎮</div>
        <p className="empty-state-text">最近のクイズセッションはありません。</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>アプリ</th>
            <th>難易度</th>
            <th>スコア</th>
            <th>正解数</th>
            <th>日時</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} onClick={() => onSelectSession(session.id)}>
              <td>{APP_DISPLAY_NAMES[session.application] || session.application}</td>
              <td>
                {session.difficulty ? (
                  <span className={getDifficultyBadgeClass(session.difficulty)}>
                    {session.difficulty}
                  </span>
                ) : (
                  <span className="difficulty-badge">N/A</span>
                )}
              </td>
              <td className="td-score"><strong>{session.score}</strong></td>
              <td>{session.correct_answers} / {session.total_questions}</td>
              <td className="td-date">
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
                  className="detail-button"
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

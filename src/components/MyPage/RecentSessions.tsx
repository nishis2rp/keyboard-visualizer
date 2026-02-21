import React from 'react';
import { QuizSession, ShortcutDifficulty } from '../../types';
import { useShortcutData } from '../../context';
import { useLanguage } from '../../context/LanguageContext';
import { DIFFICULTIES } from '../../constants';

interface RecentSessionsProps {
  sessions: QuizSession[];
  onSelectSession: (sessionId: number) => void;
}

const RecentSessions: React.FC<RecentSessionsProps> = ({ sessions, onSelectSession }) => {
  const { appMap } = useShortcutData();
  const { t, language } = useLanguage();

  const getDifficultyBadgeColor = (difficulty: ShortcutDifficulty | null) => {
    switch (difficulty) {
      case DIFFICULTIES.BASIC: return 'bg-sf-blue-ultralight text-sf-blue border-sf-blue/20';
      case DIFFICULTIES.STANDARD: return 'bg-sf-green-ultralight text-sf-green border-sf-green/20';
      case DIFFICULTIES.HARD: return 'bg-orange-50 text-orange-600 border-orange-200';
      case DIFFICULTIES.MADMAX: return 'bg-sf-red-light/10 text-sf-red border-sf-red/20';
      default: return 'bg-sf-gray-light text-sf-gray border-gray-200';
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 bg-sf-gray-ultralight rounded-apple-lg border border-gray-100">
        <div className="text-3xl mb-2">🎮</div>
        <p className="text-sf-gray font-medium">{t.myPage.noSessions}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="apple-table">
        <thead>
          <tr>
            <th>{t.myPage.app}</th>
            <th>{t.myPage.difficulty}</th>
            <th>{t.myPage.score}</th>
            <th>{t.myPage.correctCount}</th>
            <th>{t.myPage.date}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            const app = appMap[session.application];
            const displayName = language === 'en' && app?.name_en ? app.name_en : (app?.name || session.application);

            return (
              <tr 
                key={session.id} 
                onClick={() => onSelectSession(session.id)}
                className="hover:bg-sf-gray-ultralight transition-colors cursor-pointer"
              >
                <td className="font-semibold text-sf-primary">
                  {displayName}
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
                    className="apple-button-secondary text-[11px] py-1"
                  >
                    {t.myPage.details}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecentSessions;

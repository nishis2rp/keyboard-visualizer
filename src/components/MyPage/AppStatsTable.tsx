import React from 'react';
import { UserQuizStats } from '../../types';
import { useShortcutData } from '../../context';
import { useLanguage } from '../../context/LanguageContext';

interface AppStatsTableProps {
  stats: UserQuizStats[];
}

const AppStatsTable: React.FC<AppStatsTableProps> = ({ stats }) => {
  const { appMap } = useShortcutData();
  const { t, language } = useLanguage();

  if (stats.length === 0) {
    return (
      <div className="text-center py-8 bg-sf-green-ultralight/30 rounded-apple-lg border border-sf-green-light/20">
        <div className="text-3xl mb-2">📝</div>
        <p className="text-sf-gray-dark font-medium">{t.myPage.noStats}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-3 px-4 text-left text-[11px] font-bold text-sf-gray uppercase tracking-wider">{t.myPage.app}</th>
            <th className="py-3 px-4 text-left text-[11px] font-bold text-sf-gray uppercase tracking-wider">{t.myPage.accuracy}</th>
            <th className="py-3 px-4 text-left text-[11px] font-bold text-sf-gray uppercase tracking-wider">{t.myPage.correctCount}</th>
            <th className="py-3 px-4 text-left text-[11px] font-bold text-sf-gray uppercase tracking-wider">{t.myPage.sessions}</th>
            <th className="py-3 px-4 text-left text-[11px] font-bold text-sf-gray uppercase tracking-wider">{t.myPage.lastPlayed}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {stats.map((stat, index) => {
            const app = appMap[stat.application];
            const displayName = language === 'en' && app?.name_en ? app.name_en : (app?.name || stat.application);
            
            return (
              <tr key={index} className="hover:bg-sf-gray-ultralight/50 transition-colors group">
                <td className="py-4 px-4 font-bold text-sf-primary text-sm">
                  <div className="flex items-center gap-2">
                    {app?.icon && <img src={app.icon} alt="" className="w-5 h-5 opacity-80 group-hover:opacity-100" />}
                    {displayName}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="min-w-[45px] font-black text-sf-blue text-sm">{stat.overall_accuracy.toFixed(1)}%</span>
                    <div className="hidden sm:block w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sf-blue rounded-full transition-all duration-700" 
                        style={{ width: `${stat.overall_accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-xs font-bold text-sf-gray">
                  {stat.total_correct} <span className="text-gray-300 font-normal">/</span> {stat.total_questions}
                </td>
                <td className="py-4 px-4 text-xs text-sf-gray font-medium">{stat.total_sessions}</td>
                <td className="py-4 px-4 text-[10px] text-sf-gray font-bold uppercase tracking-tight">
                  {new Date(stat.last_quiz_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
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

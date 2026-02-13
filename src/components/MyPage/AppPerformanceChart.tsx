import React from 'react';
import { UserQuizStats } from '../../types';
import { useShortcutData } from '../../context';
import { useLanguage } from '../../context/LanguageContext';

interface AppPerformanceChartProps {
  stats: UserQuizStats[];
}

const AppPerformanceChart: React.FC<AppPerformanceChartProps> = ({ stats }) => {
  const { appMap } = useShortcutData();
  const { t, language } = useLanguage();

  if (stats.length === 0) return null;

  // Sort by accuracy descending
  const sortedStats = [...stats].sort((a, b) => b.overall_accuracy - a.overall_accuracy);
  const maxQuestions = Math.max(...stats.map(s => s.total_questions));

  return (
    <div className="flex flex-col gap-6">
      {sortedStats.map((stat, index) => {
        const app = appMap[stat.application];
        const displayName = language === 'en' && app?.name_en ? app.name_en : (app?.name || stat.application);
        const relativeVolume = (stat.total_questions / maxQuestions) * 100;
        
        return (
          <div key={index} className="group">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-sm font-bold text-sf-primary truncate flex-1">{displayName}</span>
              <span className="text-xs font-black text-sf-blue ml-2">{stat.overall_accuracy.toFixed(1)}%</span>
            </div>
            
            {/* Accuracy Bar */}
            <div className="h-2 w-full bg-sf-gray-ultralight rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-sf-blue rounded-full transition-all duration-1000 ease-out origin-left group-hover:brightness-110" 
                style={{ 
                  width: `${stat.overall_accuracy}%`,
                  transitionDelay: `${index * 100}ms`
                }}
              ></div>
            </div>
            
            {/* Volume indicator (subtle) */}
            <div className="flex justify-between items-center px-0.5">
              <div className="flex gap-0.5 items-center">
                <div 
                  className="h-1 bg-sf-gray-light rounded-full" 
                  style={{ width: `${Math.max(10, relativeVolume)}px` }}
                ></div>
                <span className="text-[9px] text-sf-gray font-medium uppercase tracking-tighter">
                  {stat.total_questions} {t.myPage.questionsSolvedShort || 'Qs'}
                </span>
              </div>
              <span className="text-[9px] text-sf-gray font-medium">
                {stat.total_sessions} {t.myPage.sessionsShort || 'Sessions'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppPerformanceChart;

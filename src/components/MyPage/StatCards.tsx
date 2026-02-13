import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="bg-sf-gray-ultralight p-6 rounded-apple-lg relative overflow-hidden border border-gray-100 transition-all hover:shadow-apple-md">
        <div className="absolute top-2.5 right-2.5 text-2xl opacity-20">🎯</div>
        <h4 className="m-0 mb-1 text-[10px] text-sf-gray font-bold uppercase tracking-wider">{t.myPage.overallAccuracy}</h4>
        <p className="text-3xl font-bold text-sf-blue m-0 leading-tight">{overallAccuracy}%</p>
        <div className="h-1.5 bg-gray-200 rounded-full my-3">
          <div 
            className="h-full bg-sf-blue rounded-full transition-all duration-1000" 
            style={{ width: `${overallAccuracy}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-sf-gray m-0">{overallCorrect} / {overallQuestions} {t.myPage.correct}</p>
      </div>

      <div className="bg-sf-gray-ultralight p-6 rounded-apple-lg relative overflow-hidden border border-gray-100 transition-all hover:shadow-apple-md">
        <div className="absolute top-2.5 right-2.5 text-2xl opacity-20">🔥</div>
        <h4 className="m-0 mb-1 text-[10px] text-sf-gray font-bold uppercase tracking-wider">{t.myPage.totalSessions}</h4>
        <p className="text-3xl font-bold text-sf-blue m-0 leading-tight">{totalSessions}</p>
        <p className="text-[10px] text-sf-gray m-0 mt-4">{t.myPage.completedQuizzes}</p>
      </div>

      <div className="bg-sf-gray-ultralight p-6 rounded-apple-lg relative overflow-hidden border border-gray-100 transition-all hover:shadow-apple-md">
        <div className="absolute top-2.5 right-2.5 text-2xl opacity-20">⚡</div>
        <h4 className="m-0 mb-1 text-[10px] text-sf-gray font-bold uppercase tracking-wider">{t.myPage.totalAnswers}</h4>
        <p className="text-3xl font-bold text-sf-purple m-0 leading-tight">{overallQuestions}</p>
        <p className="text-[10px] text-sf-gray m-0 mt-4">{t.myPage.questionsSolved}</p>
      </div>
    </div>
  );
};

export default StatCards;

import React from 'react';
import { WeakShortcut } from '../../types';
import { useShortcutData, useQuiz, useUI, useSettings } from '../../context';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedDescription } from '../../utils/i18n';
import { DIFFICULTIES } from '../../constants/shortcuts';
import { useNavigate } from 'react-router-dom';

interface WeakShortcutsProps {
  weakShortcuts: WeakShortcut[];
  loading: boolean;
}

const WeakShortcuts: React.FC<WeakShortcutsProps> = ({ weakShortcuts, loading }) => {
  const { appMap } = useShortcutData();
  const { t, language } = useLanguage();
  const { startQuiz } = useQuiz();
  const { setIsQuizMode } = useUI();
  const { setup, keyboardLayout } = useSettings();
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center py-4 text-sf-gray text-sm animate-pulse">{t.myPage.analyzing}</div>;
  }

  if (weakShortcuts.length === 0) {
    return (
      <div className="text-center py-6 bg-sf-green-ultralight/30 rounded-apple-lg border border-sf-green-light/20">
        <p className="text-sf-green-dark font-medium text-sm">{t.myPage.noWeakShortcuts}</p>
      </div>
    );
  }

  const handleStartPractice = () => {
    const ids = weakShortcuts.map(ws => ws.id);
    // 苦手な項目のアプリ名を特定（最初の一つのアプリをベースにするか、'custom'とする）
    const app = weakShortcuts[0]?.application || 'all';

    startQuiz(
      app,
      false, // isFullscreen - use default value
      keyboardLayout,
      DIFFICULTIES.ALLRANGE,
      ids
    );
    setIsQuizMode(true);
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleStartPractice}
        className="w-full py-3 px-4 bg-sf-red text-white font-bold rounded-apple-lg shadow-sm hover:bg-sf-red-dark transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mb-2"
      >
        <span className="text-xl">🔥</span>
        {t.myPage.startDrill}
      </button>

      {weakShortcuts.map((shortcut) => {
        const app = appMap[shortcut.application];
        const appName = language === 'en' && app?.name_en ? app.name_en : (app?.name || shortcut.application);

        return (
          <div key={shortcut.id} className="flex justify-between items-center p-4 bg-sf-gray-ultralight rounded-apple-lg border-l-4 border-l-sf-red border border-gray-100 transition-all hover:translate-x-1">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                {shortcut.keys.split(' + ').map((key, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-sf-gray text-[10px] font-bold">+</span>}
                    <kbd className="apple-kbd">{key}</kbd>
                  </React.Fragment>
                ))}
              </div>
              <div className="text-sm font-bold text-sf-primary leading-tight mb-1">
                {getLocalizedDescription(shortcut, language)}
              </div>
              <div className="text-[10px] text-sf-gray font-bold uppercase tracking-wider">
                {appName}
              </div>
            </div>
            <div className="text-right min-w-[100px]">
              <div className="text-[10px] text-sf-gray font-bold uppercase tracking-wider mb-0.5">{t.myPage.accuracy}</div>
              <div className="text-xl font-black text-sf-red-dark leading-none">{(shortcut.accuracy * 100).toFixed(0)}%</div>
              <div className="text-[9px] text-sf-gray font-medium mt-1">
                {t.myPage.mistakes.replace('{wrong}', shortcut.wrong_count.toString()).replace('{total}', (shortcut.wrong_count + shortcut.correct_count).toString())}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeakShortcuts;

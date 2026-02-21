import React from 'react';
import { RichShortcut } from '../../types';
import { useShortcutData, useQuiz, useUI, useSettings } from '../../context';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedDescription } from '../../utils/i18n';
import { DIFFICULTIES } from '../../constants/shortcuts';
import { useNavigate } from 'react-router-dom';

interface BookmarkedShortcutsProps {
  shortcuts: RichShortcut[];
  loading: boolean;
}

const BookmarkedShortcuts: React.FC<BookmarkedShortcutsProps> = ({ shortcuts, loading }) => {
  const { appMap } = useShortcutData();
  const { t, language } = useLanguage();
  const { startQuiz } = useQuiz();
  const { setIsQuizMode } = useUI();
  const { setup, keyboardLayout } = useSettings();
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center py-4 text-sf-gray text-sm animate-pulse">{t.myPage.analyzing}</div>;
  }

  if (shortcuts.length === 0) {
    return (
      <div className="text-center py-6 bg-sf-gray-ultralight rounded-apple-lg border border-gray-100">
        <p className="text-sf-gray font-medium text-sm">{t.myPage.noBookmarks}</p>
      </div>
    );
  }

  const handleStartPractice = () => {
    const ids = shortcuts.map(s => s.id);
    const app = shortcuts[0]?.application || 'all';

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
        className="w-full py-3 px-4 bg-sf-blue text-white font-bold rounded-apple-lg shadow-sm hover:bg-sf-blue-dark transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mb-2"
      >
        <span className="text-xl">⭐</span>
        {t.myPage.startBookmarkedDrill}
      </button>

      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {shortcuts.map((shortcut) => {
          const app = appMap[shortcut.application];
          const appName = language === 'en' && app?.name_en ? app.name_en : (app?.name || shortcut.application);

          return (
            <div key={shortcut.id} className="flex justify-between items-center p-4 bg-sf-gray-ultralight rounded-apple-lg border border-gray-100 transition-all hover:bg-white hover:shadow-apple-sm">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookmarkedShortcuts;

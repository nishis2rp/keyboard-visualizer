import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { translations, Translations } from '../locales';
import { analytics } from '../utils/analytics';

export type Language = 'ja' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'keyboard-visualizer-language';

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Get initial language from localStorage or browser language
  const getInitialLanguage = (): Language => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'ja' || stored === 'en') {
      return stored;
    }
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('ja') ? 'ja' : 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    // Analytics: Track language change
    analytics.languageChanged(lang);
  }, []);

  // Get translations for current language
  const t = useMemo(() => translations[language], [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

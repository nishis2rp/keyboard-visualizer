import { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Translations } from '../locales';

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

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  // Get translations for current language
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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

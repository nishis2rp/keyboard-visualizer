import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RichShortcut, App } from '../types';
import { getLocalizedDescription, getLocalizedCategory } from '../utils/i18n';

/**
 * Get localized description for a shortcut
 */
export function useLocalizedDescription(shortcut: RichShortcut): string {
  const { language } = useLanguage();

  return useMemo(() => {
    return getLocalizedDescription(shortcut, language);
  }, [language, shortcut]);
}

/**
 * Get localized category for a shortcut
 */
export function useLocalizedCategory(shortcut: RichShortcut): string | null {
  const { language } = useLanguage();

  return useMemo(() => {
    return getLocalizedCategory(shortcut, language);
  }, [language, shortcut]);
}

/**
 * Get localized app name
 */
export function useLocalizedAppName(app: App): string {
  const { language } = useLanguage();

  return useMemo(() => {
    if (language === 'en' && app.name_en) {
      return app.name_en;
    }
    return app.name;
  }, [language, app.name, app.name_en]);
}

/**
 * Get localized shortcut data (returns a new object with localized fields)
 */
export function useLocalizedShortcut(shortcut: RichShortcut): RichShortcut {
  const { language } = useLanguage();

  return useMemo(() => {
    if (language === 'en') {
      return {
        ...shortcut,
        description: shortcut.description_en || shortcut.description,
        category: shortcut.category_en || shortcut.category,
      };
    }
    return shortcut;
  }, [language, shortcut]);
}

/**
 * Get localized shortcuts array
 */
export function useLocalizedShortcuts(shortcuts: RichShortcut[]): RichShortcut[] {
  const { language } = useLanguage();

  return useMemo(() => {
    if (language === 'en') {
      return shortcuts.map(shortcut => ({
        ...shortcut,
        description: shortcut.description_en || shortcut.description,
        category: shortcut.category_en || shortcut.category,
      }));
    }
    return shortcuts;
  }, [language, shortcuts]);
}

/**
 * Internationalization utility functions
 */

import { RichShortcut, AvailableShortcut } from '../types';

/**
 * Get localized description based on language
 * Falls back to Japanese description if English is not available
 */
export function getLocalizedDescription(
  shortcut: RichShortcut | AvailableShortcut,
  language: 'ja' | 'en'
): string {
  if (language === 'en' && shortcut.description_en) {
    return shortcut.description_en;
  }
  return shortcut.description;
}

/**
 * Get localized category based on language
 * Falls back to Japanese category if English is not available
 */
export function getLocalizedCategory(
  shortcut: RichShortcut | AvailableShortcut,
  language: 'ja' | 'en'
): string | null {
  if (language === 'en' && shortcut.category_en) {
    return shortcut.category_en;
  }
  return shortcut.category;
}

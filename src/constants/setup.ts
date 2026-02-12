/**
 * Language options for setup screen
 * Note: This is kept minimal as it's only used in the setup screen.
 * Most UI text is managed through the translation system in src/locales/
 */
export const LANGUAGE_OPTIONS = [
  {
    id: 'ja' as const,
    title: '日本語',
    icon: '🇯🇵',
    description: 'Japanese'
  },
  {
    id: 'en' as const,
    title: 'English',
    icon: '🇺🇸',
    description: 'English'
  }
] as const;

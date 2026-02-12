import { en, Translations } from './en';
import { ja } from './ja';

export type { Translations };

export const translations = {
  en,
  ja,
};

export type Language = keyof typeof translations;

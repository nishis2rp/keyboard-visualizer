import { ShortcutDifficulty, QuizMode } from '../types';

/**
 * 難易度定数
 */
export const DIFFICULTIES = {
  BASIC: 'basic' as ShortcutDifficulty,
  STANDARD: 'standard' as ShortcutDifficulty,
  HARD: 'hard' as ShortcutDifficulty,
  MADMAX: 'madmax' as ShortcutDifficulty,
  ALLRANGE: 'allrange' as ShortcutDifficulty,
} as const;

/**
 * 押し方種別
 */
export const PRESS_TYPES = {
  SIMULTANEOUS: 'simultaneous' as const,
  SEQUENTIAL: 'sequential' as const,
} as const;

/**
 * クイズモード
 */
export const QUIZ_MODES = {
  STANDARD: 'standard' as QuizMode,
  SPEEDRUN: 'speedrun' as QuizMode,
  PRACTICE: 'practice' as QuizMode,
  DEFAULT: 'default' as any, // 既存のロジック用
  HARDCORE: 'hardcore' as any, // 既存のロジック用
} as const;

/**
 * 難易度設定の表示用設定
 */
export const DIFFICULTY_CONFIG = {
  [DIFFICULTIES.BASIC]: { label: 'BASIC', color: '#ecfdf5', text: '#059669' },
  [DIFFICULTIES.STANDARD]: { label: 'STANDARD', color: '#eff6ff', text: '#2563eb' },
  [DIFFICULTIES.HARD]: { label: 'HARD', color: '#fff7ed', text: '#d97706' },
  [DIFFICULTIES.MADMAX]: { label: 'MADMAX', color: '#fef2f2', text: '#dc2626' },
  [DIFFICULTIES.ALLRANGE]: { label: 'ALL', color: '#f5f3ff', text: '#7c3aed' }
} as const;

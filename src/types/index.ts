// 共通型定義

export interface App {
  id: string;
  name: string;
  icon: string;
  os: 'windows' | 'mac' | 'cross-platform';
}

export interface KeyboardLayout {
  id: string;
  name: string;
  keys: KeyDefinition[];
}

export interface KeyDefinition {
  key?: string;
  code: string;
  display?: string;
  width?: number;
  rowSpan?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  label?: string;
  shiftLabel?: string;
}

/**
 * ショートカットデータベースの型
 * { "Ctrl + A": "すべて選択" } のような形式
 */
export interface ShortcutData {
  [shortcutCombo: string]: string;
}

/**
 * アプリケーション別のショートカットデータベース
 * { "chrome": { "Ctrl + T": "新しいタブを開く" }, ... }
 */
export type ShortcutDatabase = {
  [appId: string]: ShortcutData;
}

export interface PressedKeys {
  [code: string]: boolean;
}

export interface SpecialKeys {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

export interface QuizQuestion {
  question: string;
  correctShortcut: string;
  normalizedCorrectShortcut: string;
  appId: string;
  appName: string;
}

export interface QuizStats {
  correct: number;
  incorrect: number;
  skipped: number;
  totalAnswered: number;
}

export interface QuizResult {
  question: QuizQuestion;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeMs: number;
  skipped: boolean;
}

export type QuizMode = 'standard' | 'speedrun' | 'practice';

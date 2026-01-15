// 共通型定義

export interface App {
  id: string;
  name: string;
  os: 'windows' | 'mac' | 'cross-platform';
}

export interface KeyboardLayout {
  id: string;
  name: string;
  keys: KeyDefinition[];
}

export interface KeyDefinition {
  code: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  shiftLabel?: string;
}

export interface ShortcutData {
  [key: string]: string;
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
  shortcut: string;
  description: string;
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

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
  keys: KeyDefinition[][];
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

export type ShortcutDifficulty = 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange';

export interface ShortcutDetails {
  description: string;
  difficulty: ShortcutDifficulty;
}

export interface AppShortcuts {
  [shortcut: string]: ShortcutDetails;
}

export type AllShortcuts = Record<string, AppShortcuts>;

/**
 * リッチショートカット型
 * データベースから取得したショートカット情報をより詳細に表現する型
 */
export interface RichShortcut {
  id: number;
  keys: string;
  description: string;
  difficulty: ShortcutDifficulty;
  application: string;
  category: string | null;
  created_at: string;
  platform?: 'Windows' | 'macOS' | 'Cross-Platform';
  windows_keys?: string | null;
  macos_keys?: string | null;
  windows_protection_level?: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen';
  macos_protection_level?: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen';
  press_type: 'sequential' | 'simultaneous'; // 追加
}

export interface AvailableShortcut extends RichShortcut {
  shortcut: string; // 表示用のショートカット文字列
  windows_protection_level: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen';
  macos_protection_level: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen';
}

/**
 * ショートカットデータベースの型 (旧形式)
 * { "Ctrl + A": "すべて選択" } のような形式
 */
export interface ShortcutData {
  [shortcutCombo: string]: string;
}

/**
 * アプリケーション別のショートカットデータベース (旧形式)
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
  press_type: 'sequential' | 'simultaneous'; // 追加
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

export interface UserQuizStats {
  user_id: string;
  application: string;
  total_sessions: number;
  total_correct: number;
  total_questions: number;
  overall_accuracy: number;
  last_quiz_date: string;
}

export interface QuizSession {
  id: number;
  user_id: string;
  application: string;
  difficulty: ShortcutDifficulty | null;
  score: number;
  total_questions: number;
  correct_answers: number;
  started_at: string;
  completed_at: string | null;
}

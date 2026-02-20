export interface SetupOption {
  id: string;
  title?: string;
  name?: string;
  icon: string;
  description?: string;
}

export interface SetupCompleteOptions {
  app: string;
  layout: string;
  mode: string;
  quizApp: string | null;
  difficulty?: ShortcutDifficulty | null;
  shouldBeFullscreen?: boolean;
}

// 共通型定義

export interface App {
  id: string;
  name: string;
  name_en?: string | null; // English name
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

/**
 * 保護レベルの型定義
 * - none: 保護なし
 * - preventable_fullscreen: 全画面モードでキャプチャ可能
 * - always-protected: 常に保護されている（キャプチャ不可）
 */
export type ProtectionLevel = 'none' | 'preventable_fullscreen' | 'fullscreen-preventable' | 'always-protected';

/**
 * OS種別
 */
export type OSType = 'windows' | 'macos' | 'linux' | 'unknown';

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
  description_en?: string | null; // English description
  difficulty: ShortcutDifficulty;
  application: string;
  category: string | null;
  category_en?: string | null; // English category
  created_at: string;
  platform?: 'Windows' | 'macOS' | 'Cross-Platform';
  windows_keys?: string | null;
  macos_keys?: string | null;
  windows_protection_level?: ProtectionLevel;
  macos_protection_level?: ProtectionLevel;
  press_type: 'sequential' | 'simultaneous'; // 追加
  alternative_group_id?: number | null; // 追加
}

export interface AvailableShortcut extends RichShortcut {
  shortcut: string; // 表示用のショートカット文字列
  windows_protection_level: ProtectionLevel;
  macos_protection_level: ProtectionLevel;
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

export type QuizMode = 'standard' | 'speedrun' | 'practice' | 'default' | 'hardcore';

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

export interface WeakShortcut extends RichShortcut {
  wrong_count: number;
  correct_count: number;
  accuracy: number;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio?: string | null;
  goal?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  layout: string;
  difficulty: ShortcutDifficulty;
  theme: 'light' | 'dark' | 'system';
  showLandingVisualizer: boolean;
  selectedApp?: string;
}

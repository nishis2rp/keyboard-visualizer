import { detectOS } from './os';
import { areShortcutsEquivalent } from '../constants/alternativeShortcuts';

import { getCodeDisplayName } from './keyMapping'; // Import getCodeDisplayName
import { AllShortcuts, ShortcutDetails, RichShortcut, App } from '../types';

// OSを検出
const currentOS = detectOS();

/**
 * 修飾キーの表示順序定義
 */
const MODIFIER_ORDER: { [key: string]: number } = { 
  'Ctrl': 1, 
  'Alt': 2, 
  'Meta': 3, 
  'Shift': 4 
};

/**
 * 修飾キーの文字列を正規化するヘルパー関数
 */
const normalizeModifierKeyString = (key: string): string => {
  const lowerKey = key.toLowerCase();
  if (lowerKey === 'win' || lowerKey === 'cmd') return 'Meta';
  if (lowerKey === 'ctrl' || lowerKey === 'control' || lowerKey === '⌃') return 'Ctrl';
  if (lowerKey === 'alt' || lowerKey === 'option' || lowerKey === '⌥') return 'Alt';
  if (lowerKey === 'shift' || lowerKey === '⇧') return 'Shift';
  return key; // その他のキーはそのまま
};

/**
 * 修飾キーとメインキーを分類してソートするヘルパー
 */
const sortShortcutKeys = (keys: string[]): string[] => {
  const modifiers: string[] = [];
  const mainKeys: string[] = [];

  keys.forEach((key: string) => {
    if (MODIFIER_ORDER[key]) {
      modifiers.push(key);
    } else {
      mainKeys.push(key);
    }
  });

  // 修飾キーをソート (Ctrl, Alt, Meta, Shiftの順)
  modifiers.sort((a, b) => MODIFIER_ORDER[a] - MODIFIER_ORDER[b]);

  return [...modifiers, ...mainKeys];
};

/**
 * Normalizes the shortcut key string.
 */
export const normalizeShortcut = (shortcutString: string): string => {
  if (!shortcutString) return '';

  const keys = shortcutString
    .trim()
    .split(/\s*\+\s*/)
    .map((key: string) => normalizeModifierKeyString(key))
    .map((key: string) => {
      // PgUp/PgDn を PageUp/PageDown に正規化
      if (key === 'PgUp') return 'PageUp';
      if (key === 'PgDn') return 'PageDown';
      // その他のアルファベットキーは大文字に統一
      return key.length === 1 && /[a-zA-Z]/.test(key) ? key.toUpperCase() : key;
    });

  return sortShortcutKeys(keys).join(' + ');
};

/**
 * Converts and normalizes an array of user-pressed keys into a shortcut string.
 */
export const normalizePressedKeys = (pressedCodes: Set<string>, keyboardLayout: string): string => {
  const shiftPressed = pressedCodes.has('ShiftLeft') || pressedCodes.has('ShiftRight');

  const normalizedKeys = Array.from(pressedCodes)
    .map((code: string) => {
      if (code.startsWith('Control')) return 'Ctrl';
      if (code.startsWith('Shift')) return 'Shift';
      if (code.startsWith('Alt')) return 'Alt';
      if (code.startsWith('Meta')) return 'Meta';

      return getCodeDisplayName(code, null, keyboardLayout, shiftPressed);
    })
    .filter(Boolean);

  // 重複を除外してソート
  const uniqueKeys = Array.from(new Set(normalizedKeys));
  const combined = sortShortcutKeys(uniqueKeys).join(' + ');

  return normalizeShortcut(combined);
};

/**
 * Checks if a shortcut can be safely presented as a question.
 */
const isShortcutSafe = (
  _shortcut: string, // Keep for backward compatibility if needed, but we prefer richShortcut
  quizMode: string,
  isFullscreen: boolean,
  richShortcut?: RichShortcut
): boolean => {
  if (!richShortcut) return true;

  const protectionLevel = currentOS === 'macos'
    ? richShortcut.macos_protection_level
    : richShortcut.windows_protection_level;

  if (protectionLevel === 'always-protected') return false;
  if (quizMode === 'hardcore') return true;

  if (!isFullscreen && (protectionLevel === 'preventable_fullscreen' || protectionLevel === 'fullscreen-preventable')) {
    return false;
  }

  return true;
};



/**
 * キーボードレイアウトに基づいて使用可能なアプリをフィルタリング
 * @param {string} keyboardLayout - キーボードレイアウト (e.g., 'windows-jis', 'mac-jis', 'mac-us')
 * @param {App[]} apps - アプリケーションメタデータのリスト
 * @returns {string[]} 使用可能なアプリIDの配列
 */
export const getCompatibleApps = (keyboardLayout: string, apps: App[]): string[] => {
  const isMac = keyboardLayout.startsWith('mac-');

  return apps
    .filter(app => {
      // Macレイアウトの場合、Windows専用アプリを除外
      if (isMac && app.os === 'windows') {
        return false;
      }
      // Windowsレイアウトの場合、Mac専用アプリを除外
      if (!isMac && app.os === 'mac') {
        return false;
      }
      return true;
    })
    .map(app => app.id);
};

/**
 * Creates a question from multiple apps' shortcuts.
 * @param {Object} allShortcuts - All shortcuts organized by app (e.g., {windows11: {...}, chrome: {...}})
 * @param {string[]} allowedApps - Array of app IDs to include in questions
 * @param {string} quizMode - The quiz mode ('default' or 'hardcore').
 * @param {boolean} isFullscreen - Whether fullscreen mode is active.
 * @param {Set<string>} usedShortcuts - Set of already used normalized shortcuts to avoid duplicates.
 * @param {'basic' | 'standard' | 'madmax' | 'allrange'} difficulty - The difficulty level.
 * @param {RichShortcut[]} richShortcuts - Array of shortcuts with protection level information.
 * @param {App[]} apps - Array of application metadata.
 * @returns {{question: string, correctShortcut: string, normalizedCorrectShortcut: string, appName: string} | null} A question object, or null if no shortcuts are available.
 */
export const generateQuestion = (
  allShortcuts: AllShortcuts,
  allowedApps: string[],
  quizMode = 'default',
  isFullscreen = false,
  usedShortcuts = new Set<string>(),
  difficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' = 'standard',
  richShortcuts: RichShortcut[] = [],
  apps: App[] = []
) => {
  // 全ての許可されたアプリのショートカットを収集
  const allSafeShortcuts: any[] = [];
  if (!allowedApps || !Array.isArray(allowedApps)) return null;

  // アプリ名のマップを作成
  const appNameMap = new Map<string, string>();
  apps.forEach(app => {
    appNameMap.set(app.id, app.name);
  });

  // richShortcutsからマップを作成（application + keys でルックアップ）
  const protectionLevelMap = new Map<string, RichShortcut>();
  richShortcuts.forEach(rs => {
    const key = `${rs.application}:${rs.keys}`;
    protectionLevelMap.set(key, rs);
  });

  const allPossibleQuestions: Array<{
    appId: string;
    appName: string;
    shortcut: string;
    description: string;
    normalizedShortcut: string; // 正規化されたショートカットを追加
    press_type: 'sequential' | 'simultaneous'; // 追加
  }> = [];

  allowedApps.forEach(appId => {
    const appShortcuts = allShortcuts[appId];
    if (!appShortcuts) {
      return;
    }

    Object.entries(appShortcuts).forEach(([shortcut, details]: [string, ShortcutDetails]) => {
      const normalized = normalizeShortcut(shortcut);

      // 既に出題済みのショートカットは除外
      if (usedShortcuts.has(normalized)) {
        return;
      }

      // richShortcutsから情報を取得
      const lookupKey = `${appId}:${shortcut}`;
      const richShortcut = protectionLevelMap.get(lookupKey);

      // 安全なショートカットのみを考慮
      if (!isShortcutSafe(shortcut, quizMode, isFullscreen, richShortcut)) {
        return;
      }

      // 難易度フィルタリング
      const shortcutDifficulty = richShortcut?.difficulty || 'standard';
      const isDifficultyMatch = difficulty === 'allrange' || shortcutDifficulty === difficulty;

      if (isDifficultyMatch) {
        allPossibleQuestions.push({
          appId,
          appName: appNameMap.get(appId) || appId,
          shortcut,
          description: details.description,
          normalizedShortcut: normalized,
          press_type: richShortcut?.press_type || 'simultaneous', // ★ 追加
        });
      }
    });
  });

  if (allPossibleQuestions.length === 0) {
    return null;
  }

  // ランダムに1つ選択
  const randomIndex = Math.floor(Math.random() * allPossibleQuestions.length);
  const selected = allPossibleQuestions[randomIndex];

  const question = {
    question: `【${selected.appName}】${selected.description}のショートカットは？`,
    correctShortcut: selected.shortcut,
    normalizedCorrectShortcut: selected.normalizedShortcut, // 既に計算済み
    appName: selected.appName,
    appId: selected.appId,
    press_type: selected.press_type, // ★ 追加
  };

  return question;
};

/**
 * Grace Period for key combination judgment (in milliseconds)
 * Allows user to complete key combination within this time window
 */
export const GRACE_PERIOD_MS = 300;

/**
 * Checks if the user's answer is correct.
 * Supports alternative shortcuts (e.g., Ctrl+C and Ctrl+Insert for copy).
 * @param {string} userAnswer - The normalized shortcut entered by the user.
 * @param {string} normalizedCorrectAnswer - The normalized correct shortcut.
 * @param {RichShortcut[]} richShortcuts - (Optional) Rich shortcuts from DB.
 * @returns {boolean} True if correct.
 */
export const checkAnswer = (userAnswer: string, normalizedCorrectAnswer: string, richShortcuts?: RichShortcut[]): boolean => {
  // 完全一致チェック
  if (userAnswer === normalizedCorrectAnswer) {
    return true;
  }

  // 代替ショートカットチェック
  return areShortcutsEquivalent(userAnswer, normalizedCorrectAnswer, richShortcuts);
};



// Export isShortcutSafe for use in QuizContext
export { isShortcutSafe };

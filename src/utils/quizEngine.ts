import { detectOS } from './os';
import { areShortcutsEquivalent } from '../constants/alternativeShortcuts';
import { PROTECTION_LEVELS, DIFFICULTIES, PRESS_TYPES } from '../constants';
import { normalizeProtectionLevel } from '../constants/protectionLevels';

import { getCodeDisplayName, getUnshiftedKeyForSymbol } from './keyMapping';
 // Import getCodeDisplayName and getUnshiftedKeyForSymbol
import { AllShortcuts, ShortcutDetails, RichShortcut, App, ShortcutDifficulty } from '../types';
import { getLocalizedDescription } from './i18n';

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
  if (lowerKey === 'win' || lowerKey === 'cmd' || lowerKey === '⌘' || lowerKey === '\u2318') return 'Meta';
  if (lowerKey === 'ctrl' || lowerKey === 'control' || lowerKey === '⌃' || lowerKey === '\u2303') return 'Ctrl';
  if (lowerKey === 'alt' || lowerKey === 'option' || lowerKey === '⌥' || lowerKey === '\u2325') return 'Alt';
  if (lowerKey === 'shift' || lowerKey === '⇧' || lowerKey === '\u21e7') return 'Shift';
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
 * Comparison result for detailed feedback
 */
export interface ShortcutComparison {
  correct: string[];
  missing: string[];
  extra: string[];
  isEquivalent: boolean;
}

/**
 * Compares two shortcut strings and returns a detailed breakdown of the differences.
 */
export const compareShortcuts = (
  userAnswer: string,
  correctAnswer: string,
  richShortcuts?: RichShortcut[]
): ShortcutComparison => {
  const normalizedUser = normalizeShortcut(userAnswer);
  const normalizedCorrect = normalizeShortcut(correctAnswer);

  const userKeys = normalizedUser ? normalizedUser.split(' + ') : [];
  const correctKeys = normalizedCorrect ? normalizedCorrect.split(' + ') : [];

  const correct: string[] = [];
  const missing: string[] = [];
  const extra: string[] = [];

  // 一致するキーと不足しているキーを特定
  correctKeys.forEach(key => {
    if (userKeys.includes(key)) {
      correct.push(key);
    } else {
      missing.push(key);
    }
  });

  // 余計なキーを特定
  userKeys.forEach(key => {
    if (!correctKeys.includes(key)) {
      extra.push(key);
    }
  });

  const isEquivalent = areShortcutsEquivalent(normalizedUser, normalizedCorrect, richShortcuts);

  return {
    correct,
    missing,
    extra,
    isEquivalent
  };
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

  const protectionLevel = normalizeProtectionLevel(
    currentOS === 'macos'
      ? richShortcut.macos_protection_level
      : richShortcut.windows_protection_level
  );

  if (protectionLevel === PROTECTION_LEVELS.ALWAYS_PROTECTED) return false;
  if (quizMode === 'hardcore') return true;

  if (!isFullscreen && protectionLevel === PROTECTION_LEVELS.PREVENTABLE_FULLSCREEN) {
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
  difficulty: ShortcutDifficulty = DIFFICULTIES.STANDARD,
  richShortcuts: RichShortcut[] = [],
  apps: App[] = [],
  questionFormat = '[{app}] What is the shortcut for "{description}"?',
  language: 'ja' | 'en' = 'ja',
  customIds?: number[]
) => {
  // 全ての許可されたアプリのショートカットを収集
  if (!allowedApps || !Array.isArray(allowedApps)) return null;

  // アプリ名のマップを作成
  const appNameMap = new Map<string, string>();
  apps.forEach(app => {
    const name = language === 'en' && app.name_en ? app.name_en : app.name;
    appNameMap.set(app.id, name);
  });

  // richShortcutsからマップを作成（application + keys でルックアップ）
  const protectionLevelMap = new Map<string, RichShortcut>();
  const idMap = new Map<number, RichShortcut>();
  richShortcuts.forEach(rs => {
    const key = `${rs.application}:${rs.keys}`;
    protectionLevelMap.set(key, rs);
    idMap.set(rs.id, rs);
  });

  const allPossibleQuestions: Array<{
    appId: string;
    appName: string;
    shortcut: string;
    description: string;
    normalizedShortcut: string;
    press_type: 'sequential' | 'simultaneous';
  }> = [];

  // customIdsが指定されている場合は、それらのみを対象にする
  if (customIds && customIds.length > 0) {
    customIds.forEach(id => {
      const rs = idMap.get(id);
      if (!rs) return;

      const normalized = normalizeShortcut(rs.keys);
      if (usedShortcuts.has(normalized)) return;

      // 安全なショートカットのみを考慮
      if (!isShortcutSafe(rs.keys, quizMode, isFullscreen, rs)) {
        return;
      }

      const description = getLocalizedDescription(rs, language);
      allPossibleQuestions.push({
        appId: rs.application,
        appName: appNameMap.get(rs.application) || rs.application,
        shortcut: rs.keys,
        description,
        normalizedShortcut: normalized,
        press_type: rs.press_type || PRESS_TYPES.SIMULTANEOUS,
      });
    });
  } else {
    allowedApps.forEach(appId => {
      const appShortcuts = allShortcuts[appId];
      if (!appShortcuts) {
        return;
      }

      Object.entries(appShortcuts).forEach(([shortcut, details]) => {
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
        const shortcutDifficulty = richShortcut?.difficulty || DIFFICULTIES.STANDARD;
        const isDifficultyMatch = difficulty === DIFFICULTIES.ALLRANGE || shortcutDifficulty === difficulty;

        if (isDifficultyMatch) {
          // Get localized description
          const description = richShortcut
            ? getLocalizedDescription(richShortcut, language)
            : details.description;

          allPossibleQuestions.push({
            appId,
            appName: appNameMap.get(appId) || appId,
            shortcut,
            description,
            normalizedShortcut: normalized,
            press_type: richShortcut?.press_type || PRESS_TYPES.SIMULTANEOUS,
          });
        }
      });
    });
  }

  if (allPossibleQuestions.length === 0) {
    return null;
  }

  // ランダムに1つ選択
  const randomIndex = Math.floor(Math.random() * allPossibleQuestions.length);
  const selected = allPossibleQuestions[randomIndex];

  const questionText = questionFormat
    .replace('{app}', selected.appName)
    .replace('{description}', selected.description);

  const question = {
    question: questionText,
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
 * @param {string} keyboardLayout - (Optional) Keyboard layout for symbol mapping.
 * @returns {boolean} True if correct.
 */
export const checkAnswer = (userAnswer: string, normalizedCorrectAnswer: string, richShortcuts?: RichShortcut[], keyboardLayout?: string): boolean => {
  // 完全一致チェック
  if (userAnswer === normalizedCorrectAnswer) {
    return true;
  }

  // 代替ショートカットチェック (既存のロジック)
  if (areShortcutsEquivalent(userAnswer, normalizedCorrectAnswer, richShortcuts)) {
    return true;
  }

  // Shift関連の記号/数字の読み替えチェック
  // 例: userAnswer="Ctrl + Shift + !" vs correctAnswer="Ctrl + Shift + 1"
  if (keyboardLayout && (userAnswer.includes('Shift') || normalizedCorrectAnswer.includes('Shift'))) {
    const userParts = userAnswer.split(' + ');
    const correctParts = normalizedCorrectAnswer.split(' + ');

    if (userParts.length === correctParts.length) {
      // 最後のキー以外が一致しているか確認
      const baseMatch = userParts.slice(0, -1).every((part, i) => part === correctParts[i]);
      if (baseMatch) {
        const userLastKey = userParts[userParts.length - 1];
        const correctLastKey = correctParts[correctParts.length - 1];

        // userAnswerの記号を数字に変換して比較
        const unshiftedUser = getUnshiftedKeyForSymbol(userLastKey, keyboardLayout);
        if (unshiftedUser === correctLastKey) {
          return true;
        }

        // correctAnswerの記号を数字に変換して比較
        const unshiftedCorrect = getUnshiftedKeyForSymbol(correctLastKey, keyboardLayout);
        if (unshiftedCorrect === userLastKey) {
          return true;
        }
      }
    }
  }

  return false;
};



// Export isShortcutSafe for use in QuizContext
export { isShortcutSafe };

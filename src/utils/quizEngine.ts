import {
  ALWAYS_PROTECTED_SHORTCUTS,
  FULLSCREEN_PREVENTABLE_SHORTCUTS,
  detectOS
} from '../constants/systemProtectedShortcuts';
import { areShortcutsEquivalent } from '../constants/alternativeShortcuts';
import { matchesDifficulty } from '../constants/shortcutDifficulty';
import { allShortcuts } from '../data/shortcuts';
import { isSequentialShortcut } from './sequentialShortcuts';

// OSを検出
const currentOS = detectOS();

/**
 * Normalizes the shortcut key string.
 * - Allows for comparison independent of modifier key order by sorting the keys.
 * - Treats the 'Win' key as the 'Meta' key (for consistency with macOS's Cmd key).
 * - Standardizes modifier keys to uppercase.
 * - Standardizes main alphabet keys to uppercase to match test cases.
 * @param {string} shortcutString - A shortcut string like 'Ctrl + Shift + A'.
 * @returns {string} The normalized shortcut string.
 */
export const normalizeShortcut = (shortcutString) => {
  if (!shortcutString) return '';

  const keys = shortcutString
    .replace(/ /g, '') // スペースを削除
    .split('+')
    .map(key => {
      const lowerKey = key.toLowerCase();
      // 'Win'キーは'Meta'に変換し、'Cmd'も'Meta'に変換
      if (lowerKey === 'win' || lowerKey === 'cmd') return 'Meta';
      // 修飾キーは最初が大文字で統一
      if (lowerKey === 'ctrl' || lowerKey === 'control' || lowerKey === '⌃') return 'Ctrl';
      if (lowerKey === 'alt' || lowerKey === 'option' || lowerKey === '⌥') return 'Alt';
      if (lowerKey === 'shift' || lowerKey === '⇧') return 'Shift';
      if (lowerKey === 'meta') return 'Meta';
      // その他のアルファベットキーは大文字に統一（テストケースに合わせる）
      return key.length === 1 && /[a-zA-Z]/.test(key) ? key.toUpperCase() : key;
    });

  const modifiers = [];
  const mainKeys = [];

  keys.forEach(key => {
    // 既に正規化された後なので、'Ctrl', 'Alt', 'Shift', 'Meta' のいずれかかをチェック
    if (key === 'Ctrl' || key === 'Alt' || key === 'Shift' || key === 'Meta') {
      modifiers.push(key);
    } else {
      mainKeys.push(key);
    }
  });

  // 修飾キーをソート (Ctrl, Alt, Meta, Shiftの順)
  modifiers.sort((a, b) => {
    const order = { 'Ctrl': 1, 'Alt': 2, 'Meta': 3, 'Shift': 4 }; // MetaをShiftの前に
    return order[a] - order[b];
  });

  // メインキーと修飾キーを結合
  return [...modifiers, ...mainKeys].join('+');
};

/**
 * Converts and normalizes an array of user-pressed keys into a shortcut string.
 * @param {Set<string>} pressedCodes - A set of codes for currently pressed keys (e.g., new Set(['ControlLeft', 'KeyA'])).
 * @returns {string} The normalized shortcut string.
 */
export const normalizePressedKeys = (pressedCodes) => {
  const keys = Array.from(pressedCodes)
    .map(code => {
      // 修飾キーのコードを正規化された名前に変換
      if (code.startsWith('Control')) return 'Ctrl';
      if (code.startsWith('Shift')) return 'Shift';
      if (code.startsWith('Alt')) return 'Alt';
      if (code.startsWith('Meta')) return 'Meta'; // Metaキーは常にMetaに統一

      // その他のキーはKeyboardEvent.codeからキー名を推測する
      let cleanKey = code.replace(/^(Key|Digit|Numpad)/, '');

      // アルファベットキー
      if (cleanKey.length === 1 && /[a-zA-Z]/.test(cleanKey)) {
        return cleanKey.toUpperCase(); // normalizeShortcutと同じく大文字に統一
      }
      // 矢印キー
      else if (cleanKey.startsWith('Arrow')) {
        switch(cleanKey) {
          case 'ArrowUp': return '↑';
          case 'ArrowDown': return '↓';
          case 'ArrowLeft': return '←';
          case 'ArrowRight': return '→';
          default: return cleanKey;
        }
      }
      // その他の特殊キー
      return cleanKey;
    })
    .filter(Boolean); // 空のキーを除外

  // 重複を除外し、normalizeShortcutで最終的な正規化を行う
  const uniqueKeys = Array.from(new Set(keys));
  const result = normalizeShortcut(uniqueKeys.join('+'));

  return result;
};


// 保護されたショートカットを正規化したSetを作成
const normalizedAlwaysProtected = new Set(
  Array.from(ALWAYS_PROTECTED_SHORTCUTS).map(s => normalizeShortcut(s))
);
const normalizedFullscreenPreventable = new Set(
  Array.from(FULLSCREEN_PREVENTABLE_SHORTCUTS).map(s => normalizeShortcut(s))
);

/**
 * Checks if a shortcut can be safely presented as a question.
 * @param {string} shortcut - The shortcut string (e.g., 'Ctrl + W').
 * @param {string} quizMode - The quiz mode ('default' or 'hardcore').
 * @param {boolean} isFullscreen - Whether fullscreen mode is active.
 * @returns {boolean} True if it can be safely presented.
 */
const isShortcutSafe = (shortcut, quizMode, isFullscreen) => {
  const normalizedShortcut = normalizeShortcut(shortcut);

  // 常に保護されているショートカットは、どのモードでも安全ではない
  if (normalizedAlwaysProtected.has(normalizedShortcut)) {
    return false;
  }

  // 全画面モードでない場合、フルスクリーンで防止可能なショートカットも除外
  if (!isFullscreen && normalizedFullscreenPreventable.has(normalizedShortcut)) {
    return false;
  }

  // システム保護されたショートカット以外はすべて許可
  return true;
};

// アプリケーション名の日本語表示マップ
const APP_DISPLAY_NAMES = {
  'windows11': 'Windows 11',
  'macos': 'macOS',
  'chrome': 'Chrome',
  'excel': 'Excel',
  'slack': 'Slack',
  'gmail': 'Gmail',
};

/**
 * キーボードレイアウトに基づいて使用可能なアプリをフィルタリング
 * @param {string} keyboardLayout - キーボードレイアウト (e.g., 'windows-jis', 'mac-jis', 'mac-us')
 * @returns {string[]} 使用可能なアプリIDの配列
 */
export const getCompatibleApps = (keyboardLayout) => {
  const isMac = keyboardLayout.startsWith('mac-');

  const allApps = ['windows11', 'macos', 'chrome', 'excel', 'slack', 'gmail'];

  return allApps.filter(appId => {
    // Macレイアウトの場合、Windows 11を除外
    if (isMac && appId === 'windows11') {
      return false;
    }
    // Windowsレイアウトの場合、macOSを除外
    if (!isMac && appId === 'macos') {
      return false;
    }
    return true;
  });
};

/**
 * Creates a question from multiple apps' shortcuts.
 * @param {Object} allShortcuts - All shortcuts organized by app (e.g., {windows11: {...}, chrome: {...}})
 * @param {string[]} allowedApps - Array of app IDs to include in questions
 * @param {string} quizMode - The quiz mode ('default' or 'hardcore').
 * @param {boolean} isFullscreen - Whether fullscreen mode is active.
 * @param {Set<string>} usedShortcuts - Set of already used normalized shortcuts to avoid duplicates.
 * @param {'basic' | 'standard' | 'madmax' | 'allrange'} difficulty - The difficulty level.
 * @returns {{question: string, correctShortcut: string, normalizedCorrectShortcut: string, appName: string} | null} A question object, or null if no shortcuts are available.
 */
export const generateQuestion = (allShortcuts, allowedApps, quizMode = 'default', isFullscreen = false, usedShortcuts = new Set(), difficulty: 'basic' | 'standard' | 'madmax' | 'allrange' = 'standard') => {
  // 全ての許可されたアプリのショートカットを収集
  const allSafeShortcuts = [];

  allowedApps.forEach(appId => {
    const appShortcuts = allShortcuts[appId];
    if (!appShortcuts) {
      return;
    }

    const shortcutEntries = Object.entries(appShortcuts);

    // Filter for safe shortcuts only
    const safeShortcuts = shortcutEntries.filter(([shortcut, _]) => {
      return isShortcutSafe(shortcut, quizMode, isFullscreen);
    });

    // 各ショートカットにアプリ情報を追加（未使用 & 難易度に適合するもののみ）
    safeShortcuts.forEach(([shortcut, description]) => {
      const normalized = normalizeShortcut(shortcut);
      // 既に出題済みのショートカットは除外
      if (!usedShortcuts.has(normalized)) {
        // 難易度フィルタリング
        if (matchesDifficulty(normalized, difficulty)) {
          allSafeShortcuts.push({
            appId,
            appName: APP_DISPLAY_NAMES[appId] || appId,
            shortcut,
            description
          });
        }
      }
    });
  });

  if (allSafeShortcuts.length === 0) {
    return null;
  }

  // ランダムに1つ選択
  const randomIndex = Math.floor(Math.random() * allSafeShortcuts.length);
  const selected = allSafeShortcuts[randomIndex];

  const isSeq = isSequentialShortcut(selected.shortcut);

  const question = {
    question: `【${selected.appName}】${selected.description}のショートカットは？`,
    correctShortcut: selected.shortcut,
    normalizedCorrectShortcut: normalizeShortcut(selected.shortcut),
    appName: selected.appName,
    appId: selected.appId,
    isSequential: isSeq,
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
 * @returns {boolean} True if correct.
 */
export const checkAnswer = (userAnswer, normalizedCorrectAnswer) => {
  // 完全一致チェック
  if (userAnswer === normalizedCorrectAnswer) {
    return true;
  }

  // 代替ショートカットチェック
  return areShortcutsEquivalent(userAnswer, normalizedCorrectAnswer);
};

/**
 * Checks if the user's answer is correct with grace period consideration.
 * Supports alternative shortcuts (e.g., Ctrl+C and Ctrl+Insert for copy).
 * @param {string} userAnswer - The normalized shortcut entered by the user.
 * @param {string} normalizedCorrectAnswer - The normalized correct shortcut.
 * @param {number} answerTimeMs - Time taken to answer (in milliseconds).
 * @returns {boolean} True if correct.
 */
export const checkAnswerWithGracePeriod = (userAnswer, normalizedCorrectAnswer, answerTimeMs) => {
  // Use the same logic as checkAnswer (supports alternative shortcuts)
  return checkAnswer(userAnswer, normalizedCorrectAnswer);
};

// --- Test exports (only used during development) ---
export const _testExports = process.env.NODE_ENV === 'test' ? { isShortcutSafe } : {};

import {
  ALWAYS_PROTECTED_SHORTCUTS,
  FULLSCREEN_PREVENTABLE_SHORTCUTS,
  detectOS
} from '../constants/systemProtectedShortcuts';
import { allShortcuts } from '../data/shortcuts';

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
      if (lowerKey === 'ctrl' || lowerKey === 'control') return 'Ctrl';
      if (lowerKey === 'alt') return 'Alt';
      if (lowerKey === 'shift') return 'Shift';
      if (lowerKey === 'meta') return 'Meta';
      // その他のアルファベットキーは大文字に統一（テストケースに合わせる）
      return key.length === 1 && /[a-zA-Z]/.test(key) ? key.toUpperCase() : key;
    });

  const modifiers = [];
  const mainKeys = [];

  keys.forEach(key => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === 'ctrl' || lowerKey === 'alt' || lowerKey === 'shift' || lowerKey === 'meta') {
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
 * @param {string} layout - The keyboard layout.
 * @returns {string} The normalized shortcut string.
 */
export const normalizePressedKeys = (pressedCodes, layout) => {
  const keys = Array.from(pressedCodes)
    .map(code => {
      // 修飾キーのコードを正規化された名前に変換
      if (code.startsWith('Control')) return 'Ctrl';
      if (code.startsWith('Shift')) return 'Shift';
      if (code.startsWith('Alt')) return 'Alt';
      if (code.startsWith('Meta')) return (currentOS === 'macos' ? 'Cmd' : 'Win'); // OSに応じてMetaキーの表示を調整
      
      // その他のキーはKeyboardEvent.codeからキー名を推測する
      // ここでは簡易的にKey/Digit/Numpadプレフィックスを削除し、アルファベットを小文字に
      let cleanKey = code.replace(/^(Key|Digit|Numpad)/, '');
      if (cleanKey.length === 1 && /[a-zA-Z]/.test(cleanKey)) {
        return cleanKey.toLowerCase(); // アルファベットは小文字に統一
      } else if (cleanKey.startsWith('Arrow')) {
        switch(cleanKey) { // 矢印キーは記号に変換
          case 'ArrowUp': return '↑';
          case 'ArrowDown': return '↓';
          case 'ArrowLeft': return '←';
          case 'ArrowRight': return '→';
          default: return cleanKey;
        }
      }
      return cleanKey;
    })
    .filter(Boolean); // 空のキーを除外

  // 重複を除外し、normalizeShortcutで最終的な正規化を行う
  const uniqueKeys = Array.from(new Set(keys));
  return normalizeShortcut(uniqueKeys.join('+'));
};


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
  // normalizeShortcutでWin -> Meta に変換されるため、ALWAYS_PROTECTED_SHORTCUTSもMetaベースで比較
  if (ALWAYS_PROTECTED_SHORTCUTS.has(normalizedShortcut)) {
    return false;
  }

  // ハードコアモードでない場合
  if (quizMode !== 'hardcore') {
    // フルスクリーンで防げるショートカットは、フルスクリーンでなければ安全ではない
    if (FULLSCREEN_PREVENTABLE_SHORTCUTS.has(normalizedShortcut) && !isFullscreen) {
      return false;
    }
  }
  // ハードコアモードの場合は、ALWAYS_PROTECTED_SHORTCUTS以外は全て安全
  // デフォルトモードの場合、フルスクリーンならFULLSCREEN_PREVENTABLE_SHORTCUTSも安全
  return true;
};

/**
 * Creates a question from a shortcut.
 * @param {Object} shortcuts - The application's shortcut definitions (e.g., {'Ctrl+S': 'Save'}).
 * @param {string} quizMode - The quiz mode ('default' or 'hardcore').
 * @param {boolean} isFullscreen - Whether fullscreen mode is active.
 * @returns {{question: string, correctShortcut: string, normalizedCorrectShortcut: string} | null} A question object, or null if no shortcuts are available.
 */
export const generateQuestion = (shortcuts, quizMode = 'default', isFullscreen = false) => {
  const shortcutEntries = Object.entries(shortcuts);

  if (shortcutEntries.length === 0) {
    return null;
  }

  // Filter for safe shortcuts only
  const safeShortcuts = shortcutEntries.filter(([shortcut, _]) =>
    isShortcutSafe(shortcut, quizMode, isFullscreen)
  );

  if (safeShortcuts.length === 0) {
    console.warn('No safe shortcuts available. Check filter settings.');
    return null;
  }

  const randomIndex = Math.floor(Math.random() * safeShortcuts.length);
  const [correctShortcut, description] = safeShortcuts[randomIndex];

  return {
    question: `${description}のショートカットは？`,
    correctShortcut: correctShortcut,
    normalizedCorrectShortcut: normalizeShortcut(correctShortcut),
  };
};

/**
 * Checks if the user's answer is correct.
 * @param {string} userAnswer - The normalized shortcut entered by the user.
 * @param {string} normalizedCorrectAnswer - The normalized correct shortcut.
 * @returns {boolean} True if correct.
 */
export const checkAnswer = (userAnswer, normalizedCorrectAnswer) => {
  return userAnswer === normalizedCorrectAnswer;
};

// --- Test exports (only used during development) ---
export const _testExports = process.env.NODE_ENV === 'test' ? { isShortcutSafe } : {};

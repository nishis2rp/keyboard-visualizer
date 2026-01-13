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
  console.log('[normalizePressedKeys] Input codes:', Array.from(pressedCodes));

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

  console.log('[normalizePressedKeys] Mapped keys:', keys);

  // 重複を除外し、normalizeShortcutで最終的な正規化を行う
  const uniqueKeys = Array.from(new Set(keys));
  const result = normalizeShortcut(uniqueKeys.join('+'));

  console.log('[normalizePressedKeys] Final result:', result);

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

  // 全画面でない場合は、安全なショートカットのみを許可（ホワイトリスト方式）
  if (!isFullscreen) {
    // 安全なショートカットのリスト（ブラウザ・OS機能と競合しない）
    const safeShortcuts = new Set([
      // 基本的な編集ショートカット
      normalizeShortcut('Ctrl + C'),    // コピー
      normalizeShortcut('Ctrl + V'),    // 貼り付け
      normalizeShortcut('Ctrl + X'),    // 切り取り
      normalizeShortcut('Ctrl + Z'),    // 元に戻す
      normalizeShortcut('Ctrl + Y'),    // やり直し
      normalizeShortcut('Ctrl + A'),    // すべて選択
      normalizeShortcut('Ctrl + F'),    // 検索（ページ内検索は問題ない）

      // Shiftとの組み合わせ
      normalizeShortcut('Ctrl + Shift + Z'),  // やり直し
      normalizeShortcut('Shift + ↑'),   // 上方向に選択
      normalizeShortcut('Shift + ↓'),   // 下方向に選択
      normalizeShortcut('Shift + ←'),   // 左方向に選択
      normalizeShortcut('Shift + →'),   // 右方向に選択

      // 矢印キー単体
      normalizeShortcut('↑'),
      normalizeShortcut('↓'),
      normalizeShortcut('←'),
      normalizeShortcut('→'),

      // Mac版
      normalizeShortcut('Meta + C'),
      normalizeShortcut('Meta + V'),
      normalizeShortcut('Meta + X'),
      normalizeShortcut('Meta + Z'),
      normalizeShortcut('Meta + Y'),
      normalizeShortcut('Meta + A'),
      normalizeShortcut('Meta + F'),
      normalizeShortcut('Meta + Shift + Z'),
    ]);

    const isSafe = safeShortcuts.has(normalizedShortcut);
    console.log('[isShortcutSafe]', normalizedShortcut, '→', isSafe ? 'SAFE' : 'UNSAFE (not in whitelist)');
    return isSafe;
  }

  // 全画面の場合は、ALWAYS_PROTECTED以外は全て許可
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
 * @returns {{question: string, correctShortcut: string, normalizedCorrectShortcut: string, appName: string} | null} A question object, or null if no shortcuts are available.
 */
export const generateQuestion = (allShortcuts, allowedApps, quizMode = 'default', isFullscreen = false) => {
  console.log('[generateQuestion] Input:', {
    allowedApps,
    quizMode,
    isFullscreen
  });

  // 全ての許可されたアプリのショートカットを収集
  const allSafeShortcuts = [];

  allowedApps.forEach(appId => {
    const appShortcuts = allShortcuts[appId];
    if (!appShortcuts) {
      console.warn(`[generateQuestion] No shortcuts found for app: ${appId}`);
      return;
    }

    const shortcutEntries = Object.entries(appShortcuts);

    // Filter for safe shortcuts only
    const safeShortcuts = shortcutEntries.filter(([shortcut, _]) => {
      return isShortcutSafe(shortcut, quizMode, isFullscreen);
    });

    // 各ショートカットにアプリ情報を追加
    safeShortcuts.forEach(([shortcut, description]) => {
      allSafeShortcuts.push({
        appId,
        appName: APP_DISPLAY_NAMES[appId] || appId,
        shortcut,
        description
      });
    });
  });

  console.log('[generateQuestion] Total safe shortcuts:', {
    count: allSafeShortcuts.length,
    byApp: allowedApps.reduce((acc, appId) => {
      acc[appId] = allSafeShortcuts.filter(s => s.appId === appId).length;
      return acc;
    }, {})
  });

  if (allSafeShortcuts.length === 0) {
    console.warn('[generateQuestion] No safe shortcuts available from any app');
    return null;
  }

  // ランダムに1つ選択
  const randomIndex = Math.floor(Math.random() * allSafeShortcuts.length);
  const selected = allSafeShortcuts[randomIndex];

  const question = {
    question: `【${selected.appName}】${selected.description}のショートカットは？`,
    correctShortcut: selected.shortcut,
    normalizedCorrectShortcut: normalizeShortcut(selected.shortcut),
    appName: selected.appName,
    appId: selected.appId,
  };

  console.log('[generateQuestion] Generated question:', question);

  return question;
};

/**
 * Grace Period for key combination judgment (in milliseconds)
 * Allows user to complete key combination within this time window
 */
export const GRACE_PERIOD_MS = 300;

/**
 * Checks if the user's answer is correct.
 * @param {string} userAnswer - The normalized shortcut entered by the user.
 * @param {string} normalizedCorrectAnswer - The normalized correct shortcut.
 * @returns {boolean} True if correct.
 */
export const checkAnswer = (userAnswer, normalizedCorrectAnswer) => {
  return userAnswer === normalizedCorrectAnswer;
};

/**
 * Checks if the user's answer is correct with grace period consideration.
 * @param {string} userAnswer - The normalized shortcut entered by the user.
 * @param {string} normalizedCorrectAnswer - The normalized correct shortcut.
 * @param {number} answerTimeMs - Time taken to answer (in milliseconds).
 * @returns {boolean} True if correct.
 */
export const checkAnswerWithGracePeriod = (userAnswer, normalizedCorrectAnswer, answerTimeMs) => {
  // Within grace period, allow answer
  if (answerTimeMs <= GRACE_PERIOD_MS) {
    return userAnswer === normalizedCorrectAnswer;
  }
  // After grace period, still check for correctness
  return userAnswer === normalizedCorrectAnswer;
};

// --- Test exports (only used during development) ---
export const _testExports = process.env.NODE_ENV === 'test' ? { isShortcutSafe } : {};

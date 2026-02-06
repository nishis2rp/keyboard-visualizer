import { detectOS } from './os';
import { areShortcutsEquivalent } from '../constants/alternativeShortcuts';

import { getCodeDisplayName } from './keyMapping'; // Import getCodeDisplayName
import { AllShortcuts, ShortcutDetails, RichShortcut, App } from '../types';

// OSを検出
const currentOS = detectOS();

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
 * Normalizes the shortcut key string.
 * - Allows for comparison independent of modifier key order by sorting the keys.
 * - Treats the 'Win' key as the 'Meta' key (for consistency with macOS's Cmd key).
 * - Standardizes modifier keys to uppercase.
 * - Standardizes main alphabet keys to uppercase to match test cases.
 * - Normalizes PgUp/PgDn to PageUp/PageDown for database consistency.
 * @param {string} shortcutString - A shortcut string like 'Ctrl + Shift + A'.
 * @returns {string} The normalized shortcut string.
 */
export const normalizeShortcut = (shortcutString: string): string => {
  if (!shortcutString) return '';

  const keys = shortcutString
    .trim() // 先頭と末尾のスペースを削除
    .split(/\s*\+\s*/) // スペースと+で分割
    .map((key: string) => normalizeModifierKeyString(key))
    .map((key: string) => {
      // PgUp/PgDn を PageUp/PageDown に正規化
      if (key === 'PgUp') return 'PageUp';
      if (key === 'PgDn') return 'PageDown';
      // その他のアルファベットキーは大文字に統一（テストケースに合わせる）
      return key.length === 1 && /[a-zA-Z]/.test(key) ? key.toUpperCase() : key;
    });

  const modifiers: string[] = [];
  const mainKeys: string[] = [];

  keys.forEach((key: string) => {
    // 既に正規化された後なので、'Ctrl', 'Alt', 'Shift', 'Meta' のいずれかかをチェック
    if (key === 'Ctrl' || key === 'Alt' || key === 'Shift' || key === 'Meta') {
      modifiers.push(key);
    } else {
      mainKeys.push(key);
    }
  });

  // 修飾キーをソート (Ctrl, Alt, Meta, Shiftの順)
  modifiers.sort((a, b) => {
    const order: { [key: string]: number } = { 'Ctrl': 1, 'Alt': 2, 'Meta': 3, 'Shift': 4 }; // MetaをShiftの前に
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
export const normalizePressedKeys = (pressedCodes: Set<string>, keyboardLayout: string): string => {
  const shiftPressed = pressedCodes.has('ShiftLeft') || pressedCodes.has('ShiftRight');

  const normalizedKeys = Array.from(pressedCodes)
    .map((code: string) => {
      // 修飾キーのコードを正規化された名前に変換 (normalizeModifierKeyStringを使用)
      if (code.startsWith('Control')) return normalizeModifierKeyString('Control');
      if (code.startsWith('Shift')) return normalizeModifierKeyString('Shift');
      if (code.startsWith('Alt')) return normalizeModifierKeyString('Alt');
      if (code.startsWith('Meta')) return normalizeModifierKeyString('Meta');

      // 非修飾キーの場合、getCodeDisplayNameを使用してシンボルを決定
      const displayName = getCodeDisplayName(code, null, keyboardLayout, shiftPressed);
      return displayName;
    })
    .filter(Boolean); // 空のキーを除外

  const modifiers: string[] = [];
  const mainKeys: string[] = [];

  Array.from(new Set(normalizedKeys)).forEach((key: string) => { // 重複を除外
    if (key === 'Ctrl' || key === 'Alt' || key === 'Shift' || key === 'Meta') {
      modifiers.push(key);
    } else {
      mainKeys.push(key);
    }
  });

  // 修飾キーをソート (Ctrl, Alt, Meta, Shiftの順)
  modifiers.sort((a, b) => {
    const order: { [key: string]: number } = { 'Ctrl': 1, 'Alt': 2, 'Meta': 3, 'Shift': 4 };
    return order[a] - order[b];
  });

  // メインキーと修飾キーを結合
  const combined = [...modifiers, ...mainKeys].join('+');

  // さらに正規化してPgDn→PageDown、矢印記号→ArrowXxxなどの変換を行う
  return normalizeShortcut(combined);
};


/**
 * Checks if a shortcut can be safely presented as a question.
 * @param {string} shortcut - The shortcut string (e.g., 'Ctrl + W').
 * @param {string} quizMode - The quiz mode ('default' or 'hardcore').
 * @param {boolean} isFullscreen - Whether fullscreen mode is active.
 * @param {RichShortcut} richShortcut - (Optional) Rich shortcut object from DB containing protection levels.
 * @returns {boolean} True if it can be safely presented.
 */
const isShortcutSafe = (
  _shortcut: string,
  quizMode: string,
  isFullscreen: boolean,
  richShortcut?: RichShortcut
): boolean => {
  // DB情報がない場合は、安全と見なす（DBが唯一の正解ソース）
  if (!richShortcut) {
    return true;
  }

  const protectionLevel = currentOS === 'macos'
    ? richShortcut.macos_protection_level
    : richShortcut.windows_protection_level;

  // always-protected は常に除外
  if (protectionLevel === 'always-protected') {
    return false;
  }

  // ハードコアモードでは、フルスクリーン防止可能ショートカットは安全と見なす
  if (quizMode === 'hardcore') {
    return true;
  }

  // デフォルトモードで、フルスクリーンでなく、かつ防止可能レベルの場合は安全ではない
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

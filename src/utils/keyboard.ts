import { getCodeDisplayName, getShiftedSymbolForKey, getPossibleKeyNamesFromDisplay, getUnshiftedKeyForSymbol } from './keyMapping'
import { MODIFIER_ORDER, MODIFIER_KEY_NAMES } from './keyUtils'
import { AppShortcuts, ShortcutDetails, RichShortcut, AvailableShortcut, ProtectionLevel } from '../types' // ★ RichShortcut, AvailableShortcutを追加
import { detectOS } from './os' // ★ detectOSを追加
import { getSequentialKeys } from './sequentialShortcuts' // ★ 追加
import { normalizeProtectionLevel, PROTECTION_LEVELS } from '../constants/protectionLevels' // ★ 保護レベル定数
import { sortByModifierAndKeyboard } from './shortcutSort'

// Detect OS once at module level (value never changes during session)
const OS = detectOS();

/**
 * キーの正規化
 * アルファベット1文字の場合は小文字に統一
 */
export const normalizeKey = (key: string): string => {
  // アルファベット1文字の場合は小文字に統一（macOSのCmd+キーの大文字小文字問題対策）
  if (key.length === 1 && /[a-zA-Z]/.test(key)) {
    return key.toLowerCase()
  }
  return key
}

/**
 * ショートカット文字列内のアルファベットキーを小文字に正規化する
 * (例: "Ctrl + Shift + A" -> "Ctrl + Shift + a")
 * 修飾キーやシンボルキーは変更しない
 * macOSの記号 (⌘, ⌥, ⇧, ⌃) を標準的な名称 (Cmd, Alt, Shift, Ctrl) に変換して比較しやすくする
 */
export const normalizeShortcutCombo = (combo: string): string => {
  const symbolMap: Record<string, string> = {
    '⌘': 'Cmd',
    '⌥': 'Alt',
    '⇧': 'Shift',
    '⌃': 'Ctrl',
    'Option': 'Alt',
    'Control': 'Ctrl',
    'Command': 'Cmd'
  };

  return combo.split(' + ').map(part => {
    // 修飾キーの正規化（記号または別名を標準名称に変換）
    const normalizedPart = symbolMap[part] || part;

    // アルファベット1文字で、かつ修飾キーや特殊シンボルでない場合のみ小文字にする
    if (normalizedPart.length === 1 && /[a-zA-Z]/.test(normalizedPart) && !MODIFIER_KEY_NAMES.has(normalizedPart) && !/^[!@#$%^&*()_+{}|:"<>?~]$/.test(normalizedPart)) {
      return normalizedPart.toLowerCase();
    }
    return normalizedPart;
  }).join(' + ');
};

/** 利用可能なショートカットの最大表示数 */
const MAX_SHORTCUTS_DISPLAY = Infinity

/**
 * 修飾キーのセットが一致するかチェック
 * 両方のセットのサイズが同じで、すべての要素が一致する必要がある
 */
const modifierKeysMatch = (
  pressedModifiers: string[],
  shortcutModifiers: string[]
): boolean => {
  const pressedSet = new Set(pressedModifiers.map(m => normalizeKey(m)));
  const shortcutSet = new Set(shortcutModifiers.map(m => normalizeKey(m)));

  return pressedSet.size === shortcutSet.size &&
         [...pressedSet].every(m => shortcutSet.has(m));
};

/**
 * 押されたキーがショートカットに含まれているかチェック（Shift対応）
 */
const isKeyInShortcut = (
  pressedKey: string,
  shortcutKeys: string[],
  shiftPressed: boolean,
  layout: string
): boolean => {
  const normalizedShortcutKeys = shortcutKeys.map(k => normalizeKey(k));
  const normalizedPressedKey = normalizeKey(pressedKey);

  // 直接一致するかチェック
  if (normalizedShortcutKeys.includes(normalizedPressedKey)) return true;

  // Shiftが押されている場合、代替キー（記号 <-> 数字）もチェック
  if (shiftPressed) {
    const unshifted = getUnshiftedKeyForSymbol(pressedKey, layout);
    if (unshifted && normalizedShortcutKeys.includes(normalizeKey(unshifted))) {
      return true;
    }

    // 逆のパターン（1 -> !）も考慮
    if (/^\d$/.test(pressedKey)) {
      const shifted = getShiftedSymbolForKey(`Digit${pressedKey}`, layout);
      if (shifted && normalizedShortcutKeys.includes(normalizeKey(shifted))) {
        return true;
      }
    }
  }

  return false;
};

/**
 * すべての押されたキーがショートカットに含まれているかチェック
 */
const allPressedKeysInShortcut = (
  pressedKeys: string[],
  shortcutKeys: string[],
  shiftPressed: boolean,
  layout: string
): boolean => {
  return pressedKeys.every(pressedKey =>
    isKeyInShortcut(pressedKey, shortcutKeys, shiftPressed, layout)
  );
};

/**
 * ショートカットを候補として含めるべきか判定
 */
const shouldIncludeShortcutAsCandidate = (
  pressedKeys: string[],
  shortcutKeys: string[],
  allKeysMatch: boolean
): boolean => {
  const pressedModifiers = pressedKeys.filter(key => MODIFIER_KEY_NAMES.has(key));
  const shortcutModifiers = shortcutKeys.filter(key => MODIFIER_KEY_NAMES.has(key));
  const hasNonModifierPressed = pressedKeys.some(key => !MODIFIER_KEY_NAMES.has(key));

  // 1. 完全一致
  if (allKeysMatch && pressedKeys.length === shortcutKeys.length) {
    return true;
  }

  // 2. 非修飾キーが含まれている場合
  if (hasNonModifierPressed) {
    // 修飾キーの構成が完全に一致し、ショートカットの方がキー数が多い（未完成）
    const modifiersMatch = modifierKeysMatch(pressedModifiers, shortcutModifiers);
    return modifiersMatch && allKeysMatch && pressedKeys.length < shortcutKeys.length;
  }

  // 3. 修飾キーのみが押されている場合
  if (pressedModifiers.length > 0) {
    return pressedModifiers.every(mod => shortcutModifiers.includes(mod));
  }

  return false;
};

/**
 * キーコードを修飾キーの順序でソート
 * @param {Array<string>} codes - ソートするキーの配列 (KeyboardEvent.code)
 * @returns {Array<string>} ソート済みのキー配列
 */
export const sortKeys = (codes) => {
  return codes.sort((a, b) => {
    const aOrder = MODIFIER_ORDER[a] || 999
    const bOrder = MODIFIER_ORDER[b] || 999
    return aOrder - bOrder
  })
}

/**
 * キーコードの組み合わせをテキストに変換
 * @param {Array<string>} codesArray - キーの配列 (KeyboardEvent.code)
 * @param {string} layout - キーボードレイアウト ('macUs', 'macJis', 'windowsJis')
 * @returns {string} "Ctrl + Shift + A" のような表示名形式の文字列
 */
export const getKeyComboText = (codesArray: string[], layout: string) => {
  const sortedCodes = sortKeys([...codesArray])
  const shiftPressed = codesArray.includes('ShiftLeft') || codesArray.includes('ShiftRight');
  
  // getCodeDisplayNameはcodeとkeyとlayoutとshiftPressedを受け取る
  // ここではkeyは不明なのでnullを渡す
  return sortedCodes.map(code => getCodeDisplayName(code, null, layout, shiftPressed)).join(' + ')
}

/**
 * ショートカット定義と押されたキーを比較するための代替表現を生成
 * (例: ショートカット定義が 'Ctrl + !' だが、押されたキーは 'ControlLeft + ShiftLeft + Digit1')
 * @param {string} displayComboText - getKeyComboTextで生成された表示名形式の組み合わせ文字列 (例: 'Ctrl + Shift + 1')
 * @param {string} layout - キーボードレイアウト
 * @returns {Array<string>} 代替表現の配列
 */
const getKeyComboAlternatives = (displayComboText: string, layout: string) => {
  const alternatives = [displayComboText];

  const parts = displayComboText.split(' + ');
  const hasShift = parts.some(p => p === 'Shift' || p === '⇧'); 

  if (!hasShift) return alternatives;

  const lastKey = parts[parts.length - 1];
  
  // 1. 最後のキーが数字の場合、対応するShift記号を候補に追加
  if (/^\d$/.test(lastKey)) {
    const digitCode = `Digit${lastKey}`;
    const shiftedSymbol = getShiftedSymbolForKey(digitCode, layout);

    if (shiftedSymbol) {
      const altParts = [...parts.slice(0, -1), shiftedSymbol];
      alternatives.push(altParts.join(' + '));
    }
  } 
  // 2. 最後のキーが記号の場合、対応する数字（またはベースキー）を候補に追加
  else {
    const unshiftedKey = getUnshiftedKeyForSymbol(lastKey, layout);
    if (unshiftedKey) {
      const altParts = [...parts.slice(0, -1), unshiftedKey];
      alternatives.push(altParts.join(' + '));
    }
  }

  return alternatives;
}

/**
 * OSに応じた適切なショートカットキー文字列を取得する
 * (windows_keys または macos_keys があればそれを使用し、なければ keys にフォールバックする)
 */
export const getOSSpecificKeys = (item: RichShortcut, os?: string): string => {
  const currentOS = os || detectOS();
  if (currentOS === 'windows') {
    return item.windows_keys || item.keys;
  } else if (currentOS === 'macos') {
    return item.macos_keys || item.keys;
  }
  return item.keys;
};

/**
 * 指定されたショートカットがChromeブラウザで競合するかチェック
 * Chrome以外のアプリを使用中に、Chromeのpreventable_fullscreenショートカットが押された場合にtrueを返す
 */
export const checkBrowserShortcutConflict = (
  currentCombo: string,
  richShortcuts: RichShortcut[],
  selectedApp: string
): boolean => {
  // Chromeアプリが選択されている場合は競合なし
  if (selectedApp === 'chrome') {
    return false;
  }

  const os = OS;
  const normalizedCombo = normalizeShortcutCombo(currentCombo);

  // Chromeアプリのpreventable_fullscreenショートカットをチェック
  const chromeShortcuts = richShortcuts.filter(item => item.application === 'chrome');

  for (const item of chromeShortcuts) {
    const protectionLevel = os === 'macos' ? item.macos_protection_level : item.windows_protection_level;
    // 保護レベルの正規化: fullscreen-preventable → preventable_fullscreen
    const normalized = normalizeProtectionLevel(protectionLevel);

    // preventable_fullscreenのショートカットをチェック（データベース駆動）
    if (normalized === PROTECTION_LEVELS.PREVENTABLE_FULLSCREEN) {
      const shortcutKeys = getOSSpecificKeys(item, os);
      if (normalizeShortcutCombo(shortcutKeys) === normalizedCombo) {
        return true;
      }
    }
  }

  return false;
};

/**
 * ショートカットの説明を取得（代替表現にも対応）
 * @param {string} currentDisplayComboText - 現在押されているキーの表示名形式の組み合わせ文字列
 * @param {RichShortcut[]} richShortcuts - 全てのRichShortcutデータ
 * @param {string} selectedApp - 現在選択されているアプリケーション
 * @param {string} layout - キーボードレイアウト
 * @returns {string|null} ショートカットの説明、見つからない場合はnull
 */
export const getShortcutDescription = (currentDisplayComboText: string, richShortcuts: RichShortcut[], selectedApp: string, layout: string): string | null => {
  const os = OS;
  const normalizedCurrentCombo = normalizeShortcutCombo(currentDisplayComboText); // 正規化

  // 選択されたアプリのショートカットのみをフィルタ
  const appRichShortcuts = richShortcuts.filter(item => item.application === selectedApp);

  const findDescription = (targetCombo: string) => {
    const normalizedTargetCombo = normalizeShortcutCombo(targetCombo); // 正規化
    for (const item of appRichShortcuts) {
      const shortcutKeys = getOSSpecificKeys(item, os);
      if (normalizeShortcutCombo(shortcutKeys) === normalizedTargetCombo) { // 正規化して比較
        return item.description;
      }
    }
    return null;
  };

  // まず、現在の表示名で直接検索
  let description = findDescription(normalizedCurrentCombo);
  if (description) return description;

  // 代替表現で検索
  const alternatives = getKeyComboAlternatives(currentDisplayComboText, layout);
  for (const alt of alternatives) {
    description = findDescription(alt);
    if (description) return description;
  }

  // キー名の別名を考慮した検索（PgUp <-> PageUp など）
  const parts = normalizedCurrentCombo.split(' + '); // 正規化されたコンボを使用
  const lastKey = parts[parts.length - 1];
  const possibleLastKeys = getPossibleKeyNamesFromDisplay(lastKey);

  // 最後のキーの別名を試す
  for (const possibleLastKey of possibleLastKeys) {
    if (possibleLastKey !== lastKey) {
      const alternativeCombo = [...parts.slice(0, -1), possibleLastKey].join(' + ');
      description = findDescription(alternativeCombo);
      if (description) return description;
    }
  }

  return null;
};


/**
 * ショートカットの最後のキーを取得
 * @param {string} shortcut - ショートカット文字列（例: "Win + A"）
 * @returns {string} 最後のキー（例: "A"）
 */
export const getLastKey = (shortcut: string): string => {
  // Sequential かどうかで分割ルールを変える
  if (shortcut.includes(' → ')) {
    const parts = shortcut.split(' → ')
    return parts[parts.length - 1]
  }
  const parts = shortcut.split(' + ')
  return parts[parts.length - 1]
}

/**
 * ショートカットに含まれる修飾キーの数をカウント
 * @param {string} shortcut - ショートカット文字列（例: "Win + Shift + S"）
 * @returns {number} 修飾キーの数
 */
export const countModifierKeys = (shortcut: string): number => {
  const separators = [' + ', ' → '];
  let parts: string[] = [];
  
  for (const sep of separators) {
    if (shortcut.includes(sep)) {
      parts = shortcut.split(sep);
      break;
    }
  }
  
  if (parts.length === 0) parts = [shortcut];
  
  const modifierCount = parts.filter((key: string) => MODIFIER_KEY_NAMES.has(key)).length
  return modifierCount
}

/**
 * ブラウザ競合ショートカットを取得
 * Chrome以外のアプリで使用時に、Chromeのpreventable_fullscreenショートカットと競合するものを返す
 * @param {string[]} pressedCodes - 現在押されているキーの配列 (KeyboardEvent.code)
 * @param {string} layout - キーボードレイアウト
 * @param {RichShortcut[]} richShortcuts - 全てのRichShortcutデータ
 * @param {string} selectedApp - 現在選択されているアプリケーション
 * @returns {AvailableShortcut[]} ブラウザ競合ショートカット一覧
 */
export const getBrowserConflictShortcuts = (pressedCodes: string[], layout: string, richShortcuts: RichShortcut[], selectedApp: string): AvailableShortcut[] => {
  // Chromeアプリが選択されている場合は空を返す
  if (selectedApp === 'chrome') {
    return [];
  }

  const shiftPressed = pressedCodes.includes('ShiftLeft') || pressedCodes.includes('ShiftRight');
  const pressedDisplayNames = Array.from(pressedCodes).map(code => getCodeDisplayName(code, null, layout, shiftPressed));
  const os = OS;

  // 押されているキーにWindowsキー（Win/Cmd）が含まれている場合は空を返す
  // Win+Ctrl+1などはブラウザ競合ではなく、OSレベルのショートカット
  const hasWindowsKey = pressedDisplayNames.some(key => key === 'Win' || key === 'Cmd');
  if (hasWindowsKey) {
    return [];
  }

  // Chromeのpreventable_fullscreenショートカットをフィルタリング
  const chromeConflicts = richShortcuts
    .filter(item => item.application === 'chrome')
    .filter(item => {
      const protectionLevel = os === 'macos' ? item.macos_protection_level : item.windows_protection_level;
      // preventable_fullscreen または fullscreen-preventable のショートカットのみ
      // データベースから取得するため、両方の形式をサポート
      const normalized = normalizeProtectionLevel(protectionLevel);
      if (normalized !== PROTECTION_LEVELS.PREVENTABLE_FULLSCREEN) {
        return false;
      }

      const targetShortcutString = getOSSpecificKeys(item, os);
      if (!targetShortcutString) {
        return false;
      }
      const normalizedTargetShortcut = normalizeShortcutCombo(targetShortcutString);

      // WindowsキーまたはCmdキーを含むショートカットは除外
      // これらはブラウザ競合ではなく、OSレベルのショートカット（全画面で防げる）
      // 例: Win+Ctrl+1などはブラウザではなくOSが処理する
      if (normalizedTargetShortcut.includes('Win') || normalizedTargetShortcut.includes('Cmd')) {
        return false;
      }

      const shortcutKeys = item.press_type === 'sequential'
        ? getSequentialKeys(normalizedTargetShortcut)
        : normalizedTargetShortcut.split(' + ');

      const pressedKeysArray = Array.from(pressedDisplayNames);

      const allKeysMatch = allPressedKeysInShortcut(
        pressedKeysArray,
        shortcutKeys,
        shiftPressed,
        layout
      );

      return shouldIncludeShortcutAsCandidate(
        pressedKeysArray,
        shortcutKeys,
        allKeysMatch
      );
    })
    .map(item => ({
      ...item,
      shortcut: getOSSpecificKeys(item, os),
      // 保護レベルの正規化: fullscreen-preventable → preventable_fullscreen
      windows_protection_level: normalizeProtectionLevel(item.windows_protection_level),
      macos_protection_level: normalizeProtectionLevel(item.macos_protection_level),
    }))
    .filter((item, index, self) =>
      index === self.findIndex(t => normalizeShortcutCombo(t.shortcut) === normalizeShortcutCombo(item.shortcut))
    );

  return chromeConflicts.sort(sortByModifierAndKeyboard);
};

/**
 * 利用可能なショートカット一覧を取得
 * 現在押されているキーで始まるショートカットをすべて取得
 * @param {string[]} pressedCodes - 現在押されているキーの配列 (KeyboardEvent.code)
 * @param {string} layout - キーボードレイアウト
 * @param {RichShortcut[]} richShortcuts - 全てのRichShortcutデータ
 * @param {string} selectedApp - 現在選択されているアプリケーション
 * @returns {AvailableShortcut[]} ショートカット一覧
 */
export const getAvailableShortcuts = (pressedCodes: string[], layout: string, richShortcuts: RichShortcut[], selectedApp: string): AvailableShortcut[] => {
  const shiftPressed = pressedCodes.includes('ShiftLeft') || pressedCodes.includes('ShiftRight');
  const pressedDisplayNames = Array.from(pressedCodes).map(code => getCodeDisplayName(code, null, layout, shiftPressed));
  const normalizedPressedDisplayCombo = normalizeShortcutCombo(pressedDisplayNames.join(' + ')); // ここで正規化
  const os = OS;

  const filteredRichShortcuts = richShortcuts
    .filter(item => item.application === selectedApp)
    .filter(item => {
      const targetShortcutString = getOSSpecificKeys(item, os);
      if (!targetShortcutString) {
        return false;
      }
      const normalizedTargetShortcut = normalizeShortcutCombo(targetShortcutString); // ここで正規化

      const shortcutKeys = item.press_type === 'sequential'
        ? getSequentialKeys(normalizedTargetShortcut)
        : normalizedTargetShortcut.split(' + ');

      // 押されたキーの配列を取得
      const pressedKeysArray = Array.from(pressedDisplayNames);

      // すべての押されたキーがショートカットに含まれているかチェック
      const allKeysMatch = allPressedKeysInShortcut(
        pressedKeysArray,
        shortcutKeys,
        shiftPressed,
        layout
      );

      // ショートカットを候補として含めるべきか判定
      return shouldIncludeShortcutAsCandidate(
        pressedKeysArray,
        shortcutKeys,
        allKeysMatch
      );
    })
    .map(item => ({
      ...item, // RichShortcutのプロパティをすべてコピー
      shortcut: getOSSpecificKeys(item, os), // 表示用のショートカット文字列
      windows_protection_level: normalizeProtectionLevel(item.windows_protection_level),
      macos_protection_level: normalizeProtectionLevel(item.macos_protection_level),
    }))
    .filter((item, index, self) =>
      index === self.findIndex(t => normalizeShortcutCombo(t.shortcut) === normalizeShortcutCombo(item.shortcut))
    );


  const sortedShortcuts = filteredRichShortcuts
    .sort(sortByModifierAndKeyboard)
    .slice(0, MAX_SHORTCUTS_DISPLAY);

  return sortedShortcuts;
}

/** キーボード配列順の定義（物理的な配置順） */
const KEYBOARD_LAYOUT_ORDER = [
  // Function row
  'esc', 'escape',
  'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12',

  // Number row
  '`', '~',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  '-', '_', '=', '+',
  'backspace', 'bksp',

  // Top row (QWERTY)
  'tab',
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
  '[', '{', ']', '}', '\\', '|',

  // Middle row (ASDF)
  'caps lock',
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
  ';', ':', "'", '"',
  'enter', 'return',

  // Bottom row (ZXCV)
  'z', 'x', 'c', 'v', 'b', 'n', 'm',
  ',', '<', '.', '>', '/', '?',

  // Special keys
  'space',
  'page up', 'pgup', 'page down', 'pgdn',
  'home', 'end',
  'insert', 'ins', 'delete', 'del',
  '↑', '↓', '←', '→',
]

/**
 * キーボード配列での位置を取得
 * @param {string} key - キー名
 * @returns {number} キーボード配列でのインデックス（見つからない場合は999）
 */
export const getKeyboardLayoutIndex = (key: string): number => {
  const lowerKey = key.toLowerCase()
  const index = KEYBOARD_LAYOUT_ORDER.indexOf(lowerKey)
  return index === -1 ? 999 : index
}

/**
 * 単独キー（修飾キーなし）のショートカット一覧を取得
 * @param {RichShortcut[]} richShortcuts - 全てのRichShortcutデータ
 * @param {string} selectedApp - 現在選択されているアプリケーション
 * @returns {AvailableShortcut[]} 単独キーショートカット一覧
 */
export const getSingleKeyShortcuts = (richShortcuts: RichShortcut[], selectedApp: string): AvailableShortcut[] => {
  const os = OS;

  const appShortcuts = richShortcuts.filter(item => item.application === selectedApp);
  
  const filtered = appShortcuts.filter(item => {
      // 1. まず press_type をチェック。sequential のものは除外（単独キーではない）
      if (item.press_type === 'sequential') {
        return false;
      }

      // OSごとのキーを取得
      const targetKeys = getOSSpecificKeys(item, os);
      if (!targetKeys) {
        return false;
      }

      // 2. press_type が simultaneous の場合、修飾キーを含まないかチェック
      // " + " を含まない = 単独キー
      const isSingleKey = !targetKeys.includes(' + ');
      
      return isSingleKey;
    });

  return filtered
    .map(item => ({
      ...item,
      shortcut: getOSSpecificKeys(item, os),
      windows_protection_level: normalizeProtectionLevel(item.windows_protection_level),
      macos_protection_level: normalizeProtectionLevel(item.macos_protection_level),
    }))
    .sort((a, b) => {
      const aKey = a.shortcut
      const bKey = b.shortcut

      // キーボード配列順でソート
      const aIndex = getKeyboardLayoutIndex(aKey)
      const bIndex = getKeyboardLayoutIndex(bKey)

      if (aIndex !== bIndex) {
        return aIndex - bIndex
      }

      return aKey.localeCompare(bKey)
    })
}
import { getCodeDisplayName, getShiftedSymbolForKey, getPossibleKeyNamesFromDisplay } from './keyMapping'
import { MODIFIER_ORDER } from './keyUtils'
import { AppShortcuts, ShortcutDetails, RichShortcut, AvailableShortcut } from '../types' // ★ RichShortcut, AvailableShortcutを追加
import { detectOS } from '../constants' // ★ detectOSを追加

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

/** 利用可能なショートカットの最大表示数 */
const MAX_SHORTCUTS_DISPLAY = Infinity

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
export const getKeyComboText = (codesArray, layout) => {
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
const getKeyComboAlternatives = (displayComboText, layout) => {
  const alternatives = [displayComboText];

  const parts = displayComboText.split(' + ');
  const hasShift = parts.some(p => p === 'Shift' || p === '⇧'); 

  // 最後のキーが数字の場合、対応するShift記号があるかチェック
  const lastKey = parts[parts.length - 1];
  if (hasShift && /^\d$/.test(lastKey)) { // 数字キーの場合
    // keyMapping.jsのUS/JIS_SYMBOL_MAPを逆引きして代替キーを取得
    // getShiftedSymbolForKey は code (e.g., 'Digit1') を期待するので、lastKey (e.g., '1') を 'DigitX' 形式に変換する必要がある
    const digitCode = `Digit${lastKey}`;
    const shiftedSymbol = getShiftedSymbolForKey(digitCode, layout);

    if (shiftedSymbol) {
      const altParts = [...parts.slice(0, -1), shiftedSymbol];
      alternatives.push(altParts.join(' + '));
    }
  }

  return alternatives;
}

/**
 * ショートカットの説明を取得（代替表現にも対応）
 * @param {string} currentDisplayComboText - 現在押されているキーの表示名形式の組み合わせ文字列
 * @param {AppShortcuts} shortcutDescriptions - ショートカット定義オブジェクト (keyベース、例: {'Ctrl + A': '選択'})
 * @param {string} layout - キーボードレイアウト
 * @returns {string|null} ショートカットの説明、見つからない場合はnull
 */
export const getShortcutDescription = (currentDisplayComboText: string, richShortcuts: RichShortcut[], selectedApp: string, layout: string): string | null => {
  const os = detectOS();
  // 選択されたアプリのショートカットのみをフィルタ
  const appRichShortcuts = richShortcuts.filter(item => item.application === selectedApp);

  const findDescription = (targetCombo: string) => {
    for (const item of appRichShortcuts) {
      // OSごとのキー、なければkeysにフォールバック
      const shortcutKeys = (os === 'windows' ? item.windows_keys : item.macos_keys) || item.keys;
      if (shortcutKeys === targetCombo) {
        return item.description;
      }
    }
    return null;
  };

  // まず、現在の表示名で直接検索
  let description = findDescription(currentDisplayComboText);
  if (description) return description;

  // 代替表現で検索
  const alternatives = getKeyComboAlternatives(currentDisplayComboText, layout);
  for (const alt of alternatives) {
    description = findDescription(alt);
    if (description) return description;
  }

  // キー名の別名を考慮した検索（PgUp <-> PageUp など）
  const parts = currentDisplayComboText.split(' + ');
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
const getLastKey = (shortcut: string): string => {
  const parts = shortcut.split(' + ')
  return parts[parts.length - 1]
}

/**
 * 修飾キーのリスト (表示名ベース)
 */
const MODIFIER_KEY_NAMES = new Set([
  'Ctrl', 'Shift', 'Alt', 'Win', 'Cmd', 'Option', '⌃', '⇧', '⌥' // OSごとの表示名も含む
])

/**
 * ショートカットに含まれる修飾キーの数をカウント
 * @param {string} shortcut - ショートカット文字列（例: "Win + Shift + S"）
 * @returns {number} 修飾キーの数
 */
const countModifierKeys = (shortcut: string): number => {
  const parts = shortcut.split(' + ')
  const modifierCount = parts.filter((key: string) => MODIFIER_KEY_NAMES.has(key)).length
  return modifierCount
}

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
  const pressedDisplayNames = new Set(pressedCodes.map(code => getCodeDisplayName(code, null, layout, shiftPressed)));
  const os = detectOS();

  const filteredRichShortcuts = richShortcuts
    .filter(item => item.application === selectedApp)
    .filter(item => {
      // OSごとのキー、なければkeysにフォールバック
      const targetShortcut = (os === 'windows' ? item.windows_keys : item.macos_keys) || item.keys;
      if (!targetShortcut) {
        // console.log(`    Skipping item (no target shortcut for OS ${os}):`, item);
        return false;
      }

      const shortcutKeys = targetShortcut.split(' + ');
      const allPressedKeysInShortcut = Array.from(pressedDisplayNames).every((pressedKey: string) => shortcutKeys.includes(pressedKey));
      const pressedModifiers = Array.from(pressedDisplayNames).filter((key: string) => MODIFIER_KEY_NAMES.has(key));
      const shortcutModifiers = shortcutKeys.filter(key => MODIFIER_KEY_NAMES.has(key));

      let shouldInclude = false;
      // 1. 完全一致
      if (allPressedKeysInShortcut && pressedDisplayNames.size === shortcutKeys.length) {
        shouldInclude = true;
      }
      // 2. 修飾キーのみが一致（まだメインキーが押されていないショートカット候補）
      else if (
          pressedModifiers.length > 0 &&
          pressedModifiers.length === shortcutModifiers.length &&
          pressedModifiers.every((mod: string) => shortcutModifiers.includes(mod)) &&
          pressedDisplayNames.size < shortcutKeys.length
         ) {
           shouldInclude = true;
      }

      // if (!shouldInclude) {
      //   console.log(`    Skipping item (filter out):`, {
      //     itemShortcut: targetShortcut,
      //     pressedDisplayNames: Array.from(pressedDisplayNames),
      //     shortcutKeys,
      //     allPressedKeysInShortcut,
      //     pressedModifiers,
      //     shortcutModifiers,
      //     shouldInclude,
      //   });
      // }
      return shouldInclude;
    })
    .map(item => ({
      ...item, // RichShortcutのプロパティをすべてコピー
      shortcut: (os === 'windows' ? item.windows_keys : item.macos_keys) || item.keys || '', // 表示用のショートカット文字列
      windows_protection_level: item.windows_protection_level || 'none', // non-nullableにする
      macos_protection_level: item.macos_protection_level || 'none',     // non-nullableにする
    }))
    .filter((item, index, self) =>
      index === self.findIndex(t => t.shortcut === item.shortcut)
    );


  const sortedShortcuts = filteredRichShortcuts.sort((a, b) => {
      // ソートロジック：修飾キーの数 → キーボード配列順
      const aModifierCount = countModifierKeys(a.shortcut)
      const bModifierCount = countModifierKeys(b.shortcut)

      if (aModifierCount !== bModifierCount) {
        return aModifierCount - bModifierCount
      }

      const aLastKey = getLastKey(a.shortcut)
      const bLastKey = getLastKey(b.shortcut)

      // キーボード配列順でソート
      const aIndex = getKeyboardLayoutIndex(aLastKey)
      const bIndex = getKeyboardLayoutIndex(bLastKey)

      if (aIndex !== bIndex) {
        return aIndex - bIndex
      }

      // インデックスが同じ場合は文字列比較
      return aLastKey.localeCompare(bLastKey)
    })
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
const getKeyboardLayoutIndex = (key: string): number => {
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
  const os = detectOS();

  return richShortcuts
    .filter(item => item.application === selectedApp) // 選択されたアプリのショートカットのみをフィルタ
    .filter(item => {
      // OSごとのキー、なければkeysにフォールバック
      const targetKeys = (os === 'windows' ? item.windows_keys : item.macos_keys) || item.keys;
      if (!targetKeys) return false;
      return !targetKeys.includes(' + '); // 修飾キーなしの単独キーのみ
    })
    .map(item => ({
      ...item,
      // OSごとのキー、なければkeysにフォールバック
      shortcut: (os === 'windows' ? item.windows_keys : item.macos_keys) || item.keys || '',
      windows_protection_level: item.windows_protection_level || 'none',
      macos_protection_level: item.macos_protection_level || 'none',
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
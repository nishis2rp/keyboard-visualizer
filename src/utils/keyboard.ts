import { getCodeDisplayName, getShiftedSymbolForKey } from './keyMapping';
import { getModifierPriority } from '../constants/modifierKeys';
import { UI_SETTINGS } from '../config/settings';

/**
 * キー名 (KeyboardEvent.key) を正規化する。
 * 主にuseKeyboardShortcutsでのe.keyの処理のために残されている。
 */
export const normalizeKey = (key: string): string => {
  // アルファベット1文字の場合は小文字に統一（macOSのCmd+キーの大文字小文字問題対策）
  if (key.length === 1 && /[a-zA-Z]/.test(key)) {
    return key.toLowerCase();
  }
  return key;
}

/**
 * キーコードを修飾キーの順序でソート
 */
export const sortKeys = (codes: string[]): string[] => {
  return codes.sort((a, b) => {
    const aOrder = getModifierPriority(a);
    const bOrder = getModifierPriority(b);
    return aOrder - bOrder;
  });
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
 * @param {Object} shortcutDescriptions - ショートカット定義オブジェクト (keyベース、例: {'Ctrl + A': '選択'})
 * @param {string} layout - キーボードレイアウト
 * @returns {string|null} ショートカットの説明、見つからない場合はnull
 */
export const getShortcutDescription = (currentDisplayComboText, shortcutDescriptions, layout) => {
  // まず、現在の表示名で直接検索
  if (shortcutDescriptions[currentDisplayComboText]) {
    return shortcutDescriptions[currentDisplayComboText]
  }

  // 代替表現で検索
  const alternatives = getKeyComboAlternatives(currentDisplayComboText, layout)
  for (const alt of alternatives) {
    if (shortcutDescriptions[alt]) {
      return shortcutDescriptions[alt]
    }
  }

  return null
}


/**
 * ショートカットの最後のキーを取得
 * @param {string} shortcut - ショートカット文字列（例: "Win + A"）
 * @returns {string} 最後のキー（例: "A"）
 */
const getLastKey = (shortcut) => {
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
const countModifierKeys = (shortcut) => {
  const parts = shortcut.split(' + ')
  const modifierCount = parts.filter(key => MODIFIER_KEY_NAMES.has(key)).length
  return modifierCount
}

/**
 * 利用可能なショートカット一覧を取得
 * 現在押されているキーで始まるショートカットをすべて取得
 * @param {Array<string>} pressedCodes - 現在押されているキーの配列 (KeyboardEvent.code)
 * @param {string} layout - キーボードレイアウト
 * @param {Object} shortcutDescriptions - ショートカット定義オブジェクト (keyベース)
 * @returns {Array<{shortcut: string, description: string}>} ショートカット一覧
 */
export const getAvailableShortcuts = (pressedCodes, layout, shortcutDescriptions) => {
  // 押されているキーのcodeから表示名（keyベースの表現）のセットを作成
  const shiftPressed = pressedCodes.includes('ShiftLeft') || pressedCodes.includes('ShiftRight');
  const pressedDisplayNames = new Set(pressedCodes.map(code => getCodeDisplayName(code, null, layout, shiftPressed)));

  // デバッグログ
  console.log('[getAvailableShortcuts] pressedCodes:', pressedCodes);
  console.log('[getAvailableShortcuts] pressedDisplayNames:', Array.from(pressedDisplayNames));
  console.log('[getAvailableShortcuts] layout:', layout);

  const shortcuts = Object.entries(shortcutDescriptions)
    .filter(([shortcut]) => {
      const shortcutKeys = shortcut.split(' + '); // shortcutDescriptionsのキーは表示名ベース

      // 押されているキーがすべてショートカットのキーに含まれているか
      const allPressedKeysInShortcut = Array.from(pressedDisplayNames).every(pressedKey => shortcutKeys.includes(pressedKey));

      // 押されているキーの数とショートカットのキー数が一致するか、
      // あるいは押されているキーがショートカットの修飾キー部分と一致するか
      const pressedModifiers = Array.from(pressedDisplayNames).filter(key => MODIFIER_KEY_NAMES.has(key));
      const shortcutModifiers = shortcutKeys.filter(key => MODIFIER_KEY_NAMES.has(key));

      // Ctrl + Tab専用デバッグログ
      if (shortcut === 'Ctrl + Tab') {
        console.log('[DEBUG Ctrl+Tab] shortcutKeys:', shortcutKeys);
        console.log('[DEBUG Ctrl+Tab] pressedModifiers:', pressedModifiers);
        console.log('[DEBUG Ctrl+Tab] shortcutModifiers:', shortcutModifiers);
        console.log('[DEBUG Ctrl+Tab] allPressedKeysInShortcut:', allPressedKeysInShortcut);
        console.log('[DEBUG Ctrl+Tab] Check 1 (complete match):', allPressedKeysInShortcut && pressedDisplayNames.size === shortcutKeys.length);
        console.log('[DEBUG Ctrl+Tab] Check 2 conditions:', {
          'pressedModifiers.length > 0': pressedModifiers.length > 0,
          'pressedModifiers.length === shortcutModifiers.length': pressedModifiers.length === shortcutModifiers.length,
          'every mod in shortcut': Array.from(pressedModifiers).every(mod => shortcutModifiers.includes(mod)),
          'pressedDisplayNames.size < shortcutKeys.length': pressedDisplayNames.size < shortcutKeys.length
        });
      }

      // 1. 完全一致
      if (allPressedKeysInShortcut && pressedDisplayNames.size === shortcutKeys.length) {
        return true;
      }
      // 2. 修飾キーのみが一致（まだメインキーが押されていないショートカット候補）
      if (
          pressedModifiers.length > 0 && // 何らかの修飾キーが押されている
          pressedModifiers.length === shortcutModifiers.length && // 押されている修飾キーがショートカットの修飾キー数と一致
          Array.from(pressedModifiers).every(mod => shortcutModifiers.includes(mod)) && // 押されている修飾キーがすべてショートカットの修飾キーに含まれる
          pressedDisplayNames.size < shortcutKeys.length // まだメインキーが押されていない
         ) {
           return true;
      }
      return false;
    })
    .map(([shortcut, description]) => ({ shortcut, description }))
    .filter((item, index, self) =>
      index === self.findIndex(t => t.shortcut === item.shortcut)
    );

  // フィルタ後の結果をログ出力
  console.log('[getAvailableShortcuts] After filter, before sort:', shortcuts.length, 'shortcuts');
  console.log('[getAvailableShortcuts] Contains Ctrl+Tab?', shortcuts.some(s => s.shortcut === 'Ctrl + Tab'));

  const sortedShortcuts = shortcuts.sort((a, b) => {
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
    .slice(0, UI_SETTINGS.MAX_SHORTCUTS_DISPLAY);

  console.log('[getAvailableShortcuts] After sort and slice:', sortedShortcuts.length, 'shortcuts');
  console.log('[getAvailableShortcuts] Final result contains Ctrl+Tab?', sortedShortcuts.some(s => s.shortcut === 'Ctrl + Tab'));
  if (sortedShortcuts.length > 0) {
    console.log('[getAvailableShortcuts] First 5 shortcuts:', sortedShortcuts.slice(0, 5).map(s => s.shortcut));
  }

  return sortedShortcuts
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
const getKeyboardLayoutIndex = (key) => {
  const lowerKey = key.toLowerCase()
  const index = KEYBOARD_LAYOUT_ORDER.indexOf(lowerKey)
  return index === -1 ? 999 : index
}

/**
 * 単独キー（修飾キーなし）のショートカット一覧を取得
 * @param {Object} shortcutDescriptions - ショートカット定義オブジェクト
 * @returns {Array<{shortcut: string, description: string}>} 単独キーショートカット一覧
 */
export const getSingleKeyShortcuts = (shortcutDescriptions) => {
  return Object.entries(shortcutDescriptions)
    .filter(([shortcut]) => !shortcut.includes(' + '))
    .map(([shortcut, description]) => ({ shortcut, description }))
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
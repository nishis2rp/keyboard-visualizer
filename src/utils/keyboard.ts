import { getCodeDisplayName, getShiftedSymbolForKey, getPossibleKeyNamesFromDisplay } from './keyMapping'
import { MODIFIER_ORDER, MODIFIER_KEY_NAMES } from './keyUtils'
import { AppShortcuts, ShortcutDetails, RichShortcut, AvailableShortcut } from '../types' // ★ RichShortcut, AvailableShortcutを追加
import { detectOS } from './os' // ★ detectOSを追加
import { getSequentialKeys } from './sequentialShortcuts' // ★ 追加

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
 * ショートカットの説明を取得（代替表現にも対応）
 * @param {string} currentDisplayComboText - 現在押されているキーの表示名形式の組み合わせ文字列
 * @param {RichShortcut[]} richShortcuts - 全てのRichShortcutデータ
 * @param {string} selectedApp - 現在選択されているアプリケーション
 * @param {string} layout - キーボードレイアウト
 * @returns {string|null} ショートカットの説明、見つからない場合はnull
 */
export const getShortcutDescription = (currentDisplayComboText: string, richShortcuts: RichShortcut[], selectedApp: string, layout: string): string | null => {
  const os = detectOS();
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
const getLastKey = (shortcut: string): string => {
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
const countModifierKeys = (shortcut: string): number => {
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
  const os = detectOS();

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
      
      // pressedDisplayNamesはSet<string>なので、Array.from()で配列に変換してから処理
      const allPressedKeysInShortcut = Array.from(pressedDisplayNames).every((pressedKey: string) => {
        // shortcutKeysの各要素も正規化して比較
        return shortcutKeys.map(k => normalizeKey(k)).includes(normalizeKey(pressedKey));
      });

      const pressedModifiers = Array.from(pressedDisplayNames).filter((key: string) => MODIFIER_KEY_NAMES.has(key));
      const shortcutModifiers = shortcutKeys.filter(key => MODIFIER_KEY_NAMES.has(key));

      let shouldInclude = false;

      // 1. 完全一致
      if (allPressedKeysInShortcut && pressedDisplayNames.length === shortcutKeys.length) {
        shouldInclude = true;
      }
      // 2. 候補の表示条件を厳格化
      // - 少なくとも1つは非修飾キー（文字や矢印など）が含まれている場合、
      //   その組み合わせが完全に一致していなければ候補として出さない
      // - 修飾キーのみが押されている場合は、その修飾キーを含むショートカットを候補として出す
      else {
        const hasNonModifierPressed = Array.from(pressedDisplayNames).some(key => !MODIFIER_KEY_NAMES.has(key));
        
        if (hasNonModifierPressed) {
          // 非修飾キー（例：→）が含まれている場合、修飾キーの構成が完全に一致している必要がある
          // かつ、ショートカットの方がキー数が多い（未完成のショートカット）
          const pressedModifiersSet = new Set(pressedModifiers.map(m => normalizeKey(m)));
          const shortcutModifiersSet = new Set(shortcutModifiers.map(m => normalizeKey(m)));
          
          const modifiersMatch = pressedModifiersSet.size === shortcutModifiersSet.size && 
                               [...pressedModifiersSet].every(m => shortcutModifiersSet.has(m));
          
          if (modifiersMatch && allPressedKeysInShortcut && pressedDisplayNames.length < shortcutKeys.length) {
            shouldInclude = true;
          }
        } else if (pressedModifiers.length > 0) {
          // 修飾キーのみが押されている場合、その修飾キーをすべて含むショートカットを候補に出す
          if (pressedModifiers.every((mod: string) => shortcutModifiers.includes(mod))) {
            shouldInclude = true;
          }
        }
      }

      return shouldInclude;
    })
    .map(item => ({
      ...item, // RichShortcutのプロパティをすべてコピー
      shortcut: getOSSpecificKeys(item, os), // 表示用のショートカット文字列
      windows_protection_level: item.windows_protection_level || 'none', // non-nullableにする
      macos_protection_level: item.macos_protection_level || 'none',     // non-nullableにする
    }))
    .filter((item, index, self) =>
      index === self.findIndex(t => normalizeShortcutCombo(t.shortcut) === normalizeShortcutCombo(item.shortcut))
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
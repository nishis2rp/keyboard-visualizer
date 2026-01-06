import { detectOS } from '../constants/systemProtectedShortcuts';

const currentOS = detectOS();

// =============================================================================
// キーボードコードと表示名のマッピング定義
// ============================================================================

// 一般的なキーコードと表示名のマッピング
// これらはOSやレイアウトに依存しないことが多いが、一部上書きされる
const BASE_KEY_MAP = {
  // 文字キー
  'KeyA': 'A', 'KeyB': 'B', 'KeyC': 'C', 'KeyD': 'D', 'KeyE': 'E', 'KeyF': 'F', 'KeyG': 'G',
  'KeyH': 'H', 'KeyI': 'I', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L', 'KeyM': 'M', 'KeyN': 'N',
  'KeyO': 'O', 'KeyP': 'P', 'KeyQ': 'Q', 'KeyR': 'R', 'KeyS': 'S', 'KeyT': 'T', 'KeyU': 'U',
  'KeyV': 'V', 'KeyW': 'W', 'KeyX': 'X', 'KeyY': 'Y', 'KeyZ': 'Z',

  // 数字キー
  'Digit0': '0', 'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4',
  'Digit5': '5', 'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9',

  // ファンクションキー
  'F1': 'F1', 'F2': 'F2', 'F3': 'F3', 'F4': 'F4', 'F5': 'F5', 'F6': 'F6',
  'F7': 'F7', 'F8': 'F8', 'F9': 'F9', 'F10': 'F10', 'F11': 'F11', 'F12': 'F12',

  // テンキー
  'Numpad0': 'Num 0', 'Numpad1': 'Num 1', 'Numpad2': 'Num 2', 'Numpad3': 'Num 3',
  'Numpad4': 'Num 4', 'Numpad5': 'Num 5', 'Numpad6': 'Num 6', 'Numpad7': 'Num 7',
  'Numpad8': 'Num 8', 'Numpad9': 'Num 9',
  'NumpadAdd': 'Num +', 'NumpadSubtract': 'Num -', 'NumpadMultiply': 'Num *', 'NumpadDivide': 'Num /',
  'NumpadDecimal': 'Num .', 'NumpadEnter': 'Num Enter', 'NumpadComma': 'Num ,',

  // その他
  'Escape': 'Esc', 'Tab': 'Tab', 'Backspace': 'Bksp', 'Enter': 'Enter', 'Space': 'Space',
  'CapsLock': 'Caps Lock', 'PrintScreen': 'PrtSc', 'ScrollLock': 'Scroll Lock', 'Pause': 'Pause',
  'Insert': 'Ins', 'Home': 'Home', 'PageUp': 'PgUp', 'Delete': 'Del', 'End': 'End', 'PageDown': 'PgDn',
  'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→',
  'NumLock': 'Num Lock', 'ContextMenu': 'Menu', 'Power': 'Power',
  'KanaMode': 'Kana', 'IntlRo': 'Ro', 'Convert': '変換', 'NonConvert': '無変換',

  // 修飾キー (OSによって表示名が変わる可能性があるため注意)
  'ControlLeft': 'Ctrl', 'ControlRight': 'Ctrl',
  'ShiftLeft': 'Shift', 'ShiftRight': 'Shift',
  'AltLeft': 'Alt', 'AltRight': 'Alt',
};

// =============================================================================
// US配列の記号キーマッピング (Shiftなし/あり)
// ============================================================================
const US_SYMBOL_MAP = {
  // Shiftなし
  'Backquote': '`', 'Minus': '-', 'Equal': '=', 'BracketLeft': '[', 'BracketRight': ']',
  'Backslash': '\', 'Semicolon': ';', 'Quote': "'", 'Comma': ',', 'Period': '.', 'Slash': '/',

  // Shiftあり (KeyboardEvent.key で検出される値)
  'ShiftLeft+Backquote': '~', 'ShiftLeft+Minus': '_', 'ShiftLeft+Equal': '+',
  'ShiftLeft+BracketLeft': '{', 'ShiftLeft+BracketRight': '}', 'ShiftLeft+Backslash': '|',
  'ShiftLeft+Semicolon': ':', 'ShiftLeft+Quote': '"', 'ShiftLeft+Comma': '<',
  'ShiftLeft+Period': '>', 'ShiftLeft+Slash': '?',

  // 数字キーのShift記号 (KeyboardEvent.key で検出される値)
  'ShiftLeft+Digit1': '!', 'ShiftLeft+Digit2': '@', 'ShiftLeft+Digit3': '#',
  'ShiftLeft+Digit4': '$', 'ShiftLeft+Digit5': '%', 'ShiftLeft+Digit6': '^',
  'ShiftLeft+Digit7': '&', 'ShiftLeft+Digit8': '*', 'ShiftLeft+Digit9': '(',
  'ShiftLeft+Digit0': ')',
};


// =============================================================================
// JIS配列の記号キーマッピング (Shiftなし/あり)
// ============================================================================
const JIS_SYMBOL_MAP = {
  // Shiftなし (KeyboardEvent.code)
  'Backquote': '`', 'Minus': '-', 'Equal': '^', 'BracketLeft': '[', 'BracketRight': ']',
  'Backslash': '\', 'Semicolon': ';', 'Quote': ':', 'Comma': ',', 'Period': '.', 'Slash': '/',
  'IntlYen': '¥', // JIS固有
  'IntlRo': '_',  // JIS固有（アンダーバー）
  'IntlHash': '@', // JIS固有

  // Shiftあり (KeyboardEvent.key で検出される値)
  'ShiftLeft+Backquote': '~', 'ShiftLeft+Minus': '=', 'ShiftLeft+Equal': '~',
  'ShiftLeft+BracketLeft': '{', 'ShiftLeft+BracketRight': '}', 'ShiftLeft+Backslash': '|',
  'ShiftLeft+Semicolon': '+', 'ShiftLeft+Quote': '*', 'ShiftLeft+Comma': '<',
  'ShiftLeft+Period': '>', 'ShiftLeft+Slash': '?',
  'ShiftLeft+IntlYen': '|',
  'ShiftLeft+IntlRo': 'ローマ字', // ローマ字切り替え (仮)
  'ShiftLeft+IntlHash': '`',

  // 数字キーのShift記号 (KeyboardEvent.key で検出される値)
  'ShiftLeft+Digit1': '!', 'ShiftLeft+Digit2': '"', 'ShiftLeft+Digit3': '#',
  'ShiftLeft+Digit4': '$', 'ShiftLeft+Digit5': '%', 'ShiftLeft+Digit6': '&',
  'ShiftLeft+Digit7': "'", 'ShiftLeft+Digit8': '(', 'ShiftLeft+Digit9': ')',
  'ShiftLeft+Digit0': '0', // JISのShift+0は0
};


// =============================================================================
// OSごとの修飾キー表示名
// ============================================================================
const OS_MODIFIER_MAP = {
  'windows': {
    'MetaLeft': 'Win', 'MetaRight': 'Win',
    'ControlLeft': 'Ctrl', 'ControlRight': 'Ctrl',
    'ShiftLeft': 'Shift', 'ShiftRight': 'Shift',
    'AltLeft': 'Alt', 'AltRight': 'Alt',
  },
  'macos': {
    'MetaLeft': 'Cmd', 'MetaRight': 'Cmd',
    'ControlLeft': '⌃', // Control Symbol
    'ControlRight': '⌃',
    'ShiftLeft': '⇧', // Shift Symbol
    'ShiftRight': '⇧',
    'AltLeft': '⌥', // Option Symbol
    'AltRight': '⌥',
  },
};


/**
 * キーコードから表示名を取得する
 * @param {string} code - KeyboardEvent.code (例: 'KeyA', 'BracketLeft')
 * @param {string} key - KeyboardEvent.key (例: 'a', '[', '{')
 * @param {string} layout - 選択されているキーボードレイアウト ('macUs', 'macJis', 'windowsJis')
 * @param {boolean} shiftPressed - Shiftキーが押されているか
 * @returns {string} 表示用のキー名
 */
export const getCodeDisplayName = (code, key, layout, shiftPressed) => {
  let displayKey = '';

  // 1. OS固有の修飾キーマッピング
  if (OS_MODIFIER_MAP[currentOS] && OS_MODIFIER_MAP[currentOS][code]) {
    return OS_MODIFIER_MAP[currentOS][code];
  }

  // 2. レイアウト固有の記号マッピング
  if (layout.includes('us')) {
    displayKey = US_SYMBOL_MAP[code];
    if (shiftPressed && US_SYMBOL_MAP[`ShiftLeft+${code}`]) {
      displayKey = US_SYMBOL_MAP[`ShiftLeft+${code}`];
    }
  } else if (layout.includes('jis')) {
    displayKey = JIS_SYMBOL_MAP[code];
    if (shiftPressed && JIS_SYMBOL_MAP[`ShiftLeft+${code}`]) {
      displayKey = JIS_SYMBOL_MAP[`ShiftLeft+${code}`];
    }
  }

  // 3. 基本マッピング (レイアウト固有で上書きされなかった場合)
  if (!displayKey && BASE_KEY_MAP[code]) {
    displayKey = BASE_KEY_MAP[code];
  }

  // 4. マッピングにない場合、KeyboardEvent.keyを使用
  if (!displayKey && key) {
    if (key.length === 1 && /[a-z]/i.test(key)) {
      return key.toUpperCase(); // アルファベットは常に大文字に
    }
    return key;
  }

  // 5. 最終フォールバック
  return displayKey || code;
};


/**
 * pressedKeys (codeのSet) から表示名の配列を生成
 * @param {Set<string>} pressedCodes - 現在押されているキーの KeyboardEvent.code のセット
 * @param {string} layout - 選択されているキーボードレイアウト ('macUs', 'macJis', 'windowsJis')
 * @returns {string[]} 表示名の配列
 */
export const getDisplayNamesFromCodes = (pressedCodes, layout) => {
  const shiftPressed = pressedCodes.has('ShiftLeft') || pressedCodes.has('ShiftRight');
  
  const displayNames = Array.from(pressedCodes).map(code => {
    // pressedCodesにはcodeしか含まれていないため、keyは不明。
    // そのため、getCodeDisplayNameのkey引数にはnullを渡すか、
    // ここでkeyを推測するロジックが必要だが、複雑になるためまずはcodeベースで。
    return getCodeDisplayName(code, null, layout, shiftPressed);
  });

  return displayNames;
};

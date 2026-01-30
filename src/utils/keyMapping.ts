import { detectOS } from './os';

const currentOS = detectOS();

// =============================================================================
// Key code and display name mapping definitions
// ============================================================================

// General key code to display name mapping
// These are often independent of OS or layout, but some are overridden
const BASE_KEY_MAP = {
  // Letter keys
  'KeyA': 'A', 'KeyB': 'B', 'KeyC': 'C', 'KeyD': 'D', 'KeyE': 'E', 'KeyF': 'F', 'KeyG': 'G',
  'KeyH': 'H', 'KeyI': 'I', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L', 'KeyM': 'M', 'KeyN': 'N',
  'KeyO': 'O', 'KeyP': 'P', 'KeyQ': 'Q', 'KeyR': 'R', 'KeyS': 'S', 'KeyT': 'T', 'KeyU': 'U',
  'KeyV': 'V', 'KeyW': 'W', 'KeyX': 'X', 'KeyY': 'Y', 'KeyZ': 'Z',

  // Number keys
  'Digit0': '0', 'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4',
  'Digit5': '5', 'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9',

  // Function keys
  'F1': 'F1', 'F2': 'F2', 'F3': 'F3', 'F4': 'F4', 'F5': 'F5', 'F6': 'F6',
  'F7': 'F7', 'F8': 'F8', 'F9': 'F9', 'F10': 'F10', 'F11': 'F11', 'F12': 'F12',

  // Numpad keys
  'Numpad0': 'Num 0', 'Numpad1': 'Num 1', 'Numpad2': 'Num 2', 'Numpad3': 'Num 3',
  'Numpad4': 'Num 4', 'Numpad5': 'Num 5', 'Numpad6': 'Num 6', 'Numpad7': 'Num 7',
  'Numpad8': 'Num 8', 'Numpad9': 'Num 9',
  'NumpadAdd': 'Num +', 'NumpadSubtract': 'Num -', 'NumpadMultiply': 'Num *', 'NumpadDivide': 'Num /',
  'NumpadDecimal': 'Num .', 'NumpadEnter': 'Num Enter', 'NumpadComma': 'Num ,',

  // Others
  'Escape': 'Esc', 'Tab': 'Tab', 'Backspace': 'Bksp', 'Enter': 'Enter', 'Space': 'Space',
  'CapsLock': 'Caps Lock', 'PrintScreen': 'PrtSc', 'ScrollLock': 'Scroll Lock', 'Pause': 'Pause',
  'Insert': 'Ins', 'Home': 'Home', 'PageUp': 'PgUp', 'Delete': 'Del', 'End': 'End', 'PageDown': 'PgDn',
  'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→',
  'NumLock': 'Num Lock', 'ContextMenu': 'Menu', 'Power': 'Power',
  'KanaMode': 'Kana', 'IntlRo': 'Ro', 'Convert': 'Convert', 'NonConvert': 'NonConvert',

  // Modifier keys (display names may change by OS, so be careful)
  'ControlLeft': 'Ctrl', 'ControlRight': 'Ctrl',
  'ShiftLeft': 'Shift', 'ShiftRight': 'Shift',
  'AltLeft': 'Alt', 'AltRight': 'Alt',
};

// =============================================================================
// US layout symbol key mapping (no Shift / with Shift)
// ============================================================================
const US_SYMBOL_MAP = {
  // No Shift
  'Backquote': '`', 'Minus': '-', 'Equal': '=', 'BracketLeft': '[', 'BracketRight': ']',
  'Backslash': '\\', 'Semicolon': ';', 'Quote': "'", 'Comma': ',', 'Period': '.', 'Slash': '/',

  // With Shift (values detected by KeyboardEvent.key)
  'ShiftLeft+Backquote': '~', 'ShiftLeft+Minus': '_', 'ShiftLeft+Equal': '+',
  'ShiftLeft+BracketLeft': '{', 'ShiftLeft+BracketRight': '}', 'ShiftLeft+Backslash': '|',
  'ShiftLeft+Semicolon': ':', 'ShiftLeft+Quote': '"', 'ShiftLeft+Comma': '<',
  'ShiftLeft+Period': '>', 'ShiftLeft+Slash': '?',

  // Shift symbols for number keys (values detected by KeyboardEvent.key)
  'ShiftLeft+Digit1': '!', 'ShiftLeft+Digit2': '@', 'ShiftLeft+Digit3': '#',
  'ShiftLeft+Digit4': '$', 'ShiftLeft+Digit5': '%', 'ShiftLeft+Digit6': '^',
  'ShiftLeft+Digit7': '&', 'ShiftLeft+Digit8': '*', 'ShiftLeft+Digit9': '(',
  'ShiftLeft+Digit0': ')',
};


// =============================================================================
// JIS layout symbol key mapping (no Shift / with Shift)
// ============================================================================
const JIS_SYMBOL_MAP = {
  // No Shift (KeyboardEvent.code)
  'Backquote': '`', 'Minus': '-', 'Equal': '^', 'BracketLeft': '@', 'BracketRight': '[',
  'Backslash': ']', 'Semicolon': ';', 'Quote': ':', 'Comma': ',', 'Period': '.', 'Slash': '/',
  'IntlYen': '¥', // JIS specific
  'IntlRo': '\\',  // JIS specific (backslash on JIS keyboard)

  // With Shift (values detected by KeyboardEvent.key)
  'ShiftLeft+Backquote': '~', 'ShiftLeft+Minus': '=', 'ShiftLeft+Equal': '~',
  'ShiftLeft+BracketLeft': '`', 'ShiftLeft+BracketRight': '{', 'ShiftLeft+Backslash': '}',
  'ShiftLeft+Semicolon': '+', 'ShiftLeft+Quote': '*', 'ShiftLeft+Comma': '<',
  'ShiftLeft+Period': '>', 'ShiftLeft+Slash': '?',
  'ShiftLeft+IntlYen': '|',
  'ShiftLeft+IntlRo': '_', // Underscore on JIS keyboard

  // Shift symbols for number keys (values detected by KeyboardEvent.key)
  'ShiftLeft+Digit1': '!', 'ShiftLeft+Digit2': '"', 'ShiftLeft+Digit3': '#',
  'ShiftLeft+Digit4': '$', 'ShiftLeft+Digit5': '%', 'ShiftLeft+Digit6': '&',
  'ShiftLeft+Digit7': "'", 'ShiftLeft+Digit8': '(', 'ShiftLeft+Digit9': ')',
  'ShiftLeft+Digit0': '0', // JIS Shift+0 is 0
};


// =============================================================================
// Modifier key display names per OS
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
 * Get shifted symbol for a given key code, layout, and shift state.
 * @param {string} code - KeyboardEvent.code (e.g., 'Digit1')
 * @param {string} layout - The selected keyboard layout ('macUs', 'macJis', 'windowsJis')
 * @returns {string|null} The shifted symbol, or null if not applicable
 */
export const getShiftedSymbolForKey = (code, layout) => {
  if (layout.includes('us')) {
    return US_SYMBOL_MAP[`ShiftLeft+${code}`] || null;
  } else if (layout.includes('jis')) {
    return JIS_SYMBOL_MAP[`ShiftLeft+${code}`] || null;
  }
  return null;
};

/**
 * Gets the display name from a key code.
 * @param {string} code - KeyboardEvent.code (e.g., 'KeyA', 'BracketLeft')
 * @param {string} key - KeyboardEvent.key (e.g., 'a', '[', '{')
 * @param {string} layout - The selected keyboard layout ('macUs', 'macJis', 'windowsJis')
 * @param {boolean} shiftPressed - Whether the Shift key is pressed
 * @returns {string} The display name for the key
 */
export const getCodeDisplayName = (code, key, layout, shiftPressed) => {
  let displayKey = '';

  // 1. OS-specific modifier key mapping
  if (OS_MODIFIER_MAP[currentOS] && OS_MODIFIER_MAP[currentOS][code]) {
    return OS_MODIFIER_MAP[currentOS][code];
  }

  // 2. Layout-specific symbol mapping
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

  // 3. Base mapping (if not overridden by layout-specific)
  if (!displayKey && BASE_KEY_MAP[code]) {
    displayKey = BASE_KEY_MAP[code];
  }

  // 4. Use KeyboardEvent.key if no mapping found
  if (!displayKey && key) {
    if (key.length === 1 && /[a-z]/i.test(key)) {
      return key.toUpperCase(); // Always uppercase for letters
    }
    return key;
  }

  // 5. Final fallback
  return displayKey || code;
};



/**
 * Generates an array of display names from a Set of pressed codes.
 * @param {Set<string>} pressedCodes - Set of KeyboardEvent.code for currently pressed keys
 * @param {string} layout - The selected keyboard layout ('macUs', 'macJis', 'windowsJis')
 * @returns {string[]} Array of display names
 */
export const getDisplayNamesFromCodes = (pressedCodes, layout) => {
  const shiftPressed = pressedCodes.has('ShiftLeft') || pressedCodes.has('ShiftRight');

  const displayNames = Array.from(pressedCodes).map(code => {
    // Since pressedCodes only contains 'code', 'key' is unknown.
    // We could pass null for the key argument to getCodeDisplayName,
    // or implement logic to infer the key here, but for now we'll proceed based on code.
    return getCodeDisplayName(code, null, layout, shiftPressed);
  });

  return displayNames;
};

/**
 * Gets possible key names (codes) from a display name.
 * This is useful for matching shortcuts defined with full key names (e.g., 'PageUp')
 * against display names (e.g., 'PgUp').
 * @param {string} displayName - The display name (e.g., 'PgUp', 'Del', 'Esc')
 * @returns {string[]} Array of possible key codes/names that could produce this display
 */
export const getPossibleKeyNamesFromDisplay = (displayName) => {
  const possibleNames = [displayName]; // Always include the display name itself

  // Create a reverse mapping from display names to key codes
  const reverseMap = {
    'PgUp': 'PageUp',
    'PgDn': 'PageDown',
    'Ins': 'Insert',
    'Del': 'Delete',
    'Bksp': 'Backspace',
    'Esc': 'Escape',
    'PrtSc': 'PrintScreen',
    '↑': 'ArrowUp',
    '↓': 'ArrowDown',
    '←': 'ArrowLeft',
    '→': 'ArrowRight',
  };

  // Add the reverse mapped name if it exists
  if (reverseMap[displayName]) {
    possibleNames.push(reverseMap[displayName]);
  }

  return possibleNames;
};

// Windows JIS keyboard layout
export const windowsJisLayout = [
  // Row 1 (Function keys)
  [
    { key: 'Escape', code: 'Escape', display: 'Esc', width: 1 },
    { key: 'F1', code: 'F1', display: 'F1', width: 1 },
    { key: 'F2', code: 'F2', display: 'F2', width: 1 },
    { key: 'F3', code: 'F3', display: 'F3', width: 1 },
    { key: 'F4', code: 'F4', display: 'F4', width: 1 },
    { key: 'F5', code: 'F5', display: 'F5', width: 1 },
    { key: 'F6', code: 'F6', display: 'F6', width: 1 },
    { key: 'F7', code: 'F7', display: 'F7', width: 1 },
    { key: 'F8', code: 'F8', display: 'F8', width: 1 },
    { key: 'F9', code: 'F9', display: 'F9', width: 1 },
    { key: 'F10', code: 'F10', display: 'F10', width: 1 },
    { key: 'F11', code: 'F11', display: 'F11', width: 1 },
    { key: 'F12', code: 'F12', display: 'F12', width: 1 },
  ],
  // Row 2 (Number row)
  [
    { key: 'Backquote', code: 'Backquote', display: '`', width: 1 }, // Zenkaku/Hankaku
    { key: 'Digit1', code: 'Digit1', display: '1', width: 1 },
    { key: 'Digit2', code: 'Digit2', display: '2', width: 1 },
    { key: 'Digit3', code: 'Digit3', display: '3', width: 1 },
    { key: 'Digit4', code: 'Digit4', display: '4', width: 1 },
    { key: 'Digit5', code: 'Digit5', display: '5', width: 1 },
    { key: 'Digit6', code: 'Digit6', display: '6', width: 1 },
    { key: 'Digit7', code: 'Digit7', display: '7', width: 1 },
    { key: 'Digit8', code: 'Digit8', display: '8', width: 1 },
    { key: 'Digit9', code: 'Digit9', display: '9', width: 1 },
    { key: 'Digit0', code: 'Digit0', display: '0', width: 1 },
    { key: 'Minus', code: 'Minus', display: '-', width: 1 },
    { key: 'Equal', code: 'Equal', display: '^', width: 1 }, // JIS layout: ^
    { key: 'IntlYen', code: 'IntlYen', display: '¥', width: 1 }, // JIS specific
    { key: 'Backspace', code: 'Backspace', display: 'Back', width: 2 },
  ],
  // Row 3
  [
    { key: 'Tab', code: 'Tab', display: 'Tab', width: 1.5 },
    { key: 'KeyQ', code: 'KeyQ', display: 'Q', width: 1 },
    { key: 'KeyW', code: 'KeyW', display: 'W', width: 1 },
    { key: 'KeyE', code: 'KeyE', display: 'E', width: 1 },
    { key: 'KeyR', code: 'KeyR', display: 'R', width: 1 },
    { key: 'KeyT', code: 'KeyT', display: 'T', width: 1 },
    { key: 'KeyY', code: 'KeyY', display: 'Y', width: 1 },
    { key: 'KeyU', code: 'KeyU', display: 'U', width: 1 },
    { key: 'KeyI', code: 'KeyI', display: 'I', width: 1 },
    { key: 'KeyO', code: 'KeyO', display: 'O', width: 1 },
    { key: 'KeyP', code: 'KeyP', display: 'P', width: 1 },
    { key: 'BracketLeft', code: 'BracketLeft', display: '@', width: 1 }, // JIS layout: @
    { key: 'BracketRight', code: 'BracketRight', display: '[', width: 1 }, // JIS layout: [
    { key: 'Enter', code: 'Enter', display: 'Enter', width: 1.5 },
  ],
  // Row 4
  [
    { key: 'CapsLock', code: 'CapsLock', display: 'Caps', width: 1.75 },
    { key: 'KeyA', code: 'KeyA', display: 'A', width: 1 },
    { key: 'KeyS', code: 'KeyS', display: 'S', width: 1 },
    { key: 'KeyD', code: 'KeyD', display: 'D', width: 1 },
    { key: 'KeyF', code: 'KeyF', display: 'F', width: 1 },
    { key: 'KeyG', code: 'KeyG', display: 'G', width: 1 },
    { key: 'KeyH', code: 'KeyH', display: 'H', width: 1 },
    { key: 'KeyJ', code: 'KeyJ', display: 'J', width: 1 },
    { key: 'KeyK', code: 'KeyK', display: 'K', width: 1 },
    { key: 'KeyL', code: 'KeyL', display: 'L', width: 1 },
    { key: 'Semicolon', code: 'Semicolon', display: ';', width: 1 },
    { key: 'Quote', code: 'Quote', display: ':', width: 1 }, // JIS layout: :
    { key: 'IntlRo', code: 'IntlRo', display: ']', width: 1 }, // JIS layout: ]
  ],
  // Row 5
  [
    { key: 'ShiftLeft', code: 'ShiftLeft', display: 'Shift', width: 2.25 },
    { key: 'KeyZ', code: 'KeyZ', display: 'Z', width: 1 },
    { key: 'KeyX', code: 'KeyX', display: 'X', width: 1 },
    { key: 'KeyC', code: 'KeyC', display: 'C', width: 1 },
    { key: 'KeyV', code: 'KeyV', display: 'V', width: 1 },
    { key: 'KeyB', code: 'KeyB', display: 'B', width: 1 },
    { key: 'KeyN', code: 'KeyN', display: 'N', width: 1 },
    { key: 'KeyM', code: 'KeyM', display: 'M', width: 1 },
    { key: 'Comma', code: 'Comma', display: ',', width: 1 },
    { key: 'Period', code: 'Period', display: '.', width: 1 },
    { key: 'Slash', code: 'Slash', display: '/', width: 1 },
    { key: 'IntlBackslash', code: 'IntlBackslash', display: '\\', width: 1 }, // JIS layout: \\
    { key: 'ShiftRight', code: 'ShiftRight', display: 'Shift', width: 1.5 }, // JIS: Right Shift is shorter
  ],
  // Row 6
  [
    { key: 'ControlLeft', code: 'ControlLeft', display: 'Ctrl', width: 1.5 },
    { key: 'MetaLeft', code: 'MetaLeft', display: 'Win', width: 1.25 },
    { key: 'AltLeft', code: 'AltLeft', display: 'Alt', width: 1.25 },
    { key: 'Space', code: 'Space', display: 'Space', width: 5 },
    { key: 'AltRight', code: 'AltRight', display: 'Alt', width: 1.25 },
    { key: 'KanaMode', code: 'KanaMode', display: 'かな', width: 1 }, // JIS specific
    { key: 'ControlRight', code: 'ControlRight', display: 'Ctrl', width: 1.25 },
    { key: 'ArrowLeft', code: 'ArrowLeft', display: '←', width: 1 },
    { key: 'ArrowDown', code: 'ArrowDown', display: '↓', width: 1 },
    { key: 'ArrowRight', code: 'ArrowRight', display: '→', width: 1 },
  ],
]
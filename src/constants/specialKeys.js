// 特殊キーの定義
export const specialKeys = new Set([
  'Control', 'Shift', 'Alt', 'Meta', 'Tab', 'Enter', 'Escape',
  'CapsLock', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'
])

// キーボードレイアウト別のキー名マッピング
export const getKeyNameMap = (keyboardLayout) => {
  if (keyboardLayout.startsWith('mac')) {
    return {
      'Control': 'Ctrl',
      'Meta': 'Cmd',
      'Alt': 'Option',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      ' ': 'Space'
    }
  } else {
    return {
      'Control': 'Ctrl',
      'Meta': 'Win',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      ' ': 'Space'
    }
  }
}

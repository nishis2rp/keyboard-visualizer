/**
 * キーボードレイアウト別のキー名マッピングを取得
 * MacとWindowsで異なるキー名（Cmd/Win、Option/Altなど）を適切に表示
 * @param {string} keyboardLayout - キーボードレイアウトID（'mac-jis', 'mac-us', 'windows-jis'）
 * @returns {Object} キー名のマッピングオブジェクト
 */
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
      'OS': 'Win',  // 一部のブラウザでWinキーがOSとして検出される
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      ' ': 'Space'
    }
  }
}

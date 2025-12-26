/**
 * サポートされているアプリケーションの一覧
 * 各アプリケーションには専用のショートカット定義がある
 * @type {Array<{id: string, name: string, icon: string}>}
 */
export const apps = [
  { id: 'windows11', name: 'Windows 11', icon: '🪟' },
  { id: 'macos', name: 'macOS', icon: '🍎' },
  { id: 'chrome', name: 'Chrome', icon: '🌐' },
  { id: 'excel', name: 'Excel', icon: '📊' },
  { id: 'slack', name: 'Slack', icon: '💬' },
  { id: 'gmail', name: 'Gmail', icon: '📧' },
]

/**
 * サポートされているキーボードレイアウトの一覧
 * レイアウトによってキー配置と表示名が異なる
 * @type {Array<{id: string, name: string, icon: string}>}
 */
export const keyboardLayouts = [
  { id: 'windows-jis', name: 'Windows JIS', icon: '🪟' },
  { id: 'mac-jis', name: 'Mac JIS', icon: '🍎' },
  { id: 'mac-us', name: 'Mac US', icon: '🇺🇸' },
]

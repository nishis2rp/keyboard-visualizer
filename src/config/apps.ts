/**
 * List of supported applications.
 * Each application has its own shortcut definition.
 * @type {Array<{id: string, name: string, icon: string}>}
 */
export const apps = [
  { id: 'windows11', name: 'Windows 11', icon: '🪟', os: 'windows' },
  { id: 'macos', name: 'macOS', icon: '🍎', os: 'mac' },
  { id: 'chrome', name: 'Chrome', icon: '🌐', os: 'cross-platform' },
  { id: 'vscode', name: 'VS Code', icon: '💻', os: 'cross-platform' },
  { id: 'excel', name: 'Excel', icon: '📊', os: 'cross-platform' },
  { id: 'slack', name: 'Slack', icon: '💬', os: 'cross-platform' },
  { id: 'gmail', name: 'Gmail', icon: '📧', os: 'cross-platform' },
]

/**
 * List of supported keyboard layouts.
 * Key arrangements and display names differ by layout.
 * @type {Array<{id: string, name: string, icon: string}>}
 */
export const keyboardLayouts = [
  { id: 'windows-jis', name: 'Windows JIS', icon: '🪟' },
  { id: 'mac-jis', name: 'Mac JIS', icon: '🍎' },
  { id: 'mac-us', name: 'Mac US', icon: '🇺🇸' },
]

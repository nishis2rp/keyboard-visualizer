/**
 * List of supported applications.
 * Each application has its own shortcut definition.
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
 * List of supported keyboard layouts.
 * Key arrangements and display names differ by layout.
 * @type {Array<{id: string, name: string, icon: string}>}
 */
export const keyboardLayouts = [
  { id: 'windows-jis', name: 'Windows JIS', icon: '🪟' },
  { id: 'mac-jis', name: 'Mac JIS', icon: '🍎' },
  { id: 'mac-us', name: 'Mac US', icon: '🇺🇸' },
]

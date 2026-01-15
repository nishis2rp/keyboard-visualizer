// すべてのショートカットを統合してエクスポート
import { windows11Shortcuts } from './windows11'
import { chromeShortcuts } from './chrome'
import { excelShortcuts } from './excel'
import { slackShortcuts } from './slack'
import { gmailShortcuts } from './gmail'
import { macosShortcuts } from './macos'

export const allShortcuts = {
  windows11: windows11Shortcuts,
  chrome: chromeShortcuts,
  excel: excelShortcuts,
  slack: slackShortcuts,
  gmail: gmailShortcuts,
  macos: macosShortcuts,
}

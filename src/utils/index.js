/**
 * ユーティリティ関数のエントリーポイント
 */
export {
  getKeyDisplayName,
  sortKeys,
  getKeyComboText,
  getShortcutDescription,
  getAvailableShortcuts,
  getSingleKeyShortcuts,
  normalizeKey
} from './keyboard'

export {
  enterFullscreen,
  exitFullscreen,
  toggleFullscreen,
  isFullscreen,
  onFullscreenChange
} from './fullscreen'

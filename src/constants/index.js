/**
 * 定数のエントリーポイント
 */
export { specialKeys } from './keys'
export {
  SYSTEM_PROTECTED_SHORTCUTS,
  FULLSCREEN_PREVENTABLE_SHORTCUTS,
  ALWAYS_PROTECTED_SHORTCUTS,
  isSystemProtected,
  isFullscreenPreventable,
  isAlwaysProtected,
  getProtectionLevel,
  detectOS
} from './systemProtectedShortcuts'
export { SETUP_VERSION, STORAGE_KEYS, DEFAULTS } from './app'

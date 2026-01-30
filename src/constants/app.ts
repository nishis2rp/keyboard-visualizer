/**
 * Constants used throughout the application.
 */

/**
 * Setup screen version.
 * If the version changes, the existing setup will be reset and setup will be prompted again.
 */
export const SETUP_VERSION = 'v2'

/**
 * LocalStorage keys.
 */
export const STORAGE_KEYS = {
  /** Key for saving setup information. */
  SETUP: 'keyboard-visualizer-setup'
}

/**
 * Default values.
 */
export const DEFAULTS = {
  /** Default app. */
  APP: 'windows11',
  /** Default keyboard layout. */
  LAYOUT: 'windows-jis'
}

/**
 * アプリケーション名の日本語表示マップ
 */
export const APP_DISPLAY_NAMES: { [key: string]: string } = {
  'windows11': 'Windows 11',
  'macos': 'macOS',
  'chrome': 'Chrome',
  'excel': 'Excel',
  'slack': 'Slack',
  'gmail': 'Gmail',
};

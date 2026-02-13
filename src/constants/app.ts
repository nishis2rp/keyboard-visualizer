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

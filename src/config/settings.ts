/**
 * Application settings and configuration constants
 * Centralized location for all magic numbers and configuration values
 */

/**
 * Quiz mode settings
 */
export const QUIZ_SETTINGS = {
  /** Default time limit per question in seconds */
  DEFAULT_TIME_LIMIT: 10,
  /** Maximum number of questions in a quiz */
  MAX_QUESTIONS: 10,
  /** Grace period for key release detection in milliseconds */
  GRACE_PERIOD_MS: 300,
  /** Minimum number of questions for a valid quiz */
  MIN_QUESTIONS: 5,
} as const;

/**
 * UI display settings
 */
export const UI_SETTINGS = {
  /** Maximum number of shortcuts to display at once */
  MAX_SHORTCUTS_DISPLAY: 60,
  /** Maximum number of items in key history */
  MAX_HISTORY_ITEMS: 10,
  /** Debounce delay for search/filter operations in milliseconds */
  DEBOUNCE_DELAY_MS: 300,
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  SETUP_COMPLETED: 'keyboardVisualizerSetupCompleted',
  SELECTED_APP: 'keyboardVisualizerSelectedApp',
  KEYBOARD_LAYOUT: 'keyboardVisualizerKeyboardLayout',
  QUIZ_HIGH_SCORE: 'keyboardVisualizerQuizHighScore',
} as const;

/**
 * Application constants
 */
export const APP_CONSTANTS = {
  /** Minimum browser viewport width for optimal experience */
  MIN_VIEWPORT_WIDTH: 1024,
  /** Animation duration for transitions in milliseconds */
  ANIMATION_DURATION_MS: 200,
} as const;

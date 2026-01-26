/**
 * ショートカットユーティリティ
 * ショートカットの種類判定や表示に関する関数
 */

import { isSequentialShortcut } from './sequentialShortcuts'

/**
 * ショートカットの種類を取得
 *
 * @param {string} shortcut - ショートカット文字列
 * @param {string} application - アプリケーション名（オプション）
 * @returns {'sequential' | 'simultaneous'} ショートカットの種類
 */
export const getShortcutType = (shortcut: string, application?: string): 'sequential' | 'simultaneous' => {
  return isSequentialShortcut(shortcut, application) ? 'sequential' : 'simultaneous'
}

// Re-export for convenience
export { isSequentialShortcut }

/**
 * ショートカットの表示名を整形
 *
 * @param {string} shortcut - ショートカット文字列
 * @returns {string[]} キーの配列
 */
export const parseShortcutKeys = (shortcut: string): string[] => {
  return shortcut.split(' + ').map(part => part.trim())
}

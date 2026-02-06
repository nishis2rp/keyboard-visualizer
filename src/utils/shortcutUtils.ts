/**
 * ショートカットユーティリティ
 * ショートカットの種類判定や表示に関する関数
 */



/**
 * ショートカットの表示名を整形
 *
 * @param {string} shortcut - ショートカット文字列
 * @returns {string[]} キーの配列
 */
export const parseShortcutKeys = (shortcut: string): string[] => {
  return shortcut.split(' + ').map(part => part.trim())
}

/**
 * ショートカットユーティリティ
 * ショートカットの種類判定や表示に関する関数
 */

/**
 * 順押しショートカットかどうかを判定
 *
 * 判定基準：
 * 1. キーの数が3つ以上
 * 2. Altで始まる（リボンアクセスキー）
 * 3. またはショートカット文字列に特定のパターンが含まれる
 *
 * @param {string} shortcut - ショートカット文字列（例: "Alt + H + O + I"）
 * @returns {boolean} 順押しの場合true
 */
export const isSequentialShortcut = (shortcut: string): boolean => {
  // ショートカットを " + " で分割
  const parts = shortcut.split(' + ').map(part => part.trim())

  // キーが1つまたは2つの場合は同時押し
  if (parts.length <= 2) {
    return false
  }

  // 3つ以上のキーがあり、Altで始まる場合は順押し（リボンアクセスキー）
  if (parts.length >= 3 && parts[0] === 'Alt') {
    return true
  }

  // 3つ以上のキーがあり、Optionで始まる場合は順押し（macOS）
  if (parts.length >= 3 && parts[0] === 'Option') {
    return true
  }

  // その他の3つ以上のキーの組み合わせは同時押しと判定
  // 例: Ctrl + Shift + C, Cmd + Shift + 4 など
  return false
}

/**
 * ショートカットの種類を取得
 *
 * @param {string} shortcut - ショートカット文字列
 * @returns {'sequential' | 'simultaneous'} ショートカットの種類
 */
export const getShortcutType = (shortcut: string): 'sequential' | 'simultaneous' => {
  return isSequentialShortcut(shortcut) ? 'sequential' : 'simultaneous'
}

/**
 * ショートカットの表示名を整形
 *
 * @param {string} shortcut - ショートカット文字列
 * @returns {string[]} キーの配列
 */
export const parseShortcutKeys = (shortcut: string): string[] => {
  return shortcut.split(' + ').map(part => part.trim())
}

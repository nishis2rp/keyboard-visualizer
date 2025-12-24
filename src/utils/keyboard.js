/**
 * Shift + 数字キーと記号の対応マップ（US配列基準）
 * ブラウザはShift+1を'!'として報告するため、この対応表で数字に変換
 */
const SHIFT_NUMBER_MAP = {
  '!': '1',
  '@': '2',
  '#': '3',
  '$': '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  '_': '-',
  '+': '=',
  '{': '[',
  '}': ']',
  '|': '\\',
  ':': ';',
  '"': '\'',
  '<': ',',
  '>': '.',
  '?': '/',
  '~': '`'
}

/**
 * 数字からShift記号への逆マップ
 * 例: '1' → '!', '2' → '@'
 */
const NUMBER_SHIFT_MAP = Object.fromEntries(
  Object.entries(SHIFT_NUMBER_MAP).map(([symbol, number]) => [number, symbol])
)

/** 修飾キーのソート順序 */
const MODIFIER_ORDER = {
  'Control': 1,
  'Shift': 2,
  'Alt': 3,
  'Meta': 4
}

/** 利用可能なショートカットの最大表示数 */
const MAX_SHORTCUTS_DISPLAY = 20

/**
 * キーの表示名を取得
 * @param {string} key - キー名
 * @param {Object} keyNameMap - キーボードレイアウト別の名前マップ
 * @returns {string} 表示用のキー名
 */
export const getKeyDisplayName = (key, keyNameMap) => {
  // キーマップに存在する場合はそれを返す
  if (keyNameMap[key]) {
    return keyNameMap[key]
  }
  // アルファベット1文字の場合は大文字にする
  if (key.length === 1 && /[a-z]/i.test(key)) {
    return key.toUpperCase()
  }
  return key
}

/**
 * キーを修飾キーの順序でソート
 * @param {Array<string>} keys - ソートするキーの配列
 * @returns {Array<string>} ソート済みのキー配列
 */
export const sortKeys = (keys) => {
  return keys.sort((a, b) => {
    const aOrder = MODIFIER_ORDER[a] || 999
    const bOrder = MODIFIER_ORDER[b] || 999
    return aOrder - bOrder
  })
}

/**
 * キーの組み合わせをテキストに変換
 * @param {Array<string>} keysArray - キーの配列
 * @param {Object} keyNameMap - キー名マップ
 * @returns {string} "Ctrl + Shift + A" のような形式の文字列
 */
export const getKeyComboText = (keysArray, keyNameMap) => {
  const sorted = sortKeys([...keysArray])
  return sorted.map(k => getKeyDisplayName(k, keyNameMap)).join(' + ')
}

/**
 * キーの組み合わせの代替表現を生成
 * Shift+数字キーの記号と数字の両方の表現を生成
 * @param {string} comboText - キーの組み合わせ文字列
 * @returns {Array<string>} 代替表現の配列
 * @example
 * getKeyComboAlternatives("Ctrl + Shift + !")
 * // => ["Ctrl + Shift + !", "Ctrl + Shift + 1"]
 * getKeyComboAlternatives("Ctrl + Shift + @")
 * // => ["Ctrl + Shift + @", "Ctrl + Shift + 2"]
 */
const getKeyComboAlternatives = (comboText) => {
  const alternatives = [comboText]

  // コンボを分解
  const parts = comboText.split(' + ')
  const hasShift = parts.includes('Shift')

  // 最後のキー（メインキー）を取得
  const lastKey = parts[parts.length - 1]

  // Shiftが含まれている場合、記号→数字の変換を試みる
  // 例: "Ctrl + Shift + !" → "Ctrl + Shift + 1"
  // 例: "Shift + @" → "Shift + 2"
  if (hasShift && SHIFT_NUMBER_MAP[lastKey]) {
    const newParts = [...parts]
    newParts[newParts.length - 1] = SHIFT_NUMBER_MAP[lastKey]
    alternatives.push(newParts.join(' + '))
  }

  // 逆方向の変換も追加: 数字→記号（Shiftが含まれている場合のみ）
  // 例: "Ctrl + Shift + 1" → "Ctrl + Shift + !"
  // これにより、ショートカットデータが "Ctrl + Shift + !" として定義されている場合にも対応
  if (hasShift && NUMBER_SHIFT_MAP[lastKey]) {
    const newParts = [...parts]
    newParts[newParts.length - 1] = NUMBER_SHIFT_MAP[lastKey]
    const altCombo = newParts.join(' + ')
    // 重複を避けるためチェック
    if (!alternatives.includes(altCombo)) {
      alternatives.push(altCombo)
    }
  }

  return alternatives
}

/**
 * ショートカットの説明を取得（代替表現にも対応）
 * Ctrl+Shift+1とCtrl+Shift+!を同一のものとして扱う
 * 単一文字の大文字小文字も考慮（AとaをマッチングOK）
 * @param {string} comboText - キーの組み合わせ文字列
 * @param {Object} shortcutDescriptions - ショートカット定義オブジェクト
 * @returns {string|null} ショートカットの説明、見つからない場合はnull
 */
export const getShortcutDescription = (comboText, shortcutDescriptions) => {
  // まず元のキーコンボで検索
  if (shortcutDescriptions[comboText]) {
    return shortcutDescriptions[comboText]
  }

  // 単一文字の場合、小文字でも検索（'A' → 'a'）
  if (comboText.length === 1 && /[A-Z]/i.test(comboText)) {
    const lowerCase = comboText.toLowerCase()
    if (shortcutDescriptions[lowerCase]) {
      return shortcutDescriptions[lowerCase]
    }
    const upperCase = comboText.toUpperCase()
    if (shortcutDescriptions[upperCase]) {
      return shortcutDescriptions[upperCase]
    }
  }

  // 代替表現で検索
  const alternatives = getKeyComboAlternatives(comboText)
  for (const alt of alternatives) {
    if (shortcutDescriptions[alt]) {
      return shortcutDescriptions[alt]
    }
  }

  return null
}

/**
 * 利用可能なショートカット一覧を取得（代替表現にも対応）
 * 現在押されているキーで始まるショートカットをすべて取得
 * @param {Array<string>} keys - 現在押されているキーの配列
 * @param {Object} keyNameMap - キー名マップ
 * @param {Object} shortcutDescriptions - ショートカット定義オブジェクト
 * @returns {Array<{shortcut: string, description: string}>} ショートカット一覧
 */
export const getAvailableShortcuts = (keys, keyNameMap, shortcutDescriptions) => {
  const comboPrefix = getKeyComboText(keys, keyNameMap)

  // 代替表現も取得（例: "Ctrl + Shift + !" → ["Ctrl + Shift + !", "Ctrl + Shift + 1"]）
  const prefixAlternatives = getKeyComboAlternatives(comboPrefix)

  // 該当する修飾キーで始まるショートカットをすべて取得
  const shortcuts = Object.entries(shortcutDescriptions)
    .filter(([shortcut]) => {
      // すべての代替表現でチェック
      return prefixAlternatives.some(prefix => {
        // 修飾キーのみの場合
        if (keys.length === 1 && shortcut === prefix) {
          return true
        }
        // 修飾キー + 他のキーの組み合わせ
        return shortcut.startsWith(prefix + ' +')
      })
    })
    .map(([shortcut, description]) => ({ shortcut, description }))
    // 重複を除去
    .filter((item, index, self) =>
      index === self.findIndex(t => t.shortcut === item.shortcut)
    )
    .slice(0, MAX_SHORTCUTS_DISPLAY)

  return shortcuts
}

/**
 * 単独キー（修飾キーなし）のショートカット一覧を取得
 * Gmailなどの単独キーショートカットを表示するために使用
 * @param {Object} shortcutDescriptions - ショートカット定義オブジェクト
 * @returns {Array<{shortcut: string, description: string}>} 単独キーショートカット一覧
 */
export const getSingleKeyShortcuts = (shortcutDescriptions) => {
  return Object.entries(shortcutDescriptions)
    .filter(([shortcut]) => !shortcut.includes(' + '))
    .map(([shortcut, description]) => ({ shortcut, description }))
    .slice(0, MAX_SHORTCUTS_DISPLAY)
}

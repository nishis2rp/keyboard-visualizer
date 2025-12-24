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
  'Meta': 4,
  'OS': 4  // OSキー（Winキー）はMetaと同じ優先度
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
 * ショートカットの最後のキーを取得
 * @param {string} shortcut - ショートカット文字列（例: "Win + A"）
 * @returns {string} 最後のキー（例: "A"）
 */
const getLastKey = (shortcut) => {
  const parts = shortcut.split(' + ')
  return parts[parts.length - 1]
}

/**
 * 利用可能なショートカット一覧を取得（代替表現にも対応）
 * 現在押されているキーで始まるショートカットをすべて取得
 * キーの順序に関係なくマッチング（Win + Shift = Shift + Win）
 * @param {Array<string>} keys - 現在押されているキーの配列
 * @param {Object} keyNameMap - キー名マップ
 * @param {Object} shortcutDescriptions - ショートカット定義オブジェクト
 * @returns {Array<{shortcut: string, description: string}>} ショートカット一覧
 */
export const getAvailableShortcuts = (keys, keyNameMap, shortcutDescriptions) => {
  // 押されているキーを表示名に変換してセットにする
  const pressedKeySet = new Set(keys.map(k => getKeyDisplayName(k, keyNameMap)))

  // 該当する修飾キーで始まるショートカットをすべて取得
  const shortcuts = Object.entries(shortcutDescriptions)
    .filter(([shortcut]) => {
      // ショートカットのキーを分割
      const shortcutKeys = shortcut.split(' + ')

      // 押されているキーの数がショートカットのキー数以下であることを確認
      if (pressedKeySet.size > shortcutKeys.length) {
        return false
      }

      // 押されているキーがすべてショートカットの最初の部分に含まれているかチェック
      const shortcutPrefixKeys = shortcutKeys.slice(0, pressedKeySet.size)
      const shortcutPrefixSet = new Set(shortcutPrefixKeys)

      // セットが等しいかチェック
      if (pressedKeySet.size !== shortcutPrefixSet.size) {
        return false
      }

      for (const key of pressedKeySet) {
        if (!shortcutPrefixSet.has(key)) {
          return false
        }
      }

      return true
    })
    .map(([shortcut, description]) => ({ shortcut, description }))
    // 重複を除去
    .filter((item, index, self) =>
      index === self.findIndex(t => t.shortcut === item.shortcut)
    )
    // QWERTY順でソート（ファンクションキー優先）
    .sort((a, b) => {
      const aLastKey = getLastKey(a.shortcut)
      const bLastKey = getLastKey(b.shortcut)

      // ファンクションキーかどうかを判定（F1～F12）
      const aIsFunction = /^F\d+$/.test(aLastKey)
      const bIsFunction = /^F\d+$/.test(bLastKey)

      // 両方ファンクションキーの場合、番号順にソート
      if (aIsFunction && bIsFunction) {
        const aNum = parseInt(aLastKey.substring(1))
        const bNum = parseInt(bLastKey.substring(1))
        return aNum - bNum
      }

      // ファンクションキーを優先
      if (aIsFunction) return -1
      if (bIsFunction) return 1

      // 数字キー（1～0）を判定
      const aIsNumber = /^[0-9]$/.test(aLastKey)
      const bIsNumber = /^[0-9]$/.test(bLastKey)

      // 両方数字キーの場合、数値順にソート
      if (aIsNumber && bIsNumber) {
        const aNum = parseInt(aLastKey)
        const bNum = parseInt(bLastKey)
        return aNum - bNum
      }

      // 数字キーを優先
      if (aIsNumber) return -1
      if (bIsNumber) return 1

      // それ以外はQWERTY順
      const aIndex = getQwertyIndex(aLastKey)
      const bIndex = getQwertyIndex(bLastKey)

      if (aIndex !== bIndex) {
        return aIndex - bIndex
      }

      // QWERTY配列にない場合はアルファベット順
      return aLastKey.localeCompare(bLastKey)
    })

  return shortcuts
}

/** QWERTY配列の順序定義 */
const QWERTY_ORDER = [
  // 数字行
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
  // 上段
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
  // 中段
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'',
  // 下段
  'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'
]

/**
 * QWERTY配列での位置を取得
 * @param {string} key - キー名
 * @returns {number} QWERTY配列でのインデックス（見つからない場合は999）
 */
const getQwertyIndex = (key) => {
  const lowerKey = key.toLowerCase()
  const index = QWERTY_ORDER.indexOf(lowerKey)
  return index === -1 ? 999 : index
}

/**
 * 単独キー（修飾キーなし）のショートカット一覧を取得
 * Gmailなどの単独キーショートカットを表示するために使用
 * ファンクションキーをF1から順に並べ、その後に他のキーをQWERTY順で表示
 * @param {Object} shortcutDescriptions - ショートカット定義オブジェクト
 * @returns {Array<{shortcut: string, description: string}>} 単独キーショートカット一覧
 */
export const getSingleKeyShortcuts = (shortcutDescriptions) => {
  return Object.entries(shortcutDescriptions)
    .filter(([shortcut]) => !shortcut.includes(' + '))
    .map(([shortcut, description]) => ({ shortcut, description }))
    .sort((a, b) => {
      const aKey = a.shortcut
      const bKey = b.shortcut

      // ファンクションキーかどうかを判定（F1～F12）
      const aIsFunction = /^F\d+$/.test(aKey)
      const bIsFunction = /^F\d+$/.test(bKey)

      // 両方ファンクションキーの場合、番号順にソート
      if (aIsFunction && bIsFunction) {
        const aNum = parseInt(aKey.substring(1))
        const bNum = parseInt(bKey.substring(1))
        return aNum - bNum
      }

      // ファンクションキーを優先
      if (aIsFunction) return -1
      if (bIsFunction) return 1

      // それ以外はQWERTY順
      const aIndex = getQwertyIndex(aKey)
      const bIndex = getQwertyIndex(bKey)

      if (aIndex !== bIndex) {
        return aIndex - bIndex
      }

      // QWERTY配列にない場合はアルファベット順
      return aKey.localeCompare(bKey)
    })
}

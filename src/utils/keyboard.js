import { getCodeDisplayName } from './keyMapping'

/**
 * キー名 (KeyboardEvent.key) を正規化する。
 * 主にuseKeyboardShortcutsでのe.keyの処理のために残されている。
 * @param {string} key - キー名 (KeyboardEvent.key)
 * @returns {string} 正規化されたキー名
 */
export const normalizeKey = (key) => {
  // アルファベット1文字の場合は小文字に統一（macOSのCmd+キーの大文字小文字問題対策）
  if (key.length === 1 && /[a-zA-Z]/.test(key)) {
    return key.toLowerCase()
  }
  return key
}

/** 修飾キーのソート順序 (KeyboardEvent.code) */
const MODIFIER_ORDER = {
  'ControlLeft': 1, 'ControlRight': 1,
  'ShiftLeft': 2, 'ShiftRight': 2,
  'AltLeft': 3, 'AltRight': 3,
  'MetaLeft': 4, 'MetaRight': 4,
}

/** 利用可能なショートカットの最大表示数 */
const MAX_SHORTCUTS_DISPLAY = 20

/**
 * キーコードを修飾キーの順序でソート
 * @param {Array<string>} codes - ソートするキーの配列 (KeyboardEvent.code)
 * @returns {Array<string>} ソート済みのキー配列
 */
export const sortKeys = (codes) => {
  return codes.sort((a, b) => {
    const aOrder = MODIFIER_ORDER[a] || 999
    const bOrder = MODIFIER_ORDER[b] || 999
    return aOrder - bOrder
  })
}

/**
 * キーコードの組み合わせをテキストに変換
 * @param {Array<string>} codesArray - キーの配列 (KeyboardEvent.code)
 * @param {string} layout - キーボードレイアウト ('macUs', 'macJis', 'windowsJis')
 * @returns {string} "Ctrl + Shift + A" のような表示名形式の文字列
 */
export const getKeyComboText = (codesArray, layout) => {
  const sortedCodes = sortKeys([...codesArray])
  const shiftPressed = codesArray.includes('ShiftLeft') || codesArray.includes('ShiftRight');
  
  // getCodeDisplayNameはcodeとkeyとlayoutとshiftPressedを受け取る
  // ここではkeyは不明なのでnullを渡す
  return sortedCodes.map(code => getCodeDisplayName(code, null, layout, shiftPressed)).join(' + ')
}

/**
 * ショートカット定義と押されたキーを比較するための代替表現を生成
 * (例: ショートカット定義が 'Ctrl + !' だが、押されたキーは 'ControlLeft + ShiftLeft + Digit1')
 * @param {string} displayComboText - getKeyComboTextで生成された表示名形式の組み合わせ文字列 (例: 'Ctrl + Shift + 1')
 * @param {string} layout - キーボードレイアウト
 * @returns {Array<string>} 代替表現の配列
 */
const getKeyComboAlternatives = (displayComboText, layout) => {
  const alternatives = [displayComboText];

  // ShortcutDescriptionsの定義がKeyboardEvent.keyベースと仮定
  // Shift+数字キーの記号と数字の両方の表現を生成するロジックが必要
  // 例: "Ctrl + Shift + 1" → "Ctrl + Shift + !"
  // このロジックはkeyMapping.jsの知識も必要になるため、一旦シンプルに
  // getCodeDisplayNameの結果をそのまま使う。必要に応じて拡張。
  
  // 例: displayComboTextが "Ctrl + Shift + 1" の場合、"Ctrl + Shift + !" も候補にする
  const parts = displayComboText.split(' + ');
  const hasShift = parts.some(p => p === 'Shift' || p === '⇧'); // Shiftキーの表示名も考慮

  // 最後のキーが数字の場合、対応するShift記号があるかチェック
  const lastKey = parts[parts.length - 1];
  if (hasShift && /^\d$/.test(lastKey)) { // 数字キーの場合
    // keyMapping.jsのUS/JIS_SYMBOL_MAPを逆引きして代替キーを取得
    // これはkeyMapping.jsの知識が必要になるため、ここでは一旦簡略化
    // (後でkeyMapping.jsのヘルパー関数として実装を検討)
  }

  return alternatives;
}

/**
 * ショートカットの説明を取得（代替表現にも対応）
 * @param {string} currentDisplayComboText - 現在押されているキーの表示名形式の組み合わせ文字列
 * @param {Object} shortcutDescriptions - ショートカット定義オブジェクト (keyベース、例: {'Ctrl + A': '選択'})
 * @param {string} layout - キーボードレイアウト
 * @returns {string|null} ショートカットの説明、見つからない場合はnull
 */
export const getShortcutDescription = (currentDisplayComboText, shortcutDescriptions, layout) => {
  // まず、現在の表示名で直接検索
  if (shortcutDescriptions[currentDisplayComboText]) {
    return shortcutDescriptions[currentDisplayComboText]
  }

  // 代替表現で検索
  const alternatives = getKeyComboAlternatives(currentDisplayComboText, layout)
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
 * 修飾キーのリスト (表示名ベース)
 */
const MODIFIER_KEY_NAMES = new Set([
  'Ctrl', 'Shift', 'Alt', 'Win', 'Cmd', 'Option', '⌃', '⇧', '⌥' // OSごとの表示名も含む
])

/**
 * ショートカットに含まれる修飾キーの数をカウント
 * @param {string} shortcut - ショートカット文字列（例: "Win + Shift + S"）
 * @returns {number} 修飾キーの数
 */
const countModifierKeys = (shortcut) => {
  const parts = shortcut.split(' + ')
  const modifierCount = parts.filter(key => MODIFIER_KEY_NAMES.has(key)).length
  return modifierCount
}

/**
 * 利用可能なショートカット一覧を取得
 * 現在押されているキーで始まるショートカットをすべて取得
 * @param {Array<string>} pressedCodes - 現在押されているキーの配列 (KeyboardEvent.code)
 * @param {string} layout - キーボードレイアウト
 * @param {Object} shortcutDescriptions - ショートカット定義オブジェクト (keyベース)
 * @returns {Array<{shortcut: string, description: string}>} ショートカット一覧
 */
export const getAvailableShortcuts = (pressedCodes, layout, shortcutDescriptions) => {
  // 押されているキーのcodeから表示名（keyベースの表現）のセットを作成
  const shiftPressed = pressedCodes.includes('ShiftLeft') || pressedCodes.includes('ShiftRight');
  const pressedDisplayNames = new Set(pressedCodes.map(code => getCodeDisplayName(code, null, layout, shiftPressed)));

  const shortcuts = Object.entries(shortcutDescriptions)
    .filter(([shortcut]) => {
      const shortcutKeys = shortcut.split(' + '); // shortcutDescriptionsのキーは表示名ベース

      // 押されているキーがすべてショートカットのキーに含まれているか
      const allPressedKeysInShortcut = Array.from(pressedDisplayNames).every(pressedKey => shortcutKeys.includes(pressedKey));

      // 押されているキーの数とショートカットのキー数が一致するか、
      // あるいは押されているキーがショートカットの修飾キー部分と一致するか
      const pressedModifiers = Array.from(pressedDisplayNames).filter(key => MODIFIER_KEY_NAMES.has(key));
      const shortcutModifiers = shortcutKeys.filter(key => MODIFIER_KEY_NAMES.has(key));

      // 1. 完全一致
      if (allPressedKeysInShortcut && pressedDisplayNames.size === shortcutKeys.length) {
        return true;
      }
      // 2. 修飾キーのみが一致（まだメインキーが押されていないショートカット候補）
      if (
          pressedModifiers.length > 0 && // 何らかの修飾キーが押されている
          pressedModifiers.length === shortcutModifiers.length && // 押されている修飾キーがショートカットの修飾キー数と一致
          Array.from(pressedModifiers).every(mod => shortcutModifiers.includes(mod)) && // 押されている修飾キーがすべてショートカットの修飾キーに含まれる
          pressedDisplayNames.size < shortcutKeys.length // まだメインキーが押されていない
         ) {
           return true;
      }
      return false;
    })
    .map(([shortcut, description]) => ({ shortcut, description }))
    .filter((item, index, self) =>
      index === self.findIndex(t => t.shortcut === item.shortcut)
    )
    .sort((a, b) => {
      // ソートロジックはそのまま
      const aModifierCount = countModifierKeys(a.shortcut)
      const bModifierCount = countModifierKeys(b.shortcut)

      if (aModifierCount !== bModifierCount) {
        return aModifierCount - bModifierCount
      }

      const aLastKey = getLastKey(a.shortcut)
      const bLastKey = getLastKey(b.shortcut)

      const aIsFunction = /^F\d\+$/.test(aLastKey)
      const bIsFunction = /^F\d\+$/.test(bLastKey)

      if (aIsFunction && bIsFunction) {
        const aNum = parseInt(aLastKey.substring(1))
        const bNum = parseInt(bLastKey.substring(1))
        return aNum - bNum
      }

      if (aIsFunction) return -1
      if (bIsFunction) return 1

      const aIsNumber = /^\d$/.test(aLastKey)
      const bIsNumber = /^\d$/.test(bLastKey)

      if (aIsNumber && bIsNumber) {
        const aNum = parseInt(aLastKey)
        const bNum = parseInt(bLastKey)
        return aNum - bNum
      }

      if (aIsNumber) return -1
      if (bIsNumber) return 1

      const aIndex = getQwertyIndex(aLastKey)
      const bIndex = getQwertyIndex(bLastKey)

      if (aIndex !== bIndex) {
        return aIndex - bIndex
      }

      return aLastKey.localeCompare(bLastKey)
    })
    .slice(0, MAX_SHORTCUTS_DISPLAY);

  return shortcuts
}

/** QWERTY配列の順序定義 */
const QWERTY_ORDER = [
  // 数字行
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
  // 上段
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\\\',
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

      const aIsFunction = /^F\d\+$/.test(aKey)
      const bIsFunction = /^F\d\+$/.test(bKey)

      if (aIsFunction && bIsFunction) {
        const aNum = parseInt(aKey.substring(1))
        const bNum = parseInt(bKey.substring(1))
        return aNum - bNum
      }

      if (aIsFunction) return -1
      if (bIsFunction) return 1

      const aIndex = getQwertyIndex(aKey)
      const bIndex = getQwertyIndex(bKey)

      if (aIndex !== bIndex) {
        return aIndex - bIndex
      }

      return aKey.localeCompare(bKey)
    })
}
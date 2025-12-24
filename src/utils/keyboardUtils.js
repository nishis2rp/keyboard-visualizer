// キー表示名を取得
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

// キーを修飾キーの順序でソート
export const sortKeys = (keys) => {
  const modifierOrder = { 'Control': 1, 'Shift': 2, 'Alt': 3, 'Meta': 4 }
  return keys.sort((a, b) => {
    const aOrder = modifierOrder[a] || 999
    const bOrder = modifierOrder[b] || 999
    return aOrder - bOrder
  })
}

// キーの組み合わせをテキストに変換
export const getKeyComboText = (keysArray, keyNameMap) => {
  const sorted = sortKeys([...keysArray])
  return sorted.map(k => getKeyDisplayName(k, keyNameMap)).join(' + ')
}

// ショートカットの説明を取得
export const getShortcutDescription = (comboText, shortcutDescriptions) => {
  return shortcutDescriptions[comboText] || null
}

// 利用可能なショートカット一覧を取得
export const getAvailableShortcuts = (keys, keyNameMap, shortcutDescriptions) => {
  const comboPrefix = getKeyComboText(keys, keyNameMap)

  // 該当する修飾キーで始まるショートカットをすべて取得
  const shortcuts = Object.entries(shortcutDescriptions)
    .filter(([shortcut]) => {
      // 修飾キーのみの場合
      if (keys.length === 1 && shortcut === comboPrefix) {
        return true
      }
      // 修飾キー + 他のキーの組み合わせ
      return shortcut.startsWith(comboPrefix + ' +')
    })
    .map(([shortcut, description]) => ({ shortcut, description }))
    .slice(0, 20) // 最大20件表示

  return shortcuts
}

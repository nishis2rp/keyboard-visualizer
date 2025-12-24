import { useState, useEffect } from 'react'
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts } from '../utils/keyboardUtils'

export const useKeyboardShortcuts = (shortcutDescriptions, keyNameMap) => {
  const [pressedKeys, setPressedKeys] = useState(new Set())
  const [history, setHistory] = useState([])
  const [currentDescription, setCurrentDescription] = useState(null)
  const [availableShortcuts, setAvailableShortcuts] = useState([])

  const addToHistory = (keys) => {
    const comboText = getKeyComboText(keys, keyNameMap)
    const description = getShortcutDescription(comboText, shortcutDescriptions)

    setHistory(prev => {
      if (prev.length === 0 || prev[0].combo !== comboText) {
        const newHistory = [{ combo: comboText, description }, ...prev]
        return newHistory.slice(0, 10)
      }
      return prev
    })
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl、Alt、Metaキーが押されている場合は即座にpreventDefault
      if (e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault()
      }

      const key = e.key

      // すべての修飾キーとその組み合わせでpreventDefaultを実行
      const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta']
      const isModifierKey = modifierKeys.includes(key)

      // 修飾キー自体もpreventDefault
      if (isModifierKey) {
        e.preventDefault()
      }

      // Shiftキーとの組み合わせもチェック
      if (e.shiftKey && !isModifierKey) {
        const tempSet = new Set(pressedKeys)
        tempSet.add(key)
        const comboText = getKeyComboText(Array.from(tempSet), keyNameMap)
        if (shortcutDescriptions[comboText]) {
          e.preventDefault()
        }
      }

      setPressedKeys(prev => {
        if (!prev.has(key)) {
          const newSet = new Set(prev)
          newSet.add(key)

          // 現在のショートカットの説明を更新
          const comboText = getKeyComboText(Array.from(newSet), keyNameMap)
          const description = getShortcutDescription(comboText, shortcutDescriptions)
          setCurrentDescription(description)

          // 利用可能なショートカット一覧を更新
          const shortcuts = getAvailableShortcuts(Array.from(newSet), keyNameMap, shortcutDescriptions)
          setAvailableShortcuts(shortcuts)

          return newSet
        }
        return prev
      })
    }

    const handleKeyUp = (e) => {
      const key = e.key

      setPressedKeys(prev => {
        if (prev.has(key)) {
          if (prev.size > 0) {
            addToHistory(Array.from(prev))
          }
          const newSet = new Set(prev)
          newSet.delete(key)

          // キーが離されたら説明をクリア、または残りのキーの説明を表示
          if (newSet.size === 0) {
            setCurrentDescription(null)
            setAvailableShortcuts([])
          } else {
            const comboText = getKeyComboText(Array.from(newSet), keyNameMap)
            const description = getShortcutDescription(comboText, shortcutDescriptions)
            setCurrentDescription(description)

            // 利用可能なショートカット一覧を更新
            const shortcuts = getAvailableShortcuts(Array.from(newSet), keyNameMap, shortcutDescriptions)
            setAvailableShortcuts(shortcuts)
          }

          return newSet
        }
        return prev
      })
    }

    const handleBlur = () => {
      setPressedKeys(new Set())
      setCurrentDescription(null)
      setAvailableShortcuts([])
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [pressedKeys, shortcutDescriptions, keyNameMap])

  const handleClear = () => {
    setHistory([])
  }

  return {
    pressedKeys,
    history,
    currentDescription,
    availableShortcuts,
    handleClear
  }
}

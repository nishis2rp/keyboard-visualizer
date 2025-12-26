import { useState, useEffect } from 'react'
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts, normalizeKey } from '../utils'

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

  const clearAllKeys = () => {
    setPressedKeys(new Set())
    setCurrentDescription(null)
    setAvailableShortcuts([])
  }

  useEffect(() => {
    /**
     * キーダウンイベントハンドラ
     */
    const handleKeyDown = (e) => {
      const shiftPressed = pressedKeys.has('Shift')
      const key = normalizeKey(e.key, shiftPressed)

      if (pressedKeys.has(key)) {
        return
      }

      const newKeys = new Set(pressedKeys)
      newKeys.add(key)
      const comboText = getKeyComboText(Array.from(newKeys), keyNameMap)
      const description = getShortcutDescription(comboText, shortcutDescriptions)

      if (description) {
        e.preventDefault()
        e.stopPropagation()
      }

      if (key === 'F5' || (e.ctrlKey && key === 'r')) {
        e.preventDefault()
        e.stopPropagation()
      }

      if (e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault()
        e.stopPropagation()
      }

      const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta', 'OS']
      if (modifierKeys.includes(key)) {
        e.preventDefault()
        e.stopPropagation()
      }

      if (key.startsWith('F') && key.length <= 3) {
        e.preventDefault()
        e.stopPropagation()
      }

      setPressedKeys(prev => {
        const newSet = new Set(prev)
        newSet.add(key)

        const comboText = getKeyComboText(Array.from(newSet), keyNameMap)
        const description = getShortcutDescription(comboText, shortcutDescriptions)
        setCurrentDescription(description)

        const shortcuts = getAvailableShortcuts(Array.from(newSet), keyNameMap, shortcutDescriptions)
        setAvailableShortcuts(shortcuts)

        return newSet
      })
    }

    /**
     * キーアップイベントハンドラ
     * macOS対策: 修飾キーのkeyupが発火しない場合に対応
     */
    const handleKeyUp = (e) => {
      const shiftPressed = e.key !== 'Shift' && pressedKeys.has('Shift')
      const key = normalizeKey(e.key, shiftPressed)
      const isModifierKey = ['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(key)

      if (isModifierKey) {
        // 修飾キーが離された後の状態をシミュレート
        const remainingKeys = new Set(pressedKeys)
        remainingKeys.delete(key)

        const hasOtherModifiers = Array.from(remainingKeys).some(k =>
          ['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(k)
        )
        const hasNonModifiers = Array.from(remainingKeys).some(k =>
          !['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(k)
        )

        // 文字キーだけが残り、他の修飾キーがない場合は全クリア
        if (hasNonModifiers && !hasOtherModifiers) {
          if (pressedKeys.size > 0) {
            addToHistory(Array.from(pressedKeys))
          }
          clearAllKeys()
          return
        }
      } else {
        // 文字キーのkeyup時: 修飾キーの実際の状態と記録を比較
        const hasRecordedMeta = pressedKeys.has('Meta') || pressedKeys.has('OS')
        const hasRecordedCtrl = pressedKeys.has('Control')
        const hasRecordedShift = pressedKeys.has('Shift')
        const hasRecordedAlt = pressedKeys.has('Alt')

        const shouldClear =
          (hasRecordedMeta && !e.metaKey) ||
          (hasRecordedCtrl && !e.ctrlKey) ||
          (hasRecordedShift && !e.shiftKey) ||
          (hasRecordedAlt && !e.altKey)

        if (shouldClear) {
          if (pressedKeys.size > 0) {
            addToHistory(Array.from(pressedKeys))
          }
          clearAllKeys()
          return
        }
      }

      setPressedKeys(prev => {
        if (prev.has(key)) {
          if (prev.size > 0) {
            addToHistory(Array.from(prev))
          }
          const newSet = new Set(prev)
          newSet.delete(key)

          if (newSet.size === 0) {
            setCurrentDescription(null)
            setAvailableShortcuts([])
          } else {
            const comboText = getKeyComboText(Array.from(newSet), keyNameMap)
            const description = getShortcutDescription(comboText, shortcutDescriptions)
            setCurrentDescription(description)

            const shortcuts = getAvailableShortcuts(Array.from(newSet), keyNameMap, shortcutDescriptions)
            setAvailableShortcuts(shortcuts)
          }

          return newSet
        }
        return prev
      })
    }

    const handleBlur = () => {
      clearAllKeys()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearAllKeys()
      }
    }

    const handleFocus = () => {
      setTimeout(() => {
        clearAllKeys()
      }, 50)
    }

    /**
     * マウスイベントハンドラ
     * keyupが発火しない場合のフォールバック
     */
    const handleMouseEvent = (e) => {
      if (pressedKeys.size === 0) return

      const actualModifiers = new Set()
      if (e.ctrlKey) actualModifiers.add('Control')
      if (e.shiftKey) actualModifiers.add('Shift')
      if (e.altKey) actualModifiers.add('Alt')
      if (e.metaKey) actualModifiers.add('Meta')

      const recordedModifiers = new Set(
        Array.from(pressedKeys).filter(key =>
          ['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(key)
        )
      )

      const recordedNonModifiers = Array.from(pressedKeys).filter(key =>
        !['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(key)
      )

      let needsClear = false

      // 記録されている修飾キーが実際には押されていない
      for (const mod of recordedModifiers) {
        if (!actualModifiers.has(mod)) {
          needsClear = true
          break
        }
      }

      // 修飾キーが全て離されているのに文字キーが残っている
      if (!needsClear && recordedNonModifiers.length > 0 && actualModifiers.size === 0) {
        needsClear = true
      }

      // 実際の修飾キーより多くのキーが記録されている
      if (!needsClear && pressedKeys.size > actualModifiers.size && recordedNonModifiers.length > 0) {
        needsClear = true
      }

      if (needsClear) {
        clearAllKeys()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('keyup', handleKeyUp, true)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('mousemove', handleMouseEvent)
    document.addEventListener('mousedown', handleMouseEvent)
    document.addEventListener('click', handleMouseEvent)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('keyup', handleKeyUp, true)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('mousemove', handleMouseEvent)
      document.removeEventListener('mousedown', handleMouseEvent)
      document.removeEventListener('click', handleMouseEvent)
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

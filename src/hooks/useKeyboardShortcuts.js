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

  // 定期チェックは削除（誤動作の原因となるため）
  // マウスイベントとkeyupイベントでの検出のみに頼る

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shiftキーが押されている場合、記号を元のキーに正規化
      const shiftPressed = pressedKeys.has('Shift')
      const key = normalizeKey(e.key, shiftPressed)

      // デバッグログ（より詳細に）
      console.log(`🔽 [keydown] key="${e.key}" code="${e.code}" normalized="${key}" | meta=${e.metaKey} ctrl=${e.ctrlKey} shift=${e.shiftKey} alt=${e.altKey}`)

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

    const handleKeyUp = (e) => {
      // keyupでもShiftの状態を確認（ただしShift自体が離された場合は除く）
      const shiftPressed = e.key !== 'Shift' && pressedKeys.has('Shift')
      const key = normalizeKey(e.key, shiftPressed)

      // デバッグログ（より詳細に）
      console.log(`🔼 [keyup] key="${e.key}" code="${e.code}" normalized="${key}" | meta=${e.metaKey} ctrl=${e.ctrlKey} shift=${e.shiftKey} alt=${e.altKey} | pressedKeys:`, Array.from(pressedKeys))

      // 修飾キーが離された場合の処理
      const isModifierKey = ['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(key)

      if (isModifierKey) {
        console.log(`🔑 [keyup] 修飾キー "${key}" が離されました`)
        // 修飾キーが離された場合は、そのキーだけを削除（通常処理に進む）
        // 全クリアはしない
      } else {
        // 文字キーが離された場合のみ、修飾キーの不一致をチェック
        const hasRecordedMeta = pressedKeys.has('Meta') || pressedKeys.has('OS')
        const hasRecordedCtrl = pressedKeys.has('Control')
        const hasRecordedShift = pressedKeys.has('Shift')
        const hasRecordedAlt = pressedKeys.has('Alt')

        // 記録されているが実際には押されていない修飾キーがある場合
        const shouldClear =
          (hasRecordedMeta && !e.metaKey) ||
          (hasRecordedCtrl && !e.ctrlKey) ||
          (hasRecordedShift && !e.shiftKey) ||
          (hasRecordedAlt && !e.altKey)

        if (shouldClear) {
          console.log(`✅ [keyup] 文字キー離し時に修飾キーの不一致を検出、全キーをクリアします (recorded: Meta=${hasRecordedMeta}, Ctrl=${hasRecordedCtrl}, Shift=${hasRecordedShift}, Alt=${hasRecordedAlt} | actual: meta=${e.metaKey}, ctrl=${e.ctrlKey}, shift=${e.shiftKey}, alt=${e.altKey})`)
          if (pressedKeys.size > 0) {
            addToHistory(Array.from(pressedKeys))
          }
          clearAllKeys()
          return
        }
      }

      console.log(`ℹ️ [keyup] 通常処理: "${key}" を削除`)

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

    // マウス操作時に修飾キーの状態をチェック（即座にクリア）
    const handleMouseEvent = (e) => {
      // キーが何も押されていない場合はスキップ
      if (pressedKeys.size === 0) return

      // 実際の修飾キーの状態を確認
      const actualModifiers = new Set()
      if (e.ctrlKey) actualModifiers.add('Control')
      if (e.shiftKey) actualModifiers.add('Shift')
      if (e.altKey) actualModifiers.add('Alt')
      if (e.metaKey) actualModifiers.add('Meta')

      // 記録されているキーを確認
      const recordedModifiers = new Set(
        Array.from(pressedKeys).filter(key =>
          ['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(key)
        )
      )

      const recordedNonModifiers = Array.from(pressedKeys).filter(key =>
        !['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(key)
      )

      let needsClear = false

      // 1. 記録されている修飾キーが実際には押されていない場合
      for (const mod of recordedModifiers) {
        if (!actualModifiers.has(mod)) {
          needsClear = true
          break
        }
      }

      // 2. 修飾キーが全て離されているのに文字キーが記録されている場合
      if (!needsClear && recordedNonModifiers.length > 0 && actualModifiers.size === 0) {
        needsClear = true
      }

      // 3. 実際の修飾キーより多くのキーが記録されている場合（文字キーが残っている）
      if (!needsClear && pressedKeys.size > actualModifiers.size && recordedNonModifiers.length > 0) {
        needsClear = true
      }

      if (needsClear) {
        if (import.meta.env.DEV) {
          console.log('[Mouse Event] キー状態の不一致を即座に検出、クリアします', {
            recorded: Array.from(pressedKeys),
            actualModifiers: Array.from(actualModifiers),
            recordedNonModifiers
          })
        }
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

import { useState, useEffect } from 'react'
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts, normalizeKey } from '../utils'

export const useKeyboardShortcuts = (shortcutDescriptions, keyNameMap) => {
  const [pressedKeys, setPressedKeys] = useState(new Set())
  const [history, setHistory] = useState([])
  const [currentDescription, setCurrentDescription] = useState(null)
  const [availableShortcuts, setAvailableShortcuts] = useState([])
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0)

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

  // 定期的にキー状態をチェック
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastKeyPress = now - lastKeyPressTime

      // 何かキーが押されている状態で、かつ最後のキー操作から500ms以上経過している場合
      if (pressedKeys.size > 0 && timeSinceLastKeyPress > 500) {
        if (import.meta.env.DEV) {
          console.log('[定期チェック] キーが500ms以上押されたまま、クリアします:', Array.from(pressedKeys), `経過時間: ${timeSinceLastKeyPress}ms`)
        }
        clearAllKeys()
      }
    }, 200) // 200msごとにチェック

    return () => clearInterval(checkInterval)
  }, [pressedKeys, lastKeyPressTime])

  useEffect(() => {
    const handleKeyDown = (e) => {
      // キーイベントのタイムスタンプを更新
      setLastKeyPressTime(Date.now())

      // Shiftキーが押されている場合、記号を元のキーに正規化
      const shiftPressed = pressedKeys.has('Shift')
      const key = normalizeKey(e.key, shiftPressed)

      // デバッグログ
      if (import.meta.env.DEV) {
        console.log(`[keydown] original: "${e.key}", normalized: "${key}", metaKey: ${e.metaKey}, ctrlKey: ${e.ctrlKey}`)
      }

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
      // キーイベントのタイムスタンプを更新
      setLastKeyPressTime(Date.now())

      // keyupでもShiftの状態を確認（ただしShift自体が離された場合は除く）
      const shiftPressed = e.key !== 'Shift' && pressedKeys.has('Shift')
      const key = normalizeKey(e.key, shiftPressed)

      // デバッグログ
      if (import.meta.env.DEV) {
        console.log(`[keyup] original: "${e.key}", normalized: "${key}", metaKey: ${e.metaKey}, ctrlKey: ${e.ctrlKey}, pressedKeys:`, Array.from(pressedKeys))
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

    // マウス操作時に修飾キーの状態をチェック
    const handleMouseEvent = (e) => {
      // キーが何も押されていない場合はスキップ
      if (pressedKeys.size === 0) return

      // 実際の修飾キーの状態を確認
      const actualModifiers = new Set()
      if (e.ctrlKey) actualModifiers.add('Control')
      if (e.shiftKey) actualModifiers.add('Shift')
      if (e.altKey) actualModifiers.add('Alt')
      if (e.metaKey) actualModifiers.add('Meta')

      // 記録されている修飾キーと実際の状態が異なる場合はクリア
      const recordedModifiers = new Set(
        Array.from(pressedKeys).filter(key =>
          ['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(key)
        )
      )

      let needsClear = false
      for (const mod of recordedModifiers) {
        if (!actualModifiers.has(mod)) {
          needsClear = true
          break
        }
      }

      // 修飾キーのみが押されている状態で文字キーが記録されている場合もクリア
      if (!needsClear && pressedKeys.size > actualModifiers.size) {
        const hasNonModifierKeys = Array.from(pressedKeys).some(key =>
          !['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(key)
        )
        if (hasNonModifierKeys && actualModifiers.size === 0) {
          needsClear = true
        }
      }

      if (needsClear) {
        if (import.meta.env.DEV) {
          console.log('[Mouse Event] キー状態の不一致を検出、クリアします', {
            recorded: Array.from(pressedKeys),
            actual: Array.from(actualModifiers)
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

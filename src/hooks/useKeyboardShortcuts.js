import { useState, useEffect, useRef } from 'react'
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts } from '../utils'

export const useKeyboardShortcuts = (shortcutDescriptions, keyNameMap) => {
  const [pressedKeys, setPressedKeys] = useState(new Set())
  const [history, setHistory] = useState([])
  const [currentDescription, setCurrentDescription] = useState(null)
  const [availableShortcuts, setAvailableShortcuts] = useState([])
  const lastKeyEventTime = useRef(Date.now())

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
    const handleKeyDown = (e) => {
      const key = e.key
      lastKeyEventTime.current = Date.now()

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
      const key = e.key
      lastKeyEventTime.current = Date.now()

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
        setPressedKeys(prev => {
          if (prev.size > 0) {
            clearAllKeys()
            return new Set()
          }
          return prev
        })
      }, 50)
    }

    const handleMouseEvent = (e) => {
      setPressedKeys(prev => {
        if (prev.size === 0) return prev

        let shouldClear = false
        const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta', 'OS']
        const hasModifierKeys = Array.from(prev).some(key => modifierKeys.includes(key))
        const hasNonModifierKeys = Array.from(prev).some(key => !modifierKeys.includes(key))

        if (hasModifierKeys && !hasNonModifierKeys) {
          if (!e.metaKey && (prev.has('Meta') || prev.has('OS'))) shouldClear = true
          if (!e.ctrlKey && prev.has('Control')) shouldClear = true
          if (!e.altKey && prev.has('Alt')) shouldClear = true
          if (!e.shiftKey && prev.has('Shift')) shouldClear = true
        }

        if (shouldClear) {
          clearAllKeys()
          return new Set()
        }

        return prev
      })
    }

    const intervalId = setInterval(() => {
      const now = Date.now()
      const timeSinceLastEvent = now - lastKeyEventTime.current
      
      if (timeSinceLastEvent > 2000) {
        setPressedKeys(prev => {
          if (prev.size > 0) {
            clearAllKeys()
            return new Set()
          }
          return prev
        })
      }
    }, 500)

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
      clearInterval(intervalId)
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

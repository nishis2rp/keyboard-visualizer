import { useState, useEffect, useRef } from 'react'
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts } from '../utils'

export const useKeyboardShortcuts = (shortcutDescriptions, keyNameMap) => {
  const [pressedKeys, setPressedKeys] = useState(new Set())
  const [history, setHistory] = useState([])
  const [currentDescription, setCurrentDescription] = useState(null)
  const [availableShortcuts, setAvailableShortcuts] = useState([])
  const lastKeyPressTime = useRef(Date.now())

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

  // すべてのキー状態をクリアする関数
  const clearAllKeys = () => {
    setPressedKeys(new Set())
    setCurrentDescription(null)
    setAvailableShortcuts([])
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key
      lastKeyPressTime.current = Date.now()

      // 重複キー押下を防ぐ
      if (pressedKeys.has(key)) {
        return
      }

      // 新しいキーセットを作成してショートカットをチェック
      const newKeys = new Set(pressedKeys)
      newKeys.add(key)
      const comboText = getKeyComboText(Array.from(newKeys), keyNameMap)
      const description = getShortcutDescription(comboText, shortcutDescriptions)

      // ショートカットが登録されている場合はpreventDefault
      if (description) {
        e.preventDefault()
        e.stopPropagation()
      }

      // F5とCtrl+Rはページリロードを防ぐために特別に処理
      if (key === 'F5' || (e.ctrlKey && key === 'r')) {
        e.preventDefault()
        e.stopPropagation()
      }

      // 修飾キー（Ctrl、Alt、Shift、Meta/Win）が押されている場合は
      // ブラウザのデフォルト動作を無効化
      if (e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault()
        e.stopPropagation()
      }

      // すべての修飾キー自体もpreventDefault
      const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta', 'OS']
      if (modifierKeys.includes(key)) {
        e.preventDefault()
        e.stopPropagation()
      }

      // Fキー（F1-F12）も全てpreventDefault
      if (key.startsWith('F') && key.length <= 3) {
        e.preventDefault()
        e.stopPropagation()
      }

      // 状態更新
      setPressedKeys(prev => {
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

    // ウィンドウがフォーカスを失ったときに全キーをクリア
    const handleBlur = () => {
      clearAllKeys()
    }

    // ページが非表示になったときに全キーをクリア
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearAllKeys()
      }
    }

    // フォーカスが戻ったときにもクリア（念のため）
    const handleFocus = () => {
      // フォーカスが戻った時点で何かキーが残っていたらクリア
      setTimeout(() => {
        setPressedKeys(prev => {
          if (prev.size > 0) {
            clearAllKeys()
            return new Set()
          }
          return prev
        })
      }, 100)
    }

    // 定期的にキー状態をチェックして、長時間押されているキーをクリア
    const intervalId = setInterval(() => {
      const now = Date.now()
      // 3秒以上キーイベントがない場合、全てクリア
      if (now - lastKeyPressTime.current > 3000) {
        setPressedKeys(prev => {
          if (prev.size > 0) {
            clearAllKeys()
            return new Set()
          }
          return prev
        })
      }
    }, 1000)

    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('keyup', handleKeyUp, true)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('keyup', handleKeyUp, true)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
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

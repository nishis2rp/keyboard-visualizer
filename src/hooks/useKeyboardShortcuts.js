import { useState, useEffect, useCallback } from 'react'
// normalizeKey はkeyMapping.jsのgetCodeDisplayNameで代替されるため削除
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts } from '../utils'
import { getCodeDisplayName } from '../utils/keyMapping' // getCodeDisplayNameをインポート

export const useKeyboardShortcuts = (shortcutDescriptions, keyboardLayout, isQuizMode = false) => {
  const [pressedKeys, setPressedKeys] = useState(new Set()) // codeを格納
  const [history, setHistory] = useState([])
  const [currentDescription, setCurrentDescription] = useState(null)
  const [availableShortcuts, setAvailableShortcuts] = useState([])

  const addToHistory = useCallback((codes) => { // codesを引数に取る
    // クイズモードでは履歴を更新しない
    if (isQuizMode) return;

    // getKeyComboTextにはgetCodeDisplayNameを直接渡せるように変更が必要
    // ここでは一時的にkeyNameMapをlayoutに置き換えて渡す
    const comboText = getKeyComboText(codes, keyboardLayout) // codeとlayoutを渡す
    const description = getShortcutDescription(comboText, shortcutDescriptions)

    setHistory(prev => {
      if (prev.length === 0 || prev[0].combo !== comboText) {
        const newHistory = [{ combo: comboText, description }, ...prev]
        return newHistory.slice(0, 10)
      }
      return prev
    })
  }, [isQuizMode, keyboardLayout, shortcutDescriptions])

  const clearAllKeys = useCallback(() => {
    setPressedKeys(new Set())
    if (!isQuizMode) { // クイズモードではこれらをリセットしない
      setCurrentDescription(null)
      setAvailableShortcuts([])
    }
  }, [isQuizMode])

  useEffect(() => {
    /**
     * キーダウンイベントハンドラ
     */
    const handleKeyDown = (e) => {
      // e.preventDefault() / e.stopPropagation() は常に実行し、ブラウザのデフォルト動作を抑止
      // ただし、入力フィールドなどでの通常の文字入力は許可する
      if (!e.repeat && !e.altKey && !e.metaKey && e.key.length === 1 &&
          !(e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) // Ctrl+C/V/Xは例外
         ) {
        e.preventDefault(); // ここで文字入力も防いでしまう可能性がある
      }
      
      // 常にpreventDefault/stopPropagationを呼ぶことで、OS/ブラウザのショートカット誤爆を防ぐ
      // ただし、テキスト入力フィールドでの挙動を考慮する必要がある
      // e.preventDefault() を呼ぶのは、ショートカットとして処理すべきと判断した場合に限定すべき
      // ここでは、一旦、これまでと同様に広くpreventDefaultを呼ぶ

      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) { // F5やCtrl+Rなどのリロード防止
        e.preventDefault()
      }

      // Alt, Ctrl, Metaが押されている場合はブラウザのデフォルト動作を抑制
      if (e.altKey || e.ctrlKey || e.metaKey) {
        e.preventDefault()
      }

      // 機能キー（F1-F12）のデフォルト動作も抑制
      if (e.code.startsWith('F') && e.code.length <= 3) { // F1, F2, ..., F12
        e.preventDefault()
      }
      
      // keyはKeyboardEvent.key, codeはKeyboardEvent.code
      // 物理キーコード (e.code) を使う
      const code = e.code;

      if (pressedKeys.has(code)) {
        return
      }

      setPressedKeys(prev => {
        const newSet = new Set(prev)
        newSet.add(code)

        if (!isQuizMode) { // クイズモードでない場合のみ更新
          const comboText = getKeyComboText(Array.from(newSet), keyboardLayout) // codeとlayoutを渡す
          const description = getShortcutDescription(comboText, shortcutDescriptions)
          setCurrentDescription(description)

          const shortcuts = getAvailableShortcuts(Array.from(newSet), keyboardLayout, shortcutDescriptions) // codeとlayoutを渡す
          setAvailableShortcuts(shortcuts)
        }

        return newSet
      })
    }

    /**
     * キーアップイベントハンドラ
     * macOS対策: 修飾キーのkeyupが発火しない場合に対応
     */
    const handleKeyUp = (e) => {
      // 物理キーコード (e.code) を使う
      const code = e.code;
      const isModifierKey = code.startsWith('Control') || code.startsWith('Shift') || code.startsWith('Alt') || code.startsWith('Meta');

      if (isModifierKey) {
        // 修飾キーが離された後の状態をシミュレート
        const remainingCodes = new Set(pressedKeys)
        remainingCodes.delete(code)

        const hasOtherModifiers = Array.from(remainingCodes).some(c =>
          c.startsWith('Control') || c.startsWith('Shift') || c.startsWith('Alt') || c.startsWith('Meta')
        )
        const hasNonModifiers = Array.from(remainingCodes).some(c =>
          !(c.startsWith('Control') || c.startsWith('Shift') || c.startsWith('Alt') || c.startsWith('Meta'))
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
        // e.ctrlKey/altKey/metaKeyは現在の状態を反映
        const hasRecordedMeta = pressedKeys.has('MetaLeft') || pressedKeys.has('MetaRight')
        const hasRecordedCtrl = pressedKeys.has('ControlLeft') || pressedKeys.has('ControlRight')
        const hasRecordedShift = pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight')
        const hasRecordedAlt = pressedKeys.has('AltLeft') || pressedKeys.has('AltRight')

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
        if (prev.has(code)) {
          if (prev.size > 0) {
            addToHistory(Array.from(prev))
          }
          const newSet = new Set(prev)
          newSet.delete(code)

          if (!isQuizMode) { // クイズモードでない場合のみ更新
            if (newSet.size === 0) {
              setCurrentDescription(null)
              setAvailableShortcuts([])
            } else {
              const comboText = getKeyComboText(Array.from(newSet), keyboardLayout) // codeとlayoutを渡す
              const description = getShortcutDescription(comboText, shortcutDescriptions)
              setCurrentDescription(description)

              const shortcuts = getAvailableShortcuts(Array.from(newSet), keyboardLayout, shortcutDescriptions) // codeとlayoutを渡す
              setAvailableShortcuts(shortcuts)
            }
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
      if (e.ctrlKey) { actualModifiers.add('ControlLeft'); actualModifiers.add('ControlRight'); }
      if (e.shiftKey) { actualModifiers.add('ShiftLeft'); actualModifiers.add('ShiftRight'); }
      if (e.altKey) { actualModifiers.add('AltLeft'); actualModifiers.add('AltRight'); }
      if (e.metaKey) { actualModifiers.add('MetaLeft'); actualModifiers.add('MetaRight'); }

      const recordedModifiers = new Set(
        Array.from(pressedKeys).filter(code =>
          code.startsWith('Control') || code.startsWith('Shift') || code.startsWith('Alt') || code.startsWith('Meta')
        )
      )

      const recordedNonModifiers = Array.from(pressedKeys).filter(code =>
        !(code.startsWith('Control') || code.startsWith('Shift') || code.startsWith('Alt') || code.startsWith('Meta'))
      )

      let needsClear = false

      // 記録されている修飾キーが実際には押されていない
      for (const mod of recordedModifiers) {
        // 例: ControlLeftが押されていると記録されているが、e.ctrlKeyはfalse
        if (
             (mod.startsWith('Control') && !e.ctrlKey) ||
             (mod.startsWith('Shift') && !e.shiftKey) ||
             (mod.startsWith('Alt') && !e.altKey) ||
             (mod.startsWith('Meta') && !e.metaKey)
           ) {
          needsClear = true
          break
        }
      }

      // 修飾キーが全て離されているのに文字キーが残っている
      if (!needsClear && recordedNonModifiers.length > 0 && !(e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)) {
        needsClear = true
      }

      // 実際の修飾キーより多くのキーが記録されている
      // （ただし、左右の修飾キーを区別するため、ここはより厳密に比較する必要があるかもしれない）
      // 一旦、簡略化のため、recordedNonModifiersが存在し、かつ実際の修飾キーよりも多くのキーがpressedKeysにある場合
      // if (!needsClear && pressedKeys.size > actualModifiers.size && recordedNonModifiers.length > 0) {
      //   needsClear = true
      // }


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
  }, [pressedKeys, shortcutDescriptions, keyboardLayout, isQuizMode, addToHistory, clearAllKeys])

  const handleClearHistory = () => { // 関数名を変更
    setHistory([])
  }

  return {
    pressedKeys, // codeのSetを返す
    history,
    currentDescription,
    availableShortcuts,
    handleClear: handleClearHistory // 名前を変更した関数を返す
  }
}

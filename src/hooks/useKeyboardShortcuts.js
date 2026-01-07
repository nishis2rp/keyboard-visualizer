import { useState, useEffect, useCallback, useRef } from 'react';
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts } from '../utils';

// このフックはキーボードショートカットの検出と管理を担当します。
export const useKeyboardShortcuts = (shortcutDescriptions, keyboardLayout, isQuizMode = false) => {
  const [pressedKeys, setPressedKeys] = useState(new Set()); // 現在押されているキーの`code`を保持
  const [history, setHistory] = useState([]);
  const [currentDescription, setCurrentDescription] = useState(null);
  const [availableShortcuts, setAvailableShortcuts] = useState([]);

  // イベントリスナー内で最新のProps/Stateを参照するためのRef
  const isQuizModeRef = useRef(isQuizMode);
  const keyboardLayoutRef = useRef(keyboardLayout);
  const shortcutDescriptionsRef = useRef(shortcutDescriptions);
  const pressedKeysRef = useRef(pressedKeys);

  // isQuizMode, keyboardLayout, shortcutDescriptions, pressedKeysが変更されたらRefも更新
  useEffect(() => {
    isQuizModeRef.current = isQuizMode;
  }, [isQuizMode]);

  useEffect(() => {
    keyboardLayoutRef.current = keyboardLayout;
  }, [keyboardLayout]);

  useEffect(() => {
    shortcutDescriptionsRef.current = shortcutDescriptions;
  }, [shortcutDescriptions]);

  useEffect(() => {
    pressedKeysRef.current = pressedKeys;
  }, [pressedKeys]);

  // すべてのキーをクリアする関数
  const clearAllKeys = useCallback(() => {
    setPressedKeys(new Set());
    if (!isQuizModeRef.current) {
      setCurrentDescription(null);
      setAvailableShortcuts([]);
    }
  }, []);

  // 履歴にショートカットを追加する関数
  const addToHistory = useCallback((codes) => {
    if (isQuizModeRef.current) return;

    const comboText = getKeyComboText(codes, keyboardLayoutRef.current);
    const description = getShortcutDescription(comboText, shortcutDescriptionsRef.current);

    setHistory(prev => {
      if (prev.length === 0 || prev[0].combo !== comboText) {
        return [{ combo: comboText, description }, ...prev].slice(0, 10);
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const { code, key, repeat, metaKey, ctrlKey, altKey, shiftKey } = e;

      // input, textareaでの入力を妨げない
      const activeEl = document.activeElement;
      if (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') {
        // ただし、修飾キーを伴うショートカットは許可
        if (!(metaKey || ctrlKey || altKey)) return;
      }
      
      // すでにキーが押されている場合は何もしない
      if (repeat || pressedKeysRef.current.has(code)) {
        return;
      }

      const newPressedKeys = new Set(pressedKeysRef.current);
      newPressedKeys.add(code);
      
      const comboText = getKeyComboText(Array.from(newPressedKeys), keyboardLayoutRef.current);
      const description = getShortcutDescription(comboText, shortcutDescriptionsRef.current);
      const isShortcut = !!description;

      // ショートカットが成立した場合、またはOSのショートカットと競合する可能性のある特定の組み合わせの場合にpreventDefaultを実行
      const isSystemShortcut = (metaKey && ['s', 'p', 'r', 'w', 'q'].includes(key.toLowerCase())) || (ctrlKey && ['s', 'p', 'r', 'w', 'q'].includes(key.toLowerCase()));
      if (isShortcut || isSystemShortcut) {
        e.preventDefault();
      }

      setPressedKeys(newPressedKeys);

      if (!isQuizModeRef.current) {
        setCurrentDescription(description);
        const shortcuts = getAvailableShortcuts(Array.from(newPressedKeys), keyboardLayoutRef.current, shortcutDescriptionsRef.current);
        setAvailableShortcuts(shortcuts);
      }
    };

    const handleKeyUp = (e) => {
      const { code } = e;

      // 押されていたキーが離された場合のみ処理
      if (pressedKeysRef.current.has(code)) {
        // 履歴に追加
        addToHistory(Array.from(pressedKeysRef.current));
        
        // 修飾キーではないキーが離されたら、押されているキーをすべてクリアする
        // これにより、「Cmd+C」の後、Cを離したらCmdもクリアされ、次の入力を待つ状態になる
        const isModifier = code.startsWith('Control') || code.startsWith('Shift') || code.startsWith('Alt') || code.startsWith('Meta');
        if (!isModifier) {
          clearAllKeys();
        } else {
          // 修飾キーが離された場合は、そのキーだけをセットから削除
          const newPressedKeys = new Set(pressedKeysRef.current);
          newPressedKeys.delete(code);
          setPressedKeys(newPressedKeys);
        }
      }
    };

    // ウィンドウがフォーカスを失ったら、キーの状態をリセット
    const handleBlur = () => {
      clearAllKeys();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [addToHistory, clearAllKeys]); // これらの関数はuseCallbackでメモ化されているため、初回レンダリング時のみ実行される

  const handleClearHistory = () => {
    setHistory([]);
  };

  return {
    pressedKeys,
    history,
    currentDescription,
    availableShortcuts,
    handleClear: handleClearHistory,
  };
};

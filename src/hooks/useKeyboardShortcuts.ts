import { useState, useEffect, useCallback, useRef } from 'react';
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts } from '../utils';
import { ShortcutData } from '../types';

const MAX_HISTORY_SIZE = 10; // ショートカット履歴の最大保存件数

// このフックはキーボードショートカットの検出と管理を担当します。
export const useKeyboardShortcuts = (shortcutDescriptions: ShortcutData, keyboardLayout: string, isQuizMode = false) => {
  const [pressedKeys, setPressedKeys] = useState(new Set()); // 現在押されているキーの`code`を保持
  const [history, setHistory] = useState([]);
  const [currentDescription, setCurrentDescription] = useState(null);
  const [availableShortcuts, setAvailableShortcuts] = useState([]);

  // pressedKeys は頻繁に更新されるため、イベントハンドラ内で最新の値を参照するために Ref を使用
  const pressedKeysRef = useRef(pressedKeys);

  useEffect(() => {
    pressedKeysRef.current = pressedKeys;
  }, [pressedKeys]);

  // すべてのキーをクリアする関数
  const clearAllKeys = useCallback(() => {
    setPressedKeys(new Set());
    if (!isQuizMode) {
      setCurrentDescription(null);
      setAvailableShortcuts([]);
    }
  }, [isQuizMode]);

  // 履歴にショートカットを追加する関数
  const addToHistory = useCallback((codes) => {
    if (isQuizMode) return;

    const comboText = getKeyComboText(codes, keyboardLayout);
    const description = getShortcutDescription(comboText, shortcutDescriptions);

    setHistory(prev => {
      if (prev.length === 0 || prev[0].combo !== comboText) {
        return [{ combo: comboText, description }, ...prev].slice(0, MAX_HISTORY_SIZE);
      }
      return prev;
    });
  }, [isQuizMode, keyboardLayout, shortcutDescriptions]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const { code, key, repeat, metaKey, ctrlKey, altKey, shiftKey } = e;

      // input, textareaでの入力を妨げない
      const activeEl = document.activeElement;
      if (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') {
        // ただし、修飾キーを伴うショートカットは許可
        if (!(metaKey || ctrlKey || altKey)) return;
      }

      // 修飾キー（Alt、Win/Cmd）単体でブラウザのデフォルト動作を防ぐ
      // Alt: ブラウザのメニューバーにフォーカスが移るのを防ぐ
      // Meta (Win/Cmd): WindowsスタートメニューやmacOS Spotlightを防ぐ
      const isModifierKeyAlone =
        code === 'AltLeft' ||
        code === 'AltRight' ||
        code === 'MetaLeft' ||
        code === 'MetaRight';

      if (isModifierKeyAlone) {
        e.preventDefault();
      }

      // キーリピート時の処理：現在のキー組み合わせがショートカットの場合はpreventDefaultする
      if (repeat || pressedKeysRef.current.has(code)) {
        // 現在押されているキーの組み合わせがショートカットかチェック
        const currentComboText = getKeyComboText(Array.from(pressedKeysRef.current), keyboardLayout);
        const currentDescription = getShortcutDescription(currentComboText, shortcutDescriptions);
        const isCurrentShortcut = !!currentDescription;

        // ショートカットの場合、またはシステムショートカットの場合はpreventDefault
        const isSystemShortcut = (metaKey && ['s', 'p', 'r', 'w', 'q', 'a'].includes(key.toLowerCase())) ||
                                 (ctrlKey && ['s', 'p', 'r', 'w', 'q', 'a', 'tab'].includes(key.toLowerCase()));

        if (isCurrentShortcut || isSystemShortcut) {
          e.preventDefault();
        }
        return;
      }

      const newPressedKeys = new Set(pressedKeysRef.current);
      newPressedKeys.add(code);

      const comboText = getKeyComboText(Array.from(newPressedKeys), keyboardLayout);
      const description = getShortcutDescription(comboText, shortcutDescriptions);
      const isShortcut = !!description;

      // クイズモード中は、開発用キー（F5, F12）を除き、全ての修飾キー付き入力をブロック
      const isDevelopmentKey = ['F5', 'F12'].includes(code);
      const hasModifier = metaKey || ctrlKey || altKey || (shiftKey && (metaKey || ctrlKey || altKey));

      if (isQuizMode) {
        // クイズモード: 開発用キー以外の修飾キー付き入力をすべてブロック
        if (hasModifier && !isDevelopmentKey) {
          e.preventDefault();
        }
      } else {
        // 通常モード: ショートカットが成立した場合、またはOSのショートカットと競合する可能性のある特定の組み合わせの場合にpreventDefaultを実行
        const isSystemShortcut = (metaKey && ['s', 'p', 'r', 'w', 'q'].includes(key.toLowerCase())) || (ctrlKey && ['s', 'p', 'r', 'w', 'q', 'tab'].includes(key.toLowerCase()));
        if (isShortcut || isSystemShortcut) {
          e.preventDefault();
        }
      }

      setPressedKeys(newPressedKeys);

      if (!isQuizMode) {
        setCurrentDescription(description);
        const shortcuts = getAvailableShortcuts(Array.from(newPressedKeys), keyboardLayout, shortcutDescriptions);
        setAvailableShortcuts(shortcuts);
      }
    };

    const handleKeyUp = (e) => {
      const { code } = e;

      // 押されていたキーが離された場合のみ処理
      if (pressedKeysRef.current.has(code)) {
        // 履歴に追加
        addToHistory(Array.from(pressedKeysRef.current));

        // 離されたキーをセットから削除
        const newPressedKeys = new Set(pressedKeysRef.current);
        newPressedKeys.delete(code);
        setPressedKeys(newPressedKeys);

        // クイズモードでない場合は、残っているキーに基づいて説明とショートカット候補を更新
        if (!isQuizMode) {
          const remainingKeys = Array.from(newPressedKeys);

          if (remainingKeys.length === 0) {
            // すべてのキーが離された場合はクリア
            setCurrentDescription(null);
            setAvailableShortcuts([]);
          } else {
            // 残っているキーがすべて修飾キーかチェック
            const allModifiers = remainingKeys.every(k =>
              k.startsWith('Control') || k.startsWith('Shift') || k.startsWith('Alt') || k.startsWith('Meta')
            );

            if (allModifiers) {
              // 修飾キーのみが残っている場合は、その修飾キーで利用可能なショートカット候補を表示
              setCurrentDescription(null);
              const shortcuts = getAvailableShortcuts(remainingKeys, keyboardLayout, shortcutDescriptions);
              setAvailableShortcuts(shortcuts);
            } else {
              // 非修飾キーが残っている場合は、新しい組み合わせの説明を更新
              const comboText = getKeyComboText(remainingKeys, keyboardLayout);
              const description = getShortcutDescription(comboText, shortcutDescriptions);
              setCurrentDescription(description);
              const shortcuts = getAvailableShortcuts(remainingKeys, keyboardLayout, shortcutDescriptions);
              setAvailableShortcuts(shortcuts);
            }
          }
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
  }, [isQuizMode, keyboardLayout, shortcutDescriptions, addToHistory, clearAllKeys]); // 依存関係を適切に設定

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

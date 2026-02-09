import { useState, useEffect, useCallback, useRef } from 'react';
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts } from '../utils';
import { AppShortcuts, AvailableShortcut, RichShortcut } from '../types'; // ★ RichShortcutとAvailableShortcutを追加

const MAX_HISTORY_SIZE = 10;

// --- Helper Functions ---

/**
 * 押されたキーのセットからショートカット情報を取得します。
 */
const getShortcutInfo = (keys: string[], layout: string, richShortcuts: RichShortcut[], selectedApp: string) => { // ★ 引数変更
  const comboText = getKeyComboText(keys, layout);
  const description = getShortcutDescription(comboText, richShortcuts, selectedApp, layout); // ★ 引数変更
  return { comboText, description };
};

/**
 * イベントがテキスト入力要素内で発生したかどうかを判定します。
 * 修飾キーが押されている場合は、ショートカットの可能性があるため false を返します。
 */
const isTypingInInputElement = (e: KeyboardEvent) => {
  const { tagName } = document.activeElement as HTMLElement;
  const isInput = tagName === 'INPUT' || tagName === 'TEXTAREA';
  const hasModifier = e.metaKey || e.ctrlKey || e.altKey;
  return isInput && !hasModifier;
};

/**
 * ブラウザやOSのデフォルト動作を妨げるべきか判定します。
 */
const shouldPreventDefault = (e: KeyboardEvent, pressedKeys: Set<string>, layout: string, descriptions: AppShortcuts, isQuizMode: boolean, richShortcuts: RichShortcut[], selectedApp: string) => { // ★ 引数追加
  const { code, key, metaKey, ctrlKey, altKey, repeat } = e;

  // ... (省略) ...

  // キーリピートの場合、現在押されているキーの組み合わせでショートカットが成立しているかチェック
  if (repeat && pressedKeys.has(code)) {
    const { description } = getShortcutInfo(Array.from(pressedKeys), layout, richShortcuts, selectedApp); // ★ richShortcutsとselectedAppを渡す
    if (description) return true;
  }

  // 新しくキーが押された結果、ショートカットが成立する場合
  const newPressedKeys = new Set(pressedKeys);
  newPressedKeys.add(code);
  const { description: newDescription } = getShortcutInfo(Array.from(newPressedKeys), layout, richShortcuts, selectedApp); // ★ richShortcutsとselectedAppを渡す
  if (newDescription) {
    return true;
  }

  return false;
};


// --- Main Hook ---

export const useKeyboardShortcuts = (richShortcuts: RichShortcut[], keyboardLayout: string, selectedApp: string, shortcutDescriptions: AppShortcuts, isQuizMode = false) => {
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());
  const [history, setHistory] = useState<{ combo: string; description: string | null }[]>([]);
  const [currentDescription, setCurrentDescription] = useState<string | null>(null);
  const [currentShortcut, setCurrentShortcut] = useState<AvailableShortcut | null>(null); // ★ 追加
  const [availableShortcuts, setAvailableShortcuts] = useState<AvailableShortcut[]>([]); // ★ AvailableShortcut[]型に
  const pressedKeysRef = useRef(pressedKeys);

  useEffect(() => {
    pressedKeysRef.current = pressedKeys;
  }, [pressedKeys]);

  const clearAllKeys = useCallback(() => {
    setPressedKeys(new Set());
    if (!isQuizMode) {
      setCurrentDescription(null);
      setCurrentShortcut(null); // ★ 追加
      setAvailableShortcuts([]);
    }
  }, [isQuizMode]);
  
  const updateNormalModeState = useCallback((keys: string[]) => {
    if (isQuizMode) return;

    if (keys.length === 0) {
      setCurrentDescription(null);
      setCurrentShortcut(null); // ★ 追加
      setAvailableShortcuts([]);
      return;
    }

    const { description } = getShortcutInfo(keys, keyboardLayout, richShortcuts, selectedApp);
    setCurrentDescription(description);

    const shortcuts = getAvailableShortcuts(keys, keyboardLayout, richShortcuts, selectedApp);
    setAvailableShortcuts(shortcuts);

    // descriptionが一致するショートカットを探してセット
    if (description) {
      const match = shortcuts.find(s => s.description === description);
      setCurrentShortcut(match || null);
    } else {
      setCurrentShortcut(null);
    }
  }, [isQuizMode, keyboardLayout, richShortcuts, selectedApp]);


  const addToHistory = useCallback((codes: string[]) => {
    if (isQuizMode || codes.length === 0) return;

    const { comboText, description } = getShortcutInfo(codes, keyboardLayout, richShortcuts, selectedApp);

    setHistory(prev => {
      if (prev.length === 0 || prev[0].combo !== comboText) {
        return [{ combo: comboText, description }, ...prev].slice(0, MAX_HISTORY_SIZE);
      }
      return prev;
    });
  }, [isQuizMode, keyboardLayout, richShortcuts, selectedApp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingInInputElement(e)) return;

      // Alt単独押しのデフォルト動作（メニューバーへのフォーカス）を防ぐ
      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        e.preventDefault();
      }

      // キーリピート（長押し）の場合
      if (pressedKeysRef.current.has(e.code)) {
        // ショートカットが成立している場合はブラウザのデフォルト動作を防ぐ
        if (shouldPreventDefault(e, pressedKeysRef.current, keyboardLayout, shortcutDescriptions, isQuizMode, richShortcuts, selectedApp)) {
          e.preventDefault();
        }
        return; // 状態は更新しない
      }

      if (shouldPreventDefault(e, pressedKeysRef.current, keyboardLayout, shortcutDescriptions, isQuizMode, richShortcuts, selectedApp)) {
        e.preventDefault();
      }

      const newPressedKeys = new Set(pressedKeysRef.current);
      newPressedKeys.add(e.code);
      setPressedKeys(newPressedKeys);

      if (!isQuizMode) {
        updateNormalModeState(Array.from(newPressedKeys));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!pressedKeysRef.current.has(e.code)) return;

      addToHistory(Array.from(pressedKeysRef.current));

      const newPressedKeys = new Set(pressedKeysRef.current);
      newPressedKeys.delete(e.code);
      setPressedKeys(newPressedKeys);
      
      updateNormalModeState(Array.from(newPressedKeys));
    };

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
  }, [isQuizMode, keyboardLayout, richShortcuts, selectedApp, shortcutDescriptions, addToHistory, clearAllKeys, updateNormalModeState]);

  const handleClearHistory = () => {
    setHistory([]);
  };

  return {
    pressedKeys,
    history,
    currentDescription,
    currentShortcut,
    availableShortcuts,
    handleClear: handleClearHistory,
  };
};

import { useState, useEffect, useCallback, useRef } from 'react';
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts } from '../utils';
import { ShortcutData } from '../types';

const MAX_HISTORY_SIZE = 10;

// --- Helper Functions ---

/**
 * 押されたキーのセットからショートカット情報を取得します。
 */
const getShortcutInfo = (keys, layout, descriptions) => {
  const comboText = getKeyComboText(keys, layout);
  const description = getShortcutDescription(comboText, descriptions);
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
const shouldPreventDefault = (e: KeyboardEvent, pressedKeys: Set<string>, layout: string, descriptions: ShortcutData, isQuizMode: boolean) => {
  const { code, key, metaKey, ctrlKey, altKey, repeat } = e;

  // 修飾キー（Alt, Win/Cmd）単体押下は常に防ぐ
  if (['AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'].includes(code)) {
    return true;
  }
  
  // 成立済みのショートカットキーがリピートされる場合
  if (repeat) {
    const { description } = getShortcutInfo(Array.from(pressedKeys), layout, descriptions);
    if (description) return true;
  }

  // クイズモード中は、開発用キー（F12など）を除くすべての修飾キー付き入力を防ぐ
  const isDevelopmentKey = ['F12', 'F5'].includes(code);
  if (isQuizMode && (metaKey || ctrlKey || altKey) && !isDevelopmentKey) {
    return true;
  }

  // 通常モードでのOS標準ショートカットとの競合を防ぐ
  // (e.g., Ctrl+S, Cmd+W)
  const keyLower = key.toLowerCase();
  const isSystemShortcut =
    (metaKey && ['s', 'p', 'r', 'w', 'q', 'a'].includes(keyLower)) ||
    (ctrlKey && ['s', 'p', 'r', 'w', 'q', 'a', 'tab'].includes(keyLower));
  if (isSystemShortcut) {
    return true;
  }

  // 新しくキーが押された結果、ショートカットが成立する場合
  const newPressedKeys = new Set(pressedKeys);
  newPressedKeys.add(code);
  const { description: newDescription } = getShortcutInfo(Array.from(newPressedKeys), layout, descriptions);
  if (newDescription) {
    return true;
  }

  return false;
};


// --- Main Hook ---

export const useKeyboardShortcuts = (shortcutDescriptions: ShortcutData, keyboardLayout: string, isQuizMode = false) => {
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());
  const [history, setHistory] = useState<{ combo: string; description: string | null }[]>([]);
  const [currentDescription, setCurrentDescription] = useState<string | null>(null);
  const [availableShortcuts, setAvailableShortcuts] = useState([]);
  const pressedKeysRef = useRef(pressedKeys);

  useEffect(() => {
    pressedKeysRef.current = pressedKeys;
  }, [pressedKeys]);

  const clearAllKeys = useCallback(() => {
    setPressedKeys(new Set());
    if (!isQuizMode) {
      setCurrentDescription(null);
      setAvailableShortcuts([]);
    }
  }, [isQuizMode]);
  
  const updateNormalModeState = useCallback((keys: string[]) => {
    if (isQuizMode) return;

    if (keys.length === 0) {
      setCurrentDescription(null);
      setAvailableShortcuts([]);
      return;
    }

    const { description } = getShortcutInfo(keys, keyboardLayout, shortcutDescriptions);
    setCurrentDescription(description);

    const shortcuts = getAvailableShortcuts(keys, keyboardLayout, shortcutDescriptions);
    setAvailableShortcuts(shortcuts);
  }, [isQuizMode, keyboardLayout, shortcutDescriptions]);


  const addToHistory = useCallback((codes: string[]) => {
    if (isQuizMode || codes.length === 0) return;

    const { comboText, description } = getShortcutInfo(codes, keyboardLayout, shortcutDescriptions);
    
    setHistory(prev => {
      if (prev.length === 0 || prev[0].combo !== comboText) {
        return [{ combo: comboText, description }, ...prev].slice(0, MAX_HISTORY_SIZE);
      }
      return prev;
    });
  }, [isQuizMode, keyboardLayout, shortcutDescriptions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingInInputElement(e)) return;
      if (pressedKeysRef.current.has(e.code)) return;
      
      if (shouldPreventDefault(e, pressedKeysRef.current, keyboardLayout, shortcutDescriptions, isQuizMode)) {
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
  }, [isQuizMode, keyboardLayout, shortcutDescriptions, addToHistory, clearAllKeys, updateNormalModeState]);

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

import { useCallback, useEffect } from 'react';
import { useKeyStates } from './keyboard/useKeyStates';
import { useShortcutHistory } from './keyboard/useShortcutHistory';
import { useShortcutDetection } from './keyboard/useShortcutDetection';
import { AppShortcuts, RichShortcut } from '../types';

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

export const useKeyboardShortcuts = (
  richShortcuts: RichShortcut[],
  keyboardLayout: string,
  selectedApp: string,
  _shortcutDescriptions: AppShortcuts,
  isQuizMode = false,
  allRichShortcuts?: RichShortcut[] // 全ショートカット（ブラウザ競合検出用）
) => {
  const {
    currentDescription,
    currentShortcut,
    availableShortcuts,
    browserConflicts,
    detectShortcuts,
    getShortcutInfo
  } = useShortcutDetection(richShortcuts, keyboardLayout, selectedApp, allRichShortcuts);

  const { history, addToHistory, clearHistory } = useShortcutHistory();

  const shouldPreventDefaultInternal = useCallback((e: KeyboardEvent, pressedKeys: Set<string>) => {
    if (isTypingInInputElement(e)) return false;

    const { code, repeat } = e;

    // キーリピートの場合、現在押されているキーの組み合わせでショートカットが成立しているかチェック
    if (repeat && pressedKeys.has(code)) {
      const { description } = getShortcutInfo(Array.from(pressedKeys));
      if (description) return true;
    }

    // 新しくキーが押された結果、ショートカットが成立する場合
    const newPressedKeys = Array.from(pressedKeys);
    if (!pressedKeys.has(code)) {
      newPressedKeys.push(code);
    }
    
    const { description: newDescription } = getShortcutInfo(newPressedKeys);
    if (newDescription) {
      return true;
    }

    return false;
  }, [getShortcutInfo]);

  const { pressedKeys, clearKeys } = useKeyStates({
    onKeyUp: (_e, currentKeys) => {
      if (!isQuizMode) {
        addToHistory(getShortcutInfo(Array.from(currentKeys)));
      }
    },
    onBlur: () => {
      if (!isQuizMode) {
        detectShortcuts([]);
      }
    },
    shouldPreventDefault: shouldPreventDefaultInternal,
    isDisabled: false
  });

  // pressedKeysが更新されたら検出を実行
  useEffect(() => {
    if (!isQuizMode) {
      detectShortcuts(Array.from(pressedKeys));
    }
  }, [pressedKeys, isQuizMode, detectShortcuts]);

  return {
    pressedKeys,
    history,
    currentDescription,
    currentShortcut,
    availableShortcuts,
    browserConflicts,
    handleClear: clearHistory,
    clearAllKeys: clearKeys // Added for compatibility if needed
  };
};

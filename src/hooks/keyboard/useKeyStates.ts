import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseKeyStatesOptions {
  onKeyDown?: (e: KeyboardEvent, currentKeys: Set<string>) => void;
  onKeyUp?: (e: KeyboardEvent, currentKeys: Set<string>) => void;
  onBlur?: () => void;
  shouldPreventDefault?: (e: KeyboardEvent, pressedKeys: Set<string>) => boolean;
  isDisabled?: boolean;
}

/**
 * キーの押下状態を管理する低レベルフック
 */
export const useKeyStates = (options: UseKeyStatesOptions = {}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const pressedKeysRef = useRef(pressedKeys);
  const { onKeyDown, onKeyUp, onBlur, shouldPreventDefault, isDisabled } = options;

  useEffect(() => {
    pressedKeysRef.current = pressedKeys;
  }, [pressedKeys]);

  const clearKeys = useCallback(() => {
    setPressedKeys(new Set());
    onBlur?.();
  }, [onBlur]);

  useEffect(() => {
    if (isDisabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt単独押しのデフォルト動作を防ぐ
      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        e.preventDefault();
      }

      const isAlreadyPressed = pressedKeysRef.current.has(e.code);

      if (shouldPreventDefault?.(e, pressedKeysRef.current)) {
        e.preventDefault();
      }

      if (!isAlreadyPressed) {
        const next = new Set(pressedKeysRef.current);
        next.add(e.code);
        setPressedKeys(next);
        onKeyDown?.(e, next);
      } else {
        onKeyDown?.(e, pressedKeysRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!pressedKeysRef.current.has(e.code)) return;

      // キーを離す前の状態を渡す必要がある場合があるため、
      // コールバックに現在の状態を渡してから更新する
      onKeyUp?.(e, pressedKeysRef.current);

      const next = new Set(pressedKeysRef.current);
      next.delete(e.code);
      setPressedKeys(next);
    };

    const handleBlurWindow = () => {
      clearKeys();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlurWindow);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlurWindow);
    };
  }, [onKeyDown, onKeyUp, clearKeys, shouldPreventDefault, isDisabled]);

  return {
    pressedKeys,
    clearKeys
  };
};

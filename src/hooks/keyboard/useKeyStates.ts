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

  // Store callbacks in refs to avoid recreating event listeners
  const onKeyDownRef = useRef(onKeyDown);
  const onKeyUpRef = useRef(onKeyUp);
  const shouldPreventDefaultRef = useRef(shouldPreventDefault);

  useEffect(() => {
    pressedKeysRef.current = pressedKeys;
  }, [pressedKeys]);

  useEffect(() => {
    onKeyDownRef.current = onKeyDown;
    onKeyUpRef.current = onKeyUp;
    shouldPreventDefaultRef.current = shouldPreventDefault;
  });

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

      if (shouldPreventDefaultRef.current?.(e, pressedKeysRef.current)) {
        e.preventDefault();
      }

      if (!isAlreadyPressed) {
        const next = new Set(pressedKeysRef.current);
        next.add(e.code);
        setPressedKeys(next);
        onKeyDownRef.current?.(e, next);
      } else {
        onKeyDownRef.current?.(e, pressedKeysRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!pressedKeysRef.current.has(e.code)) return;

      // キーを離す前の状態を渡す必要がある場合があるため、
      // コールバックに現在の状態を渡してから更新する
      onKeyUpRef.current?.(e, pressedKeysRef.current);

      const next = new Set(pressedKeysRef.current);
      next.delete(e.code);
      setPressedKeys(next);
    };

    const handleBlurWindow = () => {
      clearKeys();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearKeys();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlurWindow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlurWindow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clearKeys, isDisabled]);

  return {
    pressedKeys,
    clearKeys
  };
};

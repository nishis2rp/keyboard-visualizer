import { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface LocalStorageOptions<T> {
  version?: string;
  validator?: (data: unknown) => data is T;
}

type LocalStorageReturn<T> = [T, Dispatch<SetStateAction<T>>, () => void];

/**
 * LocalStorageを使用した状態管理フック
 *
 * @param {string} key - LocalStorageのキー
 * @param {T} initialValue - 初期値
 * @param {LocalStorageOptions<T>} options - オプション
 * @returns {LocalStorageReturn<T>} [value, setValue, clearValue]
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: LocalStorageOptions<T> = {}
): LocalStorageReturn<T> => {
  const { version, validator } = options;

  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValue;
      }

      const parsedItem = JSON.parse(item);

      // バージョンチェック
      if (version && parsedItem.version !== version) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      // カスタム検証
      if (validator && !validator(parsedItem)) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return parsedItem;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      window.localStorage.removeItem(key);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore = version ? { ...value, version } : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, value, version]);

  const clearValue = () => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  };

  return [value, setValue, clearValue];
};

import { useState, useEffect } from 'react'

/**
 * LocalStorageを使用した状態管理フック
 *
 * @param {string} key - LocalStorageのキー
 * @param {*} initialValue - 初期値
 * @param {Object} options - オプション
 * @param {string} [options.version] - バージョン文字列。変更された場合、既存のデータを無効化
 * @param {Function} [options.validator] - 読み込んだデータの検証関数
 * @returns {[*, Function, Function]} [value, setValue, clearValue]
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const { version, validator } = options

  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) {
        return initialValue
      }

      const parsedItem = JSON.parse(item)

      // バージョンチェック
      if (version && parsedItem.version !== version) {
        console.log(`Version mismatch for ${key}. Clearing old data.`)
        window.localStorage.removeItem(key)
        return initialValue
      }

      // カスタム検証
      if (validator && !validator(parsedItem)) {
        console.log(`Validation failed for ${key}. Clearing invalid data.`)
        window.localStorage.removeItem(key)
        return initialValue
      }

      return parsedItem
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      window.localStorage.removeItem(key)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      const valueToStore = version ? { ...value, version } : value
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error)
    }
  }, [key, value, version])

  const clearValue = () => {
    try {
      window.localStorage.removeItem(key)
      setValue(initialValue)
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error)
    }
  }

  return [value, setValue, clearValue]
}

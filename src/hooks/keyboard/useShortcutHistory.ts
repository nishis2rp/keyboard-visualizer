import { useState, useCallback } from 'react';

export interface HistoryItem {
  comboText: string;
  description: string | null;
}

const DEFAULT_MAX_HISTORY = 10;

/**
 * ショートカットの履歴を管理するフック
 */
export const useShortcutHistory = (maxSize: number = DEFAULT_MAX_HISTORY) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => {
      // 直前と同じコンボなら追加しない
      if (prev.length > 0 && prev[0].comboText === item.comboText) {
        return prev;
      }
      return [item, ...prev].slice(0, maxSize);
    });
  }, [maxSize]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    clearHistory
  };
};

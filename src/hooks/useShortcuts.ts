import { useState, useEffect } from 'react';
import { ShortcutData } from '../types';

interface UseShortcutsReturn {
  shortcuts: Record<string, ShortcutData> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * APIからショートカットデータを取得するカスタムフック
 */
export function useShortcuts(): UseShortcutsReturn {
  const [shortcuts, setShortcuts] = useState<Record<string, ShortcutData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShortcuts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/shortcuts`);

      if (!response.ok) {
        throw new Error(`Failed to fetch shortcuts: ${response.statusText}`);
      }

      const data = await response.json();

      // APIレスポンスを allShortcuts の形式に変換
      const shortcutsMap: Record<string, ShortcutData> = {};

      data.shortcuts.forEach((item: any) => {
        if (!shortcutsMap[item.application]) {
          shortcutsMap[item.application] = {};
        }
        shortcutsMap[item.application][item.keys] = item.description;
      });

      setShortcuts(shortcutsMap);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching shortcuts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortcuts();
  }, []);

  return {
    shortcuts,
    loading,
    error,
    refetch: fetchShortcuts,
  };
}

/**
 * 特定のアプリケーションのショートカットを取得するカスタムフック
 */
export function useAppShortcuts(app: string): UseShortcutsReturn {
  const [shortcuts, setShortcuts] = useState<Record<string, ShortcutData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShortcuts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/shortcuts?app=${app}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch shortcuts: ${response.statusText}`);
      }

      const data = await response.json();

      // APIレスポンスを ShortcutData の形式に変換
      const shortcutsData: ShortcutData = {};

      data.shortcuts.forEach((item: any) => {
        shortcutsData[item.keys] = item.description;
      });

      setShortcuts({ [app]: shortcutsData });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching shortcuts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (app) {
      fetchShortcuts();
    }
  }, [app]);

  return {
    shortcuts,
    loading,
    error,
    refetch: fetchShortcuts,
  };
}

import { useState, useEffect } from 'react';
import { supabase, Shortcut } from '../lib/supabase';
import { ShortcutData } from '../types';

interface UseShortcutsReturn {
  shortcuts: Record<string, ShortcutData> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Supabaseからショートカットデータを取得するカスタムフック
 */
export function useShortcuts(): UseShortcutsReturn {
  const [shortcuts, setShortcuts] = useState<Record<string, ShortcutData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShortcuts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('shortcuts')
        .select('*');

      if (supabaseError) {
        throw new Error(`Failed to fetch shortcuts: ${supabaseError.message}`);
      }

      // Supabaseレスポンスを allShortcuts の形式に変換
      const shortcutsMap: Record<string, ShortcutData> = {};

      (data as Shortcut[]).forEach((item) => {
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

      const { data, error: supabaseError } = await supabase
        .from('shortcuts')
        .select('*')
        .eq('application', app);

      if (supabaseError) {
        throw new Error(`Failed to fetch shortcuts: ${supabaseError.message}`);
      }

      // Supabaseレスポンスを ShortcutData の形式に変換
      const shortcutsData: ShortcutData = {};

      (data as Shortcut[]).forEach((item) => {
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

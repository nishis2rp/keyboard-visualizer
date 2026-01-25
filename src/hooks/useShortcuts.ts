import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AllShortcuts, ShortcutDetails, RichShortcut } from '../types';
import { getShortcutDifficulty } from '../constants/shortcutDifficulty';
import { normalizeShortcut } from '../utils/quizEngine';
import { Shortcut } from '../lib/supabase';

interface UseShortcutsReturn {
  shortcuts: AllShortcuts | null;
  richShortcuts: RichShortcut[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Supabaseからすべてのショートカットデータを取得し、難易度情報を含む形式に加工するカスタムフック
 */
export function useShortcuts(): UseShortcutsReturn {
  const [shortcuts, setShortcuts] = useState<AllShortcuts | null>(null);
  const [richShortcuts, setRichShortcuts] = useState<RichShortcut[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShortcuts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('shortcuts')
        .select('*');

      if (supabaseError) {
        throw new Error(`Failed to fetch shortcuts: ${supabaseError.message}`);
      }

      // Supabaseレスポンスを AllShortcuts の形式に変換
      const shortcutsMap: AllShortcuts = {};
      const richShortcutsArray: RichShortcut[] = [];

      (data as Shortcut[]).forEach((item) => {
        if (!shortcutsMap[item.application]) {
          shortcutsMap[item.application] = {};
        }

        const normalizedShortcut = normalizeShortcut(item.keys);
        const difficulty = item.difficulty ?? getShortcutDifficulty(normalizedShortcut);

        shortcutsMap[item.application][item.keys] = {
          description: item.description,
          difficulty: difficulty as ShortcutDetails['difficulty'],
        };

        // RichShortcut配列も作成
        richShortcutsArray.push({
          id: item.id,
          keys: item.keys,
          description: item.description,
          difficulty: difficulty as ShortcutDetails['difficulty'],
          application: item.application,
          category: item.category,
          created_at: item.created_at,
        });
      });

      setShortcuts(shortcutsMap);
      setRichShortcuts(richShortcutsArray);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching shortcuts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShortcuts();
  }, [fetchShortcuts]);

  return {
    shortcuts,
    richShortcuts,
    loading,
    error,
    refetch: fetchShortcuts,
  };
}

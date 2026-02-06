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

      // Supabaseのデフォルトは1000件制限なので、.limit()を明示的に指定
      const { data, error: supabaseError } = await supabase
        .from('shortcuts')
        .select('*')
        .limit(15000); // 最大15000件取得

      if (supabaseError) {
        throw new Error(`Failed to fetch shortcuts: ${supabaseError.message}`);
      }

      console.log('[useShortcuts] Total shortcuts fetched from DB:', data?.length);
      console.log('[useShortcuts] Expected: 1307, Got:', data?.length);

      // Count by application
      const countByApp = data?.reduce((acc: any, item: any) => {
        acc[item.application] = (acc[item.application] || 0) + 1;
        return acc;
      }, {});
      console.log('[useShortcuts] Shortcuts by app:', countByApp);

      // Supabaseレスポンスを AllShortcuts の形式に変換
      const shortcutsMap: AllShortcuts = {};
      const richShortcutsArray: RichShortcut[] = [];

      (data as Shortcut[]).forEach((item) => {
        if (!shortcutsMap[item.application]) {
          shortcutsMap[item.application] = {};
        }

        const normalizedShortcut = normalizeShortcut(item.keys);
        const difficulty: ShortcutDetails['difficulty'] = item.difficulty ? (item.difficulty as ShortcutDetails['difficulty']) : getShortcutDifficulty(normalizedShortcut); // item.difficultyがnull/undefinedでない場合はそのまま使用し、型アサーションで補完。そうでない場合はgetShortcutDifficultyの結果を使用。

        const richShortcut: RichShortcut = {
          id: item.id,
          keys: item.keys,
          description: item.description,
          difficulty: difficulty,
          application: item.application,
          category: item.category,
          created_at: item.created_at,
          platform: item.platform,
          windows_keys: item.windows_keys,
          macos_keys: item.macos_keys,
          windows_protection_level: item.windows_protection_level,
          macos_protection_level: item.macos_protection_level,
          press_type: item.press_type, // ★ 追加
        };
        richShortcutsArray.push(richShortcut);

        shortcutsMap[richShortcut.application][richShortcut.keys] = {
          description: richShortcut.description,
          difficulty: richShortcut.difficulty,
        };
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

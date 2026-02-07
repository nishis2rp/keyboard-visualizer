import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AllShortcuts, ShortcutDetails, RichShortcut, App } from '../types';
import { normalizeShortcut } from '../utils/quizEngine';
import { Shortcut } from '../lib/supabase';

interface UseShortcutsReturn {
  shortcuts: AllShortcuts | null;
  richShortcuts: RichShortcut[] | null;
  apps: App[] | null; // 追加
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
  const [apps, setApps] = useState<App[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShortcuts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 並列で取得
      const [shortcutsResponse, appsResponse] = await Promise.all([
        supabase.from('shortcuts').select('*').limit(15000),
        supabase.from('applications').select('*').order('display_order', { ascending: true })
      ]);

      if (shortcutsResponse.error) {
        throw new Error(`Failed to fetch shortcuts: ${shortcutsResponse.error.message}`);
      }
      if (appsResponse.error) {
        console.error('Failed to fetch applications, using fallback:', appsResponse.error.message);
      } else {
        setApps(appsResponse.data as App[]);
      }

      const { data } = shortcutsResponse;

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
        const difficulty: ShortcutDetails['difficulty'] = (item.difficulty as ShortcutDetails['difficulty']) || 'standard';

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
          windows_protection_level: item.windows_protection_level as 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen',
          macos_protection_level: item.macos_protection_level as 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen',
          press_type: item.press_type as 'sequential' | 'simultaneous', // ★ 追加
          alternative_group_id: item.alternative_group_id as number, // ★ 追加
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
    apps,
    loading,
    error,
    refetch: fetchShortcuts,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AllShortcuts, ShortcutDetails, RichShortcut, App } from '../types';
import { normalizeShortcut } from '../utils/quizEngine';
import { Shortcut } from '../lib/supabase';

interface UseShortcutsReturn {
  shortcuts: AllShortcuts;
  richShortcuts: RichShortcut[];
  apps: App[] | null;
  loading: boolean;
  error: Error | null;
  fetchApps: () => Promise<void>;
  fetchShortcutsForApp: (appId: string) => Promise<void>;
  isAppLoaded: (appId: string) => boolean;
}

/**
 * Supabaseからアプリケーション一覧と、必要に応じてショートカットデータを取得するカスタムフック
 */
export function useShortcuts(): UseShortcutsReturn {
  const [shortcuts, setShortcuts] = useState<AllShortcuts>({});
  const [richShortcuts, setRichShortcuts] = useState<RichShortcut[]>([]);
  const [apps, setApps] = useState<App[] | null>(null);
  const [loadedApps, setLoadedApps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApps = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setApps(data as App[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch applications'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchShortcutsForApp = useCallback(async (appId: string) => {
    if (loadedApps.has(appId)) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('shortcuts').select('*');

      if (appId !== 'random') {
        // 複数アプリ（カンマ区切り）に対応
        const appIds = appId.split(',').filter(id => id && id !== 'random');
        
        if (appIds.length === 0) {
          setLoading(false);
          return;
        }

        // 未ロードのアプリのみ取得
        const appsToFetch = appIds.filter(id => !loadedApps.has(id));
        if (appsToFetch.length === 0) {
          setLoading(false);
          return;
        }
        query = query.in('application', appsToFetch);
      } else {
        // random の場合は全アプリロード済みとするか、全データを取得
        // 既に全ロード済みのフラグがあればスキップ
        if (loadedApps.has('all')) {
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query.limit(15000);

      if (error) throw error;

      const newShortcutsMap = { ...shortcuts };
      const newRichShortcuts = [...richShortcuts];
      const newlyLoadedApps = new Set<string>();

      (data as Shortcut[]).forEach((item) => {
        newlyLoadedApps.add(item.application);
        if (!newShortcutsMap[item.application]) {
          newShortcutsMap[item.application] = {};
        }

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
          windows_protection_level: item.windows_protection_level as any,
          macos_protection_level: item.macos_protection_level as any,
          press_type: item.press_type as any,
          alternative_group_id: item.alternative_group_id as any,
        };
        
        // 重複チェック（全取得時に既にロード済みのものがある可能性があるため）
        if (!richShortcuts.some(rs => rs.id === richShortcut.id)) {
           newRichShortcuts.push(richShortcut);
        }

        newShortcutsMap[richShortcut.application][richShortcut.keys] = {
          description: richShortcut.description,
          difficulty: richShortcut.difficulty,
        };
      });

      setShortcuts(newShortcutsMap);
      setRichShortcuts(newRichShortcuts);
      setLoadedApps(prev => {
        const next = new Set(prev);
        if (appId === 'random') {
          next.add('all');
          next.add('random');
        }
        newlyLoadedApps.forEach(id => next.add(id));
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch shortcuts for ${appId}`));
    } finally {
      setLoading(false);
    }
  }, [loadedApps, shortcuts, richShortcuts]);

  const isAppLoaded = useCallback((appId: string) => {
    if (appId === 'random') return loadedApps.has('all') || loadedApps.has('random');
    const appIds = appId.split(',').filter(id => id && id !== 'random');
    return appIds.every(id => loadedApps.has(id));
  }, [loadedApps]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  return {
    shortcuts,
    richShortcuts,
    apps,
    loading,
    error,
    fetchApps,
    fetchShortcutsForApp,
    isAppLoaded,
  };
}
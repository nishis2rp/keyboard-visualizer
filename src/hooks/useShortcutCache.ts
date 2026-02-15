import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { RichShortcut, ShortcutDifficulty } from '../types';
import { Shortcut } from '../lib/supabase';
import { detectOS } from '../utils/os';

interface UseShortcutCacheReturn {
  richShortcuts: RichShortcut[];
  loading: boolean;
  error: Error | null;
  fetchShortcutsForApp: (appId: string) => Promise<void>;
  isAppLoaded: (appId: string) => boolean;
}

/**
 * ショートカットデータのキャッシング管理を行うカスタムフック
 * ショートカットの取得、キャッシング、ロード状態の管理を責務とする
 */
export function useShortcutCache(): UseShortcutCacheReturn {
  const [richShortcuts, setRichShortcuts] = useState<RichShortcut[]>([]);
  const [loadedApps, setLoadedApps] = useState<Set<string>>(new Set());
  const loadedAppsRef = useRef<Set<string>>(new Set()); // Ref for synchronous access
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchShortcutsForApp = useCallback(async (appId: string) => {
    if (import.meta.env.DEV) {
      console.log('🔵 fetchShortcutsForApp: Called with appId =', appId);
    }

    // Check if already loaded using ref
    if (loadedAppsRef.current.has(appId)) {
      if (import.meta.env.DEV) {
        console.log('⏭️ fetchShortcutsForApp: Already loaded, skipping');
      }
      return;
    }

    try {
      if (import.meta.env.DEV) {
        console.log('🔵 fetchShortcutsForApp: Starting...');
      }
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
        const appsToFetch = appIds.filter(id => !loadedAppsRef.current.has(id));

        if (appsToFetch.length === 0) {
          if (import.meta.env.DEV) {
            console.log('⏭️ fetchShortcutsForApp: All requested apps already loaded');
          }
          setLoading(false);
          return;
        }
        query = query.in('application', appsToFetch);
      } else {
        // random の場合は全アプリロード済みとするか、全データを取得
        if (loadedAppsRef.current.has('all')) {
          if (import.meta.env.DEV) {
            console.log('⏭️ fetchShortcutsForApp: All apps already loaded');
          }
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query.limit(15000);

      if (error) throw error;

      const newlyLoadedApps = new Set<string>();

      // OS検出（VS Code用のフィルタリング）
      const currentOS = detectOS();

      const newShortcuts: RichShortcut[] = [];

      (data as Shortcut[]).forEach((item) => {
        // VS CodeでWindows環境の場合、Cmd+を含むショートカットをスキップ
        if (item.application === 'vscode' && (currentOS === 'windows' || currentOS === 'linux')) {
          if (item.keys.includes('Cmd')) {
            return; // このショートカットをスキップ
          }
        }

        const difficulty = (item.difficulty as ShortcutDifficulty) || 'standard';

        const richShortcut: RichShortcut = {
          id: item.id,
          keys: item.keys,
          description: item.description,
          description_en: item.description_en,
          difficulty: difficulty,
          application: item.application,
          category: item.category,
          category_en: item.category_en,
          created_at: item.created_at,
          platform: item.platform,
          windows_keys: item.windows_keys,
          macos_keys: item.macos_keys,
          windows_protection_level: (item.windows_protection_level as RichShortcut['windows_protection_level']) || 'none',
          macos_protection_level: (item.macos_protection_level as RichShortcut['macos_protection_level']) || 'none',
          press_type: (item.press_type as RichShortcut['press_type']) || 'simultaneous',
          alternative_group_id: item.alternative_group_id || null,
        };

        newShortcuts.push(richShortcut);
        newlyLoadedApps.add(item.application);
      });

      if (import.meta.env.DEV) {
        console.log('✅ fetchShortcutsForApp: Loaded', data?.length, 'shortcuts');
      }

      // Use functional setState to merge with existing shortcuts
      setRichShortcuts(prev => {
        const merged = [...prev];
        newShortcuts.forEach(newShortcut => {
          if (!merged.some(rs => rs.id === newShortcut.id)) {
            merged.push(newShortcut);
          }
        });
        return merged;
      });

      setLoadedApps(prev => {
        const next = new Set(prev);
        if (appId === 'random') {
          next.add('all');
          next.add('random');
        }
        newlyLoadedApps.forEach(id => next.add(id));
        if (import.meta.env.DEV) {
          console.log('✅ fetchShortcutsForApp: Updated loadedApps =', Array.from(next));
        }
        loadedAppsRef.current = next; // Sync ref
        return next;
      });
    } catch (err: unknown) {
      // AbortErrorは無視（クリーンアップ時の正常な動作）
      const error = err as Error;
      if (error.name === 'AbortError' || error.message?.includes('AbortError')) {
        if (import.meta.env.DEV) {
          console.log('⏭️ fetchShortcutsForApp: Aborted (this is normal during cleanup)');
        }
        return;
      }
      console.error('❌ fetchShortcutsForApp: Error', error);
      setError(error instanceof Error ? error : new Error(`Failed to fetch shortcuts for ${appId}`));
    } finally {
      if (import.meta.env.DEV) {
        console.log('🔵 fetchShortcutsForApp: setLoading(false)');
      }
      setLoading(false);
    }
  }, []); // 依存配列を空にして、関数が再作成されないようにする

  const isAppLoaded = useCallback((appId: string) => {
    if (appId === 'random') {
      return loadedAppsRef.current.has('all') || loadedAppsRef.current.has('random');
    }
    const appIds = appId.split(',').filter(id => id && id !== 'random');
    return appIds.every(id => loadedAppsRef.current.has(id));
  }, []);

  return {
    richShortcuts,
    loading,
    error,
    fetchShortcutsForApp,
    isAppLoaded,
  };
}

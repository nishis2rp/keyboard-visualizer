import { useMemo } from 'react';
import { AllShortcuts, ShortcutDetails, RichShortcut, App } from '../types';
import { useApplications } from './useApplications';
import { useShortcutCache } from './useShortcutCache';

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
 * アプリケーション一覧とショートカットデータを統合管理するカスタムフック
 *
 * このフックは以下の2つの専用フックを組み合わせています：
 * - useApplications: アプリケーションメタデータの取得
 * - useShortcutCache: ショートカットデータのキャッシング
 *
 * レガシー形式（AllShortcuts）と新形式（RichShortcut[]）の両方を提供します。
 */
export function useShortcuts(): UseShortcutsReturn {
  // アプリケーション一覧の取得
  const {
    apps,
    loading: appsLoading,
    error: appsError,
    fetchApps,
  } = useApplications();

  // ショートカットデータのキャッシング
  const {
    richShortcuts,
    loading: shortcutsLoading,
    error: shortcutsError,
    fetchShortcutsForApp,
    isAppLoaded,
  } = useShortcutCache();

  // レガシー形式への変換（AllShortcuts）
  const shortcuts = useMemo(() => {
    const map: AllShortcuts = {};
    richShortcuts.forEach(item => {
      if (!map[item.application]) {
        map[item.application] = {};
      }
      map[item.application][item.keys] = {
        description: item.description,
        difficulty: item.difficulty,
      } as ShortcutDetails;
    });
    return map;
  }, [richShortcuts]);

  // ローディング状態とエラーの統合
  const loading = appsLoading || shortcutsLoading;
  const error = appsError || shortcutsError;

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

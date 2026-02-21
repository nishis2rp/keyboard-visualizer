import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { App } from '../types';

interface UseApplicationsReturn {
  apps: App[] | null;
  loading: boolean;
  error: Error | null;
  fetchApps: () => Promise<void>;
}

/**
 * アプリケーション一覧を取得する共通関数
 */
const performAppFetch = async (): Promise<App[]> => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as App[];
};

/**
 * Supabaseからアプリケーション一覧を取得するカスタムフック
 * アプリケーションメタデータの取得のみを責務とする
 */
export function useApplications(): UseApplicationsReturn {
  const [apps, setApps] = useState<App[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApps = useCallback(async () => {
    try {
      if (import.meta.env.DEV) {
        console.log('🔵 fetchApps: Starting...');
      }
      setLoading(true);
      const data = await performAppFetch();

      if (import.meta.env.DEV) {
        console.log('✅ fetchApps: Success', data?.length, 'apps');
      }
      setApps(data);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError' || error.message?.includes('AbortError')) {
        if (import.meta.env.DEV) {
          console.log('⏭️ fetchApps: Aborted (this is normal during cleanup)');
        }
        return;
      }
      console.error('❌ fetchApps: Error', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch applications'));
    } finally {
      if (import.meta.env.DEV) {
        console.log('🔵 fetchApps: setLoading(false)');
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();

    return () => {
      if (import.meta.env.DEV) {
        console.log('🧹 fetchApps (useEffect): Cleanup');
      }
    };
    // fetchAppsはuseCallbackで空の依存配列なので、依存配列から除外
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  return {
    apps,
    loading,
    error,
    fetchApps,
  };
}

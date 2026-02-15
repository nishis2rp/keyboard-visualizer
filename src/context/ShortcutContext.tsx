import React, { createContext, useContext, useMemo, useEffect, ReactNode, useState } from 'react';
import { useShortcuts } from '../hooks/useShortcuts';
import { useSettings } from './SettingsContext';
import { useUI } from './UIContext';
import { App, AllShortcuts, RichShortcut } from '../types';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { useLanguage } from './LanguageContext';

interface ShortcutContextType {
  allShortcuts: AllShortcuts;
  richShortcuts: RichShortcut[];
  apps: App[];
  appMap: Record<string, App>;
  loading: boolean;
  error: Error | null;
  loadShortcuts: (appId: string) => Promise<void>;
}

const ShortcutContext = createContext<ShortcutContextType | undefined>(undefined);

export const ShortcutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    shortcuts: allShortcuts,
    richShortcuts,
    apps: dbApps,
    loading,
    error,
    fetchShortcutsForApp,
    isAppLoaded,
    fetchApps
  } = useShortcuts();

  const { selectedApp } = useSettings();
  const { isQuizMode, quizApp } = useUI();
  const { t } = useLanguage();
  const [showError, setShowError] = useState(true);

  // Ensure apps is always an array
  const apps = useMemo(() => {
    if (import.meta.env.DEV) {
      console.log('🔵 ShortcutContext: dbApps =', dbApps?.length, 'apps, loading =', loading);
    }
    return dbApps || [];
  }, [dbApps]); // loadingを依存配列から削除（appsの計算に不要）

  // Create an appMap for quick lookups
  const appMap = useMemo(() => {
    return apps.reduce((acc, app) => {
      acc[app.id] = app;
      return acc;
    }, {} as Record<string, App>);
  }, [apps]);

  // 自動ロードロジック
  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const loadShortcuts = async () => {
      const targetApp = isQuizMode ? quizApp : selectedApp;
      if (import.meta.env.DEV) {
        console.log('🔵 ShortcutContext auto-load: targetApp =', targetApp, 'isQuizMode =', isQuizMode, 'selectedApp =', selectedApp, 'quizApp =', quizApp);
      }

      if (!targetApp || isAppLoaded(targetApp)) {
        if (import.meta.env.DEV) {
          console.log('⏭️ ShortcutContext auto-load: Skipping (already loaded or no targetApp)');
        }
        return;
      }

      if (import.meta.env.DEV) {
        console.log('🔵 ShortcutContext auto-load: Calling fetchShortcutsForApp');
      }

      // fetchShortcutsForAppを直接呼ぶのではなく、ここで実装
      // これによりAbortControllerを渡せるようになる
      if (isMounted) {
        await fetchShortcutsForApp(targetApp);
      }
    };

    loadShortcuts();

    return () => {
      if (import.meta.env.DEV) {
        console.log('🧹 ShortcutContext auto-load: Cleanup');
      }
      isMounted = false;
      abortController.abort();
    };
    // fetchShortcutsForAppとisAppLoadedは依存配列から除外
    // これらの関数はuseCallbackで依存配列が空なので、常に同じ参照を保持する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApp, isQuizMode, quizApp]);

  const value = {
    allShortcuts,
    richShortcuts,
    apps,
    appMap,
    loading,
    error,
    loadShortcuts: fetchShortcutsForApp
  };

  // エラーUIの表示
  const handleRetry = async () => {
    setShowError(true);
    const targetApp = isQuizMode ? quizApp : selectedApp;
    if (targetApp) {
      await fetchShortcutsForApp(targetApp);
    } else {
      await fetchApps();
    }
  };

  return (
    <ShortcutContext.Provider value={value}>
      {error && showError && (
        <ErrorAlert
          message={error.message || t.common.error}
          onRetry={handleRetry}
          onDismiss={() => setShowError(false)}
        />
      )}
      {children}
    </ShortcutContext.Provider>
  );
};

export const useShortcutData = () => {
  const context = useContext(ShortcutContext);
  if (context === undefined) {
    throw new Error('useShortcutData must be used within a ShortcutProvider');
  }
  return context;
};
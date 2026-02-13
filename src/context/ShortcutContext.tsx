import React, { createContext, useContext, useMemo, useEffect, ReactNode } from 'react';
import { useShortcuts } from '../hooks/useShortcuts';
import { useSettings } from './SettingsContext';
import { useUI } from './UIContext';
import { App, AllShortcuts, RichShortcut } from '../types';

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
    isAppLoaded 
  } = useShortcuts();

  const { selectedApp } = useSettings();
  const { isQuizMode, quizApp } = useUI();

  // Ensure apps is always an array
  const apps = useMemo(() => dbApps || [], [dbApps]);

  // Create an appMap for quick lookups
  const appMap = useMemo(() => {
    return apps.reduce((acc, app) => {
      acc[app.id] = app;
      return acc;
    }, {} as Record<string, App>);
  }, [apps]);

  // 自動ロードロジック
  useEffect(() => {
    const targetApp = isQuizMode ? quizApp : selectedApp;
    if (targetApp && !isAppLoaded(targetApp)) {
      fetchShortcutsForApp(targetApp);
    }
  }, [selectedApp, isQuizMode, quizApp, fetchShortcutsForApp, isAppLoaded]);

  const value = {
    allShortcuts,
    richShortcuts,
    apps,
    appMap,
    loading,
    error,
    loadShortcuts: fetchShortcutsForApp
  };

  return <ShortcutContext.Provider value={value}>{children}</ShortcutContext.Provider>;
};

export const useShortcutData = () => {
  const context = useContext(ShortcutContext);
  if (context === undefined) {
    throw new Error('useShortcutData must be used within a ShortcutProvider');
  }
  return context;
};
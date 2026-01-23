import React, { createContext, useState, useMemo, useCallback, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks';
import { useShortcuts } from '../hooks/useShortcuts';
import { SETUP_VERSION, STORAGE_KEYS, DEFAULTS } from '../constants';
import { getLayoutDisplayName, keyboardLayoutOptions, KeyboardLayoutOption } from '../data/layouts';
import { apps as appConfig } from '../config/apps';
import { App, ShortcutData } from '../types';

interface SetupData {
  setupCompleted: boolean;
  app: string;
  layout: string;
}

interface AppContextType {
  setup: SetupData;
  showSetup: boolean;
  selectedApp: string;
  keyboardLayout: string;
  isQuizMode: boolean;
  quizApp: string | null;
  quizDifficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' | null;
  shortcutDescriptions: ShortcutData;
  allShortcuts: Record<string, ShortcutData> | null;
  keyboardLayouts: KeyboardLayoutOption[];
  apps: App[];
  loading: boolean;
  error: Error | null;
  setSetup: (setup: SetupData) => void;
  setShowSetup: (show: boolean) => void;
  setSelectedApp: (app: string) => void;
  setKeyboardLayout: (layout: string) => void;
  setIsQuizMode: (mode: boolean) => void;
  setQuizApp: (app: string | null) => void;
  setQuizDifficulty: (difficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' | null) => void;
  handleSetupComplete: (app: string, layout: string, mode?: string, quizApp?: string | null, difficulty?: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange', isFullscreen?: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // APIからショートカットデータを取得
  const { shortcuts: allShortcuts, loading, error } = useShortcuts();

  const [setup, setSetup] = useLocalStorage(
    STORAGE_KEYS.SETUP,
    { setupCompleted: false, app: DEFAULTS.APP, layout: DEFAULTS.LAYOUT },
    {
      version: SETUP_VERSION,
      validator: (data) => data && typeof data.app === 'string' && typeof data.layout === 'string'
    }
  );

  // セットアップ画面を毎回表示（セッションベース）
  const [showSetup, setShowSetup] = useState(true);
  const [selectedApp, setSelectedApp] = useState(setup.app || DEFAULTS.APP);
  const [keyboardLayout, setKeyboardLayout] = useState(setup.layout || DEFAULTS.LAYOUT);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizApp, setQuizApp] = useState<string | null>(null);
  const [quizDifficulty, setQuizDifficulty] = useState<'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' | null>(null);
  const [apps] = useState(appConfig); // stateとして保持

  const handleSetupComplete = useCallback((app, layout, mode = 'visualizer', quizAppParam = null, difficulty = null, isFullscreen = false) => {
    setSelectedApp(app);
    setKeyboardLayout(layout);
    setIsQuizMode(mode === 'quiz');
    setQuizApp(quizAppParam);
    setQuizDifficulty(difficulty);
    setSetup({
      setupCompleted: true,
      app,
      layout
    });
    setShowSetup(false);
    // 全画面モードの情報はApp.tsxで処理される
  }, [setSetup]);

  const shortcutDescriptions = useMemo(
    () => allShortcuts?.[selectedApp] || {},
    [allShortcuts, selectedApp]
  );

  const value = {
    // State
    setup,
    showSetup,
    selectedApp,
    keyboardLayout,
    isQuizMode,
    quizApp,
    quizDifficulty,
    shortcutDescriptions,
    allShortcuts,
    keyboardLayouts: keyboardLayoutOptions,
    apps, // appsを提供
    loading,
    error,

    // Actions
    setSetup,
    setShowSetup,
    setSelectedApp,
    setKeyboardLayout,
    setIsQuizMode,
    setQuizApp,
    setQuizDifficulty,
    handleSetupComplete,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

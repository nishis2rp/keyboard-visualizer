import React, { createContext, useState, useMemo, useCallback, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks';
import { SETUP_VERSION, STORAGE_KEYS, DEFAULTS } from '../constants';
import { allShortcuts } from '../data/shortcuts';
import { getLayoutDisplayName } from '../data/layouts';
import { apps as appConfig } from '../config/apps';
import { App, ShortcutData } from '../types';

interface SetupData {
  setupCompleted: boolean;
  app: string;
  layout: string;
}

interface KeyboardLayoutOption {
  id: string;
  icon: string;
  name: string;
}

interface AppContextType {
  setup: SetupData;
  showSetup: boolean;
  selectedApp: string;
  keyboardLayout: string;
  isQuizMode: boolean;
  quizApp: string | null;
  quizDifficulty: string | null;
  shortcutDescriptions: ShortcutData;
  keyboardLayouts: KeyboardLayoutOption[];
  apps: App[];
  setSetup: (setup: SetupData) => void;
  setShowSetup: (show: boolean) => void;
  setSelectedApp: (app: string) => void;
  setKeyboardLayout: (layout: string) => void;
  setIsQuizMode: (mode: boolean) => void;
  setQuizApp: (app: string | null) => void;
  setQuizDifficulty: (difficulty: string | null) => void;
  handleSetupComplete: (app: string, layout: string, mode?: string, quizApp?: string | null, difficulty?: string, isFullscreen?: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
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
  const [quizDifficulty, setQuizDifficulty] = useState<string | null>(null);
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
    () => allShortcuts[selectedApp],
    [selectedApp]
  );

  const keyboardLayouts = useMemo(() => {
    return [
      { id: 'windows-jis', icon: '⊞', name: 'Windows JIS' },
      { id: 'mac-jis', icon: '⌘', name: 'Mac JIS' },
      { id: 'mac-us', icon: '⌘', name: 'Mac US' },
    ];
  }, []);

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
    keyboardLayouts,
    apps, // appsを提供

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

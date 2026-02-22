import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { useLocalStorage, useUserSettings } from '../hooks';
import { useAuth } from './AuthContext';
import { STORAGE_KEYS, DEFAULTS, SETUP_VERSION } from '../constants';
import { keyboardLayoutOptions, KeyboardLayoutOption } from '../data/layouts';
import { analytics } from '../utils/analytics';
import { ShortcutDifficulty } from '../types';

interface SetupData {
  setupCompleted: boolean;
  app: string;
  layout: string;
  difficulty: ShortcutDifficulty;
  theme: 'light' | 'dark' | 'system';
  showLandingVisualizer: boolean;
}

interface SettingsContextType {
  setup: SetupData;
  selectedApp: string;
  keyboardLayout: string;
  difficulty: ShortcutDifficulty;
  theme: 'light' | 'dark' | 'system';
  showLandingVisualizer: boolean;
  keyboardLayouts: KeyboardLayoutOption[];
  setSetup: (setup: SetupData) => void;
  setSelectedApp: (app: string) => void;
  setKeyboardLayout: (layout: string) => void;
  setDifficulty: (difficulty: ShortcutDifficulty) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setShowLandingVisualizer: (show: boolean) => void;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { settings: remoteSettings, saveSettings, loading: remoteLoading } = useUserSettings();

  const [setup, setSetup] = useLocalStorage<SetupData>(
    STORAGE_KEYS.SETUP,
    { 
      setupCompleted: false, 
      app: DEFAULTS.APP, 
      layout: DEFAULTS.LAYOUT,
      difficulty: 'allrange',
      theme: 'system',
      showLandingVisualizer: true
    },
    {
      version: SETUP_VERSION,
      validator: (data: unknown): data is SetupData =>
        typeof data === 'object' &&
        data !== null &&
        'app' in data &&
        'layout' in data &&
        'setupCompleted' in data &&
        'difficulty' in data
    }
  );

  const [selectedApp, setSelectedAppInternal] = useState(setup.app || DEFAULTS.APP);
  const [keyboardLayout, setKeyboardLayoutInternal] = useState(setup.layout || DEFAULTS.LAYOUT);
  const [difficulty, setDifficultyInternal] = useState<ShortcutDifficulty>(setup.difficulty || 'allrange');
  const [theme, setThemeInternal] = useState<'light' | 'dark' | 'system'>(setup.theme || 'system');
  const [showLandingVisualizer, setShowLandingVisualizerInternal] = useState(setup.showLandingVisualizer !== false);

  // Sync with remote settings when user is logged in
  useEffect(() => {
    if (user && remoteSettings) {
      // Prioritize remote settings but merge with local if necessary
      setSelectedAppInternal(remoteSettings.selectedApp || setup.app);
      setKeyboardLayoutInternal(remoteSettings.layout || setup.layout);
      setDifficultyInternal(remoteSettings.difficulty || setup.difficulty);
      setThemeInternal(remoteSettings.theme || setup.theme);
      setShowLandingVisualizerInternal(remoteSettings.showLandingVisualizer !== false);
    }
  }, [user, remoteSettings, setup]);

  // Handle setting updates
  const updateLocalAndRemote = useCallback(async (updates: Partial<SetupData>) => {
    // Update local state first for immediate UI response
    if (updates.app !== undefined) setSelectedAppInternal(updates.app);
    if (updates.layout !== undefined) setKeyboardLayoutInternal(updates.layout);
    if (updates.difficulty !== undefined) setDifficultyInternal(updates.difficulty);
    if (updates.theme !== undefined) setThemeInternal(updates.theme);
    if (updates.showLandingVisualizer !== undefined) setShowLandingVisualizerInternal(updates.showLandingVisualizer);

    // Update localStorage
    setSetup(prev => ({ ...prev, ...updates }));

    // Update remote if logged in
    if (user) {
      const remoteUpdates: any = {};
      if (updates.app !== undefined) remoteUpdates.selectedApp = updates.app;
      if (updates.layout !== undefined) remoteUpdates.layout = updates.layout;
      if (updates.difficulty !== undefined) remoteUpdates.difficulty = updates.difficulty;
      if (updates.theme !== undefined) remoteUpdates.theme = updates.theme;
      if (updates.showLandingVisualizer !== undefined) remoteUpdates.showLandingVisualizer = updates.showLandingVisualizer;

      await saveSettings(remoteUpdates);
    }
  }, [user, setSetup, saveSettings]);

  const setSelectedApp = useCallback((app: string) => {
    updateLocalAndRemote({ app });
    analytics.appSelected(app);
  }, [updateLocalAndRemote]);

  const setKeyboardLayout = useCallback((layout: string) => {
    updateLocalAndRemote({ layout });
  }, [updateLocalAndRemote]);

  const setDifficulty = useCallback((diff: ShortcutDifficulty) => {
    updateLocalAndRemote({ difficulty: diff });
  }, [updateLocalAndRemote]);

  const setTheme = useCallback((t: 'light' | 'dark' | 'system') => {
    updateLocalAndRemote({ theme: t });
  }, [updateLocalAndRemote]);

  const setShowLandingVisualizer = useCallback((show: boolean) => {
    updateLocalAndRemote({ showLandingVisualizer: show });
  }, [updateLocalAndRemote]);

  const value = useMemo(() => ({
    setup,
    selectedApp,
    keyboardLayout,
    difficulty,
    theme,
    showLandingVisualizer,
    keyboardLayouts: keyboardLayoutOptions,
    setSetup: (newSetup: SetupData) => updateLocalAndRemote(newSetup),
    setSelectedApp,
    setKeyboardLayout,
    setDifficulty,
    setTheme,
    setShowLandingVisualizer,
    loading: remoteLoading
  }), [setup, selectedApp, keyboardLayout, difficulty, theme, showLandingVisualizer, remoteLoading, setSelectedApp, setKeyboardLayout, setDifficulty, setTheme, setShowLandingVisualizer]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

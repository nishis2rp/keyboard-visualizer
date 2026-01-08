import React, { createContext, useState, useMemo, useCallback, useContext } from 'react';
import { useLocalStorage } from '../hooks';
import { SETUP_VERSION, STORAGE_KEYS, DEFAULTS } from '../constants';
import { allShortcuts } from '../data/shortcuts';
import { getLayoutDisplayName } from '../data/layouts';
import { apps as appConfig } from '../config/apps'; // appsをインポート

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [setup, setSetup] = useLocalStorage(
    STORAGE_KEYS.SETUP,
    { setupCompleted: false, app: DEFAULTS.APP, layout: DEFAULTS.LAYOUT },
    {
      version: SETUP_VERSION,
      validator: (data) => data && typeof data.app === 'string' && typeof data.layout === 'string'
    }
  );

  const [showSetup, setShowSetup] = useState(!setup.setupCompleted);
  const [selectedApp, setSelectedApp] = useState(setup.app || DEFAULTS.APP);
  const [keyboardLayout, setKeyboardLayout] = useState(setup.layout || DEFAULTS.LAYOUT);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [apps] = useState(appConfig); // stateとして保持

  const handleSetupComplete = useCallback((app, layout) => {
    setSelectedApp(app);
    setKeyboardLayout(layout);
    setSetup({
      setupCompleted: true,
      app,
      layout
    });
    setShowSetup(false);
  }, [setSetup]);

  const shortcutDescriptions = useMemo(
    () => allShortcuts[selectedApp],
    [selectedApp]
  );

  const keyboardLayouts = useMemo(() => {
    return [
      { id: 'windows-jis', icon: '⊞', name: 'Windows JIS' },
      { id: 'mac-jis', icon: '', name: 'Mac JIS' },
      { id: 'mac-us', icon: '', name: 'Mac US' },
    ];
  }, []);

  const value = {
    // State
    setup,
    showSetup,
    selectedApp,
    keyboardLayout,
    isQuizMode,
    shortcutDescriptions,
    keyboardLayouts,
    apps, // appsを提供

    // Actions
    setSetup,
    setShowSetup,
    setSelectedApp,
    setKeyboardLayout,
    setIsQuizMode,
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

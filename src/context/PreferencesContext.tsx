import React, { createContext, useState, useContext, ReactNode } from 'react';
import { DEFAULTS } from '../constants';
import { apps as appConfig } from '../config/apps';
import { KEYBOARD_LAYOUTS, KeyboardLayout } from '../config/keyboardLayouts';
import type { App } from '../config/apps';

/**
 * Preferences context value interface
 */
interface PreferencesContextValue {
  selectedApp: string;
  keyboardLayout: string;
  isQuizMode: boolean;
  apps: App[];
  keyboardLayouts: KeyboardLayout[];
  setSelectedApp: (app: string) => void;
  setKeyboardLayout: (layout: string) => void;
  setIsQuizMode: (isQuiz: boolean) => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

interface PreferencesProviderProps {
  children: ReactNode;
  initialApp?: string;
  initialLayout?: string;
  initialIsQuizMode?: boolean;
}

/**
 * PreferencesProvider manages app and keyboard layout preferences
 */
export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({
  children,
  initialApp,
  initialLayout,
  initialIsQuizMode = false,
}) => {
  const [selectedApp, setSelectedApp] = useState(initialApp || DEFAULTS.APP);
  const [keyboardLayout, setKeyboardLayout] = useState(initialLayout || DEFAULTS.LAYOUT);
  const [isQuizMode, setIsQuizMode] = useState(initialIsQuizMode);

  const value: PreferencesContextValue = {
    selectedApp,
    keyboardLayout,
    isQuizMode,
    apps: appConfig,
    keyboardLayouts: KEYBOARD_LAYOUTS,
    setSelectedApp,
    setKeyboardLayout,
    setIsQuizMode,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

/**
 * Hook to use Preferences context
 */
export const usePreferencesContext = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferencesContext must be used within a PreferencesProvider');
  }
  return context;
};

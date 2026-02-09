import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLocalStorage } from '../hooks';
import { STORAGE_KEYS, DEFAULTS, SETUP_VERSION } from '../constants';
import { keyboardLayoutOptions, KeyboardLayoutOption } from '../data/layouts';
import { analytics } from '../utils/analytics';

interface SetupData {
  setupCompleted: boolean;
  app: string;
  layout: string;
}

interface SettingsContextType {
  setup: SetupData;
  selectedApp: string;
  keyboardLayout: string;
  keyboardLayouts: KeyboardLayoutOption[];
  setSetup: (setup: SetupData) => void;
  setSelectedApp: (app: string) => void;
  setKeyboardLayout: (layout: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [setup, setSetup] = useLocalStorage(
    STORAGE_KEYS.SETUP,
    { setupCompleted: false, app: DEFAULTS.APP, layout: DEFAULTS.LAYOUT },
    {
      version: SETUP_VERSION,
      validator: (data: any): data is SetupData => 
        data && typeof data.app === 'string' && typeof data.layout === 'string'
    }
  );

  const [selectedApp, setSelectedAppInternal] = useState(setup.app || DEFAULTS.APP);
  const [keyboardLayout, setKeyboardLayout] = useState(setup.layout || DEFAULTS.LAYOUT);

  const setSelectedApp = (app: string) => {
    setSelectedAppInternal(app);
    analytics.appSelected(app);
  };

  const value = {
    setup,
    selectedApp,
    keyboardLayout,
    keyboardLayouts: keyboardLayoutOptions,
    setSetup,
    setSelectedApp,
    setKeyboardLayout
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

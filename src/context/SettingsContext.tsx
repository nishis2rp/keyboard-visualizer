import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
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
      validator: (data: unknown): data is SetupData =>
        typeof data === 'object' &&
        data !== null &&
        'app' in data &&
        'layout' in data &&
        'setupCompleted' in data &&
        typeof (data as Record<string, unknown>).app === 'string' &&
        typeof (data as Record<string, unknown>).layout === 'string' &&
        typeof (data as Record<string, unknown>).setupCompleted === 'boolean'
    }
  );

  const [selectedApp, setSelectedAppInternal] = useState(setup.app || DEFAULTS.APP);
  const [keyboardLayout, setKeyboardLayoutInternal] = useState(setup.layout || DEFAULTS.LAYOUT);

  const setSelectedApp = (app: string) => {
    setSelectedAppInternal(app);
    setSetup(prev => ({ ...prev, app }));
    analytics.appSelected(app);
  };

  const setKeyboardLayout = (layout: string) => {
    setKeyboardLayoutInternal(layout);
    setSetup(prev => ({ ...prev, layout }));
  };

  const value = useMemo(() => ({
    setup,
    selectedApp,
    keyboardLayout,
    keyboardLayouts: keyboardLayoutOptions,
    setSetup,
    setSelectedApp,
    setKeyboardLayout
  }), [setup, selectedApp, keyboardLayout, setSetup]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

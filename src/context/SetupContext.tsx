import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks';
import { SETUP_VERSION, STORAGE_KEYS, DEFAULTS } from '../constants';

/**
 * Setup state interface
 */
interface SetupState {
  setupCompleted: boolean;
  app: string;
  layout: string;
}

/**
 * Setup context value interface
 */
interface SetupContextValue {
  setup: SetupState;
  showSetup: boolean;
  setSetup: (setup: SetupState) => void;
  setShowSetup: (show: boolean) => void;
  handleSetupComplete: (app: string, layout: string, mode?: 'visualizer' | 'quiz') => void;
}

export const SetupContext = createContext<SetupContextValue | undefined>(undefined);

interface SetupProviderProps {
  children: ReactNode;
  onSetupComplete?: (app: string, layout: string, mode: 'visualizer' | 'quiz') => void;
}

/**
 * SetupProvider manages the setup flow state
 */
export const SetupProvider: React.FC<SetupProviderProps> = ({ children, onSetupComplete }) => {
  const [setup, setSetup] = useLocalStorage<SetupState>(
    STORAGE_KEYS.SETUP,
    { setupCompleted: false, app: DEFAULTS.APP, layout: DEFAULTS.LAYOUT },
    {
      version: SETUP_VERSION,
      validator: (data) => data && typeof data.app === 'string' && typeof data.layout === 'string'
    }
  );

  // セットアップ画面を毎回表示（セッションベース）
  const [showSetup, setShowSetup] = useState(true);

  const handleSetupComplete = useCallback((app: string, layout: string, mode: 'visualizer' | 'quiz' = 'visualizer') => {
    setSetup({
      setupCompleted: true,
      app,
      layout
    });
    setShowSetup(false);

    // Notify parent component if callback is provided
    onSetupComplete?.(app, layout, mode);
  }, [setSetup, onSetupComplete]);

  const value: SetupContextValue = {
    setup,
    showSetup,
    setSetup,
    setShowSetup,
    handleSetupComplete,
  };

  return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
};

/**
 * Hook to use Setup context
 */
export const useSetupContext = () => {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error('useSetupContext must be used within a SetupProvider');
  }
  return context;
};

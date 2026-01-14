/**
 * Centralized export for all context providers and hooks
 */

// Setup Context
export { SetupProvider, useSetupContext } from './SetupContext';
export type { } from './SetupContext';

// Preferences Context
export { PreferencesProvider, usePreferencesContext } from './PreferencesContext';
export type { } from './PreferencesContext';

// Shortcuts Context
export { ShortcutsProvider, useShortcutsContext } from './ShortcutsContext';
export type { } from './ShortcutsContext';

// Quiz Context
export { QuizProvider, useQuizContext } from './QuizContext';

// Combined Provider for easy app-level setup
import React, { ReactNode } from 'react';
import { SetupProvider, useSetupContext } from './SetupContext';
import { PreferencesProvider, usePreferencesContext } from './PreferencesContext';
import { ShortcutsProvider, useShortcutsContext } from './ShortcutsContext';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * ShortcutsProviderWrapper automatically connects to PreferencesContext
 */
const ShortcutsProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedApp } = usePreferencesContext();
  return <ShortcutsProvider selectedApp={selectedApp}>{children}</ShortcutsProvider>;
};

/**
 * Combined provider that wraps all context providers
 * Replaces the old AppProvider with a composition of smaller contexts
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const handleSetupComplete = (_app: string, _layout: string, _mode: 'visualizer' | 'quiz') => {
    // This callback is handled by PreferencesProvider initialization
  };

  return (
    <SetupProvider onSetupComplete={handleSetupComplete}>
      <PreferencesProviderWithSetup>{children}</PreferencesProviderWithSetup>
    </SetupProvider>
  );
};

/**
 * PreferencesProviderWithSetup connects Setup and Preferences contexts
 */
const PreferencesProviderWithSetup: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setup } = useSetupContext();

  return (
    <PreferencesProvider
      initialApp={setup.app}
      initialLayout={setup.layout}
    >
      <ShortcutsProviderWrapper>
        {children}
      </ShortcutsProviderWrapper>
    </PreferencesProvider>
  );
};

/**
 * Legacy hook for backward compatibility
 * @deprecated Use specific hooks: useSetupContext, usePreferencesContext, useShortcutsContext
 */
export const useAppContext = () => {
  const setup = useSetupContext();
  const preferences = usePreferencesContext();
  const shortcuts = useShortcutsContext();

  return {
    ...setup,
    ...preferences,
    ...shortcuts,
  };
};

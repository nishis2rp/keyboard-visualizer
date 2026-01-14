import React, { createContext, useMemo, useContext, ReactNode } from 'react';
import { allShortcuts } from '../data/shortcuts';

/**
 * Shortcut description type
 */
type ShortcutDescriptions = Record<string, string>;

/**
 * Shortcuts context value interface
 */
interface ShortcutsContextValue {
  shortcutDescriptions: ShortcutDescriptions;
}

export const ShortcutsContext = createContext<ShortcutsContextValue | undefined>(undefined);

interface ShortcutsProviderProps {
  children: ReactNode;
  selectedApp: string;
}

/**
 * ShortcutsProvider provides shortcut descriptions for the selected app
 */
export const ShortcutsProvider: React.FC<ShortcutsProviderProps> = ({ children, selectedApp }) => {
  const shortcutDescriptions = useMemo(
    () => allShortcuts[selectedApp] || {},
    [selectedApp]
  );

  const value: ShortcutsContextValue = {
    shortcutDescriptions,
  };

  return <ShortcutsContext.Provider value={value}>{children}</ShortcutsContext.Provider>;
};

/**
 * Hook to use Shortcuts context
 */
export const useShortcutsContext = () => {
  const context = useContext(ShortcutsContext);
  if (context === undefined) {
    throw new Error('useShortcutsContext must be used within a ShortcutsProvider');
  }
  return context;
};

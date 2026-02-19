import React, { createContext, useContext, ReactNode } from 'react';
import { useGlobalSettings } from '../hooks/useSettings';

/**
 * グローバル設定コンテキストの型
 */
interface GlobalSettingsContextType {
  settings: Record<string, any>;
  getSetting: <T = any>(key: string, defaultValue?: T) => T;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * グローバル設定コンテキスト
 */
const GlobalSettingsContext = createContext<GlobalSettingsContextType | undefined>(
  undefined
);

/**
 * グローバル設定プロバイダー
 */
export const GlobalSettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { settings, getSetting, loading, error, refresh } = useGlobalSettings();

  const value = React.useMemo(
    () => ({
      settings,
      getSetting,
      loading,
      error,
      refresh,
    }),
    [settings, getSetting, loading, error, refresh]
  );

  return (
    <GlobalSettingsContext.Provider value={value}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

/**
 * グローバル設定を使用するフック
 */
export const useGlobalSettingsContext = () => {
  const context = useContext(GlobalSettingsContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalSettingsContext must be used within a GlobalSettingsProvider'
    );
  }
  return context;
};

/**
 * 設定値を安全に取得するヘルパーフック
 */
export const useSetting = <T = any>(key: string, defaultValue?: T): T => {
  const { getSetting } = useGlobalSettingsContext();
  return getSetting(key, defaultValue);
};

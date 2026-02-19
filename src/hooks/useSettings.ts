import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * 設定値の型
 */
export type SettingType = 'string' | 'number' | 'boolean' | 'json';

/**
 * グローバル設定の型
 */
export interface GlobalSetting {
  setting_key: string;
  setting_value: string;
  setting_type: SettingType;
  description?: string;
  is_public: boolean;
}

/**
 * アプリケーション設定の型
 */
export interface AppSetting {
  application_id: string;
  setting_key: string;
  setting_value: string;
  setting_type: SettingType;
  description?: string;
}

/**
 * 設定値をパース
 */
const parseSetting = (value: string, type: SettingType): any => {
  if (!value) return null;

  switch (type) {
    case 'boolean':
      return value === 'true' || value === '1';
    case 'number':
      return Number(value);
    case 'json':
      try {
        return JSON.parse(value);
      } catch {
        console.error(`Failed to parse JSON setting: ${value}`);
        return null;
      }
    case 'string':
    default:
      return value;
  }
};

/**
 * グローバル設定を取得するフック
 */
export const useGlobalSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('global_settings')
        .select('*')
        .eq('is_public', true);

      if (fetchError) throw fetchError;

      const parsedSettings: Record<string, any> = {};
      data?.forEach((setting: GlobalSetting) => {
        parsedSettings[setting.setting_key] = parseSetting(
          setting.setting_value,
          setting.setting_type
        );
      });

      setSettings(parsedSettings);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch global settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getSetting = useCallback(
    <T = any>(key: string, defaultValue?: T): T => {
      return settings[key] !== undefined ? settings[key] : defaultValue;
    },
    [settings]
  );

  return { settings, getSetting, loading, error, refresh: fetchSettings };
};

/**
 * アプリケーション固有の設定を取得するフック
 */
export const useAppSettings = (applicationId?: string) => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!applicationId) {
      setSettings({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('application_id', applicationId);

      if (fetchError) throw fetchError;

      const parsedSettings: Record<string, any> = {};
      data?.forEach((setting: AppSetting) => {
        parsedSettings[setting.setting_key] = parseSetting(
          setting.setting_value,
          setting.setting_type
        );
      });

      setSettings(parsedSettings);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error(`Failed to fetch app settings for ${applicationId}:`, err);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getSetting = useCallback(
    <T = any>(key: string, defaultValue?: T): T => {
      return settings[key] !== undefined ? settings[key] : defaultValue;
    },
    [settings]
  );

  return { settings, getSetting, loading, error, refresh: fetchSettings };
};

/**
 * 設定値を取得するヘルパー関数（フック外で使用可能）
 */
export const getGlobalSetting = async <T = any>(
  key: string,
  defaultValue?: T
): Promise<T> => {
  try {
    const { data, error } = await supabase
      .from('global_settings')
      .select('setting_value, setting_type')
      .eq('setting_key', key)
      .eq('is_public', true)
      .single();

    if (error) throw error;
    if (!data) return defaultValue as T;

    return parseSetting(data.setting_value, data.setting_type as SettingType);
  } catch (err) {
    console.error(`Failed to fetch global setting ${key}:`, err);
    return defaultValue as T;
  }
};

/**
 * アプリ設定値を取得するヘルパー関数（フック外で使用可能）
 */
export const getAppSetting = async <T = any>(
  applicationId: string,
  key: string,
  defaultValue?: T
): Promise<T> => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_value, setting_type')
      .eq('application_id', applicationId)
      .eq('setting_key', key)
      .single();

    if (error) throw error;
    if (!data) return defaultValue as T;

    return parseSetting(data.setting_value, data.setting_type as SettingType);
  } catch (err) {
    console.error(`Failed to fetch app setting ${applicationId}.${key}:`, err);
    return defaultValue as T;
  }
};

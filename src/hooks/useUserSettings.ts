import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { UserSettings } from '../types';

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch user settings from Supabase
   */
  const fetchSettings = useCallback(async () => {
    if (!user) {
      setSettings(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Settings don't exist yet, should be handled by trigger but fallback here
          console.warn('Settings not found for user, might be initializing');
          return null;
        }
        console.error('Error fetching user settings:', error);
        setError(error);
        return null;
      }

      const userSettings = data.settings as UserSettings;
      setSettings(userSettings);
      return userSettings;
    } catch (err) {
      console.error('Error fetching user settings:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Save user settings to Supabase
   */
  const saveSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    if (!user) {
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Merge with existing settings
      const updatedSettings = {
        ...(settings || {}),
        ...newSettings
      };

      const { error } = await supabase
        .from('user_settings')
        .update({ settings: updatedSettings })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error saving user settings:', error);
        setError(error);
        return false;
      }

      setSettings(updatedSettings as UserSettings);
      return true;
    } catch (err) {
      console.error('Error saving user settings:', err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, settings]);

  // Auto-fetch settings when user changes
  useEffect(() => {
    if (user) {
      fetchSettings();
    } else {
      setSettings(null);
    }
  }, [user, fetchSettings]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    saveSettings
  };
};

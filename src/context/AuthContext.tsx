import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { parseOAuthCallbackError, clearOAuthErrorFromUrl, mapOAuthErrorToMessage } from '../utils/authErrors';

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  sendPasswordResetEmail: (email: string, redirectTo: string) => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: 'google', redirectTo?: string) => Promise<{ error: AuthError | null }>;
  updateEmail: (newEmail: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserProfile(session.user.id).then(setProfile);
      }

      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Handle OAuth callback errors from URL fragment
  useEffect(() => {
    const oauthError = parseOAuthCallbackError();

    if (oauthError) {
      console.error('OAuth callback error:', oauthError);

      // Store error for AuthModal to display
      sessionStorage.setItem('oauth_error', JSON.stringify({
        provider: oauthError.error_code || 'unknown',
        message: mapOAuthErrorToMessage(oauthError),
      }));

      // Clear error from URL
      clearOAuthErrorFromUrl();
    }
  }, []);

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { error };
  };

  // Sign up with email and password
  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0]
        }
      }
    });

    return { error };
  };

  // Sign out
  const signOut = async () => {
    console.log('🟢 AuthContext: signOut() called');

    const clearAllAuthData = () => {
      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
      console.log('🟢 AuthContext: Local state cleared');

      // Clear all Supabase-related data from localStorage and sessionStorage
      const clearStorage = (storage: Storage) => {
        const keys = Object.keys(storage);
        const supabaseKeys = keys.filter(key => key.includes('supabase') || key.startsWith('sb-'));
        supabaseKeys.forEach(key => {
          storage.removeItem(key);
          console.log('🟢 AuthContext: Removed storage key:', key);
        });
      };

      clearStorage(localStorage);
      clearStorage(sessionStorage);
    };

    try {
      // Try to call Supabase signOut with a timeout
      console.log('🟢 AuthContext: Calling supabase.auth.signOut()...');

      const timeoutPromise = new Promise<any>((resolve) => {
        setTimeout(() => {
          console.warn('🟢 AuthContext: Supabase signOut timed out after 2 seconds');
          resolve({ error: null });
        }, 2000);
      });

      const signOutPromise = supabase.auth.signOut();

      const result = await Promise.race([signOutPromise, timeoutPromise]);

      if (result.error) {
        console.error('🟢 AuthContext: Supabase signOut error:', result.error);
      } else {
        console.log('🟢 AuthContext: Supabase signOut completed');
      }

      // Always clear everything regardless of Supabase response
      clearAllAuthData();

      console.log('🟢 AuthContext: signOut() completed');
    } catch (error) {
      console.error('🟢 AuthContext: Exception in signOut:', error);

      // Force clear everything even on error
      clearAllAuthData();
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      }

      // Refresh profile data
      const updatedProfile = await fetchUserProfile(user.id);
      setProfile(updatedProfile);

      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error as Error };
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string, redirectTo: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    return { error };
  };

  // Sign in with OAuth provider
  const signInWithOAuth = async (
    provider: 'google',
    redirectTo?: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('OAuth error:', error);

        // Check if provider not configured
        if (error.message.includes('Provider not found') ||
            error.message.includes('not enabled')) {
          return {
            error: {
              ...error,
              message: 'Googleログインが設定されていません。管理者に連絡してください。',
            } as AuthError,
          };
        }

        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected OAuth error:', err);
      return {
        error: {
          message: 'Googleログイン中にエラーが発生しました。もう一度お試しください。',
          name: 'OAuthError',
          status: 500,
        } as AuthError,
      };
    }
  };

  // Update user email
  const updateEmail = async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    return { error };
  };

  // Update user password
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  };

  // Delete user account
  const deleteAccount = async () => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      // Delete user profile first
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        return { error: profileError };
      }

      // Delete auth user (this will cascade delete related data due to RLS)
      const { error: authError } = await supabase.rpc('delete_user');

      if (authError) {
        console.error('Error deleting auth user:', authError);
        return { error: authError };
      }

      // Sign out after deletion
      await signOut();

      return { error: null };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { error: error as Error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    signInWithOAuth,
    updateEmail,
    updatePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

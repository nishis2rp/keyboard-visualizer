import { AuthError } from '@supabase/supabase-js';
import { Translations } from '../locales/en';

/**
 * OAuth callback error returned in URL fragment
 * Example: #error=access_denied&error_description=User%20cancelled
 */
export interface OAuthCallbackError {
  error: string;
  error_code?: string;
  error_description?: string;
}

/**
 * Map Supabase AuthError to user-friendly localized message
 *
 * @param error - Supabase AuthError object or null
 * @param t - Translation object
 * @returns Localized error message
 */
export function mapAuthErrorToMessage(error: AuthError | null, t: Translations): string {
  if (!error) return '';

  const message = error.message.toLowerCase();

  // Email/Password authentication errors
  if (message.includes('invalid login credentials')) {
    return t.auth.error.invalidCredentials;
  }

  if (message.includes('email not confirmed')) {
    return t.auth.error.emailNotConfirmed;
  }

  if (message.includes('user already registered') ||
      message.includes('email address is already')) {
    return t.auth.error.emailInUse;
  }

  if (message.includes('password should be at least') ||
      message.includes('password is too short')) {
    return t.auth.error.weakPassword;
  }

  if (message.includes('invalid email')) {
    return t.auth.error.invalidEmail;
  }

  // Network and timeout errors
  if (message.includes('fetch') ||
      message.includes('network') ||
      message.includes('timeout')) {
    return t.errors.networkError;
  }

  // Rate limiting
  if (message.includes('rate limit') ||
      message.includes('too many requests')) {
    return t.auth.error.rateLimit;
  }

  // Session errors
  if (message.includes('session not found') ||
      message.includes('invalid session') ||
      message.includes('no session')) {
    return t.auth.error.sessionInvalid;
  }

  // OAuth provider errors
  if (message.includes('provider not found') ||
      message.includes('not enabled') ||
      message.includes('oauth')) {
    return t.auth.error.oauthProviderError;
  }

  // Default fallback
  return error.message || t.auth.error.unknownError;
}

/**
 * Map OAuth callback error to user-friendly localized message
 *
 * @param oauthError - OAuth callback error object
 * @param t - Translation object
 * @returns Localized error message
 */
export function mapOAuthErrorToMessage(oauthError: OAuthCallbackError, t: Translations): string {
  const { error, error_description } = oauthError;

  switch (error) {
    case 'access_denied':
      return t.auth.error.oauthCancelled;

    case 'server_error':
      return t.auth.error.serverError;

    case 'temporarily_unavailable':
      return t.auth.error.temporarilyUnavailable;

    case 'invalid_request':
      return t.auth.error.invalidRequest;

    case 'unauthorized_client':
      return t.auth.error.unauthorizedClient;

    case 'invalid_scope':
      return t.auth.error.invalidScope;

    default:
      return error_description || t.auth.error.genericSocialError;
  }
}

/**
 * Parse OAuth error from URL fragment
 * Example: #error=access_denied&error_description=User%20cancelled
 *
 * @returns OAuthCallbackError object if error found, null otherwise
 */
export function parseOAuthCallbackError(): OAuthCallbackError | null {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash.substring(1);
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const error = params.get('error');

  if (!error) return null;

  return {
    error,
    error_code: params.get('error_code') || undefined,
    error_description: params.get('error_description') || undefined,
  };
}

/**
 * Clear OAuth error from URL fragment without triggering page reload
 */
export function clearOAuthErrorFromUrl(): void {
  if (typeof window === 'undefined') return;

  const hash = window.location.hash.substring(1);
  if (!hash) return;

  const params = new URLSearchParams(hash);
  if (params.has('error')) {
    // Remove error-related parameters
    params.delete('error');
    params.delete('error_code');
    params.delete('error_description');

    // Update URL without reload
    const newHash = params.toString();
    window.history.replaceState(
      null,
      '',
      newHash ? `#${newHash}` : window.location.pathname + window.location.search
    );
  }
}

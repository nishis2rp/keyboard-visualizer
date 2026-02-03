import { AuthError } from '@supabase/supabase-js';

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
 * Common authentication error messages in Japanese
 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'メールアドレスまたはパスワードが正しくありません。',
  EMAIL_NOT_CONFIRMED: 'メールアドレスが確認されていません。確認メールを確認してください。',
  USER_EXISTS: 'このメールアドレスは既に登録されています。',
  PASSWORD_TOO_SHORT: 'パスワードは6文字以上である必要があります。',
  INVALID_EMAIL: '無効なメールアドレス形式です。',
  NETWORK_ERROR: 'ネットワークエラーが発生しました。接続を確認してもう一度お試しください。',
  RATE_LIMIT: 'リクエストが多すぎます。しばらく待ってからもう一度お試しください。',
  SESSION_INVALID: 'セッションが無効です。再度ログインしてください。',
  OAUTH_CANCELLED: 'ログインがキャンセルされました。',
  OAUTH_PROVIDER_ERROR: 'ソーシャルログインプロバイダーでエラーが発生しました。',
  GENERIC_ERROR: '認証エラーが発生しました。もう一度お試しください。',
} as const;

/**
 * Parse OAuth error from URL fragment
 * Extracts error parameters like: #error=access_denied&error_description=User%20cancelled
 *
 * @returns OAuthCallbackError object if error found in URL, null otherwise
 */
export function parseOAuthCallbackError(): OAuthCallbackError | null {
  const hash = window.location.hash;

  // No hash or no error parameter
  if (!hash || !hash.includes('error=')) {
    return null;
  }

  // Parse hash as URLSearchParams (remove leading #)
  const params = new URLSearchParams(hash.substring(1));
  const error = params.get('error');
  const errorCode = params.get('error_code');
  const errorDescription = params.get('error_description');

  if (!error) {
    return null;
  }

  return {
    error,
    error_code: errorCode || undefined,
    error_description: errorDescription || undefined,
  };
}

/**
 * Clear OAuth error from URL without triggering navigation
 * Uses history.replaceState to remove error parameters from URL
 */
export function clearOAuthErrorFromUrl(): void {
  if (window.location.hash.includes('error=')) {
    // Replace URL without reloading page
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    );
  }
}

/**
 * Map Supabase AuthError to user-friendly Japanese message
 * Handles common authentication errors and provides appropriate feedback
 *
 * @param error - Supabase AuthError object or null
 * @returns User-friendly Japanese error message
 */
export function mapAuthErrorToMessage(error: AuthError | null): string {
  if (!error) return '';

  const message = error.message.toLowerCase();

  // Email/Password authentication errors
  if (message.includes('invalid login credentials')) {
    return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
  }

  if (message.includes('email not confirmed')) {
    return AUTH_ERROR_MESSAGES.EMAIL_NOT_CONFIRMED;
  }

  if (message.includes('user already registered') ||
      message.includes('email address is already')) {
    return AUTH_ERROR_MESSAGES.USER_EXISTS;
  }

  if (message.includes('password should be at least') ||
      message.includes('password is too short')) {
    return AUTH_ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }

  if (message.includes('invalid email')) {
    return AUTH_ERROR_MESSAGES.INVALID_EMAIL;
  }

  // Network and timeout errors
  if (message.includes('fetch') ||
      message.includes('network') ||
      message.includes('timeout')) {
    return AUTH_ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Rate limiting
  if (message.includes('rate limit') ||
      message.includes('too many requests')) {
    return AUTH_ERROR_MESSAGES.RATE_LIMIT;
  }

  // Session errors
  if (message.includes('session not found') ||
      message.includes('invalid session') ||
      message.includes('no session')) {
    return AUTH_ERROR_MESSAGES.SESSION_INVALID;
  }

  // OAuth provider errors
  if (message.includes('provider not found') ||
      message.includes('not enabled') ||
      message.includes('oauth')) {
    return AUTH_ERROR_MESSAGES.OAUTH_PROVIDER_ERROR;
  }

  // Default fallback - return original message if not mapped
  return error.message || AUTH_ERROR_MESSAGES.GENERIC_ERROR;
}

/**
 * Map OAuth callback error to user-friendly Japanese message
 * Handles standard OAuth 2.0 error codes
 *
 * @param oauthError - OAuth callback error object
 * @returns User-friendly Japanese error message
 */
export function mapOAuthErrorToMessage(oauthError: OAuthCallbackError): string {
  const { error, error_description } = oauthError;

  switch (error) {
    case 'access_denied':
      return AUTH_ERROR_MESSAGES.OAUTH_CANCELLED;

    case 'server_error':
      return 'サーバーエラーが発生しました。しばらく待ってからもう一度お試しください。';

    case 'temporarily_unavailable':
      return '一時的にログインできません。しばらく待ってからもう一度お試しください。';

    case 'invalid_request':
      return '無効なリクエストです。もう一度お試しください。';

    case 'unauthorized_client':
      return 'ログインプロバイダーが正しく設定されていません。管理者に連絡してください。';

    case 'invalid_scope':
      return 'アクセス許可の設定に問題があります。管理者に連絡してください。';

    default:
      // Use error_description if available, otherwise generic message
      return error_description || 'ソーシャルログイン中にエラーが発生しました。';
  }
}

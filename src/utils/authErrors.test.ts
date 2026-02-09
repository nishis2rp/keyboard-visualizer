import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  parseOAuthCallbackError,
  clearOAuthErrorFromUrl,
  mapAuthErrorToMessage,
  mapOAuthErrorToMessage,
  AUTH_ERROR_MESSAGES,
} from './authErrors';
import { AuthError } from '@supabase/supabase-js';

describe('authErrors', () => {
  beforeEach(() => {
    // Reset window.location mocks before each test
    vi.clearAllMocks();
  });

  describe('parseOAuthCallbackError', () => {
    it('should parse access_denied error from URL hash', () => {
      // Mock window.location.hash
      Object.defineProperty(window, 'location', {
        value: {
          hash: '#error=access_denied&error_description=User%20cancelled',
        },
        writable: true,
        configurable: true,
      });

      const result = parseOAuthCallbackError();

      expect(result).toEqual({
        error: 'access_denied',
        error_description: 'User cancelled',
      });
    });

    it('should parse error with error_code', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hash: '#error=server_error&error_code=500&error_description=Internal%20server%20error',
        },
        writable: true,
        configurable: true,
      });

      const result = parseOAuthCallbackError();

      expect(result).toEqual({
        error: 'server_error',
        error_code: '500',
        error_description: 'Internal server error',
      });
    });

    it('should return null for valid auth callback (no error)', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hash: '#access_token=abc123&token_type=bearer',
        },
        writable: true,
        configurable: true,
      });

      const result = parseOAuthCallbackError();
      expect(result).toBeNull();
    });

    it('should return null for empty hash', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hash: '',
        },
        writable: true,
        configurable: true,
      });

      const result = parseOAuthCallbackError();
      expect(result).toBeNull();
    });

    it('should return null when hash exists but no error parameter', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hash: '#something=else',
        },
        writable: true,
        configurable: true,
      });

      const result = parseOAuthCallbackError();
      expect(result).toBeNull();
    });
  });

  describe('clearOAuthErrorFromUrl', () => {
    it('should clear error from URL hash using history.replaceState', () => {
      const mockReplaceState = vi.fn();
      Object.defineProperty(window, 'history', {
        value: {
          replaceState: mockReplaceState,
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window, 'location', {
        value: {
          hash: '#error=access_denied',
          pathname: '/test',
          search: '?query=1',
        },
        writable: true,
        configurable: true,
      });

      clearOAuthErrorFromUrl();

      expect(mockReplaceState).toHaveBeenCalledWith(null, '', '/test?query=1');
    });

    it('should not call replaceState if no error in hash', () => {
      const mockReplaceState = vi.fn();
      Object.defineProperty(window, 'history', {
        value: {
          replaceState: mockReplaceState,
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window, 'location', {
        value: {
          hash: '#access_token=abc',
          pathname: '/test',
          search: '',
        },
        writable: true,
        configurable: true,
      });

      clearOAuthErrorFromUrl();

      expect(mockReplaceState).not.toHaveBeenCalled();
    });
  });

  describe('mapAuthErrorToMessage', () => {
    it('should map invalid login credentials error', () => {
      const error = {
        message: 'Invalid login credentials',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    it('should map email not confirmed error', () => {
      const error = {
        message: 'Email not confirmed',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.EMAIL_NOT_CONFIRMED);
    });

    it('should map user already registered error', () => {
      const error = {
        message: 'User already registered',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.USER_EXISTS);
    });

    it('should map password too short error', () => {
      const error = {
        message: 'Password should be at least 6 characters',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.PASSWORD_TOO_SHORT);
    });

    it('should map invalid email error', () => {
      const error = {
        message: 'Invalid email',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.INVALID_EMAIL);
    });

    it('should map network error', () => {
      const error = {
        message: 'Fetch failed',
        name: 'NetworkError',
        status: 0,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.NETWORK_ERROR);
    });

    it('should map rate limit error', () => {
      const error = {
        message: 'Too many requests',
        name: 'AuthApiError',
        status: 429,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.RATE_LIMIT);
    });

    it('should map session not found error', () => {
      const error = {
        message: 'Session not found',
        name: 'AuthSessionMissingError',
        status: 401,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.SESSION_INVALID);
    });

    it('should map OAuth provider error', () => {
      const error = {
        message: 'Provider not found',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.OAUTH_PROVIDER_ERROR);
    });

    it('should return original message for unmapped error', () => {
      const error = {
        message: 'Some unknown error occurred',
        name: 'AuthApiError',
        status: 500,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe('Some unknown error occurred');
    });

    it('should return generic error for empty message', () => {
      const error = {
        message: '',
        name: 'AuthApiError',
        status: 500,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.GENERIC_ERROR);
    });

    it('should return empty string for null error', () => {
      const result = mapAuthErrorToMessage(null);
      expect(result).toBe('');
    });

    it('should handle case-insensitive matching', () => {
      const error = {
        message: 'INVALID LOGIN CREDENTIALS',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    });
  });

  describe('mapOAuthErrorToMessage', () => {
    it('should map access_denied to cancelled message', () => {
      const error = {
        error: 'access_denied',
      };

      const result = mapOAuthErrorToMessage(error);
      expect(result).toBe(AUTH_ERROR_MESSAGES.OAUTH_CANCELLED);
    });

    it('should map server_error', () => {
      const error = {
        error: 'server_error',
      };

      const result = mapOAuthErrorToMessage(error);
      expect(result).toBe('サーバーエラーが発生しました。しばらく待ってからもう一度お試しください。');
    });

    it('should map temporarily_unavailable', () => {
      const error = {
        error: 'temporarily_unavailable',
      };

      const result = mapOAuthErrorToMessage(error);
      expect(result).toBe('一時的にログインできません。しばらく待ってからもう一度お試しください。');
    });

    it('should map invalid_request', () => {
      const error = {
        error: 'invalid_request',
      };

      const result = mapOAuthErrorToMessage(error);
      expect(result).toBe('無効なリクエストです。もう一度お試しください。');
    });

    it('should map unauthorized_client', () => {
      const error = {
        error: 'unauthorized_client',
      };

      const result = mapOAuthErrorToMessage(error);
      expect(result).toBe('ログインプロバイダーが正しく設定されていません。管理者に連絡してください。');
    });

    it('should map invalid_scope', () => {
      const error = {
        error: 'invalid_scope',
      };

      const result = mapOAuthErrorToMessage(error);
      expect(result).toBe('アクセス許可の設定に問題があります。管理者に連絡してください。');
    });

    it('should use error_description when available', () => {
      const error = {
        error: 'unknown_error',
        error_description: 'Custom error message from provider',
      };

      const result = mapOAuthErrorToMessage(error);
      expect(result).toBe('Custom error message from provider');
    });

    it('should return generic message for unmapped error without description', () => {
      const error = {
        error: 'some_other_error',
      };

      const result = mapOAuthErrorToMessage(error);
      expect(result).toBe('ソーシャルログイン中にエラーが発生しました。');
    });

    it('should prefer error_description over default message', () => {
      const error = {
        error: 'access_denied',
        error_description: 'User declined permissions',
      };

      const result = mapOAuthErrorToMessage(error);
      // Should use the mapped message for access_denied, not the description
      expect(result).toBe(AUTH_ERROR_MESSAGES.OAUTH_CANCELLED);
    });
  });

  describe('AUTH_ERROR_MESSAGES constants', () => {
    it('should have all expected error message keys', () => {
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('INVALID_CREDENTIALS');
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('EMAIL_NOT_CONFIRMED');
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('USER_EXISTS');
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('PASSWORD_TOO_SHORT');
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('INVALID_EMAIL');
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('NETWORK_ERROR');
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('RATE_LIMIT');
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('SESSION_INVALID');
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('OAUTH_CANCELLED');
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('OAUTH_PROVIDER_ERROR');
      expect(AUTH_ERROR_MESSAGES).toHaveProperty('GENERIC_ERROR');
    });

    it('should have Japanese error messages', () => {
      Object.values(AUTH_ERROR_MESSAGES).forEach((message) => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
        // Check that messages contain Japanese characters (rough check)
        expect(message).toMatch(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/);
      });
    });
  });
});

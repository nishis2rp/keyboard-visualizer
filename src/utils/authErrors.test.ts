import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  parseOAuthCallbackError,
  clearOAuthErrorFromUrl,
  mapAuthErrorToMessage,
  mapOAuthErrorToMessage,
} from './authErrors';
import { AuthError } from '@supabase/supabase-js';
import { Translations, en as enTranslations } from '../locales/en';

// Mock translation object for tests
const mockTranslations: Translations = enTranslations;

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

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.invalidCredentials);
    });

    it('should map email not confirmed error', () => {
      const error = {
        message: 'Email not confirmed',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.emailNotConfirmed);
    });

    it('should map user already registered error', () => {
      const error = {
        message: 'User already registered',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.emailInUse);
    });

    it('should map password too short error', () => {
      const error = {
        message: 'Password should be at least 6 characters',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.weakPassword);
    });

    it('should map invalid email error', () => {
      const error = {
        message: 'Invalid email',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.invalidEmail);
    });

    it('should map network error', () => {
      const error = {
        message: 'Fetch failed',
        name: 'NetworkError',
        status: 0,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.errors.networkError);
    });

    it('should map rate limit error', () => {
      const error = {
        message: 'Too many requests',
        name: 'AuthApiError',
        status: 429,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.rateLimit);
    });

    it('should map session not found error', () => {
      const error = {
        message: 'Session not found',
        name: 'AuthSessionMissingError',
        status: 401,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.sessionInvalid);
    });

    it('should map OAuth provider error', () => {
      const error = {
        message: 'Provider not found',
        name: 'AuthApiError',
        status: 400,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.oauthProviderError);
    });

    it('should return original message for unmapped error', () => {
      const error = {
        message: 'Some unknown error occurred',
        name: 'AuthApiError',
        status: 500,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe('Some unknown error occurred');
    });

    it('should return original message for empty message when translations are missing', () => {
      // The current implementation returns error.message || t.auth.error.unknownError
      const error = {
        message: '',
        name: 'AuthApiError',
        status: 500,
        __isAuthError: true,
        code: undefined
      } as any as AuthError;

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.unknownError);
    });

    it('should return empty string for null error', () => {
      const result = mapAuthErrorToMessage(null, mockTranslations);
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

      const result = mapAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.invalidCredentials);
    });
  });

  describe('mapOAuthErrorToMessage', () => {
    it('should map access_denied to cancelled message', () => {
      const error = {
        error: 'access_denied',
      };

      const result = mapOAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.oauthCancelled);
    });

    it('should map server_error', () => {
      const error = {
        error: 'server_error',
      };

      const result = mapOAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.serverError);
    });

    it('should map temporarily_unavailable', () => {
      const error = {
        error: 'temporarily_unavailable',
      };

      const result = mapOAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.temporarilyUnavailable);
    });

    it('should map invalid_request', () => {
      const error = {
        error: 'invalid_request',
      };

      const result = mapOAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.invalidRequest);
    });

    it('should map unauthorized_client', () => {
      const error = {
        error: 'unauthorized_client',
      };

      const result = mapOAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.unauthorizedClient);
    });

    it('should map invalid_scope', () => {
      const error = {
        error: 'invalid_scope',
      };

      const result = mapOAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.invalidScope);
    });

    it('should use error_description when available', () => {
      const error = {
        error: 'unknown_error',
        error_description: 'Custom error message from provider',
      };

      const result = mapOAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe('Custom error message from provider');
    });

    it('should return generic message for unmapped error without description', () => {
      const error = {
        error: 'some_other_error',
      };

      const result = mapOAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.genericSocialError);
    });

    it('should use the mapped message for access_denied even if description is available', () => {
      const error = {
        error: 'access_denied',
        error_description: 'User declined permissions',
      };

      const result = mapOAuthErrorToMessage(error, mockTranslations);
      expect(result).toBe(mockTranslations.auth.error.oauthCancelled);
    });
  });
});

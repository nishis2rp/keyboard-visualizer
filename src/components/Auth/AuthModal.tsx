import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { mapAuthErrorToMessage, mapOAuthErrorToMessage } from '../../utils/authErrors';
import {
  checkPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  getPasswordStrengthBarColor,
  isValidEmail,
  isValidDisplayName,
  sanitizeDisplayName,
} from '../../utils/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'password_reset';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState<'google' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);

  const { signInWithEmail, signUpWithEmail, sendPasswordResetEmail, signInWithOAuth } = useAuth();

  // Calculate password strength for signup mode
  const passwordStrength = mode === 'signup' ? checkPasswordStrength(password) : null;

  // Check for OAuth callback errors on mount
  useEffect(() => {
    const storedError = sessionStorage.getItem('oauth_error');
    if (storedError) {
      try {
        const oauthError = JSON.parse(storedError);
        // Localize message using current translations
        setError(mapOAuthErrorToMessage(oauthError, t));
        sessionStorage.removeItem('oauth_error');
      } catch (err) {
        console.error('Failed to parse OAuth error:', err);
      }
    }
  }, [t]);

  // Validate email on blur
  const handleEmailBlur = () => {
    if (email && !isValidEmail(email)) {
      setEmailError('有効なメールアドレスを入力してください');
    } else {
      setEmailError(null);
    }
  };

  // Validate display name on blur
  const handleDisplayNameBlur = () => {
    if (displayName && !isValidDisplayName(displayName)) {
      setDisplayNameError('表示名は50文字以内で入力してください');
    } else {
      setDisplayNameError(null);
    }
  };

  // Clear validation errors when switching modes
  useEffect(() => {
    setEmailError(null);
    setDisplayNameError(null);
    setShowPassword(false);
  }, [mode]);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setEmailError(null);
    setDisplayNameError(null);

    // Client-side validation
    if (!isValidEmail(email)) {
      setEmailError('有効なメールアドレスを入力してください');
      return;
    }

    if (mode === 'signup') {
      // Validate password strength for signup
      if (!passwordStrength || !passwordStrength.isValid) {
        setError('パスワードは6文字以上で入力してください');
        return;
      }

      // Validate display name
      if (displayName && !isValidDisplayName(displayName)) {
        setDisplayNameError('表示名は50文字以内で入力してください');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setError(mapAuthErrorToMessage(error, t));
        } else {
          onClose();
        }
      } else if (mode === 'signup') {
        const sanitizedDisplayName = displayName ? sanitizeDisplayName(displayName) : undefined;
        const { error } = await signUpWithEmail(email, password, sanitizedDisplayName);
        if (error) {
          setError(mapAuthErrorToMessage(error, t));
        } else {
          setMessage(t.auth.confirmationEmailSent);
        }
      }
    } catch (err) {
      setError(t.auth.error.unknownError);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setEmailError(null);

    // Client-side validation
    if (!isValidEmail(email)) {
      setEmailError('有効なメールアドレスを入力してください');
      return;
    }

    setLoading(true);

    try {
      // Supabase configuration needs to be set up to redirect to the password reset page
      const { error: resetError } = await sendPasswordResetEmail(email, `${window.location.origin}/password-reset`);
      if (resetError) {
        setError(mapAuthErrorToMessage(resetError, t));
      } else {
        setMessage(t.auth.passwordResetEmailSent);
        setEmail(''); // Clear email after sending
      }
    } catch (err) {
      setError(t.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google') => {
    setError(null);
    setMessage(null);
    setOAuthLoading(provider); // Use provider-specific loading

    try {
      const { error: oauthError } = await signInWithOAuth(provider);

      if (oauthError) {
        setError(mapAuthErrorToMessage(oauthError, t));
        setOAuthLoading(null);
      }
      // If successful, browser redirects - loading state remains until redirect
    } catch (err) {
      setError(t.auth.error.oauthProviderError);
      setOAuthLoading(null);
    }
  };


  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setMessage(null);
    setEmailError(null);
    setDisplayNameError(null);
    setEmail('');
    setPassword('');
    setDisplayName('');
    setShowPassword(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="apple-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="apple-modal relative" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-sf-gray hover:bg-sf-gray-light hover:text-sf-primary transition-all text-xl"
          onClick={onClose}
          aria-label="閉じる"
          type="button"
        >
          ×
        </button>

        <h2 id="auth-modal-title" className="text-2xl font-black tracking-tight text-sf-primary mb-2">
          {mode === 'signin' ? t.auth.signIn : mode === 'signup' ? t.auth.signUp : t.auth.passwordReset}
        </h2>

        <p className="text-sm text-sf-gray font-medium mb-6">
          {mode === 'signin' || mode === 'signup'
            ? t.auth.subtitle
            : t.auth.passwordResetSubtitle}
        </p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-apple-md text-red-600 text-xs font-bold mb-4" role="alert">
            ⚠️ {error}
          </div>
        )}
        {message && (
          <div className="p-3 bg-green-50 border border-green-100 rounded-apple-md text-green-600 text-xs font-bold mb-4" role="status">
            ✓ {message}
          </div>
        )}

        {mode === 'password_reset' ? (
          <form className="flex flex-col gap-4" onSubmit={handlePasswordResetRequest}>
            <div>
              <label className="apple-label" htmlFor="email">{t.auth.email}</label>
              <input
                className={`apple-input ${emailError ? 'border-red-400 focus:border-red-500' : ''}`}
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                }}
                onBlur={handleEmailBlur}
                placeholder="example@example.com"
                required
                autoComplete="email"
                aria-invalid={emailError ? 'true' : 'false'}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && (
                <p id="email-error" className="mt-1 text-xs text-red-600 font-medium" role="alert">
                  {emailError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="apple-button-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !!emailError}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t.auth.processing}
                </span>
              ) : (
                t.auth.sendResetLink
              )}
            </button>
            <div className="text-center">
              <button type="button" onClick={() => toggleMode('signin')} className="text-xs font-bold text-sf-blue hover:underline">
                {t.auth.backToSignIn}
              </button>
            </div>
          </form>
        ) : (
          <>
            <form className="flex flex-col gap-4" onSubmit={handleEmailAuth}>
              {mode === 'signup' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="apple-label" htmlFor="displayName">
                    {t.auth.displayName}
                    <span className="text-sf-gray ml-1 text-[10px]">(任意)</span>
                  </label>
                  <input
                    className={`apple-input ${displayNameError ? 'border-red-400 focus:border-red-500' : ''}`}
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      setDisplayNameError(null);
                    }}
                    onBlur={handleDisplayNameBlur}
                    placeholder={t.auth.displayNamePlaceholder}
                    autoComplete="name"
                    maxLength={50}
                    aria-invalid={displayNameError ? 'true' : 'false'}
                    aria-describedby={displayNameError ? 'displayname-error' : undefined}
                  />
                  {displayNameError && (
                    <p id="displayname-error" className="mt-1 text-xs text-red-600 font-medium" role="alert">
                      {displayNameError}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="apple-label" htmlFor="email">{t.auth.email}</label>
                <input
                  className={`apple-input ${emailError ? 'border-red-400 focus:border-red-500' : ''}`}
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(null);
                  }}
                  onBlur={handleEmailBlur}
                  placeholder="example@example.com"
                  required
                  autoComplete="email"
                  aria-invalid={emailError ? 'true' : 'false'}
                  aria-describedby={emailError ? 'email-error-auth' : undefined}
                />
                {emailError && (
                  <p id="email-error-auth" className="mt-1 text-xs text-red-600 font-medium" role="alert">
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label className="apple-label" htmlFor="password">{t.auth.password}</label>
                <div className="relative">
                  <input
                    className="apple-input pr-10"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    required
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    minLength={6}
                    aria-invalid={mode === 'signup' && passwordStrength && !passwordStrength.isValid ? 'true' : 'false'}
                    aria-describedby={mode === 'signup' ? 'password-strength' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sf-gray hover:text-sf-primary transition-colors p-1"
                    aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password strength indicator for signup */}
                {mode === 'signup' && password && passwordStrength && (
                  <div id="password-strength" className="mt-2 space-y-2" role="status" aria-live="polite">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getPasswordStrengthBarColor(passwordStrength.score)}`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${getPasswordStrengthColor(passwordStrength.score)}`}>
                        {getPasswordStrengthLabel(passwordStrength.score)}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="space-y-1">
                        {passwordStrength.feedback.map((feedback, index) => (
                          <li key={index} className="text-[10px] text-sf-gray font-medium flex items-start gap-1.5">
                            <span className="mt-0.5">{feedback.startsWith('✓') ? '✓' : '•'}</span>
                            <span>{feedback.replace('✓ ', '')}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {mode === 'signin' && (
                <div className="text-right">
                  <button type="button" onClick={() => toggleMode('password_reset')} className="text-[10px] font-bold text-sf-gray hover:text-sf-blue transition-all">
                    {t.auth.forgotPassword}
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="apple-button-primary w-full py-2.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !!emailError || !!displayNameError || (mode === 'signup' && passwordStrength && !passwordStrength.isValid)}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t.auth.processing}
                  </span>
                ) : (
                  mode === 'signin' ? t.auth.signIn : t.auth.signUp
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4 text-sf-gray/30 text-[10px] font-bold uppercase tracking-widest">
              <div className="h-[1px] bg-gray-100 flex-1"></div>
              {t.auth.or}
              <div className="h-[1px] bg-gray-100 flex-1"></div>
            </div>

            <button
              type="button"
              className="apple-button-secondary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading || oauthLoading !== null}
              aria-label={t.auth.signInWithGoogle}
            >
              {oauthLoading === 'google' ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t.auth.connectingToGoogle}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {t.auth.signInWithGoogle}
                </>
              )}
            </button>
          </>
        )}


        {mode !== 'password_reset' && (
          <>
            <div className="mt-8 text-center text-xs text-sf-gray font-medium">
              {mode === 'signin' ? (
                <>
                  {t.auth.noAccount}{' '}
                  <button type="button" onClick={() => toggleMode('signup')} className="text-sf-blue font-bold hover:underline">
                    {t.auth.signUp}
                  </button>
                </>
              ) : (
                <>
                  {t.auth.haveAccount}{' '}
                  <button type="button" onClick={() => toggleMode('signin')} className="text-sf-blue font-bold hover:underline">
                    {t.auth.signIn}
                  </button>
                </>
              )}
            </div>

            {/* Security notice */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-2 text-[10px] text-sf-gray/70 font-medium">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <p className="leading-relaxed">
                  すべての通信は暗号化されています。パスワードはハッシュ化されて安全に保存されます。
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mapAuthErrorToMessage, AUTH_ERROR_MESSAGES } from '../../utils/authErrors';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'password_reset';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState<'google' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { signInWithEmail, signUpWithEmail, sendPasswordResetEmail, signInWithOAuth } = useAuth();

  // Check for OAuth callback errors on mount
  useEffect(() => {
    const storedError = sessionStorage.getItem('oauth_error');
    if (storedError) {
      try {
        const { message } = JSON.parse(storedError);
        setError(message);
        sessionStorage.removeItem('oauth_error');
      } catch (err) {
        console.error('Failed to parse OAuth error:', err);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setError(mapAuthErrorToMessage(error));
        } else {
          onClose();
        }
      } else if (mode === 'signup') {
        const { error } = await signUpWithEmail(email, password, displayName);
        if (error) {
          setError(mapAuthErrorToMessage(error));
        } else {
          setMessage('確認メールを送信しました。メールを確認してアカウントを有効化してください。');
        }
      }
    } catch (err) {
      setError(AUTH_ERROR_MESSAGES.GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      // Supabase configuration needs to be set up to redirect to the password reset page
      const { error: resetError } = await sendPasswordResetEmail(email, `${window.location.origin}/password-reset`);
      if (resetError) {
        setError(mapAuthErrorToMessage(resetError));
      } else {
        setMessage('パスワードリセットのメールを送信しました。メールを確認してください。');
        setEmail(''); // Clear email after sending
      }
    } catch (err) {
      setError(AUTH_ERROR_MESSAGES.NETWORK_ERROR);
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
        setError(mapAuthErrorToMessage(oauthError));
        setOAuthLoading(null);
      }
      // If successful, browser redirects - loading state remains until redirect
    } catch (err) {
      setError(AUTH_ERROR_MESSAGES.OAUTH_PROVIDER_ERROR);
      setOAuthLoading(null);
    }
  };


  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setMessage(null);
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="auth-modal-title">
          {mode === 'signin' ? 'ログイン' : mode === 'signup' ? 'アカウント作成' : 'パスワードをリセット'}
        </h2>

        <p className="auth-modal-description">
          {mode === 'signin' || mode === 'signup'
            ? 'アカウントを作成してクイズの進捗とスコアを保存しましょう'
            : '登録済みのメールアドレスを入力してください。パスワードリセットのリンクをお送りします。'}
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message">{message}</div>}

        {mode === 'password_reset' ? (
          <form className="auth-form" onSubmit={handlePasswordResetRequest}>
            <div className="auth-form-group">
              <label htmlFor="email">メールアドレス</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                required
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? '処理中...' : 'リセットリンクを送信'}
            </button>
            <div className="auth-toggle">
              <button type="button" onClick={() => toggleMode('signin')} className="auth-toggle-button">
                ログインに戻る
              </button>
            </div>
          </form>
        ) : (
          <>
            <form className="auth-form" onSubmit={handleEmailAuth}>
              {mode === 'signup' && (
                <div className="auth-form-group">
                  <label htmlFor="displayName">表示名</label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="例: 田中太郎"
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="auth-form-group">
                <label htmlFor="email">メールアドレス</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="password">パスワード</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6文字以上"
                  required
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  minLength={6}
                />
              </div>

              {mode === 'signin' && (
                <div className="auth-forgot-password">
                  <button type="button" onClick={() => toggleMode('password_reset')} className="auth-toggle-button">
                    パスワードをお忘れですか？
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? '処理中...' : mode === 'signin' ? 'ログイン' : 'アカウント作成'}
              </button>
            </form>

            <div className="auth-social-logins">
              <p>- または -</p>
              <button
                type="button"
                className="auth-social-button google"
                onClick={() => handleOAuthSignIn('google')}
                disabled={loading || oauthLoading !== null}
              >
                {oauthLoading === 'google' ? 'Googleに接続中...' : 'Googleで続行'}
              </button>
            </div>
          </>
        )}


        {mode !== 'password_reset' && (
          <div className="auth-toggle">
            {mode === 'signin' ? (
              <>
                アカウントをお持ちでないですか？{' '}
                <button type="button" onClick={() => toggleMode('signup')} className="auth-toggle-button">
                  アカウント作成
                </button>
              </>
            ) : (
              <>
                すでにアカウントをお持ちですか？{' '}
                <button type="button" onClick={() => toggleMode('signin')} className="auth-toggle-button">
                  ログイン
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { signInWithEmail, signUpWithEmail } = useAuth();

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
          setError(error.message);
        } else {
          onClose();
        }
      } else {
        const { error } = await signUpWithEmail(email, password, displayName);
        if (error) {
          setError(error.message);
        } else {
          setMessage('確認メールを送信しました。メールを確認してアカウントを有効化してください。');
        }
      }
    } catch (err) {
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };


  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setMessage(null);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="auth-modal-title">
          {mode === 'signin' ? 'ログイン' : 'アカウント作成'}
        </h2>

        <p className="auth-modal-description">
          アカウントを作成してクイズの進捗とスコアを保存しましょう
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message">{message}</div>}

        {/* Email/Password Form */}
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

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? '処理中...' : mode === 'signin' ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'signin' ? (
            <>
              アカウントをお持ちでないですか？{' '}
              <button onClick={toggleMode} className="auth-toggle-button">
                アカウント作成
              </button>
            </>
          ) : (
            <>
              すでにアカウントをお持ちですか？{' '}
              <button onClick={toggleMode} className="auth-toggle-button">
                ログイン
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

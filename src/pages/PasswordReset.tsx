import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { mapAuthErrorToMessage, AUTH_ERROR_MESSAGES } from '../utils/authErrors';

const PasswordReset: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically handles session from the URL fragment (access_token)
    // We just need to ensure the user is present to update the password
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && _event === 'SIGNED_IN') {
        setMessage('新しいパスワードを設定してください。');
      } else if (!session?.user && _event === 'SIGNED_OUT') {
        setError('パスワードリセットのリンクが無効または期限切れです。\n再度パスワードリセットをリクエストしてください。');
        // Optionally redirect after a delay
        setTimeout(() => navigate('/'), 5000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(AUTH_ERROR_MESSAGES.PASSWORD_TOO_SHORT);
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(mapAuthErrorToMessage(updateError));
      } else {
        setMessage('パスワードが正常にリセットされました。\n3秒後に自動的にホーム画面に移動します。');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/'), 3000); // Redirect to home/login after 3 seconds
      }
    } catch (err: any) {
      setError(AUTH_ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>パスワードリセット</h1>

      {error && <div style={{ color: 'red', backgroundColor: '#ffe0e0', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
      {message && <div style={{ color: 'green', backgroundColor: '#e0ffe0', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{message}</div>}

      <form onSubmit={handlePasswordReset}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>新しいパスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>新しいパスワード（確認用）</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007AFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? '処理中...' : 'パスワードをリセット'}
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
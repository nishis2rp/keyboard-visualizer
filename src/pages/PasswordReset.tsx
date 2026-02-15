import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { mapAuthErrorToMessage } from '../utils/authErrors';

const PasswordReset: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Supabase automatically handles session from the URL fragment (access_token)
    // We just need to ensure the user is present to update the password
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && _event === 'SIGNED_IN') {
        setMessage(t.auth.setNewPasswordMessage);
      } else if (!session?.user && _event === 'SIGNED_OUT') {
        setError(t.auth.linkInvalidError);
        // Optionally redirect after a delay
        setTimeout(() => navigate('/'), 5000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, t]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError(t.auth.error.passwordMismatch);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t.auth.error.weakPassword);
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(mapAuthErrorToMessage(updateError, t));
      } else {
        setMessage(t.auth.resetSuccessMessage);
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/'), 3000); // Redirect to home/login after 3 seconds
      }
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      setError(t.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>{t.auth.passwordResetTitle}</h1>

      {error && <div style={{ color: 'red', backgroundColor: '#ffe0e0', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
      {message && <div style={{ color: 'green', backgroundColor: '#e0ffe0', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{message}</div>}

      <form onSubmit={handlePasswordReset}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t.auth.newPasswordLabel}</label>
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
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t.auth.confirmPasswordLabel}</label>
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
          {loading ? t.auth.processing : t.auth.resetPasswordButton}
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
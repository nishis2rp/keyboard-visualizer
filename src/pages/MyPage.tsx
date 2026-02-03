import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserQuizStats, QuizSession, ShortcutDifficulty } from '../types';
import SessionDetailModal from '../components/SessionDetailModal';
import './MyPage.css';

const MyPage: React.FC = () => {
  const { user, profile, loading, updateProfile, updateEmail, deleteAccount } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [quizStats, setQuizStats] = useState<UserQuizStats[]>([]);
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>([]);
  const [quizDataLoading, setQuizDataLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // For email change
  const [newEmail, setNewEmail] = useState('');
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
    if (user?.email) {
      setNewEmail(user.email);
    }
  }, [profile, user]);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!user) return;

      setQuizDataLoading(true);
      setError(null);

      try {
        // Fetch quiz statistics
        const { data: statsData, error: statsError } = await supabase
          .from('user_quiz_stats')
          .select('*')
          .eq('user_id', user.id);

        if (statsError) {
          throw statsError;
        }
        setQuizStats(statsData || []);

        // Fetch recent quiz sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('quiz_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(10);

        if (sessionsError) {
          throw sessionsError;
        }
        setQuizSessions(sessionsData || []);

      } catch (err: any) {
        console.error('Error fetching quiz data:', err);
        setError('クイズデータの取得に失敗しました: ' + err.message);
      } finally {
        setQuizDataLoading(false);
      }
    };

    if (user) {
      fetchQuizData();
    }
  }, [user]);

  if (loading || quizDataLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleDisplayNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setProfileUpdateLoading(true);

    if (displayName.trim() === '') {
      setError('表示名は空白にできません。');
      setProfileUpdateLoading(false);
      return;
    }

    const { error: updateError } = await updateProfile({ display_name: displayName });
    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('表示名が更新されました！');
    }
    setProfileUpdateLoading(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    } else {
      setAvatarFile(null);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) {
      setError('ファイルが選択されていません。');
      return;
    }

    setError(null);
    setMessage(null);
    setUploading(true);

    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!publicUrlData) {
      setError('アバターURLの取得に失敗しました。');
      setUploading(false);
      return;
    }

    const newAvatarUrl = publicUrlData.publicUrl;

    // Update profile with new avatar URL
    const { error: updateProfileError } = await updateProfile({ avatar_url: newAvatarUrl });

    if (updateProfileError) {
      setError(updateProfileError.message);
    } else {
      setMessage('アバターが正常にアップロードされました！');
      setAvatarFile(null);
    }
    setUploading(false);
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setEmailUpdateLoading(true);

    if (newEmail.trim() === '' || !newEmail.includes('@')) {
      setError('有効なメールアドレスを入力してください。');
      setEmailUpdateLoading(false);
      return;
    }

    if (newEmail === user?.email) {
      setMessage('新しいメールアドレスは現在のメールアドレスと同じです。');
      setEmailUpdateLoading(false);
      return;
    }

    const { error: updateError } = await updateEmail(newEmail);
    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('メールアドレス変更の確認メールを送信しました。新しいメールアドレスで確認してください。');
    }
    setEmailUpdateLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError(null);
    setMessage(null);

    const { error: deleteError } = await deleteAccount();

    if (deleteError) {
      setError('アカウントの削除に失敗しました: ' + deleteError.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
    } else {
      // Redirect will happen automatically after sign out
      window.location.href = '/';
    }
  };

  const getDifficultyBadgeClass = (difficulty: ShortcutDifficulty | null) => {
    if (!difficulty) return 'difficulty-badge';
    return `difficulty-badge difficulty-${difficulty}`;
  };

  // Overall Stats
  const overallCorrect = quizStats.reduce((sum, stat) => sum + stat.total_correct, 0);
  const overallQuestions = quizStats.reduce((sum, stat) => sum + stat.total_questions, 0);
  const overallAccuracy = overallQuestions > 0 ? ((overallCorrect / overallQuestions) * 100).toFixed(1) : '0.0';
  const totalSessions = quizStats.reduce((sum, stat) => sum + stat.total_sessions, 0);

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">マイページ</h1>

      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {message && <div className="alert alert-success">✓ {message}</div>}

      {/* Profile Section */}
      <section className="mypage-section">
        <h2 className="section-title">👤 プロフィール情報</h2>

        <div className="profile-header">
          <img
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=667eea&color=fff&size=100`}
            alt="アバター"
            className="profile-avatar"
          />
          <div className="profile-info">
            <p className="profile-email"><strong>メールアドレス:</strong> {user.email}</p>
            <form onSubmit={handleDisplayNameUpdate} className="form-group">
              <label htmlFor="displayNameInput" className="form-label">表示名:</label>
              <input
                id="displayNameInput"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="form-input"
                placeholder="表示名を入力"
              />
              <button
                type="submit"
                disabled={profileUpdateLoading || displayName === profile?.display_name || displayName.trim() === ''}
                className="form-button"
              >
                {profileUpdateLoading ? '更新中...' : '更新'}
              </button>
            </form>
          </div>
        </div>

        <div className="avatar-upload-section">
          <h3 className="section-subtitle">アバターの変更</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="file-input"
          />
          <button
            onClick={handleAvatarUpload}
            disabled={uploading || !avatarFile}
            className="form-button"
          >
            {uploading ? 'アップロード中...' : 'アバターをアップロード'}
          </button>
        </div>
      </section>

      {/* Account Settings */}
      <section className="mypage-section">
        <h2 className="section-title">⚙️ アカウント設定</h2>

        <div style={{ marginBottom: '24px' }}>
          <h3 className="section-subtitle">メールアドレスの変更</h3>
          <form onSubmit={handleEmailUpdate} className="form-group">
            <label htmlFor="newEmailInput" className="form-label">新しいメール:</label>
            <input
              id="newEmailInput"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="form-input"
              placeholder="新しいメールアドレス"
              required
            />
            <button
              type="submit"
              disabled={emailUpdateLoading || newEmail.trim() === '' || newEmail === user.email}
              className="form-button"
            >
              {emailUpdateLoading ? '更新中...' : '更新'}
            </button>
          </form>
        </div>

        <div className="divider"></div>

        <div style={{ marginBottom: '24px' }}>
          <h3 className="section-subtitle">パスワードの変更</h3>
          <p style={{ marginBottom: '12px', color: '#666' }}>
            パスワードを変更する場合は、パスワードリセットページをご利用ください。
          </p>
          <Link to="/password-reset" className="text-link">
            パスワードリセットページへ →
          </Link>
        </div>

        <div className="divider"></div>

        <div>
          <h3 className="section-subtitle" style={{ color: '#dc3545' }}>アカウントの削除</h3>
          <p style={{ marginBottom: '12px', color: '#666' }}>
            アカウントを削除すると、全てのデータが完全に削除されます。この操作は取り消せません。
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="form-button form-button-danger"
            >
              アカウントを削除
            </button>
          ) : (
            <div style={{ padding: '16px', background: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107' }}>
              <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#856404' }}>
                本当にアカウントを削除しますか？
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="form-button form-button-danger"
                >
                  {deleting ? '削除中...' : 'はい、削除します'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="form-button"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quiz Statistics */}
      <section className="mypage-section">
        <h2 className="section-title">📊 クイズ統計</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <h4>総合正解率</h4>
            <p className="stat-value">{overallAccuracy}%</p>
            <p className="stat-detail">({overallCorrect} / {overallQuestions})</p>
          </div>
          <div className="stat-card">
            <h4>総セッション数</h4>
            <p className="stat-value">{totalSessions}</p>
          </div>
        </div>

        <h3 className="section-subtitle">アプリケーション別統計</h3>
        {quizStats.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p className="empty-state-text">まだクイズをプレイしていません。</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>アプリケーション</th>
                <th>セッション数</th>
                <th>正解数</th>
                <th>総問題数</th>
                <th>正解率</th>
                <th>最終プレイ日時</th>
              </tr>
            </thead>
            <tbody>
              {quizStats.map((stat, index) => (
                <tr key={index}>
                  <td>{stat.application}</td>
                  <td>{stat.total_sessions}</td>
                  <td>{stat.total_correct}</td>
                  <td>{stat.total_questions}</td>
                  <td>{stat.overall_accuracy.toFixed(1)}%</td>
                  <td>{new Date(stat.last_quiz_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Quiz Sessions */}
      <section className="mypage-section">
        <h2 className="section-title">🎯 最近のクイズセッション</h2>
        {quizSessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎮</div>
            <p className="empty-state-text">最近のクイズセッションはありません。</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>アプリケーション</th>
                <th>難易度</th>
                <th>スコア</th>
                <th>正解数</th>
                <th>総問題数</th>
                <th>完了日時</th>
                <th>詳細</th>
              </tr>
            </thead>
            <tbody>
              {quizSessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.application}</td>
                  <td>
                    {session.difficulty ? (
                      <span className={getDifficultyBadgeClass(session.difficulty)}>
                        {session.difficulty}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td><strong>{session.score}</strong></td>
                  <td>{session.correct_answers}</td>
                  <td>{session.total_questions}</td>
                  <td>
                    {session.completed_at
                      ? new Date(session.completed_at).toLocaleString()
                      : '進行中'}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedSessionId(session.id)}
                      className="form-button"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Session Detail Modal */}
      {selectedSessionId && (
        <SessionDetailModal
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}
    </div>
  );
};

export default MyPage;

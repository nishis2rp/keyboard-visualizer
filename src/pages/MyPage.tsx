import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserQuizStats, QuizSession, ShortcutDifficulty, WeakShortcut, RichShortcut } from '../types';
import SessionDetailModal from '../components/SessionDetailModal';
import StatCards from '../components/MyPage/StatCards';
import AppStatsTable from '../components/MyPage/AppStatsTable';
import RecentSessions from '../components/MyPage/RecentSessions';
import WeakShortcuts from '../components/MyPage/WeakShortcuts';
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
  const [weakShortcuts, setWeakShortcuts] = useState<WeakShortcut[]>([]);
  const [quizDataLoading, setQuizDataLoading] = useState(true);
  const [weakShortcutsLoading, setWeakShortcutsLoading] = useState(false);
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

        // Fetch and aggregate weak shortcuts
        fetchWeakShortcuts(user.id);

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

  const fetchWeakShortcuts = async (userId: string) => {
    setWeakShortcutsLoading(true);
    try {
      // Fetch recent history (detailed answers)
      const { data: historyData, error: historyError } = await supabase
        .from('quiz_history')
        .select(`
          shortcut_id,
          was_correct,
          shortcuts (*)
        `)
        .eq('user_id', userId)
        .order('answered_at', { ascending: false })
        .limit(500);

      if (historyError) throw historyError;

      if (!historyData || historyData.length === 0) {
        setWeakShortcuts([]);
        return;
      }

      // Aggregate by shortcut_id
      const aggregation: Record<number, { 
        wrong: number, 
        correct: number, 
        shortcut: any 
      }> = {};

      historyData.forEach((item: any) => {
        if (!item.shortcut_id || !item.shortcuts) return;
        
        if (!aggregation[item.shortcut_id]) {
          aggregation[item.shortcut_id] = { 
            wrong: 0, 
            correct: 0, 
            shortcut: item.shortcuts 
          };
        }
        
        if (item.was_correct) {
          aggregation[item.shortcut_id].correct++;
        } else {
          aggregation[item.shortcut_id].wrong++;
        }
      });

      // Convert to WeakShortcut and filter/sort
      const weakList: WeakShortcut[] = Object.values(aggregation)
        .filter(a => a.wrong > 0) // Only those with at least one mistake
        .map(a => {
          const total = a.wrong + a.correct;
          return {
            ...a.shortcut,
            wrong_count: a.wrong,
            correct_count: a.correct,
            accuracy: a.correct / total
          };
        })
        .sort((a, b) => {
          // Sort by accuracy (ascending) then by wrong_count (descending)
          if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
          return b.wrong_count - a.wrong_count;
        })
        .slice(0, 5); // Top 5 weak shortcuts

      setWeakShortcuts(weakList);
    } catch (err) {
      console.error('Error fetching weak shortcuts:', err);
    } finally {
      setWeakShortcutsLoading(false);
    }
  };

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

  // Overall Stats
  const overallCorrect = quizStats.reduce((sum, stat) => sum + stat.total_correct, 0);
  const overallQuestions = quizStats.reduce((sum, stat) => sum + stat.total_questions, 0);
  const overallAccuracy = overallQuestions > 0 ? ((overallCorrect / overallQuestions) * 100).toFixed(1) : '0.0';
  const totalSessions = quizStats.reduce((sum, stat) => sum + stat.total_sessions, 0);

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h1 className="mypage-title">ダッシュボード</h1>
        <div className="mypage-header-actions">
          <Link to="/" className="home-link">🏠 ホームへ戻る</Link>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {message && <div className="alert alert-success">✓ {message}</div>}

      <div className="dashboard-grid">
        {/* Main Stats Area */}
        <div className="dashboard-main">
          {/* Stats Cards Section */}
          <section className="dashboard-card stats-overview-section">
            <h2 className="section-title">📊 統計サマリー</h2>
            <StatCards
              overallAccuracy={overallAccuracy}
              overallCorrect={overallCorrect}
              overallQuestions={overallQuestions}
              totalSessions={totalSessions}
            />
          </section>

          {/* Weak Shortcuts Section */}
          <section className="dashboard-card weak-shortcuts-section">
            <h2 className="section-title">⚠️ 重点復習ショートカット</h2>
            <WeakShortcuts 
              weakShortcuts={weakShortcuts} 
              loading={weakShortcutsLoading} 
            />
          </section>

          {/* App Stats Section */}
          <section className="dashboard-card app-stats-section">
            <h2 className="section-title">📱 アプリケーション別統計</h2>
            <AppStatsTable stats={quizStats} />
          </section>

          {/* Recent Sessions Section */}
          <section className="dashboard-card recent-sessions-section">
            <h2 className="section-title">🎯 最近のプレイ履歴</h2>
            <RecentSessions 
              sessions={quizSessions} 
              onSelectSession={(id) => setSelectedSessionId(id)} 
            />
          </section>
        </div>

        {/* Sidebar / Settings Area */}
        <div className="dashboard-sidebar">
          {/* Profile Section */}
          <section className="dashboard-card profile-section">
            <h2 className="section-title">👤 プロフィール</h2>
            <div className="profile-compact">
              <div className="profile-avatar-container">
                <img
                  src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=667eea&color=fff&size=80`}
                  alt="アバター"
                  className="profile-avatar"
                />
                <div className="avatar-edit-overlay">
                  <label htmlFor="avatarInput" className="avatar-label">編集</label>
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div className="profile-details">
                <form onSubmit={handleDisplayNameUpdate} className="profile-form">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="compact-input"
                    placeholder="表示名"
                  />
                  {displayName !== profile?.display_name && (
                    <button type="submit" disabled={profileUpdateLoading} className="icon-button">
                      {profileUpdateLoading ? '...' : '✓'}
                    </button>
                  )}
                </form>
                <p className="profile-email-text">{user.email}</p>
              </div>
            </div>
            
            {avatarFile && (
              <div className="avatar-upload-confirm">
                <p className="upload-file-name">{avatarFile.name}</p>
                <button
                  onClick={handleAvatarUpload}
                  disabled={uploading}
                  className="form-button form-button-small"
                >
                  {uploading ? '...' : 'アップロード'}
                </button>
              </div>
            )}
          </section>

          {/* Account Settings Section */}
          <section className="dashboard-card settings-section">
            <h2 className="section-title">⚙️ 設定</h2>
            
            <div className="settings-item">
              <h3>メールアドレス変更</h3>
              <form onSubmit={handleEmailUpdate} className="settings-form">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="compact-input"
                  placeholder="新しいメール"
                />
                <button
                  type="submit"
                  disabled={emailUpdateLoading || newEmail === user.email}
                  className="form-button form-button-small"
                >
                  変更
                </button>
              </form>
            </div>

            <div className="settings-divider"></div>

            <div className="settings-item">
              <h3>パスワード</h3>
              <Link to="/password-reset" className="text-link-small">
                パスワードリセットはこちら →
              </Link>
            </div>

            <div className="settings-divider"></div>

            <div className="settings-item danger-zone">
              <h3>アカウント削除</h3>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-link-danger"
                >
                  アカウントを削除する
                </button>
              ) : (
                <div className="delete-confirm">
                  <p>本当に削除しますか？</p>
                  <div className="delete-actions">
                    <button onClick={handleDeleteAccount} disabled={deleting} className="btn-danger-small">
                      削除
                    </button>
                    <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting} className="btn-secondary-small">
                      戻る
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

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

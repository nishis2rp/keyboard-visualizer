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

const MyPage: React.FC = () => {
  const { user, profile, loading, updateProfile, updateEmail, deleteAccount } = useAuth();
  const { t } = useLanguage();
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
        setError(t.myPage.fetchDataFailed + err.message);
      } finally {
        setQuizDataLoading(false);
      }
    };

    if (user) {
      fetchQuizData();
    }
  }, [user, t.myPage.fetchDataFailed]);

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
        <p className="loading-text">{t.common.loading}</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/app" />;
  }

  const handleDisplayNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setProfileUpdateLoading(true);

    if (displayName.trim() === '') {
      setError(t.myPage.displayNameEmpty);
      setProfileUpdateLoading(false);
      return;
    }

    const { error: updateError } = await updateProfile({ display_name: displayName });
    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage(t.myPage.displayNameUpdated);
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
      setError('File not selected.'); // This can stay simple or be added to translations
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
      setError('Failed to get public URL.');
      setUploading(false);
      return;
    }

    const newAvatarUrl = publicUrlData.publicUrl;

    // Update profile with new avatar URL
    const { error: updateProfileError } = await updateProfile({ avatar_url: newAvatarUrl });

    if (updateProfileError) {
      setError(updateProfileError.message);
    } else {
      setMessage(t.myPage.uploadSuccess);
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
      setError(t.myPage.invalidEmailError);
      setEmailUpdateLoading(false);
      return;
    }

    if (newEmail === user?.email) {
      setMessage(t.myPage.emailSameError);
      setEmailUpdateLoading(false);
      return;
    }

    const { error: updateError } = await updateEmail(newEmail);
    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage(t.myPage.emailUpdateSent);
    }
    setEmailUpdateLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError(null);
    setMessage(null);

    const { error: deleteError } = await deleteAccount();

    if (deleteError) {
      setError(t.myPage.deleteFailed + deleteError.message);
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
    <div className="max-w-[1200px] mx-auto my-12 p-4 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black tracking-tighter text-sf-primary m-0">{t.myPage.dashboard}</h1>
        <div className="mypage-header-actions">
          <Link to="/app" className="no-underline text-sf-gray text-sm font-medium px-3 py-1.5 rounded-apple-md transition-all hover:bg-sf-gray-light hover:text-sf-primary">{t.myPage.backToApp}</Link>
        </div>
      </div>

      {error && <div className="apple-alert-error">⚠️ {error}</div>}
      {message && <div className="apple-alert-success">✓ {message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Main Stats Area */}
        <div className="flex flex-col gap-8">
          {/* Stats Cards Section */}
          <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100 transition-all hover:shadow-apple-lg">
            <h2 className="text-lg font-bold text-sf-primary mb-6 flex items-center gap-2 tracking-tight border-b border-gray-100 pb-2">{t.myPage.statsSummary}</h2>
            <StatCards
              overallAccuracy={overallAccuracy}
              overallCorrect={overallCorrect}
              overallQuestions={overallQuestions}
              totalSessions={totalSessions}
            />
          </section>

          {/* Weak Shortcuts Section */}
          <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100 transition-all hover:shadow-apple-lg">
            <h2 className="text-lg font-bold text-sf-primary mb-6 flex items-center gap-2 tracking-tight border-b border-gray-100 pb-2">{t.myPage.weakShortcutsTitle}</h2>
            <WeakShortcuts 
              weakShortcuts={weakShortcuts} 
              loading={weakShortcutsLoading} 
            />
          </section>

          {/* App Stats Section */}
          <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100 transition-all hover:shadow-apple-lg">
            <h2 className="text-lg font-bold text-sf-primary mb-6 flex items-center gap-2 tracking-tight border-b border-gray-100 pb-2">{t.myPage.appStatsTitle}</h2>
            <AppStatsTable stats={quizStats} />
          </section>

          {/* Recent Sessions Section */}
          <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100 transition-all hover:shadow-apple-lg">
            <h2 className="text-lg font-bold text-sf-primary mb-6 flex items-center gap-2 tracking-tight border-b border-gray-100 pb-2">{t.myPage.recentHistoryTitle}</h2>
            <RecentSessions 
              sessions={quizSessions} 
              onSelectSession={(id) => setSelectedSessionId(id)} 
            />
          </section>
        </div>

        {/* Sidebar / Settings Area */}
        <div className="flex flex-col gap-8">
          {/* Profile Section */}
          <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100 transition-all hover:shadow-apple-lg">
            <h2 className="text-lg font-bold text-sf-primary mb-6 flex items-center gap-2 tracking-tight border-b border-gray-100 pb-2">{t.myPage.profileTitle}</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-20 h-20 shrink-0">
                <img
                  src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=667eea&color=fff&size=80`}
                  alt={t.myPage.avatarAlt}
                  className="w-20 h-20 rounded-full object-cover border-2 border-sf-blue-ultralight"
                />
                <div className="absolute bottom-0 right-0 bg-sf-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] cursor-pointer border-2 border-white shadow-sm">
                  <label htmlFor="avatarInput" className="cursor-pointer">{t.myPage.edit}</label>
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <form onSubmit={handleDisplayNameUpdate} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="apple-input py-1.5"
                    placeholder={t.myPage.displayNamePlaceholder}
                  />
                  {displayName !== profile?.display_name && (
                    <button type="submit" disabled={profileUpdateLoading} className="w-6 h-6 bg-sf-green text-white rounded flex items-center justify-center shrink-0 disabled:opacity-50">
                      {profileUpdateLoading ? '...' : '✓'}
                    </button>
                  )}
                </form>
                <p className="text-[11px] text-sf-gray m-0 mt-1 truncate font-medium">{user.email}</p>
              </div>
            </div>
            
            {avatarFile && (
              <div className="bg-sf-blue-ultralight p-3 rounded-apple-md text-center">
                <p className="text-[10px] text-sf-blue font-bold truncate mb-2">{avatarFile.name}</p>
                <button
                  onClick={handleAvatarUpload}
                  disabled={uploading}
                  className="w-full py-1.5 bg-sf-blue text-white rounded-apple-sm text-xs font-bold disabled:opacity-50"
                >
                  {uploading ? t.myPage.uploading : t.myPage.uploadConfirm}
                </button>
              </div>
            )}
          </section>

          {/* Account Settings Section */}
          <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100 transition-all hover:shadow-apple-lg">
            <h2 className="text-lg font-bold text-sf-primary mb-6 flex items-center gap-2 tracking-tight border-b border-gray-100 pb-2">{t.myPage.settingsTitle}</h2>
            
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-sf-gray uppercase tracking-wider mb-2">{t.myPage.changeEmail}</h3>
              <form onSubmit={handleEmailUpdate} className="flex gap-1.5">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="apple-input py-1.5"
                  placeholder={t.myPage.newEmailPlaceholder}
                />
                <button
                  type="submit"
                  disabled={emailUpdateLoading || newEmail === user.email}
                  className="px-3 py-1.5 bg-sf-blue text-white rounded-apple-sm text-xs font-bold disabled:opacity-50 shrink-0"
                >
                  {t.myPage.changeButton}
                </button>
              </form>
            </div>

            <div className="h-[1px] bg-gray-100 my-6"></div>

            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-sf-gray uppercase tracking-wider mb-2">{t.myPage.passwordTitle}</h3>
              <Link to="/password-reset" className="text-xs text-sf-blue font-bold no-underline">
                {t.myPage.passwordResetLink}
              </Link>
            </div>

            <div className="h-[1px] bg-gray-100 my-6"></div>

            <div>
              <h3 className="text-[11px] font-bold text-sf-gray uppercase tracking-wider mb-2 text-sf-red">{t.myPage.dangerZoneTitle}</h3>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-sf-red font-bold bg-transparent border-none p-0 cursor-pointer"
                >
                  {t.myPage.deleteAccountButton}
                </button>
              ) : (
                <div className="bg-red-50 p-3 rounded-apple-md text-center">
                  <p className="text-[11px] text-sf-red-dark font-bold mb-2">{t.myPage.deleteConfirmText}</p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={handleDeleteAccount} disabled={deleting} className="px-3 py-1 bg-sf-red text-white text-[10px] font-bold rounded cursor-pointer border-none">
                      {t.myPage.deleteConfirmButton}
                    </button>
                    <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting} className="px-3 py-1 bg-gray-200 text-sf-gray text-[10px] font-bold rounded cursor-pointer border-none">
                      {t.myPage.deleteCancelButton}
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

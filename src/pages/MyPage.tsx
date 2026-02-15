import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserQuizStats, QuizSession, WeakShortcut } from '../types';
import SessionDetailModal from '../components/SessionDetailModal';
import StatCards from '../components/MyPage/StatCards';
import AppStatsTable from '../components/MyPage/AppStatsTable';
import RecentSessions from '../components/MyPage/RecentSessions';
import WeakShortcuts from '../components/MyPage/WeakShortcuts';
import ProfileSection from '../components/MyPage/ProfileSection';
import AccountSettings from '../components/MyPage/AccountSettings';
import AppPerformanceChart from '../components/MyPage/AppPerformanceChart';

const MyPage: React.FC = () => {
  const { user, profile, loading, updateProfile, updateEmail, deleteAccount } = useAuth();
  const { t } = useLanguage();
  
  // Profile State
  const [displayName, setDisplayName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  
  // Quiz Data State
  const [quizStats, setQuizStats] = useState<UserQuizStats[]>([]);
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>([]);
  const [weakShortcuts, setWeakShortcuts] = useState<WeakShortcut[]>([]);
  const [quizDataLoading, setQuizDataLoading] = useState(true);
  const [weakShortcutsLoading, setWeakShortcutsLoading] = useState(false);
  
  // UI State
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Account State
  const [newEmail, setNewEmail] = useState('');
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);

  // Sync profile data to local state
  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
    if (user?.email) {
      setNewEmail(user.email);
    }
  }, [profile, user]);

  // Optimized Fetching
  const fetchWeakShortcuts = useCallback(async (userId: string) => {
    setWeakShortcutsLoading(true);
    try {
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

      const weakList: WeakShortcut[] = Object.values(aggregation)
        .filter(a => a.wrong > 0)
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
          if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
          return b.wrong_count - a.wrong_count;
        })
        .slice(0, 5);

      setWeakShortcuts(weakList);
    } catch (err) {
      console.error('Error fetching weak shortcuts:', err);
    } finally {
      setWeakShortcutsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!user) return;

      setQuizDataLoading(true);
      setError(null);

      try {
        // Fetch stats and sessions in parallel
        const [statsResult, sessionsResult] = await Promise.all([
          supabase.from('user_quiz_stats').select('*').eq('user_id', user.id),
          supabase.from('quiz_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false })
            .limit(10)
        ]);

        if (statsResult.error) throw statsResult.error;
        if (sessionsResult.error) throw sessionsResult.error;

        setQuizStats(statsResult.data || []);
        setQuizSessions(sessionsResult.data || []);

        // Fetch weak shortcuts
        await fetchWeakShortcuts(user.id);

      } catch (err: unknown) {
        console.error('Error fetching quiz data:', err);
        const errorMessage = err instanceof Error ? err.message : '';
        setError(t.myPage.fetchDataFailed + errorMessage);
      } finally {
        setQuizDataLoading(false);
      }
    };

    if (user) {
      fetchQuizData();
    }
  }, [user, t.myPage.fetchDataFailed, fetchWeakShortcuts]);

  // Derived Stats with useMemo
  const statsSummary = useMemo(() => {
    const overallCorrect = quizStats.reduce((sum, stat) => sum + stat.total_correct, 0);
    const overallQuestions = quizStats.reduce((sum, stat) => sum + stat.total_questions, 0);
    const overallAccuracy = overallQuestions > 0 ? ((overallCorrect / overallQuestions) * 100).toFixed(1) : '0.0';
    const totalSessions = quizStats.reduce((sum, stat) => sum + stat.total_sessions, 0);
    
    return {
      overallCorrect,
      overallQuestions,
      overallAccuracy,
      totalSessions
    };
  }, [quizStats]);

  // Handlers
  const handleDisplayNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim() === '') {
      setError(t.myPage.displayNameEmpty);
      return;
    }
    
    setError(null);
    setMessage(null);
    setProfileUpdateLoading(true);

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
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;

    setError(null);
    setMessage(null);
    setUploading(true);

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newAvatarUrl = publicUrlData.publicUrl;
      const { error: updateProfileError } = await updateProfile({ avatar_url: newAvatarUrl });

      if (updateProfileError) throw updateProfileError;

      setMessage(t.myPage.uploadSuccess);
      setAvatarFile(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail.trim() === '' || !newEmail.includes('@')) {
      setError(t.myPage.invalidEmailError);
      return;
    }

    setError(null);
    setMessage(null);
    setEmailUpdateLoading(true);

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
    const { error: deleteError } = await deleteAccount();

    if (deleteError) {
      setError(t.myPage.deleteFailed + deleteError.message);
      setDeleting(false);
    } else {
      window.location.href = '/';
    }
  };

  if (loading || quizDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-sf-blue/20 border-t-sf-blue rounded-full animate-spin mb-4"></div>
        <p className="text-sf-gray font-medium animate-pulse">{t.common.loading}</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/app" />;

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-sf-primary mb-2">{t.myPage.dashboard}</h1>
          <p className="text-sf-gray font-medium">{t.myPage.welcomeBack || 'Your learning progress at a glance'}</p>
        </div>
        <Link 
          to="/app" 
          className="no-underline bg-sf-gray-ultralight text-sf-primary text-sm font-bold px-5 py-2.5 rounded-apple-lg border border-gray-200 transition-all hover:bg-white hover:shadow-apple-md active:scale-95"
        >
          {t.myPage.backToApp}
        </Link>
      </header>

      {(error || message) && (
        <div className="mb-8 space-y-3">
          {error && <div className="apple-alert-error animate-in zoom-in-95 duration-300">⚠️ {error}</div>}
          {message && <div className="apple-alert-success animate-in zoom-in-95 duration-300">✓ {message}</div>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Statistics (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Cards */}
          <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100">
            <h2 className="text-xl font-bold text-sf-primary mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="text-2xl">📊</span> {t.myPage.statsSummary}
            </h2>
            <StatCards
              overallAccuracy={statsSummary.overallAccuracy}
              overallCorrect={statsSummary.overallCorrect}
              overallQuestions={statsSummary.overallQuestions}
              totalSessions={statsSummary.totalSessions}
            />
          </section>

          {/* Performance Visualization & Weak Shortcuts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100">
              <h2 className="text-xl font-bold text-sf-primary mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="text-2xl">📈</span> {t.myPage.appPerformanceTitle || 'App Performance'}
              </h2>
              <AppPerformanceChart stats={quizStats} />
            </section>

            <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100">
              <h2 className="text-xl font-bold text-sf-primary mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="text-2xl">⚠️</span> {t.myPage.weakShortcutsTitle}
              </h2>
              <WeakShortcuts 
                weakShortcuts={weakShortcuts} 
                loading={weakShortcutsLoading} 
              />
            </section>
          </div>

          {/* Full Width Stats Table */}
          <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100">
            <h2 className="text-xl font-bold text-sf-primary mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="text-2xl">📱</span> {t.myPage.appStatsTitle}
            </h2>
            <AppStatsTable stats={quizStats} />
          </section>

          {/* Recent History */}
          <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100">
            <h2 className="text-xl font-bold text-sf-primary mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="text-2xl">🕒</span> {t.myPage.recentHistoryTitle}
            </h2>
            <RecentSessions 
              sessions={quizSessions} 
              onSelectSession={setSelectedSessionId} 
            />
          </section>
        </div>

        {/* Right Column - Profile & Settings (1/3 width on large screens) */}
        <div className="space-y-8">
          <ProfileSection 
            displayName={displayName}
            setDisplayName={setDisplayName}
            avatarFile={avatarFile}
            handleAvatarChange={handleAvatarChange}
            handleAvatarUpload={handleAvatarUpload}
            handleDisplayNameUpdate={handleDisplayNameUpdate}
            uploading={uploading}
            profileUpdateLoading={profileUpdateLoading}
          />

          <AccountSettings 
            newEmail={newEmail}
            setNewEmail={setNewEmail}
            handleEmailUpdate={handleEmailUpdate}
            emailUpdateLoading={emailUpdateLoading}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            handleDeleteAccount={handleDeleteAccount}
            deleting={deleting}
          />
        </div>
      </div>

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

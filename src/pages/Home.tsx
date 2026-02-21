import React, { useEffect } from 'react';
import SetupScreen from '../components/SetupScreen';
import NormalModeView from '../components/NormalModeView';
import QuizModeView from '../components/QuizModeView';
import { useSettings, useUI, useShortcutData } from '../context';
import { useLanguage } from '../context/LanguageContext';
import { useFullscreen } from '../hooks';
import { SetupCompleteOptions } from '../types';

const Home: React.FC = () => {
  const { setup, setSelectedApp, setKeyboardLayout, setSetup, setDifficulty, setShowLandingVisualizer } = useSettings();
  const {
    showSetup,
    setShowSetup,
    isQuizMode,
    setIsQuizMode,
    setQuizApp
  } = useUI();
  const { loading, error } = useShortcutData();
  const { t } = useLanguage();

  const { isFullscreenMode, toggleFullscreenMode } = useFullscreen();

  // セットアップが完了していない場合は、自動的にSetupScreenを表示
  useEffect(() => {
    if (!setup.setupCompleted) {
      setShowSetup(true);
    }
  }, [setup.setupCompleted, setShowSetup]);


  const handleSetupCompleteWithFullscreen = ({
    app,
    layout,
    mode,
    quizApp,
    difficulty,
    shouldBeFullscreen
  }: SetupCompleteOptions) => {
    // 全画面モードの状態を適用
    if (shouldBeFullscreen && !isFullscreenMode) {
      toggleFullscreenMode();
    } else if (!shouldBeFullscreen && isFullscreenMode) {
      toggleFullscreenMode();
    }

    // Settings Update
    setSelectedApp(app);
    setKeyboardLayout(layout);
    setDifficulty(difficulty || 'allrange');
    setSetup({
      setupCompleted: true,
      app,
      layout,
      difficulty: difficulty || 'allrange',
      theme: 'system',
      showLandingVisualizer: true
    });

    // UI Update
    setIsQuizMode(mode === 'quiz');
    setQuizApp(quizApp);
    setShowSetup(false);
  };


  // ローディング中の表示
  if (loading) {
    return (
      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <article style={{ textAlign: 'center' }}>
          <h2>{t.home.loadingTitle}</h2>
          <p>{t.home.loadingSubtitle}</p>
          <div className="loading-spinner"></div>
        </article>
      </main>
    );
  }

  // エラーの表示
  if (error) {
    return (
      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <article style={{ textAlign: 'center', color: 'red' }}>
          <h2>{t.errors.failedToFetch}</h2>
          <p>{error.message}</p>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            {t.errors.checkConnection}
          </p>
        </article>
      </main>
    );
  }

  if (showSetup) {
    return <SetupScreen onSetupComplete={handleSetupCompleteWithFullscreen} />;
  }

  return isQuizMode ? <QuizModeView /> : <NormalModeView />;
}

export default Home;

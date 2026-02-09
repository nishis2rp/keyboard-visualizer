import React from 'react';
import SetupScreen from '../components/SetupScreen';
import NormalModeView from '../components/NormalModeView';
import QuizModeView from '../components/QuizModeView';
import { useSettings, useUI, useShortcutData } from '../context';
import { useFullscreen } from '../hooks';
import { SetupCompleteOptions } from '../types';

const Home: React.FC = () => {
  const { setSelectedApp, setKeyboardLayout, setSetup } = useSettings();
  const {
    showSetup,
    setShowSetup,
    isQuizMode,
    setIsQuizMode,
    setQuizApp,
    setQuizDifficulty
  } = useUI();
  const { loading, error } = useShortcutData();

  const { isFullscreenMode, toggleFullscreenMode } = useFullscreen();


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
    setSetup({
      setupCompleted: true,
      app,
      layout
    });

    // UI Update
    setIsQuizMode(mode === 'quiz');
    setQuizApp(quizApp);
    setQuizDifficulty(difficulty);
    setShowSetup(false);
  };


  // ローディング中の表示
  if (loading) {
    return (
      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <article style={{ textAlign: 'center' }}>
          <h2>キーボードショートカットを読み込み中...</h2>
          <p>データを準備しています。少々お待ちください。</p>
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
          <h2>データの取得に失敗しました</h2>
          <p>{error.message}</p>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            インターネット接続を確認するか、しばらく経ってから再度お試しください。
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

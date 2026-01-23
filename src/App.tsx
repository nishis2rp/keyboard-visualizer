import React from 'react';
import AppHeader from './components/AppHeader';
import SetupScreen from './components/SetupScreen';
import NormalModeView from './components/NormalModeView';
import QuizModeView from './components/QuizModeView';
import { useAppContext } from './context/AppContext';
import { useFullscreen } from './hooks';
import './styles/global.css';

function App() {
  const {
    showSetup,
    setShowSetup,
    handleSetupComplete,
    isQuizMode,
    setIsQuizMode,
    loading,
    error
  } = useAppContext();

  const { isFullscreenMode, toggleFullscreenMode } = useFullscreen();

  const handleQuizModeToggle = () => {
    if (!isQuizMode) {
      // Visualizerモード → Quizモードへの切り替え時は、セットアップ画面を表示
      setIsQuizMode(true);
      setShowSetup(true);
    } else {
      // Quizモード → Visualizerモードへの切り替え
      setIsQuizMode(false);
    }
  };

  const handleSetupCompleteWithFullscreen = (
    app: string,
    layout: string,
    mode: string,
    quizApp: string | null,
    difficulty?: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' | null,
    shouldBeFullscreen?: boolean
  ) => {
    // 全画面モードの状態を適用
    if (shouldBeFullscreen && !isFullscreenMode) {
      toggleFullscreenMode();
    } else if (!shouldBeFullscreen && isFullscreenMode) {
      toggleFullscreenMode();
    }

    // 元のhandleSetupCompleteを呼び出す
    handleSetupComplete(app, layout, mode, quizApp, difficulty, shouldBeFullscreen);
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading shortcuts...</h2>
          <p>Fetching data from API server...</p>
        </div>
      </div>
    );
  }

  // エラーの表示
  if (error) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'red' }}>
          <h2>Error loading shortcuts</h2>
          <p>{error.message}</p>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            Make sure the API server is running on http://localhost:3001
          </p>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return <SetupScreen onSetupComplete={handleSetupCompleteWithFullscreen} />;
  }

  return (
    <div className="container">
      <AppHeader
        fullscreenMode={isFullscreenMode}
        onToggleFullscreen={toggleFullscreenMode}
        isQuizMode={isQuizMode}
        onQuizModeToggle={handleQuizModeToggle}
      />
      {isQuizMode ? <QuizModeView /> : <NormalModeView />}
    </div>
  );
}

export default App;
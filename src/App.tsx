import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import SetupScreen from './components/SetupScreen';
import NormalModeView from './components/NormalModeView';
import QuizModeView from './components/QuizModeView';
import MyPage from './pages/MyPage';
import PasswordReset from './pages/PasswordReset'; // Import PasswordReset
import { useSettings, useUI, useShortcutData } from './context';
import { useFullscreen } from './hooks';
import './styles/global.css';

const HomeView: React.FC = () => {
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

  return isQuizMode ? <QuizModeView /> : <NormalModeView />;
}


function App() {
  const { isQuizMode, setIsQuizMode, setShowSetup } = useUI();
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

  return (
    <div className="container">
      <AppHeader
        fullscreenMode={isFullscreenMode}
        onToggleFullscreen={toggleFullscreenMode}
        isQuizMode={isQuizMode}
        onQuizModeToggle={handleQuizModeToggle}
      />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/password-reset" element={<PasswordReset />} />
      </Routes>
    </div>
  );
}

export default App;

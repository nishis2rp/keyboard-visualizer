import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import PasswordReset from './pages/PasswordReset';
import { useUI } from './context';
import { useFullscreen, useAdaptivePerformance } from './hooks';
import './styles/global.css';

function App() {
  const { isQuizMode, setIsQuizMode, setShowSetup } = useUI();
  const { isFullscreenMode, toggleFullscreenMode } = useFullscreen();
  const { performanceStyles } = useAdaptivePerformance();

  const handleQuizModeToggle = () => {
    if (!isQuizMode) {
      setIsQuizMode(true);
      setShowSetup(true);
    } else {
      setIsQuizMode(false);
    }
  };

  return (
    <div className="container" style={performanceStyles}>
      <AppHeader
        fullscreenMode={isFullscreenMode}
        onToggleFullscreen={toggleFullscreenMode}
        isQuizMode={isQuizMode}
        onQuizModeToggle={handleQuizModeToggle}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/password-reset" element={<PasswordReset />} />
      </Routes>
    </div>
  );
}

export default App;
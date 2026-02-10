import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import LandingPage from './pages/LandingPage';
import PasswordReset from './pages/PasswordReset';
import { useUI } from './context';
import { useFullscreen, useAdaptivePerformance } from './hooks';
import './styles/global.css';

function App() {
  const { isQuizMode, setIsQuizMode, setShowSetup } = useUI();
  const { isFullscreenMode, toggleFullscreenMode } = useFullscreen();
  const { performanceStyles } = useAdaptivePerformance();
  const location = useLocation();
  const navigate = useNavigate();

  const isLandingPage = location.pathname === '/';

  const handleQuizModeToggle = () => {
    if (!isQuizMode) {
      setIsQuizMode(true);
      setShowSetup(true);
    } else {
      setIsQuizMode(false);
    }
    
    if (location.pathname !== '/app') {
      navigate('/app');
    }
  };

  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    );
  }

  return (
    <div className="container" style={performanceStyles}>
      <AppHeader
        fullscreenMode={isFullscreenMode}
        onToggleFullscreen={toggleFullscreenMode}
        isQuizMode={isQuizMode}
        onQuizModeToggle={handleQuizModeToggle}
      />
      <Routes>
        <Route path="/app" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
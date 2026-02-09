import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import PasswordReset from './pages/PasswordReset';
import { useUI } from './context';
import { useFullscreen } from './hooks';
import './styles/global.css';

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
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/password-reset" element={<PasswordReset />} />
      </Routes>
    </div>
  );
}

export default App;
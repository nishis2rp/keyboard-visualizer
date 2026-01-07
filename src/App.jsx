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
    handleSetupComplete,
    isQuizMode,
    setIsQuizMode
  } = useAppContext();
  
  const { isFullscreenMode, toggleFullscreenMode } = useFullscreen();

  if (showSetup) {
    return <SetupScreen onSetupComplete={handleSetupComplete} />;
  }

  return (
    <div className="container">
      <AppHeader
        fullscreenMode={isFullscreenMode}
        onToggleFullscreen={toggleFullscreenMode}
        isQuizMode={isQuizMode}
        setIsQuizMode={setIsQuizMode}
      />
      {isQuizMode ? <QuizModeView /> : <NormalModeView />}
    </div>
  );
}

export default App;
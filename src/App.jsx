import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import AppHeader from './components/AppHeader'
import AppSelector from './components/AppSelector'
import KeyboardLayoutSelector from './components/KeyboardLayoutSelector'
import KeyDisplay from './components/KeyDisplay'
import KeyboardLayout from './components/KeyboardLayout'
import SystemShortcutWarning from './components/SystemShortcutWarning'
import SetupScreen from './components/SetupScreen'
import QuestionCard from './components/Quiz/QuestionCard'
import ScoreBoard from './components/Quiz/ScoreBoard'
import ResultModal from './components/Quiz/ResultModal'
import { allShortcuts } from './data/shortcuts'
import { apps } from './config'
import { specialKeys, SETUP_VERSION, STORAGE_KEYS, DEFAULTS, detectOS } from './constants'
import { getCodeDisplayName } from './utils/keyMapping'
import { useKeyboardShortcuts, useLocalStorage, useFullscreen } from './hooks'
import { QuizProvider, useQuiz } from './context/QuizContext'
import { windowsJisLayout, macJisLayout, macUsLayout, getLayoutDisplayName } from './data/layouts';
import './styles/global.css'

function AppContent({ isQuizMode, setIsQuizMode }) {
  const { quizState, startQuiz, handleAnswer, dispatch } = useQuiz();
  const { isFullscreenMode, toggleFullscreenMode } = useFullscreen()
  const [setup, setSetup] = useLocalStorage(
    STORAGE_KEYS.SETUP,
    { setupCompleted: false, app: DEFAULTS.APP, layout: DEFAULTS.LAYOUT },
    {
      version: SETUP_VERSION,
      validator: (data) => data && typeof data.app === 'string' && typeof data.layout === 'string'
    }
  )

  const [showSetup, setShowSetup] = useState(!setup.setupCompleted)
  const [selectedApp, setSelectedApp] = useState(setup.app || DEFAULTS.APP)
  const [keyboardLayout, setKeyboardLayout] = useState(setup.layout || DEFAULTS.LAYOUT)

  // SystemShortcutWarningのモーダルを開く関数を保持するref
  const openMacWarningModalRef = useRef(null);

  // SystemShortcutWarningからの関数を受け取るコールバック
  const onMacWarningModalRequest = useCallback((openModalFunc) => {
    openMacWarningModalRef.current = openModalFunc;
  }, []);
  
  const handleSetupComplete = useCallback((app, layout) => {
    setSelectedApp(app)
    setKeyboardLayout(layout)
    setSetup({
      setupCompleted: true,
      app,
      layout
    })
    setShowSetup(false)
  }, [setSetup])

  const shortcutDescriptions = useMemo(
    () => allShortcuts[selectedApp],
    [selectedApp]
  )

  const keyboardLayouts = useMemo(() => {
    return [
      { name: 'windows-jis', displayName: getLayoutDisplayName('windows-jis') },
      { name: 'mac-jis', displayName: getLayoutDisplayName('mac-jis') },
      { name: 'mac-us', displayName: getLayoutDisplayName('mac-us') },
    ];
  }, []);

  const {
    pressedKeys, // pressedKeysはKeyboardEvent.codeのSet
    history,
    currentDescription,
    availableShortcuts,
    handleClear
  } = useKeyboardShortcuts(shortcutDescriptions, keyboardLayout, isQuizMode);

  // getCodeDisplayNameをラップする関数
  const getDisplayKeyByCode = useCallback(
    (code, key, shiftPressed) => getCodeDisplayName(code, key, keyboardLayout, shiftPressed),
    [keyboardLayout]
  );

  // クイズモード切り替え時の処理
  useEffect(() => {
    if (isQuizMode) {
      const os = detectOS();
      // macOSで、かつクイズモード開始時に特定の警告が必要な場合
      if (os === 'macos' && openMacWarningModalRef.current) {
        // 例: Mission Controlのショートカットが有効になっているかチェックするロジックがあればここで
        // 現状は常に警告を出す形で実装
        openMacWarningModalRef.current();
      }
      // クイズ開始
      startQuiz(selectedApp, isFullscreenMode);
    } else {
      // クイズ終了またはリセット
      dispatch({ type: 'RESET_QUIZ' });
    }
  }, [isQuizMode, selectedApp, isFullscreenMode, startQuiz, dispatch]);

  // クイズモード中にキーが押されたら回答をチェック
  useEffect(() => {
    if (isQuizMode && pressedKeys.size > 0 && quizState.status === 'playing') {
      // handleAnswerに渡すのはpressedKeys(codes)と現在のlayout
      handleAnswer(pressedKeys, keyboardLayout);
    }
  }, [isQuizMode, pressedKeys, keyboardLayout, quizState.status, handleAnswer]);


  if (showSetup) {
    return <SetupScreen onSetupComplete={handleSetupComplete} />
  }

  return (
    <div className="container">
      {/* onOpenRequestを渡す */}
      <SystemShortcutWarning onOpenRequest={onMacWarningModalRequest} />
      <AppHeader
        fullscreenMode={isFullscreenMode}
        onToggleFullscreen={toggleFullscreenMode}
        isQuizMode={isQuizMode}
        setIsQuizMode={setIsQuizMode}
      />
      {isQuizMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)' }}>
          <ScoreBoard />
          <QuestionCard />
          {quizState.status === 'finished' && <ResultModal />}
        </div>
      ) : (
        <>
          <div className="selectors-container">
            <AppSelector
              apps={apps}
              selectedApp={selectedApp}
              onSelectApp={setSelectedApp}
            />
            <KeyboardLayoutSelector
              layouts={keyboardLayouts}
              selectedLayout={keyboardLayout}
              onSelectLayout={setKeyboardLayout}
            />
          </div>
          <KeyboardLayout
            pressedKeys={pressedKeys} // codesのSet
            specialKeys={specialKeys}
            getKeyDisplayName={getDisplayKeyByCode} // getCodeDisplayNameを渡す
            shortcutDescriptions={shortcutDescriptions}
            keyboardLayout={keyboardLayout}
          />
          <KeyDisplay
            pressedKeys={pressedKeys} // codesのSet
            specialKeys={specialKeys}
            getKeyDisplayName={getDisplayKeyByCode} // getCodeDisplayNameを渡す
            description={currentDescription}
            availableShortcuts={availableShortcuts}
            selectedApp={selectedApp}
            shortcutDescriptions={shortcutDescriptions}
            keyboardLayout={keyboardLayout} // KeyDisplayにもkeyboardLayoutを渡す
          />
        </>
      )}
    </div>
  )
}

function App() {
  const [isQuizMode, setIsQuizMode] = useState(false); // App内で状態を管理し、PropsとしてAppContentに渡す

  return (
    <QuizProvider>
      <AppContent isQuizMode={isQuizMode} setIsQuizMode={setIsQuizMode} />
    </QuizProvider>
  );
}

export default App
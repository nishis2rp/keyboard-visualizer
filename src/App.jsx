import { useState, useMemo, useCallback, useEffect } from 'react'
import AppHeader from './components/AppHeader'
import AppSelector from './components/AppSelector'
import KeyboardLayoutSelector from './components/KeyboardLayoutSelector'
import KeyDisplay from './components/KeyDisplay'
import KeyboardLayout from './components/KeyboardLayout'
import SystemShortcutWarning from './components/SystemShortcutWarning'
import SetupScreen from './components/SetupScreen'
import { allShortcuts } from './data/shortcuts'
import { apps, keyboardLayouts, getKeyNameMap } from './config'
import { specialKeys } from './constants'
import { getKeyDisplayName, toggleFullscreen, isFullscreen, onFullscreenChange } from './utils'
import { useKeyboardShortcuts } from './hooks'
import './styles/global.css'

function App() {
  const [showSetup, setShowSetup] = useState(true)
  const [selectedApp, setSelectedApp] = useState('windows11')
  const [keyboardLayout, setKeyboardLayout] = useState('windows-jis')
  const [fullscreenMode, setFullscreenMode] = useState(false)

  useEffect(() => {
    const savedSetup = localStorage.getItem('keyboard-visualizer-setup')
    if (savedSetup) {
      try {
        const setup = JSON.parse(savedSetup)
        if (setup.setupCompleted) {
          setSelectedApp(setup.app)
          setKeyboardLayout(setup.layout)
          setShowSetup(false)
        }
      } catch (e) {
        console.error('Failed to parse saved setup:', e)
      }
    }
  }, [])

  const handleSetupComplete = (app, layout) => {
    setSelectedApp(app)
    setKeyboardLayout(layout)
    setShowSetup(false)
  }

  const shortcutDescriptions = useMemo(() => allShortcuts[selectedApp], [selectedApp])

  const keyNameMap = useMemo(() => getKeyNameMap(keyboardLayout), [keyboardLayout])

  const {
    pressedKeys,
    history,
    currentDescription,
    availableShortcuts,
    handleClear
  } = useKeyboardShortcuts(shortcutDescriptions, keyNameMap)

  const getKeyDisplayNameWithMap = useCallback(
    (key) => getKeyDisplayName(key, keyNameMap),
    [keyNameMap]
  )

  useEffect(() => {
    setFullscreenMode(isFullscreen())
    const cleanup = onFullscreenChange((isFs) => {
      setFullscreenMode(isFs)
    })
    return cleanup
  }, [])

  const handleToggleFullscreen = useCallback(() => {
    toggleFullscreen()
  }, [])

  if (showSetup) {
    return <SetupScreen onSetupComplete={handleSetupComplete} />
  }

  return (
    <div className="container">
      <SystemShortcutWarning />

      <AppHeader
        fullscreenMode={fullscreenMode}
        onToggleFullscreen={handleToggleFullscreen}
      />

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
        pressedKeys={pressedKeys}
        specialKeys={specialKeys}
        getKeyDisplayName={getKeyDisplayNameWithMap}
        shortcutDescriptions={shortcutDescriptions}
        keyboardLayout={keyboardLayout}
      />

      <KeyDisplay
        pressedKeys={pressedKeys}
        specialKeys={specialKeys}
        getKeyDisplayName={getKeyDisplayNameWithMap}
        description={currentDescription}
        availableShortcuts={availableShortcuts}
        selectedApp={selectedApp}
        shortcutDescriptions={shortcutDescriptions}
      />
    </div>
  )
}

export default App

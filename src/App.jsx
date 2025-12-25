import { useState, useMemo, useCallback, useEffect } from 'react'
import AppHeader from './components/AppHeader'
import AppSelector from './components/AppSelector'
import KeyboardLayoutSelector from './components/KeyboardLayoutSelector'
import KeyDisplay from './components/KeyDisplay'
import KeyboardLayout from './components/KeyboardLayout'
import { allShortcuts } from './data/shortcuts'
import { apps, keyboardLayouts, getKeyNameMap } from './config'
import { specialKeys } from './constants'
import { getKeyDisplayName, toggleFullscreen, isFullscreen, onFullscreenChange } from './utils'
import { useKeyboardShortcuts } from './hooks'
import './styles/global.css'

function App() {
  const [selectedApp, setSelectedApp] = useState('windows11')
  const [keyboardLayout, setKeyboardLayout] = useState('windows-jis')
  const [fullscreenMode, setFullscreenMode] = useState(false)

  // 現在選択されているアプリのショートカットを取得
  const shortcutDescriptions = useMemo(() => allShortcuts[selectedApp], [selectedApp])

  // キーボードレイアウトに応じたキー名マップを取得
  const keyNameMap = useMemo(() => getKeyNameMap(keyboardLayout), [keyboardLayout])

  // カスタムフックを使用してキーボードショートカットの状態を管理
  const {
    pressedKeys,
    history,
    currentDescription,
    availableShortcuts,
    handleClear
  } = useKeyboardShortcuts(shortcutDescriptions, keyNameMap)

  // getKeyDisplayNameをラップして、keyNameMapを自動的に渡す（メモ化）
  const getKeyDisplayNameWithMap = useCallback(
    (key) => getKeyDisplayName(key, keyNameMap),
    [keyNameMap]
  )

  // フルスクリーン状態の監視
  useEffect(() => {
    setFullscreenMode(isFullscreen())
    const cleanup = onFullscreenChange((isFs) => {
      setFullscreenMode(isFs)
    })
    return cleanup
  }, [])

  // フルスクリーントグルハンドラ
  const handleToggleFullscreen = useCallback(() => {
    toggleFullscreen()
  }, [])

  return (
    <div className="container">
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

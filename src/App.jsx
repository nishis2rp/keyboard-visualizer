import { useState, useMemo, useCallback } from 'react'
import AppHeader from './components/AppHeader'
import AppSelector from './components/AppSelector'
import KeyboardLayoutSelector from './components/KeyboardLayoutSelector'
import KeyDisplay from './components/KeyDisplay'
import KeyboardLayout from './components/KeyboardLayout'
import SystemShortcutWarning from './components/SystemShortcutWarning'
import SetupScreen from './components/SetupScreen'
import { allShortcuts } from './data/shortcuts'
import { apps, keyboardLayouts, getKeyNameMap } from './config'
import { specialKeys, SETUP_VERSION, STORAGE_KEYS, DEFAULTS } from './constants'
import { getKeyDisplayName } from './utils'
import { useKeyboardShortcuts, useLocalStorage, useFullscreen } from './hooks'
import './styles/global.css'

/**
 * メインアプリケーションコンポーネント
 * キーボードビジュアライザーのルートコンポーネント
 */
function App() {
  // セットアップ情報をLocalStorageから読み込み
  const [setup, setSetup] = useLocalStorage(
    STORAGE_KEYS.SETUP,
    { setupCompleted: false, app: DEFAULTS.APP, layout: DEFAULTS.LAYOUT },
    {
      version: SETUP_VERSION,
      validator: (data) => data && typeof data.app === 'string' && typeof data.layout === 'string'
    }
  )

  // セットアップ完了状態
  const [showSetup, setShowSetup] = useState(!setup.setupCompleted)

  // 選択されているアプリとキーボードレイアウト
  const [selectedApp, setSelectedApp] = useState(setup.app || DEFAULTS.APP)
  const [keyboardLayout, setKeyboardLayout] = useState(setup.layout || DEFAULTS.LAYOUT)

  // フルスクリーン管理
  const { isFullscreenMode, toggleFullscreenMode } = useFullscreen()

  /**
   * セットアップ完了時のハンドラー
   * @param {string} app - 選択されたアプリ
   * @param {string} layout - 選択されたキーボードレイアウト
   */
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

  // 現在選択されているアプリのショートカット定義
  const shortcutDescriptions = useMemo(
    () => allShortcuts[selectedApp],
    [selectedApp]
  )

  // 現在選択されているキーボードレイアウトのキー名マップ
  const keyNameMap = useMemo(
    () => getKeyNameMap(keyboardLayout),
    [keyboardLayout]
  )

  // キーボードショートカットフック
  const {
    pressedKeys,
    history,
    currentDescription,
    availableShortcuts,
    handleClear
  } = useKeyboardShortcuts(shortcutDescriptions, keyNameMap)

  /**
   * キー表示名を取得する関数（メモ化済み）
   * @param {string} key - キー名
   * @returns {string} 表示用のキー名
   */
  const getKeyDisplayNameWithMap = useCallback(
    (key) => getKeyDisplayName(key, keyNameMap),
    [keyNameMap]
  )

  // セットアップ画面を表示
  if (showSetup) {
    return <SetupScreen onSetupComplete={handleSetupComplete} />
  }

  // メインアプリケーション画面
  return (
    <div className="container">
      {/* macOSシステムショートカット警告 */}
      <SystemShortcutWarning />

      {/* ヘッダー（タイトルとフルスクリーン切り替え） */}
      <AppHeader
        fullscreenMode={isFullscreenMode}
        onToggleFullscreen={toggleFullscreenMode}
      />

      {/* アプリ選択とキーボードレイアウト選択 */}
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

      {/* キーボードレイアウト表示 */}
      <KeyboardLayout
        pressedKeys={pressedKeys}
        specialKeys={specialKeys}
        getKeyDisplayName={getKeyDisplayNameWithMap}
        shortcutDescriptions={shortcutDescriptions}
        keyboardLayout={keyboardLayout}
      />

      {/* キー表示エリア（押下中のキー、説明、利用可能なショートカット） */}
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

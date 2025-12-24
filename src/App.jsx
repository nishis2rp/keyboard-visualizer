import { useState, useMemo, useCallback, useEffect } from 'react'
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>⌨️ キーボードビジュアライザー</h1>
        <button
          onClick={handleToggleFullscreen}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '8px',
            border: 'none',
            background: fullscreenMode ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          title="フルスクリーンモードでショートカット競合を軽減。Keyboard Lock APIによりほとんどのWinキーショートカットをキャプチャできますが、Win+L（ロック）などのセキュリティ関連はOSレベルで保護されています"
        >
          {fullscreenMode ? '🔲 全画面を終了' : '⛶ 全画面モード'}
        </button>
      </div>
      <p className="subtitle">
        アプリケーション別のショートカットを視覚的に表示します
        {!fullscreenMode && <span style={{ color: '#e74c3c', fontWeight: '600', marginLeft: '10px' }}>
          💡 Ctrl+WやWinキーなどの競合を防ぐには全画面モードを使用してください
        </span>}
      </p>

      <div className="selectors-container">
        <div className="selector-section">
          <h3 className="selector-title">アプリケーション</h3>
          <div className="app-selector">
            {apps.map(app => (
              <button
                key={app.id}
                className={`app-tab ${selectedApp === app.id ? 'active' : ''}`}
                onClick={() => setSelectedApp(app.id)}
              >
                <span className="app-icon">{app.icon}</span>
                <span className="app-name">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="selector-section">
          <h3 className="selector-title">キーボード配列</h3>
          <div className="app-selector">
            {keyboardLayouts.map(layout => (
              <button
                key={layout.id}
                className={`app-tab ${keyboardLayout === layout.id ? 'active' : ''}`}
                onClick={() => setKeyboardLayout(layout.id)}
              >
                <span className="app-icon">{layout.icon}</span>
                <span className="app-name">{layout.name}</span>
              </button>
            ))}
          </div>
        </div>
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

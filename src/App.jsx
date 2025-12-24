import { useState, useMemo } from 'react'
import KeyDisplay from './components/KeyDisplay'
import KeyboardLayout from './components/KeyboardLayout'
import { allShortcuts } from './data/shortcuts'
import { apps, keyboardLayouts } from './constants/appConfig'
import { specialKeys, getKeyNameMap } from './constants/specialKeys'
import { getKeyDisplayName } from './utils/keyboardUtils'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import './App.css'

function App() {
  const [selectedApp, setSelectedApp] = useState('windows11')
  const [keyboardLayout, setKeyboardLayout] = useState('windows-jis')

  // 現在選択されているアプリのショートカットを取得
  const shortcutDescriptions = allShortcuts[selectedApp]

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

  // getKeyDisplayNameをラップして、keyNameMapを自動的に渡す
  const getKeyDisplayNameWithMap = (key) => getKeyDisplayName(key, keyNameMap)

  return (
    <div className="container">
      <h1>⌨️ キーボードビジュアライザー</h1>
      <p className="subtitle">アプリケーション別のショートカットを視覚的に表示します</p>

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
      />
    </div>
  )
}

export default App

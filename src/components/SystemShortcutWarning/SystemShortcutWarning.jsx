import { useState, useEffect } from 'react'
import { detectOS, MACOS_CONFIGURABLE_SHORTCUTS } from '../../constants/systemProtectedShortcuts'
import './SystemShortcutWarning.css'

const SystemShortcutWarning = () => {
  const [os, setOs] = useState('unknown')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const detectedOS = detectOS()
    setOs(detectedOS)
  }, [])

  const handleToggle = () => {
    setIsVisible(!isVisible)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (os !== 'macos') {
    return null
  }

  return (
    <>
      <button 
        className="warning-text-link"
        onClick={handleToggle}
        title="macOSシステムショートカットの設定について"
      >
        macOSシステムショートカットについて
      </button>
      
      {isVisible && (
        <div className="system-warning-container">
          <div className="system-warning-header">
            <span className="warning-icon">⚠️</span>
            <h3>macOSシステムショートカットについて</h3>
            <button 
              className="warning-close-btn"
              onClick={handleClose}
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>
          
          <div className="system-warning-content">
            <p className="warning-description">
              macOSのシステムショートカット（<code>Ctrl + F2</code>など）は、Webアプリケーションでは無効化できません。
              以下の方法で競合を解決できます：
            </p>

            <div className="warning-solutions">
              <div className="solution-item">
                <h4>方法1: フルスクリーンモードを使用</h4>
                <p>
                  アプリを<strong>フルスクリーンモード</strong>にすることで、一部のショートカットをキャプチャできます。
                  右上の全画面ボタンをクリックしてください。
                </p>
              </div>

              <div className="solution-item">
                <h4>方法2: システム設定で無効化</h4>
                <ol>
                  <li>システム設定 → キーボード → キーボードショートカット を開く</li>
                  <li>左側のメニューから該当するカテゴリを選択：
                    <ul>
                      <li><strong>Mission Control</strong>: <code>Ctrl + ↑↓←→</code>, <code>F3</code></li>
                      <li><strong>Launchpad</strong>: <code>F4</code></li>
                      <li><strong>キーボード</strong>: <code>Ctrl + F2</code>, <code>Ctrl + F3</code></li>
                      <li><strong>スクリーンショット</strong>: <code>Cmd + Shift + 3/4/5</code></li>
                    </ul>
                  </li>
                  <li>使用しないショートカットのチェックを外す</li>
                </ol>
              </div>

              <div className="solution-item">
                <h4>主な競合ショートカット</h4>
                <div className="shortcut-list">
                  {Array.from(MACOS_CONFIGURABLE_SHORTCUTS).slice(0, 10).map((shortcut) => (
                    <code key={shortcut} className="shortcut-badge">{shortcut}</code>
                  ))}
                </div>
                <p className="shortcut-note">
                  これらは「システム設定」で無効化できます
                </p>
              </div>
            </div>

            <div className="warning-footer">
              <p>
                💡 <strong>ヒント:</strong> セキュリティ関連のショートカット（<code>Cmd + Option + Escape</code>、
                <code>Ctrl + Cmd + Q</code>など）は、OSによって保護されており無効化できません。
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SystemShortcutWarning

import { useState, useEffect, useCallback } from 'react'
import { detectOS } from '../../constants'
import './SystemShortcutWarning.css'

const LOCAL_STORAGE_KEY_WARNING_SHOWN = 'macOsSystemShortcutWarningShown';

const SystemShortcutWarning = ({ onOpenRequest }) => { // onOpenRequestをプロップとして受け取る
  const [os, setOs] = useState('unknown')
  const [isVisible, setIsVisible] = useState(false) // モーダルの表示状態
  const [hasShownWarning, setHasShownWarning] = useState(() => {
    // ローカルストレージから初回表示フラグを読み込む
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LOCAL_STORAGE_KEY_WARNING_SHOWN) === 'true';
    }
    return false;
  });

  const handleOpen = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const detectedOS = detectOS()
    setOs(detectedOS)

    // macOSで、かつまだ警告を表示していない場合、モーダルを自動で表示
    if (detectedOS === 'macos' && !hasShownWarning) {
      handleOpen(); // handleOpenを呼び出す
      // 一度表示したらフラグを立てる
      localStorage.setItem(LOCAL_STORAGE_KEY_WARNING_SHOWN, 'true');
      setHasShownWarning(true);
    }

    // onOpenRequestが提供された場合、handleOpenを渡す
    if (onOpenRequest) {
      onOpenRequest(handleOpen);
    }
  }, [hasShownWarning, onOpenRequest, handleOpen]); // onOpenRequestとhandleOpenを依存配列に追加

  if (os !== 'macos') {
    return null
  }

  return (
    <>
      {/* 警告モーダルを開くボタン。常に表示され、設定画面の一部として機能する */}
      {/* AppHeaderに統合する予定なので、ここでは一時的に表示 */}
      {/* <button 
        className="warning-text-link"
        onClick={handleOpen}
        title="macOSシステムショートカットの設定について"
        style={{ position: 'absolute', top: '10px', right: '10px' }} // 一時的に右上に配置
      >
        macOSシステムショートカットについて
      </button> */}
      
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
                  {['Ctrl + F2', 'Ctrl + F3', 'F3', 'F4', 'Ctrl + ↑', 'Ctrl + ↓', 'Ctrl + ←', 'Ctrl + →', 'Cmd + Shift + 3', 'Cmd + Shift + 4'].map((shortcut) => (
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

import PropTypes from 'prop-types'
import { memo } from 'react'

/**
 * アプリケーションヘッダーコンポーネント
 *
 * タイトルと全画面モード切り替えボタンを表示
 * 全画面モードでない場合は、ショートカット競合に関する警告を表示
 *
 * @param {boolean} fullscreenMode - 全画面モード状態
 * @param {function} onToggleFullscreen - 全画面モード切り替えハンドラ
 */
const AppHeader = memo(({ fullscreenMode, onToggleFullscreen }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>⌨️ キーボードビジュアライザー</h1>
        <button
          onClick={onToggleFullscreen}
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
    </>
  )
})

AppHeader.displayName = 'AppHeader'

AppHeader.propTypes = {
  fullscreenMode: PropTypes.bool.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired
}

export default AppHeader

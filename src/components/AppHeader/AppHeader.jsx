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
        <h1 style={{
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '2em'
        }}>
          <span style={{
            fontSize: '1.8em',
            background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 4px rgba(0, 122, 255, 0.2))'
          }}>⌨️</span>
          <span style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            letterSpacing: '-1.5px'
          }}>Keyboard</span>
          <span style={{
            color: '#1D1D1F',
            fontWeight: '300',
            letterSpacing: '-0.5px'
          }}>Visualizer</span>
        </h1>
        <button
          onClick={onToggleFullscreen}
          style={{
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: '600',
            borderRadius: '12px',
            border: '1px solid ' + (fullscreenMode ? '#FF3B30' : '#007AFF'),
            background: fullscreenMode ? '#FF3B30' : '#007AFF',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)'
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.16)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)'
          }}
          title="フルスクリーンモードでショートカット競合を軽減。Keyboard Lock APIによりほとんどのWinキーショートカットをキャプチャできますが、Win+L（ロック）などのセキュリティ関連はOSレベルで保護されています"
        >
          {fullscreenMode ? '全画面を終了' : '全画面モード'}
        </button>
      </div>
      <p className="subtitle">
        アプリケーション別のショートカットを視覚的に表示します
        {!fullscreenMode && <span style={{ color: '#FF3B30', fontWeight: '600', marginLeft: '10px' }}>
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

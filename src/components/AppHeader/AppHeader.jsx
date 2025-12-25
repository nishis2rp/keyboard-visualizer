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
          gap: '8px',
          fontSize: '2em',
          position: 'relative'
        }}>
          <span style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 50%, #FF2D55 100%)',
            borderRadius: '14px',
            fontSize: '1.5em',
            boxShadow: '0 4px 20px rgba(0, 122, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            transform: 'rotate(-3deg)',
            transition: 'all 0.3s ease'
          }}>⌨️</span>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            lineHeight: '1'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '800',
              fontSize: '1.3em',
              letterSpacing: '-2px',
              textTransform: 'uppercase'
            }}>KeyViz</span>
            <span style={{
              color: '#6E6E73',
              fontWeight: '500',
              fontSize: '0.4em',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginLeft: '2px'
            }}>Shortcut Visualizer</span>
          </div>
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

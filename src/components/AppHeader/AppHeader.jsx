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
 * @param {boolean} isQuizMode - クイズモード状態
 * @param {function} setIsQuizMode - クイズモード切り替えハンドラ
 */
const AppHeader = memo(({ fullscreenMode, onToggleFullscreen, isQuizMode, setIsQuizMode }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h1 style={{
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '2em',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
              borderRadius: '8px',
              fontSize: '1.2em',
              fontWeight: '700',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>K</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #50C9C9 0%, #38A3A5 100%)',
              borderRadius: '8px',
              fontSize: '1.2em',
              fontWeight: '700',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(80, 201, 201, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>S</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #5FD9C2 0%, #4ABFA8 100%)',
              borderRadius: '8px',
              fontSize: '1.2em',
              fontWeight: '700',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(95, 217, 194, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>V</span>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            lineHeight: '1.1'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #4A90E2 0%, #50C9C9 50%, #5FD9C2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '700',
              fontSize: '0.75em',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>Keyboard Shortcut</span>
            <span style={{
              background: 'linear-gradient(135deg, #4A90E2 0%, #50C9C9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '800',
              fontSize: '0.85em',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>Visualizer</span>
          </div>
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}> {/* フルスクリーンボタンとモード切り替えボタンを囲むdiv */}
          <button
            onClick={() => setIsQuizMode(!isQuizMode)}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '600',
              borderRadius: '12px',
              border: '1px solid ' + (isQuizMode ? '#6C757D' : '#007AFF'), // クイズモード時は色を変える
              background: isQuizMode ? '#6C757D' : '#007AFF', // クイズモード時は色を変える
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
            title={isQuizMode ? 'クイズモードを終了してビジュアライザーに戻ります' : 'ショートカットを学習するクイズモードを開始します'}
          >
            {isQuizMode ? 'Visualizer Mode' : 'Quiz Mode'}
          </button>
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
  onToggleFullscreen: PropTypes.func.isRequired,
  isQuizMode: PropTypes.bool.isRequired, // 新しく追加
  setIsQuizMode: PropTypes.func.isRequired // 新しく追加
}

export default AppHeader

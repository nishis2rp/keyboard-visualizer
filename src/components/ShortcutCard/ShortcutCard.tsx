import { memo } from 'react'
import { getProtectionLevel } from '../../constants'

/**
 * ショートカットカードコンポーネント
 *
 * ショートカットの情報を表示するカードコンポーネント
 * 保護レベルに応じて色分けされる：
 * - 通常: 色なし（干渉しない）
 * - 青色: 全画面表示で防げる（Keyboard Lock API）🔵
 * - 赤色: 全画面表示しても防げない（システムレベル保護）🔒
 *
 * @param {string} shortcut - ショートカットのキー組み合わせ（例: "Win + L"）
 * @param {string} description - ショートカットの説明
 * @param {boolean} showDebugLog - デバッグログを表示するか（開発モードのみ）
 */
const ShortcutCard = memo(({ shortcut, description, showDebugLog = false }) => {
  const protectionLevel = getProtectionLevel(shortcut)

  // デバッグログ（開発時のみ） - 全てのショートカットでログ出力
  if (showDebugLog && import.meta.env.DEV) {
    const emoji = protectionLevel === 'always-protected' ? '🔒' : protectionLevel === 'fullscreen-preventable' ? '🔵' : '⚪'
    console.log(`${emoji} ${shortcut} -> ${protectionLevel}`)
  }

  // 保護レベルに応じたスタイル
  const getStyle = () => {
    switch (protectionLevel) {
      case 'always-protected':
        // 赤色: 全画面表示しても防げない（システムレベル保護）
        return {
          card: {
            borderColor: '#FF3B30',
            backgroundColor: 'rgba(255, 59, 48, 0.08)'
          },
          combo: {
            color: '#FF3B30'
          },
          description: {
            color: '#E62E24'
          },
          icon: '🔒',
          tooltip: '⚠️ このショートカットはOSレベルで保護されており、全画面表示してもキャプチャできません'
        }

      case 'fullscreen-preventable':
        // 青色: 全画面表示で防げる（Keyboard Lock API）
        return {
          card: {
            borderColor: '#007AFF',
            backgroundColor: 'rgba(0, 122, 255, 0.08)'
          },
          combo: {
            color: '#007AFF'
          },
          description: {
            color: '#0062CC'
          },
          icon: '🔵',
          tooltip: 'ℹ️ このショートカットは全画面表示にするとキャプチャできます'
        }

      default:
        // 通常: 色なし（干渉しない）
        return {
          card: {},
          combo: {},
          description: {},
          icon: null,
          tooltip: ''
        }
    }
  }

  // 修飾キーかどうかを判定
  const isModifierKey = (keyName: string) => {
    return ['Ctrl', 'Shift', 'Alt', 'Cmd', 'Option'].includes(keyName)
  }

  // Windowsキーかどうかを判定
  const isWindowsKey = (keyName: string) => {
    return keyName === 'Win'
  }

  // ショートカット文字列をパースしてキーをボタンとして表示
  const renderShortcut = () => {
    // ショートカットを " + " で分割
    const parts = shortcut.split(' + ')

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        {parts.map((part, index) => (
          <span key={index} style={{ display: 'contents' }}>
            {index > 0 && <span style={{ fontSize: '0.8em', color: '#86868B', margin: '0 2px' }}>+</span>}
            <span
              className={`key ${isWindowsKey(part) ? 'windows-key' : (isModifierKey(part) ? 'modifier-key' : '')}`}
              style={{
                padding: '2px 6px',
                fontSize: '0.75em',
                minWidth: 'auto',
                display: 'inline-block',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            >
              {part}
            </span>
          </span>
        ))}
      </div>
    )
  }

  const style = getStyle()

  return (
    <div
      className="shortcut-card"
      style={style.card}
      title={style.tooltip}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
        {style.icon && <span style={{ fontSize: '0.9em' }}>{style.icon}</span>}
        <div className="shortcut-combo" style={{ ...style.combo, marginBottom: 0 }}>
          {renderShortcut()}
        </div>
      </div>
      <div className="shortcut-desc" style={style.description}>
        {description}
      </div>
    </div>
  )
})

ShortcutCard.displayName = 'ShortcutCard'


export default ShortcutCard

import PropTypes from 'prop-types'
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

  // デバッグログ（開発時のみ）
  if (protectionLevel !== 'none' && showDebugLog && import.meta.env.DEV) {
    const emoji = protectionLevel === 'always-protected' ? '🔒' : '🔵'
    console.log(`${emoji} 保護ショートカット検出: ${shortcut} (${protectionLevel})`)
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

  const style = getStyle()

  return (
    <div
      className="shortcut-card"
      style={style.card}
      title={style.tooltip}
    >
      <div className="shortcut-combo" style={style.combo}>
        {style.icon && `${style.icon} `}
        {shortcut}
      </div>
      <div className="shortcut-desc" style={style.description}>
        {description}
      </div>
    </div>
  )
})

ShortcutCard.displayName = 'ShortcutCard'

ShortcutCard.propTypes = {
  shortcut: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showDebugLog: PropTypes.bool
}

export default ShortcutCard

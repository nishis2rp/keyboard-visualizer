import PropTypes from 'prop-types'
import { memo } from 'react'
import { isSystemProtected } from '../../constants'

/**
 * ショートカットカードコンポーネント
 *
 * ショートカットの情報を表示するカードコンポーネント
 * システムレベルで保護されているショートカット（Win+L、Win+Gなど）は
 * 赤色の枠線と背景、🔒アイコンで視覚的に区別される
 *
 * @param {string} shortcut - ショートカットのキー組み合わせ（例: "Win + L"）
 * @param {string} description - ショートカットの説明
 * @param {boolean} showDebugLog - デバッグログを表示するか（開発モードのみ）
 */
const ShortcutCard = memo(({ shortcut, description, showDebugLog = false }) => {
  const isProtected = isSystemProtected(shortcut)

  // デバッグログ（開発時のみ）
  if (isProtected && showDebugLog && import.meta.env.DEV) {
    console.log(`🔒 システム保護ショートカット検出: ${shortcut}`)
  }

  // システム保護ショートカットのスタイル（Apple SF Red）
  const protectedStyle = {
    card: {
      borderColor: '#FF3B30',
      backgroundColor: 'rgba(255, 59, 48, 0.08)'
    },
    combo: {
      color: '#FF3B30'
    },
    description: {
      color: '#E62E24'
    }
  }

  return (
    <div
      className="shortcut-card"
      style={isProtected ? protectedStyle.card : {}}
      title={isProtected ? '⚠️ このショートカットはOSレベルで保護されており、ブラウザでキャプチャできません' : ''}
    >
      <div className="shortcut-combo" style={isProtected ? protectedStyle.combo : {}}>
        {isProtected && '🔒 '}
        {shortcut}
      </div>
      <div className="shortcut-desc" style={isProtected ? protectedStyle.description : {}}>
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

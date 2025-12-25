import PropTypes from 'prop-types'
import { memo } from 'react'
import { getSingleKeyShortcuts } from '../../utils'
import ShortcutCard from '../ShortcutCard'

// 修飾キーの表示順序
const MODIFIER_DISPLAY_ORDER = ['Control', 'Shift', 'Alt', 'Meta', 'OS']

// 修飾キーのリスト
const MODIFIER_KEYS = ['Control', 'Shift', 'Alt', 'Meta', 'OS']

const KeyDisplay = memo(({ pressedKeys, specialKeys, getKeyDisplayName, description, availableShortcuts, selectedApp, shortcutDescriptions }) => {
  if (pressedKeys.size === 0) {
    // すべてのアプリケーションで単独キーショートカットを表示
    const singleKeyShortcuts = getSingleKeyShortcuts(shortcutDescriptions)

    if (singleKeyShortcuts.length > 0) {
      return (
        <div className="display-area active" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <div className="shortcut-description-inline">
              <span className="description-icon">{selectedApp === 'gmail' ? '📧' : '⌨️'}</span>
              {selectedApp === 'gmail'
                ? 'Gmailの単独キーショートカット - キーを押すだけで操作できます'
                : '単独キーショートカット - ファンクションキーなど、単独で使用できるショートカット'
              }
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <h3 className="shortcuts-list-title" style={{ marginTop: '0', marginBottom: '10px' }}>利用可能な単独キーショートカット</h3>
            <div className="shortcuts-grid">
              {singleKeyShortcuts.map((item, index) => (
                <ShortcutCard
                  key={index}
                  shortcut={item.shortcut}
                  description={item.description}
                  showDebugLog={true}
                />
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="display-area">
        <p className="instruction">キーを押してください...</p>
      </div>
    )
  }

  const sortedKeys = Array.from(pressedKeys).sort((a, b) => {
    const aIndex = MODIFIER_DISPLAY_ORDER.indexOf(a)
    const bIndex = MODIFIER_DISPLAY_ORDER.indexOf(b)

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return 0
  })

  // 修飾キーのみが押されているかチェック
  const isOnlyModifierKeys = sortedKeys.every(key => MODIFIER_KEYS.includes(key))

  // 完全なショートカットが押されている場合（説明がある）
  // ただし、修飾キーのみの場合は、利用可能なショートカット一覧も表示
  if (description && (!isOnlyModifierKeys || availableShortcuts.length === 0)) {
    return (
      <div className="display-area active">
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            {sortedKeys.map((key, index) => (
              <div key={`${key}-${index}`} style={{ display: 'contents' }}>
                {index > 0 && <span className="plus">+</span>}
                <div className={`key ${specialKeys.has(key) ? 'special-key' : ''}`}>
                  {getKeyDisplayName(key)}
                </div>
              </div>
            ))}
          </div>
          <div className="shortcut-description-inline">
            <span className="description-icon">💡</span> {description}
          </div>
        </div>
      </div>
    )
  }

  // 修飾キーのみが押されている場合、または利用可能なショートカット一覧を表示
  return (
    <div className="display-area active" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginBottom: availableShortcuts.length > 0 ? '12px' : '0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {sortedKeys.map((key, index) => (
            <div key={`${key}-${index}`} style={{ display: 'contents' }}>
              {index > 0 && <span className="plus">+</span>}
              <div className={`key ${specialKeys.has(key) ? 'special-key' : ''}`}>
                {getKeyDisplayName(key)}
              </div>
            </div>
          ))}
        </div>
        {availableShortcuts.length === 0 && (
          <div className="shortcut-description-inline" style={{ opacity: 0.6 }}>
            <span className="description-icon">ℹ️</span> このキーの組み合わせにショートカットは登録されていません
          </div>
        )}
      </div>
      {availableShortcuts.length > 0 && (
        <div style={{ width: '100%' }}>
          <h3 className="shortcuts-list-title" style={{ marginTop: '0', marginBottom: '10px' }}>利用可能なショートカット</h3>
          <div className="shortcuts-grid">
            {availableShortcuts.map((item, index) => (
              <ShortcutCard
                key={index}
                shortcut={item.shortcut}
                description={item.description}
                showDebugLog={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

KeyDisplay.displayName = 'KeyDisplay'

KeyDisplay.propTypes = {
  pressedKeys: PropTypes.instanceOf(Set).isRequired,
  specialKeys: PropTypes.instanceOf(Set).isRequired,
  getKeyDisplayName: PropTypes.func.isRequired,
  description: PropTypes.string,
  availableShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      shortcut: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedApp: PropTypes.string.isRequired,
  shortcutDescriptions: PropTypes.objectOf(PropTypes.string).isRequired
}

export default KeyDisplay

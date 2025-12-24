import PropTypes from 'prop-types'
import { memo } from 'react'

const KeyDisplay = memo(({ pressedKeys, specialKeys, getKeyDisplayName, description, availableShortcuts }) => {
  if (pressedKeys.size === 0) {
    return (
      <div className="display-area">
        <p className="instruction">キーを押してください...</p>
      </div>
    )
  }

  const sortedKeys = Array.from(pressedKeys).sort((a, b) => {
    const specialOrder = ['Control', 'Shift', 'Alt', 'Meta']
    const aIndex = specialOrder.indexOf(a)
    const bIndex = specialOrder.indexOf(b)

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return 0
  })

  // 完全なショートカットが押されている場合（説明がある）
  if (description) {
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
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', marginBottom: availableShortcuts.length > 0 ? '20px' : '0' }}>
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
        {availableShortcuts.length === 0 && (
          <div className="shortcut-description-inline" style={{ opacity: 0.6 }}>
            <span className="description-icon">ℹ️</span> このキーの組み合わせにショートカットは登録されていません
          </div>
        )}
      </div>
      {availableShortcuts.length > 0 && (
        <div style={{ width: '100%' }}>
          <h3 className="shortcuts-list-title" style={{ marginTop: '0', marginBottom: '15px' }}>利用可能なショートカット</h3>
          <div className="shortcuts-grid">
            {availableShortcuts.map((item, index) => (
              <div key={index} className="shortcut-card">
                <div className="shortcut-combo">{item.shortcut}</div>
                <div className="shortcut-desc">{item.description}</div>
              </div>
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
  ).isRequired
}

export default KeyDisplay

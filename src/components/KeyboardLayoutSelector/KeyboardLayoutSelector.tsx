import PropTypes from 'prop-types'
import { memo } from 'react'

/**
 * キーボード配列選択コンポーネント
 *
 * 利用可能なキーボード配列の一覧を表示し、選択できるようにする
 *
 * @param {Array} layouts - キーボード配列の配列 [{id, icon, name}, ...]
 * @param {string} selectedLayout - 現在選択されているキーボード配列のID
 * @param {function} onSelectLayout - キーボード配列選択時のハンドラ
 */
const KeyboardLayoutSelector = memo(({ layouts, selectedLayout, onSelectLayout }) => {
  return (
    <div className="selector-section">
      <h3 className="selector-title">キーボード配列</h3>
      <div className="app-selector">
        {layouts.map(layout => (
          <button
            key={layout.id}
            className={`app-tab ${selectedLayout === layout.id ? 'active' : ''}`}
            onClick={() => onSelectLayout(layout.id)}
          >
            <span className="app-icon">{layout.icon}</span>
            <span className="app-name">{layout.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
})

KeyboardLayoutSelector.displayName = 'KeyboardLayoutSelector'

KeyboardLayoutSelector.propTypes = {
  layouts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedLayout: PropTypes.string.isRequired,
  onSelectLayout: PropTypes.func.isRequired
}

export default KeyboardLayoutSelector

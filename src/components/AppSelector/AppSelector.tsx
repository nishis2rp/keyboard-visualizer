import PropTypes from 'prop-types'
import { memo } from 'react'

/**
 * アプリケーション選択コンポーネント
 *
 * 利用可能なアプリケーションの一覧を表示し、選択できるようにする
 *
 * @param {Array} apps - アプリケーションの配列 [{id, icon, name}, ...]
 * @param {string} selectedApp - 現在選択されているアプリのID
 * @param {function} onSelectApp - アプリ選択時のハンドラ
 */
const AppSelector = memo(({ apps, selectedApp, onSelectApp }) => {
  return (
    <div className="selector-section">
      <h3 className="selector-title">アプリケーション</h3>
      <div className="app-selector">
        {apps.map(app => (
          <button
            key={app.id}
            className={`app-tab ${selectedApp === app.id ? 'active' : ''}`}
            onClick={() => onSelectApp(app.id)}
          >
            <span className="app-icon">{app.icon}</span>
            <span className="app-name">{app.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
})

AppSelector.displayName = 'AppSelector'

AppSelector.propTypes = {
  apps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedApp: PropTypes.string.isRequired,
  onSelectApp: PropTypes.func.isRequired
}

export default AppSelector

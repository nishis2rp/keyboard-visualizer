import { memo } from 'react'
import { App } from '../../types'

interface AppSelectorProps {
  apps: App[];
  selectedApp: string;
  onSelectApp: (appId: string) => void;
}

/**
 * アプリケーション選択コンポーネント
 *
 * 利用可能なアプリケーションの一覧を表示し、選択できるようにする
 */
const AppSelector = memo<AppSelectorProps>(({ apps, selectedApp, onSelectApp }) => {
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

export default AppSelector

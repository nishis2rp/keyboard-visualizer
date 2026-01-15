import { memo } from 'react'

interface KeyboardLayoutOption {
  id: string;
  icon: string;
  name: string;
}

interface KeyboardLayoutSelectorProps {
  layouts: KeyboardLayoutOption[];
  selectedLayout: string;
  onSelectLayout: (layoutId: string) => void;
}

/**
 * キーボード配列選択コンポーネント
 *
 * 利用可能なキーボード配列の一覧を表示し、選択できるようにする
 */
const KeyboardLayoutSelector = memo<KeyboardLayoutSelectorProps>(({ layouts, selectedLayout, onSelectLayout }) => {
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

export default KeyboardLayoutSelector

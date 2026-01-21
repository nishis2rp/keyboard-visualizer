import { memo } from 'react'

/**
 * セレクターアイテムの基底インターフェース
 */
export interface SelectorItem {
  id: string;
  icon: string;
  name: string;
}

interface SelectorProps<T extends SelectorItem> {
  title: string;
  items: T[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/**
 * 汎用セレクターコンポーネント
 *
 * アプリケーション選択やキーボード配列選択など、
 * アイコンと名前を持つアイテムのリストから選択するUIを提供
 */
function SelectorComponent<T extends SelectorItem>({
  title,
  items,
  selectedId,
  onSelect
}: SelectorProps<T>) {
  return (
    <div className="selector-section">
      <h3 className="selector-title">{title}</h3>
      <div className="app-selector">
        {items.map(item => (
          <button
            key={item.id}
            className={`app-tab ${selectedId === item.id ? 'active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <span className="app-icon">{item.icon}</span>
            <span className="app-name">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * 型安全な汎用Selectorコンポーネント
 * memo化されたバージョン
 */
export const Selector = memo(SelectorComponent) as typeof SelectorComponent

import { App } from '../../types'
import { Selector } from '../common/Selector'

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
const AppSelector = ({ apps, selectedApp, onSelectApp }: AppSelectorProps) => {
  return (
    <Selector
      title="アプリケーション"
      items={apps}
      selectedId={selectedApp}
      onSelect={onSelectApp}
    />
  )
}

export default AppSelector

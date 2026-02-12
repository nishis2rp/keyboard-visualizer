import { App } from '../../types'
import { useLanguage } from '../../context/LanguageContext'
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
  const { t } = useLanguage();

  return (
    <Selector
      title={t.normalMode.applicationSelector}
      items={apps}
      selectedId={selectedApp}
      onSelect={onSelectApp}
    />
  )
}

export default AppSelector

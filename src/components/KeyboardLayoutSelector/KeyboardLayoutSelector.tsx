import { Selector, SelectorItem } from '../common/Selector'
import { useLanguage } from '../../context/LanguageContext'

interface KeyboardLayoutOption extends SelectorItem {
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
const KeyboardLayoutSelector = ({ layouts, selectedLayout, onSelectLayout }: KeyboardLayoutSelectorProps) => {
  const { t } = useLanguage()

  return (
    <Selector
      title={t.header.keyboardLayout}
      items={layouts}
      selectedId={selectedLayout}
      onSelect={onSelectLayout}
    />
  )
}

export default KeyboardLayoutSelector

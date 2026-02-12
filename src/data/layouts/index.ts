import { KeyboardLayout } from '../../types'

// すべてのキーボードレイアウトを統合してエクスポート
import { windowsJisLayout } from './windowsJis'
import { windowsUsLayout } from './windowsUs'
import { macJisLayout } from './macJis'
import { macUsLayout } from './macUs'

// レイアウト取得用のヘルパー関数
export const getKeyboardLayoutByName = (layoutName: string): KeyboardLayout => {
  switch (layoutName) {
    case 'mac-jis':
      return macJisLayout
    case 'mac-us':
      return macUsLayout
    case 'windows-us':
      return windowsUsLayout
    case 'windows-jis':
    default:
      return windowsJisLayout
  }
}

// レイアウト表示名取得用のヘルパー関数
export const getLayoutDisplayName = (layoutName) => {
  switch (layoutName) {
    case 'mac-jis':
      return 'Mac JIS キーボード配列'
    case 'mac-us':
      return 'Mac US キーボード配列'
    case 'windows-us':
      return 'Windows US キーボード配列'
    case 'windows-jis':
    default:
      return 'Windows JIS キーボード配列'
  }
}

// キーボードレイアウトの選択肢リスト
export interface KeyboardLayoutOption {
  id: string;
  icon: string;
  name: string;
}

export const keyboardLayoutOptions: KeyboardLayoutOption[] = [
  { id: 'windows-jis', icon: '⊞', name: 'Windows JIS' },
  { id: 'windows-us', icon: '⊞', name: 'Windows US' },
  { id: 'mac-jis', icon: '⌘', name: 'Mac JIS' },
  { id: 'mac-us', icon: '⌘', name: 'Mac US' },
];

// 個別のレイアウトもエクスポート
export { windowsJisLayout, windowsUsLayout, macJisLayout, macUsLayout }

// すべてのキーボードレイアウトを統合してエクスポート
import { windowsJisLayout } from './windowsJis'
import { macJisLayout } from './macJis'
import { macUsLayout } from './macUs'

// レイアウト取得用のヘルパー関数
export const getKeyboardLayoutByName = (layoutName) => {
  switch (layoutName) {
    case 'mac-jis':
      return macJisLayout
    case 'mac-us':
      return macUsLayout
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
    case 'windows-jis':
    default:
      return 'Windows JIS キーボード配列'
  }
}

// 個別のレイアウトもエクスポート
export { windowsJisLayout, macJisLayout, macUsLayout }

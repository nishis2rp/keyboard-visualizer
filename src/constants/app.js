/**
 * アプリケーション全体で使用される定数
 */

/**
 * セットアップ画面のバージョン
 * バージョンが変わると、既存のセットアップをリセットして再度セットアップを求める
 */
export const SETUP_VERSION = 'v2'

/**
 * LocalStorageのキー
 */
export const STORAGE_KEYS = {
  /** セットアップ情報を保存するキー */
  SETUP: 'keyboard-visualizer-setup'
}

/**
 * デフォルト値
 */
export const DEFAULTS = {
  /** デフォルトアプリ */
  APP: 'windows11',
  /** デフォルトキーボードレイアウト */
  LAYOUT: 'windows-jis'
}

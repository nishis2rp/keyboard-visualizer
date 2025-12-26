/**
 * システムレベルで保護されているショートカット
 * これらのショートカットは、ブラウザのKeyboard Lock APIでもキャプチャできません
 * OSのセキュリティやシステムの安定性のために保護されています
 */
export const SYSTEM_PROTECTED_SHORTCUTS = new Set([
  // ===== Windows =====
  
  // Windows セキュリティ関連（最高優先度）
  'Win + L',                    // PCロック（セキュリティ保護）
  'Ctrl + Alt + Delete',        // セキュリティオプション
  'Ctrl + Shift + Escape',      // タスクマネージャー（システム保護）

  // Xbox Game Bar関連（システムレベルフック）
  'Win + G',                    // Xbox Game Barを開く
  'Win + Alt + R',              // ゲームバーで録画開始/停止
  'Win + Alt + Print Screen',   // ゲームウィンドウのスクリーンショット
  'Win + Alt + G',              // 最後の30秒を録画

  // スクリーンショット関連（一部環境で保護）
  'Win + Print Screen',         // スクリーンショットを保存
  'Win + Shift + S',            // スクリーンショット（Snipping Tool）

  // システムダイアログ（高優先度）
  'Alt + F4',                   // アプリを閉じる（一部環境で保護）

  // ===== macOS =====

  // セキュリティ・システム関連（最高優先度）
  'Ctrl + Cmd + Q',             // 画面をロック
  'Cmd + Option + Escape',      // 強制終了
  'Cmd + Shift + Q',            // ログアウト
  'Cmd + Ctrl + Power',         // 再起動
  'Option + Cmd + Power',       // スリープ

  // Spotlight（システムレベル検索）
  'Cmd + Space',                // Spotlightを表示
  'Cmd + Option + Space',       // Finderの検索ウィンドウを表示

  // Mission Control・ウィンドウ管理（システムレベル）
  'Ctrl + ↑',                   // Mission Controlを表示
  'Ctrl + ↓',                   // アプリケーションWindowsを表示
  'Ctrl + ←',                   // Mission Control左へ
  'Ctrl + →',                   // Mission Control右へ
  'F3',                         // Mission Control
  'F4',                         // Launchpadを表示
  'Fn + F4',                    // Launchpadを表示（代替）
  'Fn + F12',                   // Dashboardを表示（古いmacOS）

  // スクリーンショット（システムレベル）
  'Cmd + Shift + 3',            // スクリーン全体をキャプチャ
  'Cmd + Shift + 4',            // 選択範囲をキャプチャ
  'Cmd + Shift + 5',            // スクリーンショットオプション
  'Cmd + Shift + 6',            // Touch Barをキャプチャ
  'Cmd + Shift + 4 + Space',    // ウィンドウをキャプチャ

  // アクセシビリティ（システムレベル）
  'Cmd + Option + F5',          // アクセシビリティオプション
  'Cmd + Option + 8',           // ズーム機能のオン/オフ
  'Cmd + Option + =',           // ズームイン（アクセシビリティ）
  'Cmd + Option + -',           // ズームアウト（アクセシビリティ）
  'Ctrl + Option + Cmd + 8',    // 色を反転

  // メニューバー・Dock・通知（システムUI）
  'Ctrl + F2',                  // メニューバーにフォーカス
  'Ctrl + F3',                  // Dockにフォーカス
  'Cmd + Option + D',           // Dockの表示/非表示
  'Ctrl + Cmd + N',             // 通知センターを表示

  // ファンクションキー（一部）
  'F1',                         // ディスプレイの輝度を下げる
  'F2',                         // ディスプレイの輝度を上げる
  'F5',                         // キーボードのバックライトを暗くする
  'F6',                         // キーボードのバックライトを明るくする
  'F7',                         // 前のトラック
  'F8',                         // 再生/一時停止
  'F9',                         // 次のトラック
  'F10',                        // ミュート
  'F11',                        // 音量を下げる
  'F12',                        // 音量を上げる

  // アプリケーション切り替え（システムレベル）
  'Cmd + Tab',                  // アプリケーションの切り替え
  'Cmd + `',                    // 同じアプリのウィンドウ切り替え

  // 音声入力（システムレベル）
  'Fn Fn (2回)',                // 音声入力を開始
])

/**
 * macOS特有のシステムショートカット（ブラウザで一部キャプチャ可能だが、システム設定で有効な場合は優先される）
 */
export const MACOS_CONFIGURABLE_SHORTCUTS = new Set([
  'Ctrl + F2',                  // メニューバーにフォーカス
  'Ctrl + F3',                  // Dockにフォーカス
  'Ctrl + F4',                  // すべてのウィンドウを切り替え
  'Ctrl + F5',                  // アプリのウィンドウを切り替え
  'Ctrl + F6',                  // 次のパネルに移動
  'Ctrl + F7',                  // フルキーボードアクセス
  'Ctrl + F8',                  // メニューバー項目を選択
  'F1',                         // ディスプレイの輝度を下げる
  'F2',                         // ディスプレイの輝度を上げる
  'F3',                         // Mission Control
  'F4',                         // Launchpad
  'F5',                         // キーボードのバックライトを暗くする
  'F6',                         // キーボードのバックライトを明るくする
  'F7',                         // 前のトラック
  'F8',                         // 再生/一時停止
  'F9',                         // 次のトラック
  'F10',                        // ミュート
  'F11',                        // 音量を下げる
  'F12',                        // 音量を上げる
])

/**
 * ショートカットがシステムレベルで保護されているかチェック
 * @param {string} shortcut - ショートカット文字列（例: "Win + L"）
 * @returns {boolean} システム保護されている場合true
 */
export const isSystemProtected = (shortcut) => {
  return SYSTEM_PROTECTED_SHORTCUTS.has(shortcut)
}

/**
 * macOSで設定によって変更可能なシステムショートカットかチェック
 * @param {string} shortcut - ショートカット文字列
 * @returns {boolean} macOSで設定変更可能な場合true
 */
export const isMacOSConfigurable = (shortcut) => {
  return MACOS_CONFIGURABLE_SHORTCUTS.has(shortcut)
}

/**
 * OSを検出
 * @returns {'windows' | 'macos' | 'linux' | 'unknown'}
 */
export const detectOS = () => {
  const platform = navigator.platform.toLowerCase()
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'macos'
  } else if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows'
  } else if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux'
  }
  return 'unknown'
}

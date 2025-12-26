/**
 * システムレベルで保護されているショートカットの分類
 *
 * 【分類基準】
 * 1. FULLSCREEN_PREVENTABLE: 全画面表示（Keyboard Lock API）で防げるショートカット → 青色表示
 * 2. ALWAYS_PROTECTED: 全画面表示しても防げないショートカット → 赤色表示
 * 3. その他: 干渉しないショートカット → 通常表示（色なし）
 */

/**
 * 全画面表示（Keyboard Lock API）で防げるショートカット
 * これらは通常はブラウザやOSに取られるが、フルスクリーン+Keyboard Lock APIで防げる
 */
export const FULLSCREEN_PREVENTABLE_SHORTCUTS = new Set([
  // ===== Windows =====

  // ブラウザショートカット（フルスクリーンで防げる）
  'Ctrl + W',                   // タブを閉じる
  'Ctrl + T',                   // 新しいタブ
  'Ctrl + N',                   // 新しいウィンドウ
  'Ctrl + Shift + N',           // シークレットウィンドウ
  'Ctrl + Tab',                 // 次のタブ
  'Ctrl + Shift + Tab',         // 前のタブ
  'Ctrl + 1',                   // 1番目のタブ
  'Ctrl + 2',                   // 2番目のタブ
  'Ctrl + 3',                   // 3番目のタブ
  'Ctrl + 4',                   // 4番目のタブ
  'Ctrl + 5',                   // 5番目のタブ
  'Ctrl + 6',                   // 6番目のタブ
  'Ctrl + 7',                   // 7番目のタブ
  'Ctrl + 8',                   // 8番目のタブ
  'Ctrl + 9',                   // 最後のタブ
  'Ctrl + F4',                  // タブを閉じる
  'Alt + ←',                    // 戻る
  'Alt + →',                    // 進む
  'F5',                         // 更新
  'Ctrl + R',                   // 更新
  'Ctrl + F5',                  // 強制更新
  'Ctrl + Shift + R',           // 強制更新
  'F11',                        // 全画面表示
  'Ctrl + +',                   // ズームイン
  'Ctrl + -',                   // ズームアウト
  'Ctrl + 0',                   // ズームリセット
  'Ctrl + F',                   // 検索
  'Ctrl + H',                   // 履歴
  'Ctrl + J',                   // ダウンロード
  'Ctrl + D',                   // ブックマーク
  'Ctrl + Shift + D',           // 全てブックマーク
  'Ctrl + Shift + B',           // ブックマークバー
  'Ctrl + Shift + O',           // ブックマークマネージャ
  'Ctrl + P',                   // 印刷
  'Ctrl + S',                   // 保存
  'Ctrl + U',                   // ソース表示

  // Windows ウィンドウ管理（フルスクリーンで防げる）
  'Win + D',                    // デスクトップ表示
  'Win + M',                    // 全ウィンドウ最小化
  'Win + ↑',                    // ウィンドウ最大化
  'Win + ↓',                    // ウィンドウ最小化/復元
  'Win + ←',                    // 左半分にスナップ
  'Win + →',                    // 右半分にスナップ
  'Win + Home',                 // アクティブウィンドウ以外を最小化
  'Alt + Tab',                  // ウィンドウ切り替え
  'Alt + Escape',               // ウィンドウ順次切り替え

  // ===== macOS =====

  // ブラウザショートカット（フルスクリーンで防げる）
  'Cmd + W',                    // タブを閉じる
  'Cmd + T',                    // 新しいタブ
  'Cmd + N',                    // 新しいウィンドウ
  'Cmd + Shift + N',            // シークレットウィンドウ
  'Cmd + Option + ←',           // 前のタブ
  'Cmd + Option + →',           // 次のタブ
  'Cmd + 1',                    // 1番目のタブ
  'Cmd + 2',                    // 2番目のタブ
  'Cmd + 3',                    // 3番目のタブ
  'Cmd + 4',                    // 4番目のタブ
  'Cmd + 5',                    // 5番目のタブ
  'Cmd + 6',                    // 6番目のタブ
  'Cmd + 7',                    // 7番目のタブ
  'Cmd + 8',                    // 8番目のタブ
  'Cmd + 9',                    // 最後のタブ
  'Cmd + [',                    // 戻る
  'Cmd + ]',                    // 進む
  'Cmd + R',                    // 更新
  'Cmd + Shift + R',            // 強制更新
  'Cmd + Ctrl + F',             // 全画面表示
  'Cmd + +',                    // ズームイン
  'Cmd + -',                    // ズームアウト
  'Cmd + 0',                    // ズームリセット
  'Cmd + F',                    // 検索
  'Cmd + G',                    // 次を検索
  'Cmd + Shift + G',            // 前を検索
  'Cmd + H',                    // ウィンドウを隠す
  'Cmd + Option + H',           // 他を隠す
  'Cmd + M',                    // ウィンドウを最小化
  'Cmd + Q',                    // アプリを終了
  'Cmd + W',                    // ウィンドウを閉じる
  'Cmd + D',                    // ブックマーク
  'Cmd + Shift + D',            // 全てブックマーク
  'Cmd + Option + B',           // ブックマークバー
  'Cmd + P',                    // 印刷
  'Cmd + S',                    // 保存
  'Cmd + Option + U',           // ソース表示
  'Cmd + ,',                    // 設定
])

/**
 * 常にシステムレベルで保護されているショートカット
 * フルスクリーン+Keyboard Lock APIでも防げない（OSレベルで優先）
 */
export const ALWAYS_PROTECTED_SHORTCUTS = new Set([
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

  // スクリーンショット関連
  'Win + Print Screen',         // スクリーンショットを保存
  'Win + Shift + S',            // スクリーンショット（Snipping Tool）
  'Print Screen',               // スクリーンショット

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

  // スクリーンショット（システムレベル）
  'Cmd + Shift + 3',            // スクリーン全体をキャプチャ
  'Cmd + Shift + 4',            // 選択範囲をキャプチャ
  'Cmd + Shift + 5',            // スクリーンショットオプション
  'Cmd + Shift + 6',            // Touch Barをキャプチャ

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

  // ファンクションキー（ハードウェア制御）
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
])

// 後方互換性のため、全ての保護ショートカットを統合
export const SYSTEM_PROTECTED_SHORTCUTS = new Set([
  ...FULLSCREEN_PREVENTABLE_SHORTCUTS,
  ...ALWAYS_PROTECTED_SHORTCUTS
])

/**
 * ショートカットの保護レベルを判定
 * @param {string} shortcut - ショートカット文字列（例: "Win + L"）
 * @returns {'none' | 'fullscreen-preventable' | 'always-protected'} 保護レベル
 */
export const getProtectionLevel = (shortcut) => {
  if (ALWAYS_PROTECTED_SHORTCUTS.has(shortcut)) {
    return 'always-protected'  // 赤色
  }
  if (FULLSCREEN_PREVENTABLE_SHORTCUTS.has(shortcut)) {
    return 'fullscreen-preventable'  // 青色
  }
  return 'none'  // 通常（色なし）
}

/**
 * ショートカットがシステムレベルで保護されているかチェック（後方互換）
 * @param {string} shortcut - ショートカット文字列
 * @returns {boolean} システム保護されている場合true
 */
export const isSystemProtected = (shortcut) => {
  return SYSTEM_PROTECTED_SHORTCUTS.has(shortcut)
}

/**
 * ショートカットがフルスクリーンで防げるかチェック
 * @param {string} shortcut - ショートカット文字列
 * @returns {boolean} フルスクリーンで防げる場合true
 */
export const isFullscreenPreventable = (shortcut) => {
  return FULLSCREEN_PREVENTABLE_SHORTCUTS.has(shortcut)
}

/**
 * ショートカットが常に保護されているかチェック
 * @param {string} shortcut - ショートカット文字列
 * @returns {boolean} 常に保護されている場合true
 */
export const isAlwaysProtected = (shortcut) => {
  return ALWAYS_PROTECTED_SHORTCUTS.has(shortcut)
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

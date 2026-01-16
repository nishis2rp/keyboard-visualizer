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
 *
 * 注意: 一般的な編集ショートカット（Ctrl+S, Ctrl+Pなど）はここに含めない
 * それらはアプリケーション内で正常に動作するため、全画面表示の必要はない
 */
export const FULLSCREEN_PREVENTABLE_SHORTCUTS = new Set([
  // ===== Windows =====

  // ブラウザタブ操作（フルスクリーンで防げる）
  'Ctrl + W',                   // タブを閉じる
  'Ctrl + F4',                  // タブを閉じる
  'Ctrl + T',                   // 新しいタブ
  'Ctrl + N',                   // 新しいウィンドウ
  'Ctrl + Shift + N',           // シークレットウィンドウ
  'Ctrl + Tab',                 // 次のタブ
  'Ctrl + Shift + Tab',         // 前のタブ
  'Ctrl + Page Down',           // 次のタブ
  'Ctrl + Page Up',             // 前のタブ
  'Ctrl + Shift + Page Down',   // タブを右に移動
  'Ctrl + Shift + Page Up',     // タブを左に移動
  'Ctrl + 1',                   // 1番目のタブ
  'Ctrl + 2',                   // 2番目のタブ
  'Ctrl + 3',                   // 3番目のタブ
  'Ctrl + 4',                   // 4番目のタブ
  'Ctrl + 5',                   // 5番目のタブ
  'Ctrl + 6',                   // 6番目のタブ
  'Ctrl + 7',                   // 7番目のタブ
  'Ctrl + 8',                   // 8番目のタブ
  'Ctrl + 9',                   // 最後のタブ
  'Ctrl + Shift + T',           // 閉じたタブを再度開く

  // ブラウザナビゲーション（フルスクリーンで防げる）
  'Alt + ←',                    // 戻る
  'Alt + →',                    // 進む
  'Backspace',                  // 前のページに戻る
  'Shift + Backspace',          // 次のページに進む
  'Ctrl + R',                   // ページを更新
  'Ctrl + +',                   // ズームイン
  'Ctrl + -',                   // ズームアウト
  'Ctrl + 0',                   // ズームリセット
  'Ctrl + L',                   // アドレスバーにフォーカス
  'Alt + D',                    // アドレスバーにフォーカス
  'Ctrl + K',                   // 検索バーにフォーカス
  'Ctrl + E',                   // 検索バーにフォーカス

  // ブラウザ機能（フルスクリーンで防げる）
  'Ctrl + H',                   // 履歴
  'Ctrl + J',                   // ダウンロード
  'Ctrl + D',                   // ブックマーク
  'Ctrl + Shift + D',           // 全てブックマーク
  'Ctrl + Shift + B',           // ブックマークバー
  'Ctrl + Shift + O',           // ブックマークマネージャ
  'Ctrl + U',                   // ソース表示
  'Ctrl + O',                   // ファイルを開く
  'Ctrl + Shift + S',           // 名前を付けて保存
  'Ctrl + A',                   // すべて選択
  'Ctrl + F',                   // ページ内検索
  'F3',                         // ページ内検索
  'Shift + F3',                 // 前の検索結果
  'Ctrl + G',                   // 次を検索
  'Ctrl + Shift + G',           // 前を検索
  'F7',                         // カーソルブラウジング
  'Ctrl + Shift + Delete',      // 閲覧データを削除
  'F12',                        // デベロッパーツール
  'Ctrl + Shift + I',           // デベロッパーツール
  'Ctrl + Shift + J',           // コンソールを開く
  'Ctrl + Shift + C',           // 要素を検証
  'Ctrl + Shift + M',           // デバイスツールバー
  'Ctrl + [',                   // DevTools前のパネル
  'Ctrl + ]',                   // DevTools次のパネル
  'Ctrl + Enter',               // .comを追加
  'Ctrl + Shift + A',           // タブを検索
  'Ctrl + Shift + E',           // 拡張機能ページ
  'Shift + Escape',             // タスクマネージャー

  // Windows UI操作（フルスクリーンで防げる）
  'Win + D',                    // デスクトップ表示
  'Win + M',                    // 全ウィンドウ最小化
  'Win + ↑',                    // ウィンドウ最大化
  'Win + ↓',                    // ウィンドウ最小化/復元
  'Win + ←',                    // 左半分にスナップ
  'Win + →',                    // 右半分にスナップ
  'Win + Home',                 // アクティブウィンドウ以外を最小化
  'Win + Shift + ↑',            // 垂直方向に最大化
  'Win + Shift + ↓',            // 垂直方向サイズ戻す
  'Win + Shift + ←',            // 左のモニターに移動
  'Win + Shift + →',            // 右のモニターに移動
  'Win + Shift + M',            // 最小化したウィンドウを復元

  // Windows 機能（フルスクリーンで防げる）
  'Win',                        // スタートメニュー
  'Win + A',                    // クイック設定
  'Win + C',                    // Microsoft Teams チャット
  'Win + E',                    // エクスプローラー
  'Win + F',                    // フィードバックHub
  'Win + G',                    // Xbox Game Barを開く
  'Win + H',                    // 音声入力
  'Win + I',                    // 設定
  'Win + K',                    // キャスト（ワイヤレスディスプレイ）
  'Win + N',                    // 通知センター
  'Win + O',                    // デバイスの向きをロック
  'Win + P',                    // プレゼンテーション表示モード
  'Win + Q',                    // 検索
  'Win + R',                    // ファイル名を指定して実行
  'Win + S',                    // 検索
  'Win + T',                    // タスクバーのアプリを順番に選択
  'Win + U',                    // 簡単操作センター
  'Win + V',                    // クリップボード履歴
  'Win + W',                    // ウィジェット
  'Win + X',                    // クイックリンクメニュー
  'Win + Y',                    // Windows Mixed Reality
  'Win + Z',                    // スナップレイアウト
  'Win + Tab',                  // タスクビュー
  'Win + Space',                // 入力言語切り替え
  'Win + Enter',                // ナレーター
  'Win + .',                    // 絵文字パネル
  'Win + ;',                    // 絵文字パネル
  'Win + ,',                    // デスクトッププレビュー
  'Win + +',                    // 拡大鏡で拡大
  'Win + -',                    // 拡大鏡で縮小
  'Win + Escape',               // 拡大鏡終了
  'Win + /',                    // IME再変換
  'Win + B',                    // 通知領域フォーカス
  'Win + Pause',                // システムのプロパティ
  'Win + 1',                    // タスクバー1番目
  'Win + 2',                    // タスクバー2番目
  'Win + 3',                    // タスクバー3番目
  'Win + 4',                    // タスクバー4番目
  'Win + 5',                    // タスクバー5番目
  'Win + 6',                    // タスクバー6番目
  'Win + 7',                    // タスクバー7番目
  'Win + 8',                    // タスクバー8番目
  'Win + 9',                    // タスクバー9番目
  'Win + 0',                    // タスクバー10番目
  'Win + Alt + R',              // ゲームバーで録画開始/停止
  'Win + Alt + Print Screen',   // ゲームウィンドウのスクリーンショット
  'Win + Alt + G',              // 最後の30秒を録画
  'Win + Print Screen',         // スクリーンショットを保存
  'Win + Shift + S',            // スクリーンショット（Snipping Tool）
  'Win + Shift + N',            // 通知センター・カレンダー
  'Win + Ctrl + D',             // 新しい仮想デスクトップ
  'Win + Ctrl + ←',             // 左の仮想デスクトップ
  'Win + Ctrl + →',             // 右の仮想デスクトップ
  'Win + Ctrl + F4',            // 仮想デスクトップを閉じる
  'Win + Ctrl + Enter',         // ナレーター
  'Win + Ctrl + N',             // ナレーター設定
  'Win + Ctrl + M',             // 拡大鏡
  'Win + Ctrl + C',             // カラーフィルター
  'Win + Ctrl + Shift + B',     // グラフィックドライバー再起動

  // ===== macOS =====

  // ブラウザタブ操作（フルスクリーンで防げる）
  'Cmd + W',                    // タブを閉じる
  'Cmd + T',                    // 新しいタブ
  'Cmd + N',                    // 新しいウィンドウ
  'Cmd + Shift + N',            // シークレットウィンドウ
  'Cmd + Option + ←',           // 前のタブ
  'Cmd + Option + →',           // 次のタブ
  'Cmd + Shift + [',            // 前のタブ
  'Cmd + Shift + ]',            // 次のタブ
  'Cmd + 1',                    // 1番目のタブ
  'Cmd + 2',                    // 2番目のタブ
  'Cmd + 3',                    // 3番目のタブ
  'Cmd + 4',                    // 4番目のタブ
  'Cmd + 5',                    // 5番目のタブ
  'Cmd + 6',                    // 6番目のタブ
  'Cmd + 7',                    // 7番目のタブ
  'Cmd + 8',                    // 8番目のタブ
  'Cmd + 9',                    // 最後のタブ
  'Cmd + Shift + T',            // 閉じたタブを再度開く

  // ブラウザナビゲーション（フルスクリーンで防げる）
  'Cmd + [',                    // 戻る
  'Cmd + ]',                    // 進む
  'Cmd + R',                    // ページを更新
  'Cmd + Shift + R',            // キャッシュをクリアして強制再読み込み
  'Cmd + +',                    // ズームイン
  'Cmd + -',                    // ズームアウト
  'Cmd + 0',                    // ズームリセット
  'Cmd + L',                    // アドレスバーにフォーカス

  // ブラウザ機能（フルスクリーンで防げる）
  'Cmd + F',                    // 検索
  'Cmd + G',                    // 次を検索
  'Cmd + Shift + G',            // 前を検索
  'Cmd + D',                    // ブックマーク
  'Cmd + Shift + D',            // 全てブックマーク
  'Cmd + Option + B',           // ブックマークバー
  'Cmd + Option + U',           // ソース表示
  'Cmd + Shift + S',            // 名前を付けて保存
  'Cmd + O',                    // ファイルを開く
  'Cmd + Shift + Delete',       // 閲覧データを削除
  'Cmd + Option + I',           // デベロッパーツール
  'Cmd + Option + J',           // コンソールを開く
  'Cmd + Option + C',           // 要素を検証
  'Cmd + Shift + A',            // タブを検索
  'Cmd + Shift + E',            // 拡張機能ページ
])

/**
 * 常にシステムレベルで保護されているショートカット
 * フルスクリーン+Keyboard Lock APIでも防げない（OSレベルで優先）
 *
 * 注意: 実際にOSレベルで保護されているショートカットのみを含める
 */
export const ALWAYS_PROTECTED_SHORTCUTS = new Set([
  // ===== Windows =====

  // Windows セキュリティ関連（最高優先度）
  'Win + L',                    // PCロック（セキュリティ保護）
  'Ctrl + Alt + Delete',        // セキュリティオプション
  'Ctrl + Shift + Escape',      // タスクマネージャー（システム保護）

  // Windows システムショートカット（OSレベルで保護）
  'Print Screen',               // スクリーンショット
  'Alt + Tab',                  // ウィンドウ切り替え
  'Alt + Escape',               // ウィンドウ順次切り替え
  'Alt + F4',                   // ウィンドウを閉じる

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

  // macOS ウィンドウ管理（システムレベル）
  'Cmd + H',                    // ウィンドウを隠す
  'Cmd + Option + H',           // 他を隠す
  'Cmd + M',                    // ウィンドウを最小化
  'Cmd + Q',                    // アプリを終了
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

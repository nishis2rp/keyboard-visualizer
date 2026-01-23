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
 * それらはアプリケーション内でpreventDefault()で制御できるため、全画面表示の必要はない
 *
 * このリストには、ブラウザのタブ/ウィンドウ操作など、フルスクリーンが必要なもののみを含める
 */
export const FULLSCREEN_PREVENTABLE_SHORTCUTS = new Set([
  // ===== Windows =====

  // ブラウザタブ操作（フルスクリーンで防げる）
  'Ctrl + W',                   // タブを閉じる
  'Ctrl + T',                   // 新しいタブ
  'Ctrl + N',                   // 新しいウィンドウ
  'Ctrl + Shift + N',           // シークレットウィンドウ
  'Ctrl + Shift + T',           // 閉じたタブを再度開く

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
  'Cmd + Shift + T',            // 閉じたタブを再度開く
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
 * Excelアプリ内では競合しないショートカット
 * Excelデスクトップアプリを使用する場合、これらはブラウザと競合しない
 */
const EXCEL_APP_SAFE_SHORTCUTS = new Set([
  // 編集系（Excel固有の動作）
  'Ctrl + B',      // 太字
  'Ctrl + I',      // 斜体
  'Ctrl + U',      // 下線（ブラウザではソース表示だが、Excelアプリでは下線）
  'Ctrl + 5',      // 取り消し線

  // 書式設定
  'Ctrl + 1',      // セルの書式設定（ブラウザではタブ切り替えだが、Excelアプリでは書式設定）
  'Ctrl + 2',      // （Excel用）
  'Ctrl + 3',      // （Excel用）
  'Ctrl + 4',      // （Excel用）
  'Ctrl + 5',      // （Excel用）
  'Ctrl + 6',      // （Excel用）
  'Ctrl + 7',      // （Excel用）
  'Ctrl + 8',      // アウトライン記号（ブラウザではタブ切り替えだが、Excelアプリではアウトライン）
  'Ctrl + 9',      // 行を非表示（ブラウザではタブ切り替えだが、Excelアプリでは行非表示）
  'Ctrl + 0',      // 列を非表示（ブラウザではズームリセットだが、Excelアプリでは列非表示）

  // 移動・選択
  'Ctrl + Space',  // 列選択
  'Ctrl + Home',   // A1セルへ
  'Ctrl + End',    // 最終セルへ
  'Ctrl + ↑',      // 上方向の端
  'Ctrl + ↓',      // 下方向の端
  'Ctrl + ←',      // 左方向の端
  'Ctrl + →',      // 右方向の端
  'Ctrl + PageUp', // 前のシート
  'Ctrl + PageDown', // 次のシート
  'Ctrl + Backspace', // アクティブセルまでスクロール

  // 数式・入力
  'Ctrl + ;',      // 現在の日付
  'Ctrl + :',      // 現在の時刻
  'Ctrl + `',      // 数式表示切替
  'Ctrl + \'',     // 上のセルをコピー
  'Ctrl + Enter',  // 選択範囲に同じ値

  // Excel固有のファンクションキー
  'Ctrl + F1',     // リボン表示/非表示
  'Ctrl + F2',     // 印刷プレビュー
  'Ctrl + F3',     // 名前の管理
  'Ctrl + F6',     // 次のブックウィンドウ
  'Ctrl + F9',     // ブックウィンドウ最小化
  'Ctrl + F10',    // ブックウィンドウ最大化/復元

  // その他Excel固有
  'Ctrl + Insert', // コピー
  'Ctrl + -',      // セル/行/列を削除
  'Ctrl + D',      // 下方向にコピー（ブラウザではブックマークだが、Excelアプリでは下コピー）
  'Ctrl + R',      // 右方向にコピー（ブラウザでは更新だが、Excelアプリでは右コピー）
  'Ctrl + K',      // ハイパーリンク（ブラウザでは検索バーだが、Excelアプリではハイパーリンク）
  'Ctrl + T',      // テーブル作成（ブラウザでは新しいタブだが、Excelアプリではテーブル作成）
  'Ctrl + L',      // テーブル作成（ブラウザではアドレスバーだが、Excelアプリではテーブル作成）
  'Ctrl + E',      // フラッシュフィル（ブラウザでは検索バーだが、Excelアプリではフラッシュフィル）
  'Ctrl + Q',      // クイック分析
  'Ctrl + G',      // ジャンプダイアログ

  // Ctrl + Shift系も多くがExcel固有
  'Ctrl + Shift + +',  // セル/行/列を挿入
  'Ctrl + Shift + ↑',  // 上方向に選択
  'Ctrl + Shift + ↓',  // 下方向に選択
  'Ctrl + Shift + ←',  // 左方向に選択
  'Ctrl + Shift + →',  // 右方向に選択
  'Ctrl + Shift + Home', // 先頭セルまで選択
  'Ctrl + Shift + End',  // 最終セルまで選択
  'Ctrl + Shift + Space', // データ範囲全体を選択
  'Ctrl + Shift + ~',  // 標準表示形式
  'Ctrl + Shift + !',  // 桁区切り表示
  'Ctrl + Shift + @',  // 時刻表示
  'Ctrl + Shift + #',  // 日付表示
  'Ctrl + Shift + $',  // 通貨表示
  'Ctrl + Shift + %',  // パーセント表示
  'Ctrl + Shift + ^',  // 指数表示
  'Ctrl + Shift + &',  // 罫線を引く
  'Ctrl + Shift + _',  // 罫線を削除
  'Ctrl + Shift + 1',  // 数値形式
  'Ctrl + Shift + 2',  // 時刻形式
  'Ctrl + Shift + 3',  // 日付形式
  'Ctrl + Shift + 4',  // 通貨形式
  'Ctrl + Shift + 5',  // パーセント形式
  'Ctrl + Shift + 6',  // 指数形式
  'Ctrl + Shift + 9',  // 行の再表示
  'Ctrl + Shift + 0',  // 列の再表示
  'Ctrl + Shift + A',  // 関数の引数を挿入（ブラウザではタブ検索だが、Excelアプリでは関数引数）
  'Ctrl + Shift + Enter', // 配列数式
  'Ctrl + Shift + U',  // 数式バー展開
  'Ctrl + Shift + F',  // セルの書式を検索
  'Ctrl + Shift + L',  // フィルター切替
  'Ctrl + Shift + F2', // コメント表示/非表示
  'Ctrl + Shift + F3', // 名前を作成
  'Ctrl + Shift + F6', // 前のブックウィンドウ
  'Ctrl + Shift + "',  // 上のセルの値をコピー
  'Ctrl + Shift + T',  // テーブルの合計行切替
  'Ctrl + Shift + =',  // セル挿入
  'Ctrl + Shift + F9', // 数式を値に変換

  // Ctrl + Alt系
  'Ctrl + Alt + V',    // 形式を選択して貼り付け
  'Ctrl + Alt + F9',   // すべてのブックを再計算

  // その他
  'Ctrl + [',      // 参照元セルに移動
  'Ctrl + ]',      // 参照先セルに移動
  'Ctrl + /',      // アクティブ配列を選択
  'Ctrl + \\',     // 行の違いを選択
  'Ctrl + Shift + |', // 列の違いを選択
  'Ctrl + Shift + O', // コメントがあるセルを選択
])

/**
 * ショートカットの保護レベルを判定
 * @param {string} shortcut - ショートカット文字列（例: "Win + L"）
 * @param {string} appContext - アプリケーションコンテキスト（例: "excel", "chrome"など）
 * @returns {'none' | 'fullscreen-preventable' | 'always-protected'} 保護レベル
 */
export const getProtectionLevel = (shortcut, appContext = null) => {
  // Excelアプリのコンテキストでは、Excel固有のショートカットは保護不要
  if (appContext === 'excel' && EXCEL_APP_SAFE_SHORTCUTS.has(shortcut)) {
    return 'none'  // 通常（色なし） - Excelアプリ内では競合しない
  }

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

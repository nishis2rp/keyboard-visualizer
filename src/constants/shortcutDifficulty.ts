/**
 * ショートカットの難易度分類
 *
 * Basic: よく使われる基本的なショートカット
 * Standard: 全てのショートカット（basic + madmax含む）
 * MadMax: あまり使わないショートカット
 */

/**
 * よく使われる基本的なショートカット（正規化形式）
 * これらは初心者にも覚えやすく、頻繁に使用されるショートカット
 */
export const BASIC_SHORTCUTS = new Set([
  // 基本操作
  'Ctrl+C',          // コピー
  'Ctrl+V',          // 貼り付け
  'Ctrl+X',          // 切り取り
  'Ctrl+Z',          // 元に戻す
  'Ctrl+Y',          // やり直し
  'Ctrl+A',          // すべて選択
  'Ctrl+S',          // 上書き保存
  'Ctrl+F',          // 検索
  'Ctrl+P',          // 印刷
  'Ctrl+N',          // 新規作成
  'Ctrl+O',          // 開く
  'Ctrl+W',          // タブ/ウィンドウを閉じる

  // ウィンドウ・タブ操作
  'Alt+Tab',         // アプリケーション切り替え
  'Alt+F4',          // ウィンドウを閉じる
  'Ctrl+T',          // 新しいタブ
  'Ctrl+Tab',        // タブ切り替え（次）
  'Ctrl+Shift+Tab',  // タブ切り替え（前）

  // ブラウザ
  'Ctrl+R',          // ページ更新
  'F5',              // ページ更新
  'Ctrl+L',          // アドレスバーにフォーカス
  'Ctrl+D',          // ブックマーク
  'Ctrl+H',          // 履歴
  'F11',             // 全画面
  'Ctrl++',          // ズームイン
  'Ctrl+-',          // ズームアウト
  'Ctrl+0',          // ズームリセット

  // Excel
  'F2',              // セルの編集
  'Ctrl+B',          // 太字
  'Ctrl+I',          // 斜体
  'Ctrl+U',          // 下線
  'Ctrl+PageDown',   // 次のシート
  'Ctrl+PageUp',     // 前のシート

  // macOS基本
  'Meta+C',          // コピー（Mac）
  'Meta+V',          // 貼り付け（Mac）
  'Meta+X',          // 切り取り（Mac）
  'Meta+Z',          // 元に戻す（Mac）
  'Meta+Shift+Z',    // やり直し（Mac）
  'Meta+Tab',        // アプリケーション切り替え（Mac）
  'Meta+R',          // ブラウザ更新（Mac）
  'Meta+L',          // アドレスバー（Mac）
]);

/**
 * あまり使わないショートカット（正規化形式）
 * 上級者向けや特殊な用途のショートカット
 */
export const MADMAX_SHORTCUTS = new Set([
  // 代替キー
  'Ctrl+Insert',     // コピー（代替）
  'Shift+Insert',    // 貼り付け（代替）
  'Shift+Delete',    // 切り取り（代替）
  'Alt+Backspace',   // 元に戻す（代替）

  // ブラウザ上級
  'Ctrl+Shift+R',    // 強制更新
  'Ctrl+F5',         // 強制更新（代替）
  'Alt+D',           // アドレスバー（代替）
  'F6',              // アドレスバー（代替）
  'Ctrl+Shift+I',    // デベロッパーツール
  'F12',             // デベロッパーツール（代替）
  'Ctrl+=',          // ズームイン（代替）

  // Excel上級
  'Ctrl+1',          // セルの書式設定
  'Ctrl+2',          // 太字（代替）
  'Ctrl+3',          // 斜体（代替）
  'Ctrl+4',          // 下線（代替）
  'Ctrl+Shift+S',    // 名前を付けて保存（代替）
  'Shift+Space',     // 行全体を選択
  'Ctrl+Space',      // 列全体を選択
  'Ctrl+Shift+Space',// すべてのセルを選択

  // Windows特殊
  'Ctrl+F4',         // タブを閉じる（代替）

  // macOS上級
  'Meta+Y',          // やり直し（Mac代替）
  'Meta+Ctrl+F',     // 全画面（Mac）
  'Meta+Shift+R',    // ブラウザ強制更新（Mac）
  'Meta+=',          // ズームイン（Mac代替）
]);

/**
 * ショートカットの難易度を判定
 * @param normalizedShortcut - 正規化されたショートカット
 * @returns 難易度（'basic' | 'standard' | 'madmax'）
 */
export const getShortcutDifficulty = (normalizedShortcut: string): 'basic' | 'standard' | 'madmax' => {
  if (BASIC_SHORTCUTS.has(normalizedShortcut)) {
    return 'basic';
  }
  if (MADMAX_SHORTCUTS.has(normalizedShortcut)) {
    return 'madmax';
  }
  return 'standard';
};

/**
 * 指定された難易度に適合するかチェック
 * @param normalizedShortcut - 正規化されたショートカット
 * @param targetDifficulty - 対象難易度
 * @returns 適合する場合true
 */
export const matchesDifficulty = (
  normalizedShortcut: string,
  targetDifficulty: 'basic' | 'standard' | 'madmax'
): boolean => {
  const shortcutDifficulty = getShortcutDifficulty(normalizedShortcut);

  // standardは全てのショートカットを含む
  if (targetDifficulty === 'standard') {
    return true;
  }

  // basicはbasicのみ
  if (targetDifficulty === 'basic') {
    return shortcutDifficulty === 'basic';
  }

  // madmaxはbasic以外の全て（standard + madmax）を含む
  if (targetDifficulty === 'madmax') {
    return shortcutDifficulty !== 'basic';
  }

  return false;
};

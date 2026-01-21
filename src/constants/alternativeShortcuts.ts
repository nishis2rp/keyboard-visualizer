/**
 * 代替ショートカットのマッピング
 *
 * 同じ処理を行う異なるショートカットキーをグループ化します。
 * クイズモードでは、グループ内のいずれかのショートカットで回答すれば正解となります。
 */

/**
 * 代替ショートカットのグループ
 * キー: 正規化された代表的なショートカット
 * 値: 同じ処理を行う代替ショートカットの配列（正規化済み）
 */
export const ALTERNATIVE_SHORTCUTS: Record<string, string[]> = {
  // === 基本操作 ===
  // コピー
  'Ctrl+C': ['Ctrl+Insert'],

  // 切り取り
  'Ctrl+X': ['Shift+Delete'],

  // 貼り付け
  'Ctrl+V': ['Shift+Insert'],

  // 元に戻す
  'Ctrl+Z': ['Alt+Backspace'],

  // やり直し
  'Ctrl+Y': ['Ctrl+Shift+Z'],

  // すべて選択
  'Ctrl+A': [],

  // 検索
  'Ctrl+F': [],

  // 上書き保存
  'Ctrl+S': [],

  // 新規作成
  'Ctrl+N': [],

  // 開く
  'Ctrl+O': [],

  // 印刷
  'Ctrl+P': [],

  // === ウィンドウ・タブ操作 ===
  // ウィンドウを閉じる
  'Alt+F4': [],

  // タブを閉じる（ブラウザ）
  'Ctrl+W': ['Ctrl+F4'],

  // 新しいタブ（ブラウザ）
  'Ctrl+T': [],

  // タブ切り替え（ブラウザ）
  'Ctrl+Tab': ['Ctrl+PageDown'],
  'Ctrl+Shift+Tab': ['Ctrl+PageUp'],

  // アプリケーション切り替え
  'Alt+Tab': [],

  // === ブラウザ操作 ===
  // ページ更新
  'Ctrl+R': ['F5'],

  // 強制更新
  'Ctrl+Shift+R': ['Ctrl+F5'],

  // アドレスバーにフォーカス
  'Ctrl+L': ['Alt+D', 'F6'],

  // ブックマーク
  'Ctrl+D': [],

  // 履歴
  'Ctrl+H': [],

  // デベロッパーツール
  'Ctrl+Shift+I': ['F12'],

  // 全画面
  'F11': [],

  // ズームイン
  'Ctrl++': ['Ctrl+='],

  // ズームアウト
  'Ctrl+-': [],

  // ズームリセット
  'Ctrl+0': [],

  // === Excel操作 ===
  // セルの編集
  'F2': [],

  // 太字
  'Ctrl+B': ['Ctrl+2'],

  // 斜体
  'Ctrl+I': ['Ctrl+3'],

  // 下線
  'Ctrl+U': ['Ctrl+4'],

  // セルの書式設定
  'Ctrl+1': [],

  // 名前を付けて保存
  'F12': ['Ctrl+Shift+S'],

  // シート移動（右）
  'Ctrl+PageDown': [],

  // シート移動（左）
  'Ctrl+PageUp': [],

  // 行全体を選択
  'Shift+Space': [],

  // 列全体を選択
  'Ctrl+Space': [],

  // すべてのセルを選択（Excel）
  'Ctrl+Shift+Space': [],

  // === macOS固有の代替 ===
  // コピー（Mac）
  'Cmd+C': [],

  // 切り取り（Mac）
  'Cmd+X': [],

  // 貼り付け（Mac）
  'Cmd+V': [],

  // 元に戻す（Mac）
  'Cmd+Z': [],

  // やり直し（Mac）
  'Cmd+Shift+Z': ['Cmd+Y'],

  // 全画面（Mac）
  'Cmd+Ctrl+F': [],

  // アプリケーション切り替え（Mac）
  'Cmd+Tab': [],

  // ブラウザ更新（Mac）
  'Cmd+R': [],

  // ブラウザ強制更新（Mac）
  'Cmd+Shift+R': [],

  // アドレスバー（Mac）
  'Cmd+L': [],

  // ズームイン（Mac）
  'Cmd++': ['Cmd+='],

  // ズームアウト（Mac）
  'Cmd+-': [],

  // ズームリセット（Mac）
  'Cmd+0': [],
};

/**
 * 指定されたショートカットの代替ショートカットをすべて取得
 * @param normalizedShortcut - 正規化されたショートカット
 * @returns 代替ショートカットの配列（元のショートカットも含む）
 */
export const getAlternativeShortcuts = (normalizedShortcut: string): string[] => {
  // 直接マッピングがある場合
  if (ALTERNATIVE_SHORTCUTS[normalizedShortcut]) {
    return [normalizedShortcut, ...ALTERNATIVE_SHORTCUTS[normalizedShortcut]];
  }

  // 逆引き：代替ショートカットとして登録されている場合
  for (const [primary, alternatives] of Object.entries(ALTERNATIVE_SHORTCUTS)) {
    if (alternatives.includes(normalizedShortcut)) {
      return [primary, ...alternatives];
    }
  }

  // 代替ショートカットがない場合は自分自身のみ
  return [normalizedShortcut];
};

/**
 * 2つのショートカットが同じ処理を行うかチェック
 * @param shortcut1 - 正規化されたショートカット1
 * @param shortcut2 - 正規化されたショートカット2
 * @returns 同じ処理を行う場合true
 */
export const areShortcutsEquivalent = (shortcut1: string, shortcut2: string): boolean => {
  if (shortcut1 === shortcut2) {
    return true;
  }

  const alternatives1 = getAlternativeShortcuts(shortcut1);
  const alternatives2 = getAlternativeShortcuts(shortcut2);

  // いずれかのグループに両方が含まれていればtrue
  return alternatives1.some(alt => alternatives2.includes(alt));
};

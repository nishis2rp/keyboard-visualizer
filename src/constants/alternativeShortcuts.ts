import { RichShortcut } from '../types';

/**
 * 代替ショートカットのマッピング
 * ... (existing mappings) ...
 */
export const ALTERNATIVE_SHORTCUTS: Record<string, string[]> = {
  // === 基本操作 ===
  // コピー
  'Ctrl + C': ['Ctrl + Insert'],
  'Ctrl + Insert': ['Ctrl + C'],

  // 切り取り
  'Ctrl + X': ['Shift + Delete'],
  'Shift + Delete': ['Ctrl + X'],

  // 貼り付け
  'Ctrl + V': ['Shift + Insert'],
  'Shift + Insert': ['Ctrl + V'],

  // 元に戻す
  'Ctrl + Z': ['Alt + Backspace'],
  'Alt + Backspace': ['Ctrl + Z'],

  // やり直し
  'Ctrl + Y': ['Ctrl + Shift + Z'],
  'Ctrl + Shift + Z': ['Ctrl + Y'],

  // すべて選択
  'Ctrl + A': [],

  // 検索
  'Ctrl + F': [],

  // 上書き保存
  'Ctrl + S': [],

  // 開く
  'Ctrl + O': [],

  // 印刷
  'Ctrl + P': [],

  // === ウィンドウ・タブ操作 ===
  // ウィンドウを閉じる
  'Alt + F4': [],

  // タブを閉じる（ブラウザ）
  'Ctrl + W': ['Ctrl + F4'],
  'Ctrl + F4': ['Ctrl + W'],

  // 新しいタブ（ブラウザ）
  'Ctrl + T': [],

  // タブ切り替え（ブラウザ）
  'Ctrl + Tab': ['Ctrl + PageDown'],
  'Ctrl + PageDown': ['Ctrl + Tab'],
  'Ctrl + Shift + Tab': ['Ctrl + PageUp'],
  'Ctrl + PageUp': ['Ctrl + Shift + Tab'],

  // アプリケーション切り替え
  'Alt + Tab': [],

  // === Windows 11 操作 ===
  // スタートメニューを開く
  'Win': ['Ctrl + Esc'],
  'Ctrl + Esc': ['Win'],

  // === ブラウザ操作 ===
  // ページ更新
  'Ctrl + R': ['F5'],
  'F5': ['Ctrl + R'],

  // 強制更新
  'Ctrl + Shift + R': ['Ctrl + F5'],
  'Ctrl + F5': ['Ctrl + Shift + R'],

  // アドレスバーにフォーカス
  'Ctrl + L': ['Alt + D', 'F6'],
  'Alt + D': ['Ctrl + L', 'F6'],
  'F6': ['Ctrl + L', 'Alt + D'],

  // ブックマーク
  'Ctrl + D': [],

  // 履歴
  'Ctrl + H': [],

  // デベロッパーツール
  'Ctrl + Shift + I': ['F12'],
  'F12': ['Ctrl + Shift + I'],

  // 全画面
  'F11': [],

  // ズームイン
  'Ctrl + +': ['Ctrl + ='],
  'Ctrl + =': ['Ctrl + +'],

  // ズームアウト
  'Ctrl + -': [],

  // ズームリセット
  'Ctrl + 0': [],

  // === Excel操作 ===
  // セルの編集
  'F2': [],

  // 太字
  'Ctrl + B': ['Ctrl + 2'],
  'Ctrl + 2': ['Ctrl + B'],

  // 斜体
  'Ctrl + I': ['Ctrl + 3'],
  'Ctrl + 3': ['Ctrl + I'],

  // 下線
  'Ctrl + U': ['Ctrl + 4'],
  'Ctrl + 4': ['Ctrl + U'],

  // セルの書式設定
  'Ctrl + 1': [],

  // 名前を付けて保存
  'Ctrl + Shift + S': [],

  // 行全体を選択
  'Shift + Space': [],

  // 列全体を選択
  'Ctrl + Space': [],

  // すべてのセルを選択（Excel）
  'Ctrl + Shift + Space': [],

  // === macOS固有の代替 ===
  // コピー（Mac）
  'Cmd + C': [],

  // 切り取り（Mac）
  'Cmd + X': [],

  // 貼り付け（Mac）
  'Cmd + V': [],

  // 元に戻す（Mac）
  'Cmd + Z': [],

  // やり直し（Mac）
  'Cmd + Shift + Z': ['Cmd + Y'],

  // 全画面（Mac）
  'Cmd + Ctrl + F': [],

  // アプリケーション切り替え（Mac）
  'Cmd + Tab': [],

  // ブラウザ更新（Mac）
  'Cmd + R': [],

  // ブラウザ強制更新（Mac）
  'Cmd + Shift + R': [],

  // アドレスバー（Mac）
  'Cmd + L': [],

  // ズームイン（Mac）
  'Cmd + +': ['Cmd + ='],

  // ズームアウト（Mac）
  'Cmd + -': [],

  // ズームリセット（Mac）
  'Cmd + 0': [],

  // === Slack固有の代替 ===
  // 新規メッセージ
  'Ctrl + N': ['Shift + Ctrl + K'],
  'Shift + Ctrl + K': ['Ctrl + N'],

  // 次に移動
  'Ctrl + K': ['T'],
  'T': ['Ctrl + K'],

  // 直近のメッセージを編集
  'ArrowUp': ['Ctrl + ArrowUp'],
  'Ctrl + ArrowUp': ['ArrowUp'],

  // アクティビティ
  'Ctrl + Shift + 3': ['Shift + Ctrl + M'],
  'Shift + Ctrl + M': ['Ctrl + Shift + 3'],

  // === その他の代替 ===
  // 削除キー
  'Delete': ['Del'],
  'Del': ['Delete'],
};

/**
 * 指定されたショートカットの代替ショートカットをすべて取得
 * @param normalizedShortcut - 正規化されたショートカット
 * @param richShortcuts - (Optional) DBから取得したリッチショートカットのリスト
 * @returns 代替ショートカットの配列（元のショートカットも含む）
 */
export const getAlternativeShortcuts = (normalizedShortcut: string, richShortcuts?: RichShortcut[] | null): string[] => {
  // DB情報がある場合は、同じalternative_group_idを持つショートカットを探す
  if (richShortcuts) {
    // まず、入力されたショートカットに紐付くグループIDを探す
    // ※複数のアプリで同じキーが定義されている可能性があるため、最初に見つかったグループIDを採用
    const groupShortcut = richShortcuts.find(rs => rs.keys === normalizedShortcut && rs.alternative_group_id);
    if (groupShortcut) {
      const groupId = groupShortcut.alternative_group_id;
      // 同じグループIDを持つすべてのキーを取得
      const alts = richShortcuts
        .filter(rs => rs.alternative_group_id === groupId)
        .map(rs => rs.keys);
      return Array.from(new Set([normalizedShortcut, ...alts]));
    }
  }

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
 * @param richShortcuts - (Optional) DBから取得したリッチショートカットのリスト
 * @returns 同じ処理を行う場合true
 */
export const areShortcutsEquivalent = (shortcut1: string, shortcut2: string, richShortcuts?: RichShortcut[] | null): boolean => {
  if (shortcut1 === shortcut2) {
    return true;
  }

  const alternatives1 = getAlternativeShortcuts(shortcut1, richShortcuts);
  const alternatives2 = getAlternativeShortcuts(shortcut2, richShortcuts);

  // いずれかのグループに両方が含まれていればtrue
  return alternatives1.some(alt => alternatives2.includes(alt));
};

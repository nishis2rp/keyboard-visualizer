/**
 * Excelアプリ内では競合しないショートカット
 * Excelデスクトップアプリを使用する場合、これらはブラウザと競合しない
 */
export const EXCEL_APP_SAFE_SHORTCUTS = new Set([
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
]);
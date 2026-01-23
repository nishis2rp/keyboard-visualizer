// Slackショートカットデータを変換するスクリプト（重複対応版）
const data = `基本,新規メッセージ,"Ctrl + N または Shift + Ctrl + K"
基本,新しい canvas,"Ctrl + Shift + N"
基本,次に移動...,"Ctrl + K または T"
基本,検索,"Ctrl + G"
基本,現在の会話を検索する,"Ctrl + F"
基本,直近のメッセージを(空白のテキスト入力で)編集する,"↑ または Ctrl + ↑"
基本,直近のメッセージの送信を取り消す (空欄へのテキスト入力で),"Ctrl + Z"
基本,履歴に戻る,"Alt + ←"
基本,履歴に進む,"Alt + →"
基本,全未読,"Shift + Ctrl + A"
基本,スレッド,"Shift + Ctrl + T"
基本,ダイアログを閉じる,"Esc"
基本,ステータスを設定,"Shift + Ctrl + Y"
基本,ヘルプを開く,"F1"
基本,コンテキストメニューを開く,"Shift + F10"
サイドバー,表示 / 非表示,"Shift + Ctrl + D"
サイドバー,サイズ変更 (リサイザーにフォーカス),"← または →"
操作方法,ホーム,"Ctrl + Shift + 1"
操作方法,DM,"Ctrl + Shift + 2"
操作方法,アクティビティ,"Ctrl + Shift + 3 または Shift + Ctrl + M"
操作方法,後で,"Ctrl + Shift + 4"
操作方法,その他メニューを開く,"Ctrl + Shift + 0"
操作方法,メッセージ間でフォーカスを移動する,"▲ または ▼"
操作方法,フォーカスを次の項目に移動,"F6"
操作方法,フォーカスを前の項目に移動,"Shift + F6"
操作方法,アクションの実行・選択したオプションを「クリック」,"Enter"
操作方法,テキストサイズを大きくする,"Ctrl + ;"
操作方法,テキストサイズを小さくする,"Ctrl + -"
操作方法,スクロールアップ,"▲ または Page Up"
操作方法,スクロールダウン,"▼ または Page Down"
操作方法,前の日へスクロールする,"Shift + Page Up"
操作方法,次の日へスクロールする,"Shift + Page Down"
操作方法,右サイドバーを閉じる,"Ctrl + ."
操作方法,チャンネル情報,"Shift + Ctrl + I"
操作方法,チャンネル一覧,"Shift + Ctrl + L"
操作方法,チームディレクトリ,"Shift + Ctrl + E"
操作方法,フルスクリーン表示の切り替え,"F11"
操作方法,未読メッセージに移動する,"Ctrl + J"
操作方法,新しいウィンドウでサイドバー項目を開く,"Ctrl そしてクリック"
操作方法,新しいウィンドウで会話を開く,"Ctrl + Enter"
操作方法,ウィンドウを閉じる,"Ctrl + W"
操作方法,最後に閉じたウィンドウを開く,"Ctrl + Shift + W"
スクリーンリーダー,最近のメッセージをいくつか再生する,"Alt + 0 - 9"
スクリーンリーダー,全ワークスペースの通知の要約を再生する,"Ctrl + Alt + S"
メッセージング,テキストの現在行の先頭まで選択,"Shift + ↑"
メッセージング,テキストの現在行の最後まで選択,"Shift + ↓"
メッセージング,改行する,"Shift + Enter"
メッセージング,直近のメッセージ(またはフォーカスカード)にリアクションする,"Shift + Ctrl + _"
メッセージング,オートコンプリート@ユーザー名,"@"
メッセージング,オートコンプリートチャンネル,"#"
メッセージング,オートコンプリート絵文字,":"
メッセージング,書式設定：太字,"Ctrl + B"
メッセージング,書式設定：斜体,"Ctrl + I"
メッセージング,テキストに下線を引く,"Ctrl + U"
メッセージング,書式設定：取り消し線,"Shift + Ctrl + X"
メッセージング,書式設定：コードテキスト,"Shift + Ctrl + C"
メッセージング,書式設定：箇条書きリスト,"Shift + Ctrl + 8"
メッセージング,書式設定：番号付きリスト,"Shift + Ctrl + 7"
メッセージング,書式設定：引用,"Shift + Ctrl + 9"
メッセージング,コードブロックとしての書式選択,"Alt + Shift + Ctrl + c"
メッセージを未読または既読にする,現在のチャンネルのすべてのメッセージを既読にする,"Esc"
メッセージを未読または既読にする,全メッセージを既読にする,"Shift + Esc"
メッセージを未読または既読にする,メッセージを未読にする,"Alt + メッセージをクリック"
チャンネル & DM,前のチャンネルまたは DM,"Alt + ↑"
チャンネル & DM,次のチャンネルまたは DM,"Alt + ↓"
チャンネル & DM,前の未読チャンネルまたは DM,"Alt + Shift + ↑"
チャンネル & DM,次の未読チャンネルまたは DM,"Alt + Shift + ↓"
全未読,チャンネルを開く,"→"
全未読,チャンネルを折りたたむ,"←"
全未読,チャンネルを既読にする,"Esc"
全未読,前のチャンネル,"Shift + Page Up"
全未読,次のチャンネル,"Shift + Page Down"
ファイルとスニペット,ファイルを追加する,"Ctrl + O"
ファイルとスニペット,スニペットを作成する,"Shift + Ctrl + Enter"
ファイルとスニペット,すべてのダウンロードを表示する,"Shift + Ctrl + J"
ファイルとスニペット,ファイルを挿入する,"Ctrl + O"
ファイルとスニペット,カードビューで操作する,"Ctrl + Enter"
キーボードショートカット,番号付きリストスタイル,"Ctrl + Shift + 7"
キーボードショートカット,見出しとリストのスタイル切り替え,"Ctrl + @"
canvas の編集,コメントスレッドを表示する,"Ctrl + Alt + T"
canvas の編集,絵文字リアクションを表示する,"Ctrl + Alt + E"
canvas の編集,コンテキストメニューを開く,"Shift + F10"
canvas の編集,リーダー / 編集ビューを表示,"Ctrl + Alt + R"
canvas の編集,検索 / 次の検索結果,"Ctrl + F"
canvas の編集,前の検索結果,"Ctrl + Shift + F"
canvas の編集,リンクを挿入,"Ctrl + Shift + U"
canvas の編集,アンカーリンクをコピー,"Ctrl + Alt + Q"
canvas の編集,もとに戻す,"Ctrl + Z"
canvas の編集,やり直し,"Ctrl + Y"
canvas の編集,リスト項目を上へ移動,"Ctrl + Alt + ▲"
canvas の編集,リスト項目を下へ移動,"Ctrl + Alt + ▼"
canvas の編集,太字,"Ctrl + B"
canvas の編集,斜体,"Ctrl + I"
canvas の編集,下線,"Ctrl + U"
canvas の編集,取り消し線,"Ctrl + Shift + X"
canvas の編集,インラインコード,"Ctrl + Shift + C"
canvas の編集,段落（通常のテキスト）スタイル,"Ctrl + Alt + 0"
canvas の編集,大見出しスタイル,"Ctrl + Alt + 1"
canvas の編集,中見出しスタイル,"Ctrl + Alt + 2"
canvas の編集,小見出しスタイル,"Ctrl + Alt + 3"
canvas の編集,ブロック引用スタイル,"Ctrl + Shift + >"
canvas の編集,コードブロックスタイル,"Ctrl + Alt + Shift + C"
canvas の編集,チェックリストスタイル,"Ctrl + Shift + 9"
canvas の編集,箇条書きスタイル,"Ctrl + Shift + 8"
canvas の編集,番号付きリストスタイル,"Ctrl + Shift + 7"
ワークスペースの切り替え,次のワークスペース,"Ctrl + Tab"
ワークスペースの切り替え,前のワークスペース,"Ctrl + Shift + Tab"
ワークスペースの切り替え,特定のワークスペース,"Ctrl および 1〜9"
ワークスペースの切り替え,ワークスペーススイッチャーを開く,"Shift + Ctrl + S"
タブの切り替え中,次のタブ,"Ctrl + PageDown"
タブの切り替え中,前のタブ,"Ctrl + PageUp"
メッセージ内で使えるショートカット,自分のメッセージを編集する,"E"
メッセージ内で使えるショートカット,自分のメッセージを削除する,"Delete"
メッセージ内で使えるショートカット,絵文字リアクションを追加する,"R"
メッセージ内で使えるショートカット,スレッドを開く,"→ または T"
メッセージ内で使えるショートカット,ピン留めする / ピンを外す,"P"
メッセージ内で使えるショートカット,転送する,"F"
メッセージ内で使えるショートカット,「後で」の登録 / 削除,"A"
メッセージ内で使えるショートカット,このメッセージから未読としてマークする,"U"
メッセージ内で使えるショートカット,このメッセージについて後でリマインドする,"M"
メッセージ内で使えるショートカット,このメッセージへのリンクをコピーする,"L"
メッセージ内で使えるショートカット,このメッセージからテキストをコピーする,"Ctrl + C"
チャンネルセクション,すべてを折りたたむ / 展開する,"Alt + さらにセクションをクリック"
ハドルミーティング,ハドルミーティングの開始 / 終了を切り替える,"Ctrl + Shift + H"
ハドルミーティング,ハドルミーティングのミュート / ミュート解除を切り替える,"Ctrl + Shift + Space"`;

// キーを正規化する関数（App.jsxのsortKeysと同じロジック）
const normalizeKeyCombo = (keyCombo) => {
  const modifierOrder = { 'Ctrl': 1, 'Shift': 2, 'Alt': 3, 'Win': 4, 'Control': 1, 'Meta': 4 };

  // ' + ' で分割
  const keys = keyCombo.split(' + ').map(k => k.trim());

  // ソート
  keys.sort((a, b) => {
    const aOrder = modifierOrder[a] || 999;
    const bOrder = modifierOrder[b] || 999;
    return aOrder - bOrder;
  });

  // 結合
  return keys.join(' + ');
};

const lines = data.split('\n');
const shortcuts = {}; // キー -> [{category, action}] の形式

lines.forEach(line => {
  const match = line.match(/^([^,]+),([^,]+),"(.+)"$/);
  if (match) {
    const category = match[1].trim();
    const action = match[2].trim();
    let shortcutKeys = match[3].trim();

    // 「または」で区切られているショートカットを分割
    const keyVariations = shortcutKeys.split(/\s*または\s*/);

    keyVariations.forEach(key => {
      // 矢印記号を統一
      key = key.replace(/▲/g, '↑').replace(/▼/g, '↓');

      // 特殊な表記（クリック操作など）は除外
      if (!key.includes('クリック') && !key.includes('メッセージを')) {
        // キー組み合わせを正規化
        const normalizedKey = normalizeKeyCombo(key);

        if (!shortcuts[normalizedKey]) {
          shortcuts[normalizedKey] = [];
        }
        shortcuts[normalizedKey].push({ category, action });
      }
    });
  }
});

// 出力用のオブジェクトを作成
const output = {};
Object.keys(shortcuts).sort().forEach(key => {
  const entries = shortcuts[key];

  if (entries.length === 1) {
    // 単一の定義の場合
    const entry = entries[0];
    output[key] = `[${entry.category}] ${entry.action}`;
  } else {
    // 複数の定義がある場合、結合
    const descriptions = entries
      .map(e => `[${e.category}] ${e.action}`)
      .join(' / ');
    output[key] = descriptions;
  }
});

// JavaScript形式で出力
console.log('    slack: {');
const keys = Object.keys(output);
keys.forEach((key, index) => {
  const comma = (index === keys.length - 1) ? '' : ',';
  const escapedKey = key.replace(/'/g, "\\'");
  const escapedValue = output[key].replace(/'/g, "\\'");
  console.log(`      '${escapedKey}': '${escapedValue}'${comma}`);
});
console.log('    },');

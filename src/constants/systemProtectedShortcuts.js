/**
 * システムレベルで保護されているショートカット
 * これらのショートカットは、ブラウザのKeyboard Lock APIでもキャプチャできません
 * OSのセキュリティやシステムの安定性のために保護されています
 */
export const SYSTEM_PROTECTED_SHORTCUTS = new Set([
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

  // その他のシステム保護ショートカット
  // 環境により異なる場合があります
])

/**
 * ショートカットがシステムレベルで保護されているかチェック
 * @param {string} shortcut - ショートカット文字列（例: "Win + L"）
 * @returns {boolean} システム保護されている場合true
 */
export const isSystemProtected = (shortcut) => {
  return SYSTEM_PROTECTED_SHORTCUTS.has(shortcut)
}

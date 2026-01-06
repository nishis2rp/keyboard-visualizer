import {
  ALWAYS_PROTECTED_SHORTCUTS,
  FULLSCREEN_PREVENTABLE_SHORTCUTS,
  detectOS
} from '../constants/systemProtectedShortcuts';
import { allShortcuts } from '../data/shortcuts';

// OSを検出
const currentOS = detectOS();

/**
 * ショートカットキー文字列を正規化する
 * - キーをソートすることで、修飾キーの順序に依存しない比較を可能にする
 * - 'Win' キーは 'Meta' キーとして扱う (macOSのCmdキーとの統一)
 * - 修飾キーは大文字で統一
 * - メインキーのアルファベットは小文字で統一（テストケースに合わせる）
 * @param {string} shortcutString - 'Ctrl + Shift + A' のようなショートカット文字列
 * @returns {string} 正規化されたショートカット文字列
 */
export const normalizeShortcut = (shortcutString) => {
  if (!shortcutString) return '';

  const keys = shortcutString
    .replace(/ /g, '') // スペースを削除
    .split('+')
    .map(key => {
      const lowerKey = key.toLowerCase();
      // 'Win'キーは'Meta'に変換し、'Cmd'も'Meta'に変換
      if (lowerKey === 'win' || lowerKey === 'cmd') return 'Meta';
      // 修飾キーは最初が大文字で統一
      if (lowerKey === 'ctrl' || lowerKey === 'control') return 'Ctrl';
      if (lowerKey === 'alt') return 'Alt';
      if (lowerKey === 'shift') return 'Shift';
      if (lowerKey === 'meta') return 'Meta';
      // その他のアルファベットキーは大文字に統一（テストケースに合わせる）
      return key.length === 1 && /[a-zA-Z]/.test(key) ? key.toUpperCase() : key;
    });

  const modifiers = [];
  const mainKeys = [];

  keys.forEach(key => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === 'ctrl' || lowerKey === 'alt' || lowerKey === 'shift' || lowerKey === 'meta') {
      modifiers.push(key);
    } else {
      mainKeys.push(key);
    }
  });

  // 修飾キーをソート (Ctrl, Alt, Meta, Shiftの順)
  modifiers.sort((a, b) => {
    const order = { 'Ctrl': 1, 'Alt': 2, 'Meta': 3, 'Shift': 4 }; // MetaをShiftの前に
    return order[a] - order[b];
  });

  // メインキーと修飾キーを結合
  return [...modifiers, ...mainKeys].join('+');
};

/**
 * ユーザーが押したキーの配列をショートカット文字列に変換し、正規化する
 * @param {Set<string>} pressedCodes - 現在押されているキーのコードのセット (例: new Set(['ControlLeft', 'KeyA']))
 * @param {string} layout - キーボードレイアウト
 * @returns {string} 正規化されたショートカット文字列
 */
export const normalizePressedKeys = (pressedCodes, layout) => {
  const keys = Array.from(pressedCodes)
    .map(code => {
      // 修飾キーのコードを正規化された名前に変換
      if (code.startsWith('Control')) return 'Ctrl';
      if (code.startsWith('Shift')) return 'Shift';
      if (code.startsWith('Alt')) return 'Alt';
      if (code.startsWith('Meta')) return (currentOS === 'macos' ? 'Cmd' : 'Win'); // OSに応じてMetaキーの表示を調整
      
      // その他のキーはKeyboardEvent.codeからキー名を推測する
      // ここでは簡易的にKey/Digit/Numpadプレフィックスを削除し、アルファベットを小文字に
      let cleanKey = code.replace(/^(Key|Digit|Numpad)/, '');
      if (cleanKey.length === 1 && /[a-zA-Z]/.test(cleanKey)) {
        return cleanKey.toLowerCase(); // アルファベットは小文字に統一
      } else if (cleanKey.startsWith('Arrow')) {
        switch(cleanKey) { // 矢印キーは記号に変換
          case 'ArrowUp': return '↑';
          case 'ArrowDown': return '↓';
          case 'ArrowLeft': return '←';
          case 'ArrowRight': return '→';
          default: return cleanKey;
        }
      }
      return cleanKey;
    })
    .filter(Boolean); // 空のキーを除外

  // 重複を除外し、normalizeShortcutで最終的な正規化を行う
  const uniqueKeys = Array.from(new Set(keys));
  return normalizeShortcut(uniqueKeys.join('+'));
};


/**
 * ショートカットが安全に出題可能かチェックする
 * @param {string} shortcut - ショートカット文字列 (例: 'Ctrl + W')
 * @param {string} quizMode - クイズモード ('default' or 'hardcore')
 * @param {boolean} isFullscreen - フルスクリーンモードかどうか
 * @returns {boolean} 安全に出題可能であれば true
 */
const isShortcutSafe = (shortcut, quizMode, isFullscreen) => {
  const normalizedShortcut = normalizeShortcut(shortcut);

  // 常に保護されているショートカットは、どのモードでも安全ではない
  // normalizeShortcutでWin -> Meta に変換されるため、ALWAYS_PROTECTED_SHORTCUTSもMetaベースで比較
  if (ALWAYS_PROTECTED_SHORTCUTS.has(normalizedShortcut)) {
    return false;
  }

  // ハードコアモードでない場合
  if (quizMode !== 'hardcore') {
    // フルスクリーンで防げるショートカットは、フルスクリーンでなければ安全ではない
    if (FULLSCREEN_PREVENTABLE_SHORTCUTS.has(normalizedShortcut) && !isFullscreen) {
      return false;
    }
  }
  // ハードコアモードの場合は、ALWAYS_PROTECTED_SHORTCUTS以外は全て安全
  // デフォルトモードの場合、フルスクリーンならFULLSCREEN_PREVENTABLE_SHORTCUTSも安全
  return true;
};

/**
 * ショートカットから問題を作成する
 * @param {Object} shortcuts - アプリケーションのショートカット定義 (例: {'Ctrl+S': '保存'})
 * @param {string} quizMode - クイズモード ('default' or 'hardcore')
 * @param {boolean} isFullscreen - フルスクリーンモードかどうか
 * @returns {{question: string, correctShortcut: string} | null} 問題オブジェクト、またはショートカットがなければnull
 */
export const generateQuestion = (shortcuts, quizMode = 'default', isFullscreen = false) => {
  const shortcutEntries = Object.entries(shortcuts);

  if (shortcutEntries.length === 0) {
    return null;
  }

  // 安全なショートカットのみをフィルタリング
  const safeShortcuts = shortcutEntries.filter(([shortcut, _]) =>
    isShortcutSafe(shortcut, quizMode, isFullscreen)
  );

  if (safeShortcuts.length === 0) {
    console.warn('利用可能な安全なショートカットがありません。フィルタリング設定を確認してください。');
    return null;
  }

  const randomIndex = Math.floor(Math.random() * safeShortcuts.length);
  const [correctShortcut, description] = safeShortcuts[randomIndex];

  return {
    question: `${description} のショートカットは？`,
    correctShortcut: correctShortcut,
    normalizedCorrectShortcut: normalizeShortcut(correctShortcut),
  };
};

/**
 * ユーザーの回答が正しいかチェックする
 * @param {string} userAnswer - ユーザーが入力した正規化済みショートカット
 * @param {string} normalizedCorrectAnswer - 正解の正規化済みショートカット
 * @returns {boolean} 正しい場合は true
 */
export const checkAnswer = (userAnswer, normalizedCorrectAnswer) => {
  return userAnswer === normalizedCorrectAnswer;
};

// --- テスト用のエクスポート (開発時にのみ使用) ---
export const _testExports = process.env.NODE_ENV === 'test' ? { isShortcutSafe } : {};

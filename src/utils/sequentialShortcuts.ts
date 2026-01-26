/**
 * 順序押しショートカットのユーティリティ
 *
 * 順序押しショートカット: Alt + H + O + I のように、
 * 最初のキー（通常はAlt）を押したまま、他のキーを順番に押していくショートカット
 */

/**
 * ショートカットが順序押しかどうかを判定
 * @param shortcut - ショートカット文字列（例: "Alt + H + O + I"）
 * @param application - アプリケーション名（オプション）
 * @returns 順序押しの場合true
 */
export const isSequentialShortcut = (shortcut: string, application?: string): boolean => {
  if (!shortcut) return false;

  // Windows 11とmacOSは順押しショートカットを持たない（すべて同時押し）
  if (application === 'windows11' || application === 'macos') {
    return false;
  }

  // スペースを削除して分割
  const keys = shortcut.replace(/ /g, '').split('+');

  // Gmailの単独キーシーケンス（例: "g, i"）
  if (application === 'gmail' && shortcut.includes(',')) {
    return true;
  }

  // VS Codeの2段階コマンド（例: "Ctrl + K, Ctrl + S"）
  if (application === 'vscode' && shortcut.includes(',')) {
    return true;
  }

  // Excelのリボン操作（Alt + 文字キー3つ以上）
  if (application === 'excel') {
    const firstKeyLower = keys[0].toLowerCase();
    // Altで始まり、4つ以上のキー、かつ2番目以降が文字キー
    if (firstKeyLower === 'alt' && keys.length >= 4) {
      // 2番目以降がすべて1文字の英字かチェック
      const hasOnlyLetters = keys.slice(1).every(k => /^[a-zA-Z]$/.test(k));
      if (hasOnlyLetters) {
        return true;
      }
    }
  }

  return false;
};

/**
 * 順序押しショートカットのキーシーケンスを取得
 * @param shortcut - ショートカット文字列
 * @returns キーの配列（例: ['Alt', 'H', 'O', 'I']）
 */
export const getSequentialKeys = (shortcut: string): string[] => {
  if (!shortcut) return [];

  return shortcut
    .replace(/ /g, '')
    .split('+')
    .map(key => key.trim());
};

/**
 * 順序押しショートカットの表示用文字列を生成
 * @param shortcut - ショートカット文字列
 * @returns 表示用文字列（例: "Alt → H → O → I"）
 */
export const formatSequentialShortcut = (shortcut: string, application?: string): string => {
  if (!isSequentialShortcut(shortcut, application)) {
    return shortcut;
  }

  const keys = getSequentialKeys(shortcut);
  return keys.join(' → ');
};

/**
 * ユーザーのキー入力シーケンスを記録するクラス
 */
export class SequentialKeyRecorder {
  private sequence: string[] = [];
  private lastKeyTime: number = 0;
  private readonly TIMEOUT_MS = 3000; // 3秒でタイムアウト

  /**
   * キー入力を記録
   * @param key - 押されたキー
   * @returns 現在のシーケンス
   */
  addKey(key: string): string[] {
    const now = Date.now();

    // タイムアウトチェック
    if (this.sequence.length > 0 && now - this.lastKeyTime > this.TIMEOUT_MS) {
      this.reset();
    }

    this.sequence.push(key);
    this.lastKeyTime = now;

    return [...this.sequence];
  }

  /**
   * シーケンスをリセット
   */
  reset(): void {
    this.sequence = [];
    this.lastKeyTime = 0;
  }

  /**
   * 現在のシーケンスを取得
   */
  getSequence(): string[] {
    return [...this.sequence];
  }

  /**
   * シーケンスが期待されるキーシーケンスと一致するかチェック
   * @param expectedKeys - 期待されるキーの配列
   * @returns 一致する場合true
   */
  matches(expectedKeys: string[]): boolean {
    if (this.sequence.length !== expectedKeys.length) {
      return false;
    }

    // 大文字小文字を無視して比較
    return this.sequence.every((key, index) =>
      key.toLowerCase() === expectedKeys[index].toLowerCase()
    );
  }

  /**
   * シーケンスが期待されるキーシーケンスの途中まで一致しているかチェック
   * @param expectedKeys - 期待されるキーの配列
   * @returns 部分一致する場合true
   */
  isPartialMatch(expectedKeys: string[]): boolean {
    if (this.sequence.length > expectedKeys.length) {
      return false;
    }

    return this.sequence.every((key, index) =>
      key.toLowerCase() === expectedKeys[index].toLowerCase()
    );
  }
}

/**
 * 順序押しショートカットの判定
 * @param userSequence - ユーザーが入力したキーシーケンス
 * @param correctShortcut - 正解のショートカット文字列
 * @returns 正解の場合true
 */
export const checkSequentialShortcut = (
  userSequence: string[],
  correctShortcut: string,
  application?: string
): boolean => {
  if (!isSequentialShortcut(correctShortcut, application)) {
    return false;
  }

  const expectedKeys = getSequentialKeys(correctShortcut);

  if (userSequence.length !== expectedKeys.length) {
    return false;
  }

  return userSequence.every((key, index) =>
    key.toLowerCase() === expectedKeys[index].toLowerCase()
  );
};

/**
 * 順序押しショートカットのユーティリティ
 *
 * 順序押しショートカット: Alt + H + O + I のように、
 * 最初のキー（通常はAlt）を押したまま、他のキーを順番に押していくショートカット
 */

import { RichShortcut, AvailableShortcut } from '../types';

/**
 * 順序押しショートカットかどうかを判定
 *
 * データベースの press_type カラムを優先的に使用します。
 * カラムが利用できない場合は、以下の3つのパターンに基づいて判定します:
 * 1. Excel-style: Alt + H + O + I (修飾キーを押したまま順番に押す)
 * 2. VS Code-style: Ctrl + K, Ctrl + S (カンマで区切られた複数の組み合わせ)
 * 3. Gmail-style: g + i (シンプルな文字の連続)
 *
 * @param shortcut - ショートカット文字列、またはショートカットオブジェクト
 * @param application - アプリケーション名（オプション）
 * @returns 順序押しショートカットの場合true
 */
export const isSequentialShortcut = (
  shortcut: string | RichShortcut | AvailableShortcut | { press_type?: string; keys?: string },
  application?: string
): boolean => {
  if (!shortcut) return false;

  // 1. オブジェクトが渡され、press_type カラムがある場合はそれを使用（最優先）
  if (typeof shortcut === 'object' && 'press_type' in shortcut && shortcut.press_type) {
    return shortcut.press_type === 'sequential';
  }

  // 2. 文字列ベースのフォールバック判定
  const shortcutStr = typeof shortcut === 'string' 
    ? shortcut 
    : (('keys' in shortcut ? shortcut.keys : '') || '');
  
  if (!shortcutStr) return false;

  // VS Code-style: カンマで区切られている (例: Ctrl + K, Ctrl + S)
  if (shortcutStr.includes(',')) {
    return true;
  }

  // "then" で区切られている (例: Tab then Enter)
  if (shortcutStr.includes(' then ')) {
    return true;
  }

  // Excel-style: 3つ以上のキーが + で繋がれている (例: Alt + H + O + I)
  const keys = shortcutStr.split('+').map(k => k.trim());
  if (keys.length >= 3) {
    // 修飾キー（Ctrl, Alt, Shift, Meta, Cmd）で始まるかチェック
    const firstKey = keys[0].toLowerCase();
    const modifiers = ['ctrl', 'alt', 'shift', 'meta', 'cmd', 'control', 'option', 'command', '⌃', '⌥', '⇧', 'win'];
    if (modifiers.includes(firstKey)) {
      return true;
    }
  }

  // Gmail-style: 小文字の単一文字が + で繋がれている (例: g + i)
  // または単にスペースで区切られている
  if (keys.length >= 2) {
    const allSingleLetters = keys.every(k => /^[a-z]$/i.test(k));
    if (allSingleLetters) {
      return true;
    }
  }

  const app = typeof shortcut === 'object' && 'application' in shortcut ? shortcut.application : application;
  if (app === 'gmail' && shortcutStr.match(/^[a-z] [a-z]$/i)) {
    return true;
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

  // カンマ区切りの場合 (VS Code style)
  if (shortcut.includes(',')) {
    return shortcut.split(',').map(s => s.trim());
  }

  // "then" 区切りの場合
  if (shortcut.includes(' then ')) {
    return shortcut.split(' then ').map(s => s.trim());
  }

  // スペース区切りの場合 (Gmail style, ただし + を含まない場合)
  if (!shortcut.includes('+') && shortcut.trim().includes(' ')) {
    return shortcut.split(/\s+/).map(s => s.trim());
  }

  // デフォルト: + で分割
  return shortcut
    .split(/\s*\+\s*/)
    .map(key => key.trim());
};

/**
 * 順序押しショートカットの表示用文字列を生成
 * @param shortcut - ショートカット文字列
 * @param pressType - プレスタイプ（オプション）
 * @returns 表示用文字列（例: "Alt → H → O → I"）
 */
export const formatSequentialShortcut = (
  shortcut: string, 
  application?: string,
  pressType?: 'sequential' | 'simultaneous'
): string => {
  const isSequential = pressType 
    ? pressType === 'sequential'
    : isSequentialShortcut(shortcut, application);

  if (!isSequential) {
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
      key.toLowerCase().replace(/\s+/g, '') === expectedKeys[index].toLowerCase().replace(/\s+/g, '')
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
      key.toLowerCase().replace(/\s+/g, '') === expectedKeys[index].toLowerCase().replace(/\s+/g, '')
    );
  }
}

/**
 * 順序押しショートカットの判定
 * @param userSequence - ユーザーが入力したキーシーケンス
 * @param correctShortcut - 正解のショートカット文字列
 * @param pressType - 正解のプレスタイプ（オプション）
 * @returns 正解の場合true
 */
export const checkSequentialShortcut = (
  userSequence: string[],
  correctShortcut: string,
  application?: string,
  pressType?: 'sequential' | 'simultaneous'
): boolean => {
  const isSequential = pressType 
    ? pressType === 'sequential'
    : isSequentialShortcut(correctShortcut, application);

  if (!isSequential) {
    return false;
  }

  const expectedKeys = getSequentialKeys(correctShortcut);

  if (userSequence.length !== expectedKeys.length) {
    return false;
  }

  return userSequence.every((key, index) =>
    key.toLowerCase().replace(/\s+/g, '') === expectedKeys[index].toLowerCase().replace(/\s+/g, '')
  );
};

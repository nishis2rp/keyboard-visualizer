/**
 * 修飾キーのコードリスト
 */
export const MODIFIER_CODES = new Set([
  'ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight',
  'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'
]);

/**
 * Windowsキー(Metaキー)のコードリスト
 */
export const WINDOWS_KEY_CODES = new Set(['MetaLeft', 'MetaRight']);

/**
 * 修飾キーかどうかを判定する関数
 * @param code - キーコード (例: 'ControlLeft', 'ShiftRight', 'KeyA')
 * @returns 修飾キーの場合true
 */
export const isModifierKey = (code: string): boolean => MODIFIER_CODES.has(code);

/**
 * Windowsキー(Metaキー)かどうかを判定する関数
 * @param code - キーコード (例: 'MetaLeft', 'MetaRight')
 * @returns Windowsキーの場合true
 */
export const isWindowsKey = (code: string): boolean => WINDOWS_KEY_CODES.has(code);

/**
 * 修飾キーのコードベース表示順序
 */
export const MODIFIER_CODE_DISPLAY_ORDER: readonly string[] = [
  'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight',
  'ShiftLeft', 'ShiftRight', 'MetaLeft', 'MetaRight'
];

/**
 * 修飾キーのコードリスト
 */
export const MODIFIER_CODES = new Set(Array.from(MODIFIER_CODE_DISPLAY_ORDER));

/**
 * Windowsキー(Metaキー)のコードリスト
 */
export const WINDOWS_KEY_CODES = new Set(['MetaLeft', 'MetaRight']);

/**
 * 修飾キーの名前リスト（表示名ベース）
 */
export const MODIFIER_KEY_NAMES = new Set(['Ctrl', 'Shift', 'Alt', 'Cmd', 'Option', 'Meta', 'Win']);

/**
 * Windowsキーの名前リスト（表示名ベース）
 */
export const WINDOWS_KEY_NAMES = new Set(['Win']);

/**
 * 修飾キーのソート順序（KeyboardEvent.code）
 * データベースの規約 (Alt + Shift + ...) に合わせるため Alt を Shift より先に並べる
 */
export const MODIFIER_ORDER: Record<string, number> = {
  ControlLeft: 1, ControlRight: 1,
  AltLeft: 2, AltRight: 2,
  ShiftLeft: 3, ShiftRight: 3,
  MetaLeft: 4, MetaRight: 4,
};

/**
 * 修飾キーかどうかを判定する関数（コードベース）
 * @param code - キーコード (例: 'ControlLeft', 'ShiftRight', 'KeyA')
 * @returns 修飾キーの場合true
 */
export const isModifierKey = (code: string): boolean => MODIFIER_CODES.has(code);

/**
 * Windowsキー(Metaキー)かどうかを判定する関数（コードベース）
 * @param code - キーコード (例: 'MetaLeft', 'MetaRight')
 * @returns Windowsキーの場合true
 */
export const isWindowsKey = (code: string): boolean => WINDOWS_KEY_CODES.has(code);

/**
 * 修飾キーかどうかを判定する関数（名前ベース）
 * @param keyName - キー名 (例: 'Ctrl', 'Shift', 'Alt')
 * @returns 修飾キーの場合true
 */
export const isModifierKeyName = (keyName: string): boolean => MODIFIER_KEY_NAMES.has(keyName);

/**
 * Windowsキーかどうかを判定する関数（名前ベース）
 * @param keyName - キー名 (例: 'Win')
 * @returns Windowsキーの場合true
 */
export const isWindowsKeyName = (keyName: string): boolean => WINDOWS_KEY_NAMES.has(keyName);

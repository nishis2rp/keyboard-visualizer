/**
 * Modifier key definitions
 * Single source of truth for all modifier key configurations
 */

export type ModifierCode =
  | 'ControlLeft' | 'ControlRight'
  | 'ShiftLeft' | 'ShiftRight'
  | 'AltLeft' | 'AltRight'
  | 'MetaLeft' | 'MetaRight';

/**
 * All modifier key codes in display order
 */
export const MODIFIER_CODES: ModifierCode[] = [
  'ControlLeft',
  'ControlRight',
  'ShiftLeft',
  'ShiftRight',
  'AltLeft',
  'AltRight',
  'MetaLeft',
  'MetaRight',
];

/**
 * Set of modifier codes for fast lookup
 */
export const MODIFIER_CODES_SET = new Set<string>(MODIFIER_CODES);

/**
 * Modifier key display order (priority)
 * Lower number = displayed first
 */
export const MODIFIER_ORDER: Record<string, number> = {
  'ControlLeft': 1,
  'ControlRight': 1,
  'ShiftLeft': 2,
  'ShiftRight': 2,
  'AltLeft': 3,
  'AltRight': 3,
  'MetaLeft': 4,
  'MetaRight': 4,
};

/**
 * Check if a key code is a modifier key
 */
export const isModifierKey = (code: string): boolean => {
  return MODIFIER_CODES_SET.has(code);
};

/**
 * Get modifier key priority for sorting
 */
export const getModifierPriority = (code: string): number => {
  return MODIFIER_ORDER[code] || 999;
};

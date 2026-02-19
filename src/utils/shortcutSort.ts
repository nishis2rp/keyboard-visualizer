import { AvailableShortcut } from '../types';
import { countModifierKeys, getLastKey, getKeyboardLayoutIndex } from './keyboard';

/**
 * ソート順の種類
 */
export type SortOrder = 'keyboard' | 'alphabetical' | 'difficulty' | 'modifierCount';

/**
 * ショートカットを修飾キーの数とキーボード配列順でソート
 */
export const sortByModifierAndKeyboard = (a: AvailableShortcut, b: AvailableShortcut): number => {
  // 修飾キーの数で比較
  const aModifierCount = countModifierKeys(a.shortcut);
  const bModifierCount = countModifierKeys(b.shortcut);

  if (aModifierCount !== bModifierCount) {
    return aModifierCount - bModifierCount;
  }

  // キーボード配列順で比較
  const aLastKey = getLastKey(a.shortcut);
  const bLastKey = getLastKey(b.shortcut);

  const aIndex = getKeyboardLayoutIndex(aLastKey);
  const bIndex = getKeyboardLayoutIndex(bLastKey);

  if (aIndex !== bIndex) {
    return aIndex - bIndex;
  }

  // インデックスが同じ場合は文字列比較
  return aLastKey.localeCompare(bLastKey);
};

/**
 * ショートカットをアルファベット順でソート
 */
export const sortAlphabetically = (a: AvailableShortcut, b: AvailableShortcut): number => {
  return a.shortcut.localeCompare(b.shortcut);
};

/**
 * ショートカットを難易度順でソート
 */
export const sortByDifficulty = (a: AvailableShortcut, b: AvailableShortcut): number => {
  const difficultyOrder = { basic: 1, standard: 2, hard: 3, madmax: 4, allrange: 5 };
  const aOrder = difficultyOrder[a.difficulty] || 999;
  const bOrder = difficultyOrder[b.difficulty] || 999;
  return aOrder - bOrder;
};

/**
 * ショートカットを修飾キーの数でソート
 */
export const sortByModifierCount = (a: AvailableShortcut, b: AvailableShortcut): number => {
  const aCount = countModifierKeys(a.shortcut);
  const bCount = countModifierKeys(b.shortcut);
  return aCount - bCount;
};

/**
 * ショートカット配列を指定された順序でソート
 */
export const sortShortcuts = (shortcuts: AvailableShortcut[], order: SortOrder = 'keyboard'): AvailableShortcut[] => {
  const sortFunctions: Record<SortOrder, (a: AvailableShortcut, b: AvailableShortcut) => number> = {
    keyboard: sortByModifierAndKeyboard,
    alphabetical: sortAlphabetically,
    difficulty: sortByDifficulty,
    modifierCount: sortByModifierCount,
  };

  const sortFn = sortFunctions[order];
  return [...shortcuts].sort(sortFn);
};

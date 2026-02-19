import { RichShortcut, AvailableShortcut, ProtectionLevel, OSType } from '../types';
import { getOSSpecificKeys } from './keyboard';
import { normalizeShortcut } from './quizEngine';
import { getSequentialKeys } from './sequentialShortcuts';
import { detectOS } from './os';
import { PROTECTION_LEVELS, normalizeProtectionLevel, isBrowserConflictProtectionLevel } from '../constants/protectionLevels';

/**
 * ショートカットのフィルタリング条件インターフェース
 */
export interface ShortcutFilterOptions {
  /** フィルタリング対象のアプリケーションID */
  applicationId?: string;
  /** 保護レベルでフィルタリング */
  protectionLevel?: ProtectionLevel;
  /** 保護レベルの除外条件 */
  excludeProtectionLevel?: ProtectionLevel;
  /** 特定のキーを含むショートカットを除外 */
  excludeKeysContaining?: string[];
  /** カスタムフィルタ関数 */
  customFilter?: (shortcut: RichShortcut) => boolean;
}

/**
 * ショートカットをフィルタリングする汎用関数
 */
export const filterShortcuts = (
  shortcuts: RichShortcut[],
  options: ShortcutFilterOptions = {},
  os: OSType = detectOS()
): RichShortcut[] => {
  return shortcuts.filter(shortcut => {
    // アプリケーションIDでフィルタ
    if (options.applicationId && shortcut.application !== options.applicationId) {
      return false;
    }

    // 保護レベルでフィルタ
    if (options.protectionLevel) {
      const protectionLevel = os === 'macos'
        ? normalizeProtectionLevel(shortcut.macos_protection_level)
        : normalizeProtectionLevel(shortcut.windows_protection_level);

      if (protectionLevel !== normalizeProtectionLevel(options.protectionLevel)) {
        return false;
      }
    }

    // 保護レベルの除外
    if (options.excludeProtectionLevel) {
      const protectionLevel = os === 'macos'
        ? normalizeProtectionLevel(shortcut.macos_protection_level)
        : normalizeProtectionLevel(shortcut.windows_protection_level);

      if (protectionLevel === normalizeProtectionLevel(options.excludeProtectionLevel)) {
        return false;
      }
    }

    // 特定のキーを含むショートカットを除外
    if (options.excludeKeysContaining && options.excludeKeysContaining.length > 0) {
      const shortcutKeys = getOSSpecificKeys(shortcut, os);
      const normalized = normalizeShortcut(shortcutKeys);

      for (const excludeKey of options.excludeKeysContaining) {
        if (normalized.includes(excludeKey)) {
          return false;
        }
      }
    }

    // カスタムフィルタ
    if (options.customFilter && !options.customFilter(shortcut)) {
      return false;
    }

    return true;
  });
};

/**
 * ショートカットをAvailableShortcut形式に変換
 */
export const toAvailableShortcut = (shortcut: RichShortcut, os: OSType = detectOS()): AvailableShortcut => {
  return {
    ...shortcut,
    shortcut: getOSSpecificKeys(shortcut, os),
    windows_protection_level: normalizeProtectionLevel(shortcut.windows_protection_level),
    macos_protection_level: normalizeProtectionLevel(shortcut.macos_protection_level),
  };
};

/**
 * ショートカット配列を重複排除
 */
export const deduplicateShortcuts = (shortcuts: AvailableShortcut[]): AvailableShortcut[] => {
  return shortcuts.filter((item, index, self) =>
    index === self.findIndex(t => normalizeShortcut(t.shortcut) === normalizeShortcut(item.shortcut))
  );
};

/**
 * ブラウザ競合ショートカットを取得するためのフィルタオプション
 */
export const getBrowserConflictFilterOptions = (excludeKeys: string[] = []): ShortcutFilterOptions => {
  return {
    applicationId: 'chrome',
    protectionLevel: PROTECTION_LEVELS.PREVENTABLE_FULLSCREEN,
    excludeKeysContaining: ['Win', 'Cmd', ...excludeKeys],
  };
};

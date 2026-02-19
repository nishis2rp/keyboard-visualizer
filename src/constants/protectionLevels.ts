import { ProtectionLevel } from '../types';

/**
 * 保護レベル定数
 */
export const PROTECTION_LEVELS = {
  NONE: 'none' as ProtectionLevel,
  PREVENTABLE_FULLSCREEN: 'preventable_fullscreen' as ProtectionLevel,
  FULLSCREEN_PREVENTABLE: 'fullscreen-preventable' as ProtectionLevel, // 後方互換性のため
  ALWAYS_PROTECTED: 'always-protected' as ProtectionLevel,
} as const;

/**
 * 保護レベルの正規化
 * fullscreen-preventable → preventable_fullscreen
 */
export const normalizeProtectionLevel = (level: ProtectionLevel | null | undefined): ProtectionLevel => {
  if (!level) return PROTECTION_LEVELS.NONE;
  if (level === 'fullscreen-preventable') return PROTECTION_LEVELS.PREVENTABLE_FULLSCREEN;
  return level;
};

/**
 * ブラウザ競合検出の対象となる保護レベルかチェック
 */
export const isBrowserConflictProtectionLevel = (level: ProtectionLevel | null | undefined): boolean => {
  const normalized = normalizeProtectionLevel(level);
  return normalized === PROTECTION_LEVELS.PREVENTABLE_FULLSCREEN;
};

/**
 * 特定のアプリケーションをブラウザ競合検出から除外するかチェック
 */
export const shouldExcludeFromBrowserConflictDetection = (appId: string): boolean => {
  // Chromeアプリ自体は競合検出の対象外
  return appId === 'chrome';
};

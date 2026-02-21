import { memo, useMemo } from 'react'
import { isModifierKeyName, isWindowsKeyName } from '../../utils/keyUtils'
import { detectOS } from '../../utils/os'
import { EXCEL_APP_SAFE_SHORTCUTS } from '../../constants/systemProtectedShortcuts'
import { ShortcutDifficulty, ProtectionLevel } from '../../types'
import { getSequentialKeys } from '../../utils/sequentialShortcuts'
import { AppIcon } from '../common/AppIcon'
import { useLanguage } from '../../context/LanguageContext'
import { useBookmarks } from '../../hooks'
import { useAuth } from '../../context/AuthContext'
import { 
  DIFFICULTIES, 
  PROTECTION_LEVELS, 
  PRESS_TYPES, 
  normalizeProtectionLevel 
} from '../../constants'
import styles from './ShortcutCard.module.css'

const CURRENT_OS = detectOS();

interface ShortcutCardProps {
  id?: number;
  shortcut: string;
  description: string;
  appContext?: string | null;
  showDebugLog?: boolean;
  windows_protection_level?: ProtectionLevel;
  macos_protection_level?: ProtectionLevel;
  difficulty?: ShortcutDifficulty;
  press_type?: 'sequential' | 'simultaneous';
  isBrowserConflict?: boolean;
  compact?: boolean;
}

const ShortcutCard = memo<ShortcutCardProps>(({ id, shortcut, description, appContext = null, showDebugLog = false, windows_protection_level = 'none', macos_protection_level = 'none', difficulty, press_type, isBrowserConflict = false, compact = false }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const bookmarked = useMemo(() => id ? isBookmarked(id) : false, [id, isBookmarked]);

  // 難易度表示のテキストとクラスを取得（オブジェクトマッピングで簡略化）
  const difficultyInfo = useMemo(() => {
    const difficultyMap = {
      [DIFFICULTIES.BASIC]: { label: t.shortcutCard.basic.toUpperCase(), class: styles.basic },
      [DIFFICULTIES.STANDARD]: { label: t.shortcutCard.standard.toUpperCase(), class: styles.standard },
      [DIFFICULTIES.HARD]: { label: t.shortcutCard.hard.toUpperCase(), class: styles.hard },
      [DIFFICULTIES.MADMAX]: { label: t.shortcutCard.madmax.toUpperCase(), class: styles.madmax },
      [DIFFICULTIES.ALLRANGE]: { label: 'ALL', class: styles.allrange }
    };
    return difficulty ? difficultyMap[difficulty] || { label: '', class: '' } : { label: '', class: '' };
  }, [difficulty, t.shortcutCard]);

  const effectiveProtectionLevel = useMemo((): ProtectionLevel => {
    // 明示的にブラウザ競合として指定されている場合
    if (isBrowserConflict) {
      return 'browser-conflict';
    }

    // Excel app内では安全なショートカットは保護レベルをnoneにする
    if (appContext === 'excel' && EXCEL_APP_SAFE_SHORTCUTS.has(shortcut)) {
      return PROTECTION_LEVELS.NONE;
    }

    // OS別の保護レベルを取得（macOS以外はWindowsの保護レベルを使用）
    const protectionLevel = normalizeProtectionLevel(
      CURRENT_OS === 'macos' ? macos_protection_level : windows_protection_level
    );

    // 常時保護されているショートカットは最優先
    if (protectionLevel === PROTECTION_LEVELS.ALWAYS_PROTECTED) {
      return PROTECTION_LEVELS.ALWAYS_PROTECTED;
    }

    // 正規化された保護レベルを返す
    return protectionLevel || PROTECTION_LEVELS.NONE;
  }, [shortcut, appContext, windows_protection_level, macos_protection_level, isBrowserConflict]);

  // カードのスタイルクラス（簡略化）
  const cardClassName = useMemo(() =>
    [
      styles.card,
      compact && styles.compact,
      effectiveProtectionLevel === PROTECTION_LEVELS.PREVENTABLE_FULLSCREEN && styles.preventableFullscreen,
      effectiveProtectionLevel === PROTECTION_LEVELS.ALWAYS_PROTECTED && styles.alwaysProtected,
      effectiveProtectionLevel === 'browser-conflict' && styles.browserConflict
    ].filter(Boolean).join(' ')
  , [effectiveProtectionLevel, compact]);

  // ツールチップテキスト
  const tooltipText = useMemo(() => {
    if (effectiveProtectionLevel === PROTECTION_LEVELS.ALWAYS_PROTECTED) return `⚠️ ${t.shortcutCard.protected}`;
    if (effectiveProtectionLevel === 'browser-conflict') return `🌐 ${t.shortcutCard.browserConflict || 'ブラウザショートカットと競合（全画面モードで解消）'}`;
    if (effectiveProtectionLevel === PROTECTION_LEVELS.PREVENTABLE_FULLSCREEN) return `ℹ️ ${t.shortcutCard.preventableInFullscreen}`;
    return '';
  }, [effectiveProtectionLevel, t.shortcutCard]);

  // ショートカットキーのパーツ分割
  const keyParts = useMemo(() => {
    if (press_type === PRESS_TYPES.SEQUENTIAL) {
      return getSequentialKeys(shortcut);
    }
    return shortcut.split(' + ');
  }, [shortcut, press_type]);

  const isSequential = press_type === PRESS_TYPES.SEQUENTIAL;

  return (
    <div className={cardClassName} title={tooltipText}>
      <div className={styles.header}>
        {isSequential && (
          <span className={styles.sequentialIcon} title="順押し">▶</span>
        )}
        <div className={styles.shortcutCombo}>
          {keyParts.map((part, index) => (
            <div key={index} style={{ display: 'contents' }}>
              {index > 0 && (
                <span className={isSequential ? styles.sequentialArrow : styles.separator}>
                  {isSequential ? '→' : '+'}
                </span>
              )}
              <span
                className={`
                  ${styles.key} 
                  ${isModifierKeyName(part) ? styles.modifierKey : ''}
                  ${isWindowsKeyName(part) ? styles.windowsKey : ''}
                  ${isSequential ? styles.sequentialKey : ''}
                `}
              >
                {part}
              </span>
            </div>
          ))}
        </div>

        {/* ブックマークボタン */}
        {user && id && (
          <button 
            className={`${styles.bookmarkButton} ${bookmarked ? styles.isBookmarked : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(id);
            }}
            aria-label={bookmarked ? "ブックマーク解除" : "ブックマーク"}
          >
            {bookmarked ? '★' : '☆'}
          </button>
        )}
      </div>

      {!compact && (
        <>
          <div className={styles.description}>
            {description}
          </div>

          {difficultyInfo.label && (
            <div className={`${styles.difficultyBadge} ${difficultyInfo.class}`}>
              {difficulty && <AppIcon appId={difficulty} size={12} className={styles.difficultyIcon} />}
              {difficultyInfo.label}
            </div>
          )}
        </>
      )}
    </div>
  )
})

ShortcutCard.displayName = 'ShortcutCard'

export default ShortcutCard

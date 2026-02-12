import { memo, useMemo } from 'react'
import { isModifierKeyName, isWindowsKeyName } from '../../utils/keyUtils'
import { detectOS } from '../../utils/os'
import { EXCEL_APP_SAFE_SHORTCUTS } from '../../constants/systemProtectedShortcuts'
import { ShortcutDifficulty } from '../../types'
import { getSequentialKeys } from '../../utils/sequentialShortcuts'
import { AppIcon } from '../common/AppIcon'
import { useLanguage } from '../../context/LanguageContext'
import styles from './ShortcutCard.module.css'

const CURRENT_OS = detectOS();

interface ShortcutCardProps {
  shortcut: string;
  description: string;
  appContext?: string | null;
  showDebugLog?: boolean;
  windows_protection_level?: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen';
  macos_protection_level?: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen';
  difficulty?: ShortcutDifficulty;
  press_type?: 'sequential' | 'simultaneous';
}

const ShortcutCard = memo<ShortcutCardProps>(({ shortcut, description, appContext = null, showDebugLog = false, windows_protection_level = 'none', macos_protection_level = 'none', difficulty, press_type }) => {
  const { t } = useLanguage();

  // 難易度表示のテキストとクラスを取得（オブジェクトマッピングで簡略化）
  const difficultyInfo = useMemo(() => {
    const difficultyMap = {
      basic: { label: t.shortcutCard.basic.toUpperCase(), class: styles.basic },
      standard: { label: t.shortcutCard.standard.toUpperCase(), class: styles.standard },
      hard: { label: t.shortcutCard.hard.toUpperCase(), class: styles.hard },
      madmax: { label: t.shortcutCard.madmax.toUpperCase(), class: styles.madmax },
      allrange: { label: 'ALL', class: styles.allrange }
    };
    return difficulty ? difficultyMap[difficulty] || { label: '', class: '' } : { label: '', class: '' };
  }, [difficulty, t.shortcutCard]);

  const effectiveProtectionLevel = useMemo((): 'none' | 'preventable_fullscreen' | 'always-protected' => {
    // Excel app内では安全なショートカットは保護レベルをnoneにする
    if (appContext === 'excel' && EXCEL_APP_SAFE_SHORTCUTS.has(shortcut)) {
      return 'none';
    }

    // OS別の保護レベルを取得（macOS以外はWindowsの保護レベルを使用）
    const protectionLevel = CURRENT_OS === 'macos' ? macos_protection_level : windows_protection_level;

    // 表記の正規化: fullscreen-preventable → preventable_fullscreen
    return protectionLevel === 'fullscreen-preventable' ? 'preventable_fullscreen' : (protectionLevel || 'none');
  }, [shortcut, appContext, windows_protection_level, macos_protection_level]);

  // カードのスタイルクラス（簡略化）
  const cardClassName = useMemo(() =>
    [
      styles.card,
      effectiveProtectionLevel === 'preventable_fullscreen' && styles.preventableFullscreen,
      effectiveProtectionLevel === 'always-protected' && styles.alwaysProtected
    ].filter(Boolean).join(' ')
  , [effectiveProtectionLevel]);

  // ツールチップテキスト
  const tooltipText = useMemo(() => {
    if (effectiveProtectionLevel === 'always-protected') return `⚠️ ${t.shortcutCard.protected}`;
    if (effectiveProtectionLevel === 'preventable_fullscreen') return `ℹ️ ${t.shortcutCard.preventableInFullscreen}`;
    return '';
  }, [effectiveProtectionLevel, t.shortcutCard]);

  // ショートカットキーのパーツ分割
  const keyParts = useMemo(() => {
    if (press_type === 'sequential') {
      return getSequentialKeys(shortcut);
    }
    return shortcut.split(' + ');
  }, [shortcut, press_type]);

  const isSequential = press_type === 'sequential';

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
      </div>
      
      <div className={styles.description}>
        {description}
      </div>

      {difficultyInfo.label && (
        <div className={`${styles.difficultyBadge} ${difficultyInfo.class}`}>
          {difficulty && <AppIcon appId={difficulty} size={12} className={styles.difficultyIcon} />}
          {difficultyInfo.label}
        </div>
      )}
    </div>
  )
})

ShortcutCard.displayName = 'ShortcutCard'

export default ShortcutCard

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

  // 難易度表示のテキストとクラスを取得
  const difficultyInfo = useMemo(() => {
    switch (difficulty) {
      case 'basic': return { label: t.shortcutCard.basic.toUpperCase(), class: styles.basic };
      case 'standard': return { label: t.shortcutCard.standard.toUpperCase(), class: styles.standard };
      case 'hard': return { label: t.shortcutCard.hard.toUpperCase(), class: styles.hard };
      case 'madmax': return { label: t.shortcutCard.madmax.toUpperCase(), class: styles.madmax };
      case 'allrange': return { label: 'ALL', class: styles.allrange };
      default: return { label: '', class: '' };
    }
  }, [difficulty, t.shortcutCard]);

  const effectiveProtectionLevel = useMemo((): 'none' | 'preventable_fullscreen' | 'always-protected' => {
    if (appContext === 'excel' && EXCEL_APP_SAFE_SHORTCUTS.has(shortcut)) {
      return 'none';
    }

    let protectionLevel: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen';
    if (CURRENT_OS === 'windows') {
      protectionLevel = windows_protection_level;
    } else if (CURRENT_OS === 'macos') {
      protectionLevel = macos_protection_level;
    } else {
      protectionLevel = windows_protection_level;
    }

    if (protectionLevel === 'fullscreen-preventable') {
      return 'preventable_fullscreen';
    }
    return protectionLevel || 'none';
  }, [shortcut, appContext, windows_protection_level, macos_protection_level]);

  // カードのスタイルクラス
  const cardClassName = useMemo(() => {
    const classes = [styles.card];
    if (effectiveProtectionLevel === 'preventable_fullscreen') classes.push(styles.preventableFullscreen);
    if (effectiveProtectionLevel === 'always-protected') classes.push(styles.alwaysProtected);
    return classes.join(' ');
  }, [effectiveProtectionLevel]);

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

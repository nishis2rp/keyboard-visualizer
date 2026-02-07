import { memo, useMemo } from 'react';
import { getSingleKeyShortcuts } from '../../utils';
import ShortcutCard from '../ShortcutCard';
import { getCodeDisplayName } from '../../utils/keyMapping';
import {
  MODIFIER_CODE_DISPLAY_ORDER,
  MODIFIER_CODES,
  isModifierKey,
  isWindowsKey
} from '../../utils/keyUtils';
import { AvailableShortcut, RichShortcut } from '../../types';
import styles from './KeyDisplay.module.css';

interface KeyDisplayProps {
  pressedKeys?: Set<string>;
  specialKeys?: Set<string>;
  description?: string | null;
  availableShortcuts?: AvailableShortcut[];
  selectedApp?: string;
  keyboardLayout?: string;
  richShortcuts?: RichShortcut[];
}

const KeyDisplay = memo<KeyDisplayProps>(({ pressedKeys = new Set(), specialKeys = new Set(), description, availableShortcuts = [], selectedApp, richShortcuts = [], keyboardLayout }) => {
  // Shiftキーが押されているか判定
  const shiftPressed = useMemo(
    () => pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight'),
    [pressedKeys]
  );

  // pressedKeysを表示用に変換・ソート
  const sortedCodes = useMemo(
    () => Array.from(pressedKeys).sort((a: string, b: string) => {
      const aIndex = MODIFIER_CODE_DISPLAY_ORDER.indexOf(a)
      const bIndex = MODIFIER_CODE_DISPLAY_ORDER.indexOf(b)

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      return 0
    }),
    [pressedKeys]
  )

  // 修飾キーのみが押されているかチェック
  const isOnlyModifierKeys = useMemo(
    () => sortedCodes.every((code: string) => MODIFIER_CODES.has(code)),
    [sortedCodes]
  )

  // キーが押されていない場合：単独キーショートカットを表示
  if (pressedKeys.size === 0) {
    const singleKeyShortcuts = getSingleKeyShortcuts(richShortcuts, selectedApp || '')

    if (singleKeyShortcuts.length > 0) {
      return (
        <div className={`${styles.container} ${styles.active}`}>
          <div className={styles.header}>
            <h3 className={styles.title}>
              <span className={styles.descriptionIcon}>{selectedApp === 'gmail' ? '📧' : '⌨️'}</span>
              {selectedApp === 'gmail'
                ? 'Gmail 単独キーショートカット'
                : '単独キーショートカット'
              }
            </h3>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span>▶</span>
                <span>順押し</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendIcon} ${styles.blueBorder}`}></span>
                <span>全画面で防げる</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendIcon} ${styles.redBorder}`}></span>
                <span>システム保護</span>
              </div>
            </div>
          </div>
          <div className={styles.grid}>
            {singleKeyShortcuts.map((item, index) => (
              <ShortcutCard
                key={index}
                shortcut={item.shortcut}
                description={item.description}
                appContext={selectedApp}
                windows_protection_level={item.windows_protection_level}
                macos_protection_level={item.macos_protection_level}
                difficulty={item.difficulty}
                press_type={item.press_type}
              />
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p className={styles.instruction}>キーを押してください...</p>
        </div>
      </div>
    )
  }

  // 完全なショートカットが押されている場合（説明がある）
  // ただし、修飾キーのみの場合は、利用可能なショートカット一覧も表示
  if (description && (!isOnlyModifierKeys || availableShortcuts.length === 0)) {
    const currentShortcut = availableShortcuts.find(s => s.description === description);
    const difficulty = currentShortcut?.difficulty || 'basic';

    const difficultyConfig = {
      basic: { label: 'BASIC', color: '#ecfdf5', text: '#059669' },
      standard: { label: 'STANDARD', color: '#eff6ff', text: '#2563eb' },
      hard: { label: 'HARD', color: '#fff7ed', text: '#d97706' },
      madmax: { label: 'MADMAX', color: '#fef2f2', text: '#dc2626' },
      allrange: { label: 'ALL', color: '#f5f3ff', text: '#7c3aed' }
    };
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.basic;

    return (
      <div className={`${styles.container} ${styles.active}`}>
        <div className={styles.pressedKeysContainer}>
          <div className={styles.keysWrapper}>
            {sortedCodes.map((code, index) => (
              <div key={`${code}-${index}`} style={{ display: 'contents' }}>
                {index > 0 && <span className={styles.plus}>+</span>}
                <div className={`
                  ${styles.key}
                  ${isWindowsKey(code) ? styles.windowsKey : ''}
                  ${isModifierKey(code) ? styles.modifierKey : ''}
                `}>
                  {getCodeDisplayName(code, null, keyboardLayout, shiftPressed)}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.descriptionInline}>
            <span className={styles.descriptionIcon}>💡</span> {description}
          </div>
          <div 
            className={styles.difficultyBadge}
            style={{ backgroundColor: config.color, color: config.text }}
          >
            {config.label}
          </div>
        </div>
      </div>
    )
  }

  // 修飾キーのみが押されている場合、または利用可能なショートカット一覧を表示
  return (
    <div className={`${styles.container} ${styles.active}`}>
      <div className={styles.pressedKeysContainer}>
        <div className={styles.keysWrapper}>
          {sortedCodes.map((code, index) => (
            <div key={`${code}-${index}`} style={{ display: 'contents' }}>
              {index > 0 && <span className={styles.plus}>+</span>}
              <div className={`
                ${styles.key}
                ${isWindowsKey(code) ? styles.windowsKey : ''}
                ${isModifierKey(code) ? styles.modifierKey : ''}
              `}>
                {getCodeDisplayName(code, null, keyboardLayout, shiftPressed)}
              </div>
            </div>
          ))}
        </div>
        {availableShortcuts.length === 0 && (
          <div className={styles.descriptionInline} style={{ opacity: 0.6 }}>
            <span className={styles.descriptionIcon}>ℹ️</span> ショートカットが見つかりません
          </div>
        )}
      </div>
      {availableShortcuts.length > 0 && (
        <>
          <div className={styles.header}>
            <h3 className={styles.title}>利用可能なショートカット</h3>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span>▶</span>
                <span>順押し</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendIcon} ${styles.blueBorder}`}></span>
                <span>全画面で防げる</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendIcon} ${styles.redBorder}`}></span>
                <span>システム保護</span>
              </div>
            </div>
          </div>
          <div className={styles.grid}>
            {availableShortcuts.map((item, index) => (
              <ShortcutCard
                key={index}
                shortcut={item.shortcut}
                description={item.description}
                appContext={selectedApp}
                windows_protection_level={item.windows_protection_level}
                macos_protection_level={item.macos_protection_level}
                difficulty={item.difficulty}
                press_type={item.press_type}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
})

KeyDisplay.displayName = 'KeyDisplay'

export default KeyDisplay;
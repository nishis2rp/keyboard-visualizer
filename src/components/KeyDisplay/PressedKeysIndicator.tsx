import { memo, useMemo } from 'react';
import { getCodeDisplayName } from '../../utils/keyMapping';
import {
  MODIFIER_CODE_DISPLAY_ORDER,
  MODIFIER_CODES,
  isModifierKey,
  isWindowsKey
} from '../../utils/keyUtils';
import { AvailableShortcut } from '../../types';
import { AppIcon } from '../common/AppIcon';
import styles from './KeyDisplay.module.css';

interface PressedKeysIndicatorProps {
  pressedKeys?: Set<string>;
  description?: string | null;
  currentShortcut?: AvailableShortcut | null;
  availableShortcuts?: AvailableShortcut[];
  keyboardLayout?: string;
}

const PressedKeysIndicator = memo<PressedKeysIndicatorProps>(({
  pressedKeys = new Set(),
  description,
  currentShortcut,
  availableShortcuts = [],
  keyboardLayout
}) => {
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

  // キーが押されていない場合
  if (pressedKeys.size === 0) {
    return (
      <div className={`${styles.container} ${styles.containerPressedKeys}`}>
        <div className={styles.emptyState}>
          <p className={styles.instruction}>キーを押してください...</p>
        </div>
      </div>
    )
  }

  // 完全なショートカットが押されている場合（説明がある）
  if (description && (!isOnlyModifierKeys || availableShortcuts.length === 0)) {
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
      <div className={`${styles.container} ${styles.containerPressedKeys} ${styles.active}`}>
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
            <AppIcon appId={difficulty} size={12} className={styles.difficultyIcon} />
            {config.label}
          </div>
        </div>
      </div>
    )
  }

  // 修飾キーのみが押されている場合
  return (
    <div className={`${styles.container} ${styles.containerPressedKeys} ${styles.active}`}>
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
    </div>
  )
})

PressedKeysIndicator.displayName = 'PressedKeysIndicator'

export default PressedKeysIndicator;

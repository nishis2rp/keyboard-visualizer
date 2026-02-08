import { memo } from 'react';
import { getSingleKeyShortcuts } from '../../utils';
import ShortcutCard from '../ShortcutCard';
import { AvailableShortcut, RichShortcut } from '../../types';
import styles from './KeyDisplay.module.css';

interface ShortcutsListProps {
  pressedKeys?: Set<string>;
  availableShortcuts?: AvailableShortcut[];
  selectedApp?: string;
  richShortcuts?: RichShortcut[];
  description?: string | null;
}

const ShortcutsList = memo<ShortcutsListProps>(({
  pressedKeys = new Set(),
  availableShortcuts = [],
  selectedApp,
  richShortcuts = [],
  description
}) => {
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

    return null;
  }

  // 完全なショートカットが押されている場合は何も表示しない
  if (description) {
    return null;
  }

  // 修飾キーのみが押されている場合、利用可能なショートカット一覧を表示
  if (availableShortcuts.length > 0) {
    return (
      <div className={`${styles.container} ${styles.active}`}>
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
      </div>
    )
  }

  return null;
})

ShortcutsList.displayName = 'ShortcutsList'

export default ShortcutsList;

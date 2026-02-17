import { memo } from 'react';
import { MODIFIER_CODES } from '../../utils/keyUtils';
import ShortcutCard from '../ShortcutCard';
import { AvailableShortcut, RichShortcut } from '../../types';
import { getLocalizedDescription } from '../../utils/i18n';
import { useLanguage } from '../../context/LanguageContext';
import styles from './KeyDisplay.module.css';

interface ShortcutsListProps {
  pressedKeys?: Set<string>;
  availableShortcuts?: AvailableShortcut[];
  selectedApp?: string;
  richShortcuts?: RichShortcut[];
  singleKeyShortcuts?: AvailableShortcut[];
  description?: string | null;
}

const ShortcutsList = memo<ShortcutsListProps>(({
  pressedKeys = new Set(),
  availableShortcuts = [],
  selectedApp,
  singleKeyShortcuts = [],
  description
}) => {
  const { language, t } = useLanguage();
  
  // キーが押されていない場合：渡されたメモ化済みの単独キーショートカットを表示
  if (pressedKeys.size === 0) {
    if (singleKeyShortcuts.length > 0) {
      return (
        <div className={`${styles.container} ${styles.active}`}>
          <div className={styles.header}>
            <h3 className={styles.title}>
              <span className={styles.descriptionIcon}>{selectedApp === 'gmail' ? '📧' : '⌨️'}</span>
              {selectedApp === 'gmail'
                ? t.normalMode.gmailSingleKeyShortcuts
                : t.normalMode.singleKeyShortcuts
              }
            </h3>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span>▶</span>
                <span>{t.normalMode.sequential}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendIcon} ${styles.blueBorder}`}></span>
                <span>{t.normalMode.preventableInFullscreen}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendIcon} ${styles.redBorder}`}></span>
                <span>{t.normalMode.systemProtected}</span>
              </div>
            </div>
          </div>
          <div className={styles.grid}>
            {singleKeyShortcuts.map((item, index) => (
              <ShortcutCard
                key={`${item.id}-${index}`}
                shortcut={item.shortcut}
                description={getLocalizedDescription(item, language)}
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

  // 修飾キーのみが押されているかをチェック
  const isOnlyModifierKeys = Array.from(pressedKeys).every(key => MODIFIER_CODES.has(key));

  if (description && !isOnlyModifierKeys) {
    return null;
  }

  if (availableShortcuts.length > 0) {
    return (
      <div className={`${styles.container} ${styles.active}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>{t.normalMode.availableShortcuts}</h3>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span>▶</span>
              <span>{t.normalMode.sequential}</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendIcon} ${styles.blueBorder}`}></span>
              <span>{t.normalMode.preventableInFullscreen}</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendIcon} ${styles.redBorder}`}></span>
              <span>{t.normalMode.systemProtected}</span>
            </div>
          </div>
        </div>
        <div className={styles.grid}>
          {availableShortcuts.map((item, index) => (
            <ShortcutCard
              key={`${item.id}-${index}`}
              shortcut={item.shortcut}
              description={getLocalizedDescription(item, language)}
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

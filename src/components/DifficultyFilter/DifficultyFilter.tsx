import { memo, useMemo } from 'react';
import { ShortcutDifficulty } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { AppIcon } from '../common/AppIcon';
import { analytics } from '../../utils/analytics';
import { DIFFICULTIES } from '../../constants';
import styles from './DifficultyFilter.module.css';

interface DifficultyOption {
  id: ShortcutDifficulty;
  name: string;
  description: string;
}

interface DifficultyFilterProps {
  selectedDifficulties: Set<ShortcutDifficulty>;
  onToggleDifficulty: (difficulty: ShortcutDifficulty) => void;
}

const DifficultyFilter = memo<DifficultyFilterProps>(({
  selectedDifficulties,
  onToggleDifficulty,
}) => {
  const { t } = useLanguage();

  const difficultyOptions: DifficultyOption[] = useMemo(() => [
    { id: DIFFICULTIES.BASIC, name: DIFFICULTIES.BASIC, description: t.normalMode.difficultyDescriptions.basic },
    { id: DIFFICULTIES.STANDARD, name: DIFFICULTIES.STANDARD, description: t.normalMode.difficultyDescriptions.standard },
    { id: DIFFICULTIES.HARD, name: DIFFICULTIES.HARD, description: t.normalMode.difficultyDescriptions.hard },
    { id: DIFFICULTIES.MADMAX, name: DIFFICULTIES.MADMAX, description: t.normalMode.difficultyDescriptions.madmax },
  ], [t.normalMode.difficultyDescriptions]);

  const handleToggle = (difficulty: ShortcutDifficulty) => {
    onToggleDifficulty(difficulty);
    // Analytics: Track difficulty filter after toggle
    setTimeout(() => {
      const selected = Array.from(selectedDifficulties);
      if (selected.length > 0) {
        analytics.difficultyFiltered(selected);
      }
    }, 100);
  };

  const allSelected = difficultyOptions.every(opt => selectedDifficulties.has(opt.id));
  const noneSelected = selectedDifficulties.size === 0;

  const handleSelectAll = () => {
    if (allSelected) {
      // 全て選択されている場合は全て解除
      difficultyOptions.forEach(opt => {
        if (selectedDifficulties.has(opt.id)) {
          onToggleDifficulty(opt.id);
        }
      });
    } else {
      // 一部または何も選択されていない場合は全て選択
      difficultyOptions.forEach(opt => {
        if (!selectedDifficulties.has(opt.id)) {
          onToggleDifficulty(opt.id);
        }
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{t.normalMode.difficultyFilter}</span>
        <button
          className={styles.selectAllButton}
          onClick={handleSelectAll}
          title={allSelected ? t.normalMode.deselectAll : t.normalMode.selectAll}
        >
          {allSelected ? t.normalMode.deselectAll : t.normalMode.selectAll}
        </button>
      </div>
      <div className={styles.optionsGrid}>
        {difficultyOptions.map((option) => {
          const isSelected = selectedDifficulties.has(option.id);
          return (
            <label
              key={option.id}
              className={`${styles.option} ${styles[option.id]} ${isSelected ? styles.selected : ''}`}
              title={option.description}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(option.id)}
                className={styles.checkbox}
              />
              <span className={styles.icon}>
                <AppIcon appId={option.id} size={18} />
              </span>
              <span className={styles.name}>{option.name}</span>
            </label>
          );
        })}
      </div>
      {noneSelected && (
        <div className={styles.warning}>
          {t.normalMode.selectAtLeastOne}
        </div>
      )}
    </div>
  );
});

DifficultyFilter.displayName = 'DifficultyFilter';

export default DifficultyFilter;

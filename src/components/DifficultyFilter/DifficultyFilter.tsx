import { memo } from 'react';
import { ShortcutDifficulty } from '../../types';
import styles from './DifficultyFilter.module.css';

interface DifficultyOption {
  id: ShortcutDifficulty;
  name: string;
  icon: string;
  description: string;
}

const difficultyOptions: DifficultyOption[] = [
  { id: 'basic', name: '基本', icon: '🌟', description: '日常的に使う基本操作' },
  { id: 'standard', name: '標準', icon: '⚡', description: '標準的なショートカット' },
  { id: 'hard', name: '難解', icon: '🔥', description: '高度な機能・専門的な操作' },
  { id: 'madmax', name: '超難解', icon: '💀', description: '超上級者向け' },
];

interface DifficultyFilterProps {
  selectedDifficulties: Set<ShortcutDifficulty>;
  onToggleDifficulty: (difficulty: ShortcutDifficulty) => void;
}

const DifficultyFilter = memo<DifficultyFilterProps>(({
  selectedDifficulties,
  onToggleDifficulty,
}) => {
  const handleToggle = (difficulty: ShortcutDifficulty) => {
    onToggleDifficulty(difficulty);
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
        <span className={styles.title}>難易度フィルター</span>
        <button
          className={styles.selectAllButton}
          onClick={handleSelectAll}
          title={allSelected ? '全て解除' : '全て選択'}
        >
          {allSelected ? '全解除' : '全選択'}
        </button>
      </div>
      <div className={styles.optionsGrid}>
        {difficultyOptions.map((option) => {
          const isSelected = selectedDifficulties.has(option.id);
          return (
            <label
              key={option.id}
              className={`${styles.option} ${isSelected ? styles.selected : ''}`}
              title={option.description}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(option.id)}
                className={styles.checkbox}
              />
              <span className={styles.icon}>{option.icon}</span>
              <span className={styles.name}>{option.name}</span>
            </label>
          );
        })}
      </div>
      {noneSelected && (
        <div className={styles.warning}>
          ⚠️ 少なくとも1つの難易度を選択してください
        </div>
      )}
    </div>
  );
});

DifficultyFilter.displayName = 'DifficultyFilter';

export default DifficultyFilter;

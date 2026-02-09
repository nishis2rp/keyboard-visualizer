import React, { useState, useMemo, useCallback } from 'react';
import AppSelector from './AppSelector';
import KeyboardLayoutSelector from './KeyboardLayoutSelector';
import DifficultyFilter from './DifficultyFilter';
import KeyboardLayout from './KeyboardLayout';
import { PressedKeysIndicator, ShortcutsList } from './KeyDisplay';
import { useKeyboardShortcuts } from '../hooks';
import { useSettings, useShortcutData } from '../context';
import { specialKeys } from '../constants/keys';
import { ShortcutDifficulty } from '../types';

const NormalModeView = () => {
  const {
    selectedApp,
    setSelectedApp,
    keyboardLayout,
    setKeyboardLayout,
    keyboardLayouts,
  } = useSettings();

  const {
    allShortcuts,
    apps,
    richShortcuts,
  } = useShortcutData();

  const shortcutDescriptions = useMemo(
    () => allShortcuts?.[selectedApp] || {},
    [allShortcuts, selectedApp]
  );

  // 難易度フィルターの状態管理（デフォルトは全て選択）
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<ShortcutDifficulty>>(
    new Set<ShortcutDifficulty>(['basic', 'standard', 'hard', 'madmax'])
  );

  // 難易度の選択/解除をトグル
  const handleToggleDifficulty = useCallback((difficulty: ShortcutDifficulty) => {
    setSelectedDifficulties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(difficulty)) {
        newSet.delete(difficulty);
      } else {
        newSet.add(difficulty);
      }
      return newSet;
    });
  }, []);

  // richShortcuts が null の場合は空の配列を渡す
  const currentRichShortcuts = richShortcuts || [];

  // 難易度でフィルタリングされたショートカット
  const filteredShortcuts = useMemo(() => {
    if (selectedDifficulties.size === 0) {
      // 何も選択されていない場合は全て表示
      return currentRichShortcuts;
    }
    return currentRichShortcuts.filter((shortcut) =>
      selectedDifficulties.has(shortcut.difficulty as ShortcutDifficulty)
    );
  }, [currentRichShortcuts, selectedDifficulties]);

  const {
    pressedKeys,
    currentDescription,
    availableShortcuts,
  } = useKeyboardShortcuts(filteredShortcuts, keyboardLayout, selectedApp, shortcutDescriptions, false);

  return (
    <>
      <div className="selectors-container">
        <AppSelector
          apps={apps}
          selectedApp={selectedApp}
          onSelectApp={setSelectedApp}
        />
        <KeyboardLayoutSelector
          layouts={keyboardLayouts}
          selectedLayout={keyboardLayout}
          onSelectLayout={setKeyboardLayout}
        />
      </div>
      <KeyboardLayout
        pressedKeys={pressedKeys}
        specialKeys={specialKeys}
        shortcutDescriptions={shortcutDescriptions}
        keyboardLayout={keyboardLayout}
      />
      <div className="indicator-filter-container">
        <div className="indicator-wrapper">
          <PressedKeysIndicator
            pressedKeys={pressedKeys}
            description={currentDescription}
            availableShortcuts={availableShortcuts}
            keyboardLayout={keyboardLayout}
          />
        </div>
        <div className="filter-wrapper">
          <DifficultyFilter
            selectedDifficulties={selectedDifficulties}
            onToggleDifficulty={handleToggleDifficulty}
          />
        </div>
      </div>
      <ShortcutsList
        pressedKeys={pressedKeys}
        availableShortcuts={availableShortcuts}
        selectedApp={selectedApp}
        richShortcuts={filteredShortcuts}
        description={currentDescription}
      />
    </>
  );
};

export default NormalModeView;

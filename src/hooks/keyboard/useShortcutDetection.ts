import { useState, useCallback, useMemo } from 'react';
import { getKeyComboText, getShortcutDescription, getAvailableShortcuts } from '../../utils';
import { RichShortcut, AvailableShortcut } from '../../types';

interface ShortcutInfo {
  comboText: string;
  description: string | null;
}

/**
 * 押されたキーからショートカット情報を導出するフック
 */
export const useShortcutDetection = (
  richShortcuts: RichShortcut[],
  layout: string,
  selectedApp: string
) => {
  const [currentDescription, setCurrentDescription] = useState<string | null>(null);
  const [currentShortcut, setCurrentShortcut] = useState<AvailableShortcut | null>(null);
  const [availableShortcuts, setAvailableShortcuts] = useState<AvailableShortcut[]>([]);

  const detectShortcuts = useCallback((pressedKeys: string[]) => {
    if (pressedKeys.length === 0) {
      setCurrentDescription(null);
      setCurrentShortcut(null);
      setAvailableShortcuts([]);
      return;
    }

    const comboText = getKeyComboText(pressedKeys, layout);
    const description = getShortcutDescription(comboText, richShortcuts, selectedApp, layout);
    setCurrentDescription(description);

    const shortcuts = getAvailableShortcuts(pressedKeys, layout, richShortcuts, selectedApp);
    setAvailableShortcuts(shortcuts);

    if (description) {
      const match = shortcuts.find(s => s.description === description);
      setCurrentShortcut(match || null);
    } else {
      setCurrentShortcut(null);
    }
  }, [layout, richShortcuts, selectedApp]);

  const getShortcutInfo = useCallback((keys: string[]): ShortcutInfo => {
    const comboText = getKeyComboText(keys, layout);
    const description = getShortcutDescription(comboText, richShortcuts, selectedApp, layout);
    return { comboText, description };
  }, [layout, richShortcuts, selectedApp]);

  return {
    currentDescription,
    currentShortcut,
    availableShortcuts,
    detectShortcuts,
    getShortcutInfo
  };
};

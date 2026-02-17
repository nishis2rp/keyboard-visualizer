import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShortcutHistory } from '../../../hooks/keyboard/useShortcutHistory';

describe('useShortcutHistory', () => {
  it('should add items to history', () => {
    const { result } = renderHook(() => useShortcutHistory(5));

    act(() => {
      result.current.addToHistory({ comboText: 'Ctrl+C', description: 'Copy' });
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toEqual({ comboText: 'Ctrl+C', description: 'Copy' });
  });

  it('should not add duplicate consecutive items', () => {
    const { result } = renderHook(() => useShortcutHistory(5));

    act(() => {
      result.current.addToHistory({ comboText: 'Ctrl+C', description: 'Copy' });
    });

    act(() => {
      result.current.addToHistory({ comboText: 'Ctrl+C', description: 'Copy' });
    });

    expect(result.current.history).toHaveLength(1);
  });

  it('should respect maxSize', () => {
    const { result } = renderHook(() => useShortcutHistory(2));

    act(() => {
      result.current.addToHistory({ comboText: 'A', description: 'A' });
      result.current.addToHistory({ comboText: 'B', description: 'B' });
      result.current.addToHistory({ comboText: 'C', description: 'C' });
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].comboText).toBe('C');
    expect(result.current.history[1].comboText).toBe('B');
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useShortcutHistory());

    act(() => {
      result.current.addToHistory({ comboText: 'A', description: 'A' });
      result.current.clearHistory();
    });

    expect(result.current.history).toHaveLength(0);
  });
});

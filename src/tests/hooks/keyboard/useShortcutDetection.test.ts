import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShortcutDetection } from '../../../hooks/keyboard/useShortcutDetection';
import { RichShortcut } from '../../../types';

const mockShortcuts: RichShortcut[] = [
  {
    id: 1,
    keys: 'Ctrl + C',
    description: 'Copy',
    difficulty: 'basic',
    application: 'test-app',
    category: 'edit',
    created_at: '',
    press_type: 'simultaneous'
  }
];

describe('useShortcutDetection', () => {
  it('should detect shortcuts', () => {
    const { result } = renderHook(() => 
      useShortcutDetection(mockShortcuts, 'windows-jis', 'test-app')
    );

    act(() => {
      // KeyControlLeft and KeyC correspond to 'Ctrl + C' in windows-jis
      result.current.detectShortcuts(['ControlLeft', 'KeyC']);
    });

    expect(result.current.currentDescription).toBe('Copy');
    expect(result.current.currentShortcut?.description).toBe('Copy');
  });

  it('should return null when no shortcut matches', () => {
    const { result } = renderHook(() => 
      useShortcutDetection(mockShortcuts, 'windows-jis', 'test-app')
    );

    act(() => {
      result.current.detectShortcuts(['KeyA']);
    });

    expect(result.current.currentDescription).toBeNull();
  });
});

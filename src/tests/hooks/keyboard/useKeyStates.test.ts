import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyStates } from '../../../hooks/keyboard/useKeyStates';

describe('useKeyStates', () => {
  it('should track pressed keys', () => {
    const { result } = renderHook(() => useKeyStates());

    act(() => {
      const event = new KeyboardEvent('keydown', { code: 'KeyA' });
      document.dispatchEvent(event);
    });

    expect(result.current.pressedKeys.has('KeyA')).toBe(true);

    act(() => {
      const event = new KeyboardEvent('keyup', { code: 'KeyA' });
      document.dispatchEvent(event);
    });

    expect(result.current.pressedKeys.has('KeyA')).toBe(false);
  });

  it('should call onKeyDown and onKeyUp callbacks', () => {
    const onKeyDown = vi.fn();
    const onKeyUp = vi.fn();
    renderHook(() => useKeyStates({ onKeyDown, onKeyUp }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyB' }));
    });
    expect(onKeyDown).toHaveBeenCalled();

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyB' }));
    });
    expect(onKeyUp).toHaveBeenCalled();
  });

  it('should prevent default when shouldPreventDefault returns true', () => {
    const shouldPreventDefault = vi.fn().mockReturnValue(true);
    renderHook(() => useKeyStates({ shouldPreventDefault }));

    const event = new KeyboardEvent('keydown', { code: 'KeyC', cancelable: true });
    vi.spyOn(event, 'preventDefault');

    act(() => {
      document.dispatchEvent(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should clear keys on blur', () => {
    const { result } = renderHook(() => useKeyStates());

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }));
    });
    expect(result.current.pressedKeys.has('KeyD')).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('blur'));
    });
    expect(result.current.pressedKeys.size).toBe(0);
  });
});

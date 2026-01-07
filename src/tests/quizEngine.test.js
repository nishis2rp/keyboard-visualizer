import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  normalizeShortcut,
  normalizePressedKeys,
  generateQuestion,
  checkAnswer,
  _testExports,
} from '../utils/quizEngine';
import {
  ALWAYS_PROTECTED_SHORTCUTS,
  FULLSCREEN_PREVENTABLE_SHORTCUTS,
  detectOS
} from '../constants/systemProtectedShortcuts';

const { isShortcutSafe } = _testExports;

// Mock detectOS
vi.mock('../constants/systemProtectedShortcuts', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    detectOS: vi.fn(() => 'windows'), // Default to Windows
  };
});

describe('quizEngine', () => {
  beforeEach(() => {
    // Reset mocks before each test
    detectOS.mockReturnValue('windows');
  });

  // --- normalizeShortcut ---
  describe('normalizeShortcut', () => {
    it('should normalize shortcut strings by sorting modifiers', () => {
      expect(normalizeShortcut('Shift + Ctrl + A')).toBe('Ctrl+Shift+A');
      expect(normalizeShortcut('Alt + B + Ctrl')).toBe('Ctrl+Alt+B');
      expect(normalizeShortcut('A')).toBe('A');
      expect(normalizeShortcut('Ctrl')).toBe('Ctrl');
      expect(normalizeShortcut('Ctrl + Alt + Shift + A')).toBe('Ctrl+Alt+Shift+A');
    });

    it('should handle "Win" and "Cmd" keys by converting to "Meta"', () => {
      expect(normalizeShortcut('Win + A')).toBe('Meta+A');
      expect(normalizeShortcut('Cmd + S')).toBe('Meta+S');
      expect(normalizeShortcut('Shift + Win + C')).toBe('Meta+Shift+C'); // Corrected expectation
    });

    it('should handle different modifier casing', () => {
      expect(normalizeShortcut('ctrl + a')).toBe('Ctrl+A'); // Corrected expectation
      expect(normalizeShortcut('ALT + B')).toBe('Alt+B'); // Corrected expectation
    });

    it('should remove spaces', () => {
      expect(normalizeShortcut(' Ctrl + A ')).toBe('Ctrl+A'); // Corrected expectation
    });

    it('should return empty string for null or empty input', () => {
      expect(normalizeShortcut(null)).toBe('');
      expect(normalizeShortcut('')).toBe('');
    });
  });

  // --- normalizePressedKeys ---
  describe('normalizePressedKeys', () => {
    const keyNameMap = {
      'KeyA': 'A', 'KeyB': 'B',
      'ControlLeft': 'Ctrl', 'ShiftLeft': 'Shift', 'AltLeft': 'Alt',
      'MetaLeft': 'Win', // MetaLeft in Windows environment
      'ArrowUp': '↑',
    };

    it('should normalize basic key presses', () => {
      const pressed = new Set(['KeyA']);
      expect(normalizePressedKeys(pressed, keyNameMap)).toBe('A');
    });

    it('should normalize modifier key presses', () => {
      const pressed = new Set(['ControlLeft']);
      expect(normalizePressedKeys(pressed, keyNameMap)).toBe('Ctrl');
    });

    it('should combine and sort modifiers with main keys (Windows)', () => {
      const pressed = new Set(['ControlLeft', 'ShiftLeft', 'KeyA']);
      expect(normalizePressedKeys(pressed, keyNameMap)).toBe('Ctrl+Shift+A');
    });

    it('should map arrow keys correctly', () => {
      const pressed = new Set(['ArrowUp']);
      expect(normalizePressedKeys(pressed, keyNameMap)).toBe('↑');
    });

    it('should handle Windows Meta key', () => {
      const pressed = new Set(['MetaLeft', 'KeyD']);
      expect(normalizePressedKeys(pressed, keyNameMap)).toBe('Meta+D'); // Converted to Meta by normalizeShortcut
    });

    it('should handle macOS Cmd key', () => {
      detectOS.mockReturnValue('macos'); // Set to macOS
      const pressed = new Set(['MetaLeft', 'KeyS']);
      expect(normalizePressedKeys(pressed, keyNameMap)).toBe('Meta+S'); // Converted to Meta by normalizeShortcut
    });
  });

  // --- isShortcutSafe ---
  describe('isShortcutSafe', () => {
    beforeEach(() => {
      ALWAYS_PROTECTED_SHORTCUTS.clear();
      FULLSCREEN_PREVENTABLE_SHORTCUTS.clear();
    });

    it('should be safe if not in any protected lists', () => {
      expect(isShortcutSafe('Ctrl+A', 'default', false)).toBe(true);
    });

    it('should be unsafe if in ALWAYS_PROTECTED_SHORTCUTS', () => {
      ALWAYS_PROTECTED_SHORTCUTS.add('Ctrl+L');
      expect(isShortcutSafe('Ctrl+L', 'default', false)).toBe(false);
      expect(isShortcutSafe('Ctrl+L', 'hardcore', true)).toBe(false); // Always protected, even in hardcore mode
    });

    it('should be unsafe if in FULLSCREEN_PREVENTABLE_SHORTCUTS and not fullscreen in default mode', () => {
      FULLSCREEN_PREVENTABLE_SHORTCUTS.add('Ctrl+W');
      expect(isShortcutSafe('Ctrl+W', 'default', false)).toBe(false);
    });

    it('should be safe if in FULLSCREEN_PREVENTABLE_SHORTCUTS but is fullscreen in default mode', () => {
      FULLSCREEN_PREVENTABLE_SHORTCUTS.add('Ctrl+W');
      expect(isShortcutSafe('Ctrl+W', 'default', true)).toBe(true);
    });

    it('should be safe if in FULLSCREEN_PREVENTABLE_SHORTCUTS and in hardcore mode', () => {
      FULLSCREEN_PREVENTABLE_SHORTCUTS.add('Ctrl+W');
      expect(isShortcutSafe('Ctrl+W', 'hardcore', false)).toBe(true);
      expect(isShortcutSafe('Ctrl+W', 'hardcore', true)).toBe(true);
    });
  });

  // --- generateQuestion ---
  describe('generateQuestion', () => {
    const mockShortcuts = {
      'Ctrl+A': 'すべて選択',
      'Ctrl+S': '保存',
      'Win+L': 'PCをロック',
      'Ctrl+W': 'タブを閉じる',
      'Alt+F4': 'アプリを閉じる'
    };

    it('should return null if no shortcuts are provided', () => {
      expect(generateQuestion({}, 'default', false)).toBeNull();
    });

    it('should generate a question from safe shortcuts in default mode', () => {
      ALWAYS_PROTECTED_SHORTCUTS.add('Meta+L'); // Win+L is normalized to Meta+L
      FULLSCREEN_PREVENTABLE_SHORTCUTS.add('Ctrl+W'); // Ctrl+W is unsafe by default

      const question = generateQuestion(mockShortcuts, 'default', false);
      expect(question).not.toBeNull();
      // Win+L and Ctrl+W are excluded, so one of Ctrl+A, Ctrl+S, Alt+F4
      const possibleShortcuts = ['Ctrl+A', 'Ctrl+S', 'Alt+F4'];
      expect(possibleShortcuts).toContain(question.correctShortcut);
      expect(question.question).toMatch(/のショートカットは？$/);
      expect(question.normalizedCorrectShortcut).toBe(normalizeShortcut(question.correctShortcut));
    });

    it('should generate a question from FULLSCREEN_PREVENTABLE_SHORTCUTS if fullscreen in default mode', () => {
      ALWAYS_PROTECTED_SHORTCUTS.add('Meta+L');
      FULLSCREEN_PREVENTABLE_SHORTCUTS.add('Ctrl+W');

      const question = generateQuestion(mockShortcuts, 'default', true); // Fullscreen
      expect(question).not.toBeNull();
      // Win+L is always protected and excluded. Ctrl+W becomes safe in fullscreen.
      const possibleShortcuts = ['Ctrl+A', 'Ctrl+S', 'Alt+F4', 'Ctrl+W'];
      expect(possibleShortcuts).toContain(question.correctShortcut);
    });

    it('should generate a question from FULLSCREEN_PREVENTABLE_SHORTCUTS in hardcore mode', () => {
      ALWAYS_PROTECTED_SHORTCUTS.add('Meta+L');
      FULLSCREEN_PREVENTABLE_SHORTCUTS.add('Ctrl+W');

      const question = generateQuestion(mockShortcuts, 'hardcore', false); // Hardcore mode
      expect(question).not.toBeNull();
      // Win+L is always protected and excluded. Ctrl+W becomes safe in hardcore mode.
      const possibleShortcuts = ['Ctrl+A', 'Ctrl+S', 'Alt+F4', 'Ctrl+W'];
      expect(possibleShortcuts).toContain(question.correctShortcut);
    });

    it('should return null if no safe shortcuts are available', () => {
      ALWAYS_PROTECTED_SHORTCUTS.add('Ctrl+A');
      ALWAYS_PROTECTED_SHORTCUTS.add('Ctrl+S');
      ALWAYS_PROTECTED_SHORTCUTS.add('Meta+L');
      ALWAYS_PROTECTED_SHORTCUTS.add('Ctrl+W');
      ALWAYS_PROTECTED_SHORTCUTS.add('Alt+F4');

      const question = generateQuestion(mockShortcuts, 'default', false);
      expect(question).toBeNull();
    });
  });

  // --- checkAnswer ---
  describe('checkAnswer', () => {
    it('should return true for a correct answer', () => {
      expect(checkAnswer('Ctrl+Shift+A', 'Ctrl+Shift+A')).toBe(true);
    });

    it('should return false for an incorrect answer', () => {
      expect(checkAnswer('Ctrl+Shift+A', 'Ctrl+Shift+B')).toBe(false);
    });

    it('should handle different casing in userAnswer if normalized correctly', () => {
      // Assumes that casing is normalized by normalizeShortcut
      expect(checkAnswer(normalizeShortcut('ctrl+a'), normalizeShortcut('Ctrl+A'))).toBe(true);
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  normalizeShortcut,
  normalizePressedKeys,
  generateQuestion,
  checkAnswer,
  isShortcutSafe,
} from '../utils/quizEngine';
import { detectOS } from '../utils/os';
import { RichShortcut, App, ShortcutDetails } from '../types';

// Mock detectOS
vi.mock('../utils/os', async (importOriginal) => {
  return {
    detectOS: vi.fn(() => 'windows'), // Default to Windows
  };
});

describe('quizEngine', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (detectOS as any).mockReturnValue('windows');
  });

  describe('normalizeShortcut', () => {
    it('should normalize shortcut strings by sorting modifiers', () => {
      expect(normalizeShortcut('Shift + Ctrl + A')).toBe('Ctrl + Shift + A');
      expect(normalizeShortcut('Alt + B + Ctrl')).toBe('Ctrl + Alt + B');
      expect(normalizeShortcut('A')).toBe('A');
      expect(normalizeShortcut('Ctrl')).toBe('Ctrl');
      expect(normalizeShortcut('Ctrl + Alt + Shift + A')).toBe('Ctrl + Alt + Shift + A');
    });

    it('should handle "Win" and "Cmd" keys by converting to "Meta"', () => {
      expect(normalizeShortcut('Win + A')).toBe('Meta + A');
      expect(normalizeShortcut('Cmd + S')).toBe('Meta + S');
      expect(normalizeShortcut('Shift + Win + C')).toBe('Meta + Shift + C'); 
    });

    it('should handle different modifier casing', () => {
      expect(normalizeShortcut('ctrl + a')).toBe('Ctrl + A'); 
      expect(normalizeShortcut('ALT + B')).toBe('Alt + B'); 
    });

    it('should maintain standard spaces', () => {
      expect(normalizeShortcut(' Ctrl + A ')).toBe('Ctrl + A'); 
    });

    it('should return empty string for null or empty input', () => {
      expect(normalizeShortcut(null)).toBe('');
      expect(normalizeShortcut('')).toBe('');
    });

    it('should normalize PgUp/PgDn to PageUp/PageDown', () => {
      expect(normalizeShortcut('PgUp')).toBe('PageUp');
      expect(normalizeShortcut('PgDn')).toBe('PageDown');
      expect(normalizeShortcut('Ctrl + PgUp')).toBe('Ctrl + PageUp');
      expect(normalizeShortcut('Ctrl + PgDn')).toBe('Ctrl + PageDown');
      expect(normalizeShortcut('Shift + PgUp')).toBe('Shift + PageUp');
      expect(normalizeShortcut('Shift + PgDn')).toBe('Shift + PageDown');
    });

    it('should handle Mac symbols (\u2303, \u2325, \u2318, \u21e7)', () => {
      expect(normalizeShortcut('\u2303 + A')).toBe('Ctrl + A');
      expect(normalizeShortcut('\u2325 + B')).toBe('Alt + B');
      expect(normalizeShortcut('\u2318 + S')).toBe('Meta + S');
      expect(normalizeShortcut('\u21e7 + C')).toBe('Shift + C');
      expect(normalizeShortcut('\u2303 + \u2325 + \u2318 + \u21e7 + Z')).toBe('Ctrl + Alt + Meta + Shift + Z');
    });
  });

  // --- normalizePressedKeys ---
  describe('normalizePressedKeys', () => {
    const mockLayout = 'windows-jis';
    it('should normalize basic key presses', () => {
      const pressed = new Set(['KeyA']);
      expect(normalizePressedKeys(pressed, mockLayout)).toBe('A');
    });

    it('should normalize modifier key presses', () => {
      const pressed = new Set(['ControlLeft']);
      expect(normalizePressedKeys(pressed, mockLayout)).toBe('Ctrl');
    });

    it('should combine and sort modifiers with main keys in a fixed order', () => {
      // Order: Ctrl > Alt > Meta > Shift
      const pressed = new Set(['ShiftLeft', 'MetaLeft', 'AltLeft', 'ControlLeft', 'KeyA']);
      expect(normalizePressedKeys(pressed, mockLayout)).toBe('Ctrl + Alt + Meta + Shift + A');
    });

    it('should map arrow keys correctly', () => {
      const pressed = new Set(['ArrowUp']);
      expect(normalizePressedKeys(pressed, mockLayout)).toBe('↑');
      expect(normalizePressedKeys(new Set(['ArrowDown']), mockLayout)).toBe('↓');
      expect(normalizePressedKeys(new Set(['ArrowLeft']), mockLayout)).toBe('←');
      expect(normalizePressedKeys(new Set(['ArrowRight']), mockLayout)).toBe('→');
    });

    it('should handle Windows Meta key', () => {
      const pressed = new Set(['MetaLeft', 'KeyD']);
      expect(normalizePressedKeys(pressed, mockLayout)).toBe('Meta + D'); 
    });

    it('should handle macOS Cmd key', () => {
      (detectOS as any).mockReturnValue('macos'); // Set to macOS
      const pressed = new Set(['MetaLeft', 'KeyS']);
      const macMockLayout = 'mac-us';
      expect(normalizePressedKeys(pressed, macMockLayout)).toBe('Meta + S'); 
    });

    it('should handle sequential key combinations (represented as a sequence string)', () => {
      // In sequential mode, the UI accumulates keys like "Alt + H + O + I"
      // normalizeShortcut should be able to handle this format as well
      expect(normalizeShortcut('Alt + H + O + I')).toBe('Alt + H + O + I');
    });
  });

  // --- isShortcutSafe ---
  describe('isShortcutSafe', () => {
    // Helper to create a mock RichShortcut
    const createRichShortcut = (protectionLevel: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen'): RichShortcut => ({
      id: 1,
      keys: 'Ctrl+A',
      description: 'Test',
      difficulty: 'basic',
      application: 'test',
      category: 'test',
      created_at: '',
      press_type: 'simultaneous',
      windows_protection_level: protectionLevel,
      macos_protection_level: protectionLevel,
    });

    it('should be safe if no richShortcut is provided (fallback)', () => {
      expect(isShortcutSafe('Ctrl+A', 'default', false)).toBe(true);
    });

    it('should be safe if protection level is none', () => {
      const rs = createRichShortcut('none');
      expect(isShortcutSafe('Ctrl+A', 'default', false, rs)).toBe(true);
    });

    it('should be unsafe if protection level is always-protected', () => {
      const rs = createRichShortcut('always-protected');
      expect(isShortcutSafe('Ctrl+L', 'default', false, rs)).toBe(false);
      expect(isShortcutSafe('Ctrl+L', 'hardcore', true, rs)).toBe(false);
    });

    it('should be unsafe if preventable_fullscreen and not fullscreen in default mode', () => {
      const rs = createRichShortcut('preventable_fullscreen');
      expect(isShortcutSafe('Ctrl+W', 'default', false, rs)).toBe(false);
    });

    it('should be safe if preventable_fullscreen but is fullscreen in default mode', () => {
      const rs = createRichShortcut('preventable_fullscreen');
      expect(isShortcutSafe('Ctrl+W', 'default', true, rs)).toBe(true);
    });

    it('should be safe if preventable_fullscreen and in hardcore mode', () => {
      const rs = createRichShortcut('preventable_fullscreen');
      expect(isShortcutSafe('Ctrl+W', 'hardcore', false, rs)).toBe(true);
    });
  });

  // --- generateQuestion ---
  describe('generateQuestion', () => {
    const mockShortcuts = {
      'testApp': {
        'Ctrl+A': { description: 'すべて選択', difficulty: 'basic' } as ShortcutDetails,
        'Ctrl+S': { description: '保存', difficulty: 'basic' } as ShortcutDetails,
        'Win+L': { description: 'PCをロック', difficulty: 'basic' } as ShortcutDetails,
        'Ctrl+W': { description: 'タブを閉じる', difficulty: 'basic' } as ShortcutDetails,
        'Alt+F4': { description: 'アプリを閉じる', difficulty: 'basic' } as ShortcutDetails
      }
    };

    const mockApps: App[] = [{ id: 'testApp', name: 'Test App', icon: '', os: 'windows' }];

    const mockRichShortcuts: RichShortcut[] = [
      { id: 1, keys: 'Ctrl+A', application: 'testApp', difficulty: 'basic', windows_protection_level: 'none', macos_protection_level: 'none', description: '', created_at: '', press_type: 'simultaneous', category: null },
      { id: 2, keys: 'Ctrl+S', application: 'testApp', difficulty: 'basic', windows_protection_level: 'none', macos_protection_level: 'none', description: '', created_at: '', press_type: 'simultaneous', category: null },
      { id: 3, keys: 'Win+L', application: 'testApp', difficulty: 'basic', windows_protection_level: 'always-protected', macos_protection_level: 'always-protected', description: '', created_at: '', press_type: 'simultaneous', category: null },
      { id: 4, keys: 'Ctrl+W', application: 'testApp', difficulty: 'basic', windows_protection_level: 'preventable_fullscreen', macos_protection_level: 'preventable_fullscreen', description: '', created_at: '', press_type: 'simultaneous', category: null },
      { id: 5, keys: 'Alt+F4', application: 'testApp', difficulty: 'basic', windows_protection_level: 'none', macos_protection_level: 'none', description: '', created_at: '', press_type: 'simultaneous', category: null }
    ];

    it('should return null if no shortcuts are provided', () => {
      expect(generateQuestion({}, ['anyApp'], 'default', false, new Set(), 'allrange', [], mockApps)).toBeNull();
      // Even if data is provided, if allowedApps is empty/mismatch
      expect(generateQuestion(mockShortcuts, [], 'default', false, new Set(), 'allrange', mockRichShortcuts, mockApps)).toBeNull();
    });

    it('should generate a question from safe shortcuts in default mode', () => {
      const question = generateQuestion(mockShortcuts, ['testApp'], 'default', false, new Set(), 'allrange', mockRichShortcuts, mockApps);
      expect(question).not.toBeNull();
      
      // Win+L (always) and Ctrl+W (preventable, windowed) are excluded
      const possibleShortcuts = ['Ctrl+A', 'Ctrl+S', 'Alt+F4'];
      expect(possibleShortcuts).toContain(question?.correctShortcut);
    });

    it('should generate a question from preventable shortcuts if fullscreen in default mode', () => {
      const question = generateQuestion(mockShortcuts, ['testApp'], 'default', true, new Set(), 'allrange', mockRichShortcuts, mockApps);
      expect(question).not.toBeNull();
      
      // Ctrl+W is now safe
      const possibleShortcuts = ['Ctrl+A', 'Ctrl+S', 'Alt+F4', 'Ctrl+W'];
      expect(possibleShortcuts).toContain(question?.correctShortcut);
    });

    it('should generate a question from preventable shortcuts in hardcore mode', () => {
      const question = generateQuestion(mockShortcuts, ['testApp'], 'hardcore', false, new Set(), 'allrange', mockRichShortcuts, mockApps);
      expect(question).not.toBeNull();
      
      const possibleShortcuts = ['Ctrl+A', 'Ctrl+S', 'Alt+F4', 'Ctrl+W'];
      expect(possibleShortcuts).toContain(question?.correctShortcut);
    });

    it('should correctly capture press_type for sequential shortcuts', () => {
      const seqShortcuts = {
        'testApp': {
          'Alt + H + O + I': { description: 'Auto fit', difficulty: 'basic' } as ShortcutDetails,
        }
      };
      const seqRichShortcuts: RichShortcut[] = [
        { id: 10, keys: 'Alt + H + O + I', application: 'testApp', difficulty: 'basic', windows_protection_level: 'none', macos_protection_level: 'none', description: 'Auto fit', created_at: '', press_type: 'sequential', category: null },
      ];
      
      const question = generateQuestion(seqShortcuts, ['testApp'], 'default', false, new Set(), 'allrange', seqRichShortcuts, mockApps);
      expect(question?.press_type).toBe('sequential');
    });
  });

  // --- checkAnswer ---
  // (No changes needed usually, unless checkAnswer relies on DB data mock now)
  describe('checkAnswer', () => {
    it('should return true for a correct answer', () => {
      expect(checkAnswer('Ctrl + Shift + A', 'Ctrl + Shift + A')).toBe(true);
    });

    it('should return false for an incorrect answer', () => {
      expect(checkAnswer('Ctrl + Shift + A', 'Ctrl + Shift + B')).toBe(false);
    });

    it('should handle different casing in userAnswer if normalized correctly', () => {
      expect(checkAnswer(normalizeShortcut('ctrl + a'), normalizeShortcut('Ctrl + A'))).toBe(true);
    });

        it('should handle Shift-symbol-digit equivalents (e.g., ! vs 1)', () => {
          const mockLayout = 'windows-jis';
          // User presses Shift + 1 which produces '!' in some layouts
          // The correct answer is defined as 'Ctrl + Shift + 1'
          expect(checkAnswer('Ctrl + Shift + !', 'Ctrl + Shift + 1', [], mockLayout)).toBe(true);
          expect(checkAnswer('Ctrl + Shift + 1', 'Ctrl + Shift + !', [], mockLayout)).toBe(true);
        });
    
        it('should handle JIS-specific Shift mappings (e.g., " vs 2)', () => {
          const jisLayout = 'windows-jis';
          // JIS: Shift + 2 = "
          expect(checkAnswer('Ctrl + Shift + "', 'Ctrl + Shift + 2', [], jisLayout)).toBe(true);
        });
    
        it('should handle US-specific Shift mappings (e.g., @ vs 2)', () => {
          const usLayout = 'windows-us';
          // US: Shift + 2 = @
          expect(checkAnswer('Ctrl + Shift + @', 'Ctrl + Shift + 2', [], usLayout)).toBe(true);
        });
    
        it('should NOT match if the layout does not support the mapping', () => {
          // JIS does not map @ to 2 (Shift + 2 is " in JIS)
          const jisLayout = 'windows-jis';
          expect(checkAnswer('Ctrl + Shift + @', 'Ctrl + Shift + 2', [], jisLayout)).toBe(false);
        });
      });
    });
    
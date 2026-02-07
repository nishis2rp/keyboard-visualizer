import { describe, it, expect } from 'vitest';
import { 
  isSequentialShortcut, 
  getSequentialKeys, 
  formatSequentialShortcut,
  SequentialKeyRecorder,
  checkSequentialShortcut
} from '../utils/sequentialShortcuts';

describe('sequentialShortcuts utilities', () => {
  describe('isSequentialShortcut', () => {
    it('should return true if press_type is sequential in object', () => {
      expect(isSequentialShortcut({ press_type: 'sequential' })).toBe(true);
      expect(isSequentialShortcut({ press_type: 'simultaneous' })).toBe(false);
    });

    it('should fall back to string parsing if no press_type is provided', () => {
      expect(isSequentialShortcut('Alt + H + O + I')).toBe(true);
      expect(isSequentialShortcut('Ctrl + K, Ctrl + S')).toBe(true);
      expect(isSequentialShortcut('Tab then Enter')).toBe(true);
      expect(isSequentialShortcut('g + i')).toBe(true);
      expect(isSequentialShortcut('Ctrl + A')).toBe(false);
    });

    it('should handle Gmail space-separated sequences if application is provided', () => {
      expect(isSequentialShortcut('g i', 'gmail')).toBe(true);
      expect(isSequentialShortcut({ keys: 'g i', application: 'gmail' })).toBe(true);
    });
  });

  describe('getSequentialKeys', () => {
    it('should split by + by default', () => {
      expect(getSequentialKeys('Alt + H + O + I')).toEqual(['Alt', 'H', 'O', 'I']);
    });

    it('should split by comma', () => {
      expect(getSequentialKeys('Ctrl + K, Ctrl + S')).toEqual(['Ctrl + K', 'Ctrl + S']);
    });

    it('should split by "then"', () => {
      expect(getSequentialKeys('Tab then Enter')).toEqual(['Tab', 'Enter']);
    });

    it('should split by space for Gmail style', () => {
      expect(getSequentialKeys('g i')).toEqual(['g', 'i']);
    });
  });

  describe('formatSequentialShortcut', () => {
    it('should format with arrows if sequential', () => {
      expect(formatSequentialShortcut('Alt + H + O + I', undefined, 'sequential')).toBe('Alt → H → O → I');
    });

    it('should return original string if simultaneous', () => {
      expect(formatSequentialShortcut('Ctrl + A', undefined, 'simultaneous')).toBe('Ctrl + A');
    });
  });

  describe('SequentialKeyRecorder', () => {
    it('should record keys and check for matches', () => {
      const recorder = new SequentialKeyRecorder();
      recorder.addKey('Alt');
      recorder.addKey('H');
      
      expect(recorder.getSequence()).toEqual(['Alt', 'H']);
      expect(recorder.matches(['Alt', 'H'])).toBe(true);
      expect(recorder.isPartialMatch(['Alt', 'H', 'O'])).toBe(true);
      
      recorder.reset();
      expect(recorder.getSequence()).toEqual([]);
    });

    it('should handle case insensitivity and whitespace', () => {
      const recorder = new SequentialKeyRecorder();
      recorder.addKey('ctrl');
      expect(recorder.matches(['Ctrl'])).toBe(true);
    });
  });

  describe('checkSequentialShortcut', () => {
    it('should validate user sequence against correct shortcut', () => {
      const userSequence = ['Alt', 'H', 'O', 'I'];
      expect(checkSequentialShortcut(userSequence, 'Alt + H + O + I', undefined, 'sequential')).toBe(true);
      expect(checkSequentialShortcut(['Alt', 'H'], 'Alt + H + O + I', undefined, 'sequential')).toBe(false);
    });
  });
});

/**
 * Keyboard layout definitions
 * Single source of truth for all keyboard layout configurations
 */

export interface KeyboardLayout {
  id: string;
  name: string;
  icon: string;
  displayIcon: string;
  osType: 'windows' | 'macos';
}

export const KEYBOARD_LAYOUTS: KeyboardLayout[] = [
  {
    id: 'windows-jis',
    name: 'Windows JIS',
    icon: '🪟',
    displayIcon: '⊞',
    osType: 'windows',
  },
  {
    id: 'mac-jis',
    name: 'Mac JIS',
    icon: '🍎',
    displayIcon: '⌘',
    osType: 'macos',
  },
  {
    id: 'mac-us',
    name: 'Mac US',
    icon: '🇺🇸',
    displayIcon: '⌘',
    osType: 'macos',
  },
];

/**
 * Get keyboard layout by ID
 */
export const getKeyboardLayoutById = (id: string): KeyboardLayout | undefined => {
  return KEYBOARD_LAYOUTS.find(layout => layout.id === id);
};

/**
 * Get default keyboard layout based on OS
 */
export const getDefaultKeyboardLayout = (os: string): KeyboardLayout => {
  if (os === 'macos') {
    return KEYBOARD_LAYOUTS.find(l => l.id === 'mac-us') || KEYBOARD_LAYOUTS[1];
  }
  return KEYBOARD_LAYOUTS[0]; // windows-jis
};

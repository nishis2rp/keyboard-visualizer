/**
 * Application definition interface
 */
export interface App {
  id: string;
  name: string;
  icon: string;
}

/**
 * List of supported applications.
 * Each application has its own shortcut definition.
 */
export const apps: App[] = [
  { id: 'windows11', name: 'Windows 11', icon: '🪟' },
  { id: 'macos', name: 'macOS', icon: '🍎' },
  { id: 'chrome', name: 'Chrome', icon: '🌐' },
  { id: 'excel', name: 'Excel', icon: '📊' },
  { id: 'slack', name: 'Slack', icon: '💬' },
  { id: 'gmail', name: 'Gmail', icon: '📧' },
];

/**
 * Re-export keyboard layouts from centralized location
 * @see src/config/keyboardLayouts.ts for the single source of truth
 */
export { KEYBOARD_LAYOUTS as keyboardLayouts } from './keyboardLayouts';

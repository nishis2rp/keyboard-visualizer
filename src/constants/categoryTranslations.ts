/**
 * Category name translations (Japanese to English)
 */
export const categoryTranslations: Record<string, string> = {
  // English categories (already in English)
  'Action': 'Action',
  'Application': 'Application',
  'Compose': 'Compose',
  'Debug': 'Debug',
  'Editing': 'Editing',
  'Editor': 'Editor',
  'File': 'File',
  'Format': 'Format',
  'General': 'General',
  'Git': 'Git',
  'Help': 'Help',
  'Information': 'Information',
  'Insert': 'Insert',
  'Markdown': 'Markdown',
  'Navigation': 'Navigation',
  'Object': 'Object',
  'Refactoring': 'Refactoring',
  'Review': 'Review',
  'Search': 'Search',
  'Selection': 'Selection',
  'Settings': 'Settings',
  'Slide': 'Slide',
  'Slideshow': 'Slideshow',
  'System': 'System',
  'Table': 'Table',
  'Terminal': 'Terminal',
  'Tools': 'Tools',
  'Window': 'Window',
  'Workspace': 'Workspace',

  // Japanese categories
  'チャット': 'Chat',
  'ラベル': 'Label',
};

/**
 * Get English category name
 */
export function getCategoryInEnglish(japaneseCategory: string | null): string | null {
  if (!japaneseCategory) return null;
  return categoryTranslations[japaneseCategory] || japaneseCategory;
}

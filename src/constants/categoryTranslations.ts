/**
 * Category name translations (Japanese to English)
 * Note: Only Japanese categories need translation mapping.
 * English categories are returned as-is by getCategoryInEnglish().
 */
export const categoryTranslations: Record<string, string> = {
  // Japanese categories only
  'チャット': 'Chat',
  'ラベル': 'Label',
};

/**
 * Get English category name
 * Returns the original value if no translation exists (already in English)
 */
export function getCategoryInEnglish(japaneseCategory: string | null): string | null {
  if (!japaneseCategory) return null;
  return categoryTranslations[japaneseCategory] || japaneseCategory;
}

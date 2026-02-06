import { RichShortcut } from '../types';

/**
 * Escape CSV field value
 * - Wrap in quotes if it contains comma, quote, or newline
 * - Escape quotes by doubling them
 */
function escapeCsvField(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // Check if field needs to be quoted
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Escape quotes by doubling them
    const escapedValue = stringValue.replace(/"/g, '""');
    return `"${escapedValue}"`;
  }

  return stringValue;
}

/**
 * Convert shortcuts array to CSV string
 */
function convertToCSV(shortcuts: RichShortcut[]): string {
  // CSV Header
  const headers = [
    'id',
    'application',
    'keys',
    'description',
    'difficulty',
    'category',
    'platform',
    'windows_keys',
    'macos_keys',
    'windows_protection_level',
    'macos_protection_level',
    'created_at'
  ];

  const csvLines: string[] = [];

  // Add header row
  csvLines.push(headers.join(','));

  // Add data rows
  for (const shortcut of shortcuts) {
    const row = [
      escapeCsvField(String(shortcut.id)),
      escapeCsvField(shortcut.application),
      escapeCsvField(shortcut.keys),
      escapeCsvField(shortcut.description),
      escapeCsvField(shortcut.difficulty),
      escapeCsvField(shortcut.category),
      escapeCsvField(shortcut.platform),
      escapeCsvField(shortcut.windows_keys),
      escapeCsvField(shortcut.macos_keys),
      escapeCsvField(shortcut.windows_protection_level),
      escapeCsvField(shortcut.macos_protection_level),
      escapeCsvField(shortcut.created_at)
    ];

    csvLines.push(row.join(','));
  }

  return csvLines.join('\n');
}

/**
 * Download shortcuts as CSV file
 * @param shortcuts - Array of shortcuts to export
 * @param filename - Optional filename (default: shortcuts-export-{timestamp}.csv)
 */
export function downloadShortcutsAsCSV(shortcuts: RichShortcut[], filename?: string): void {
  // Convert to CSV
  const csvContent = convertToCSV(shortcuts);

  // Generate filename with timestamp if not provided
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const finalFilename = filename || `shortcuts-export-${timestamp}.csv`;

  // Create blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

import { getSupabaseClient } from './lib/supabase';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface Shortcut {
  id: number;
  application: string;
  keys: string;
  description: string;
  difficulty: string;
  category: string | null;
  platform: string | null;
  windows_keys: string | null;
  macos_keys: string | null;
  windows_protection_level: string | null;
  macos_protection_level: string | null;
  created_at: string;
}

/**
 * Escape CSV field value
 * - Wrap in quotes if it contains comma, quote, or newline
 * - Escape quotes by doubling them
 */
function escapeCsvField(value: string | null): string {
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
function convertToCSV(shortcuts: Shortcut[]): string {
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

async function main() {
  console.log('📊 Exporting shortcuts to CSV...\n');

  try {
    const supabase = getSupabaseClient();

    // Fetch all shortcuts from database
    const { data: shortcuts, error } = await supabase
      .from('shortcuts')
      .select('*')
      .order('application', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    if (!shortcuts || shortcuts.length === 0) {
      console.log('⚠️  No shortcuts found in database');
      return;
    }

    console.log(`✅ Fetched ${shortcuts.length} shortcuts from database\n`);

    // Statistics by application
    const appCounts: Record<string, number> = {};
    for (const shortcut of shortcuts) {
      appCounts[shortcut.application] = (appCounts[shortcut.application] || 0) + 1;
    }

    console.log('📈 Shortcuts by application:');
    for (const [app, count] of Object.entries(appCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${app}: ${count}`);
    }
    console.log();

    // Convert to CSV
    const csvContent = convertToCSV(shortcuts as Shortcut[]);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `shortcuts-export-${timestamp}.csv`;
    const filepath = join(process.cwd(), filename);

    // Write to file
    writeFileSync(filepath, csvContent, 'utf-8');

    console.log(`✅ CSV file created successfully!`);
    console.log(`📁 File path: ${filepath}`);
    console.log(`📊 Total records: ${shortcuts.length}`);

  } catch (error) {
    console.error('❌ Error exporting shortcuts:', error);
    process.exit(1);
  }
}

// Run the export
main();

import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('✓ Connected to database\n');

    console.log('Checking Word and PowerPoint for Page Up/Down variations:\n');

    const result = await client.query(
      `SELECT application, keys, windows_keys, macos_keys, description
       FROM shortcuts
       WHERE (application = 'word' OR application = 'powerpoint')
         AND (keys LIKE '%Page %' OR windows_keys LIKE '%Page %' OR macos_keys LIKE '%Page %')
       ORDER BY application, keys`
    );

    if (result.rows.length > 0) {
      console.log(`Found ${result.rows.length} shortcuts with "Page " (with space):\n`);
      result.rows.forEach(row => {
        console.log(`${row.application}: ${row.description}`);
        console.log(`  keys: "${row.keys}"`);
        if (row.windows_keys) console.log(`  windows_keys: "${row.windows_keys}"`);
        if (row.macos_keys) console.log(`  macos_keys: "${row.macos_keys}"`);
        console.log('');
      });
    } else {
      console.log('✓ No "Page " (with space) found. All are normalized to "PageUp"/"PageDown"');
    }
  });
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});


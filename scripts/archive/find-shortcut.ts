import { withDatabase } from './lib/db';

async function findShortcut(searchKey: string) {
  await withDatabase(async (client) => {
    const result = await client.query(
      'SELECT application, keys, description, windows_protection_level, macos_protection_level FROM shortcuts WHERE keys = $1',
      [searchKey]
    );

    console.log(`\nSearching for: "${searchKey}"\n`);

    if (result.rows.length > 0) {
      console.log(`Found ${result.rows.length} result(s):\n`);
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. Application: ${row.application}`);
        console.log(`   Description: ${row.description}`);
        console.log(`   Windows Protection: ${row.windows_protection_level || 'none'}`);
        console.log(`   macOS Protection: ${row.macos_protection_level || 'none'}\n`);
      });
    } else {
      console.log(`❌ No shortcuts found for "${searchKey}"\n`);
    }
  });
}

const searchKey = process.argv[2];
if (!searchKey) {
  console.error('Usage: tsx scripts/find-shortcut.ts "Ctrl + PageUp"');
  process.exit(1);
}

findShortcut(searchKey).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

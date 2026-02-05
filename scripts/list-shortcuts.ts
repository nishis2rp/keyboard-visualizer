import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    const result = await client.query(
      'SELECT id, application, keys, description, category, created_at, windows_protection_level, macos_protection_level, difficulty, sort_order FROM shortcuts ORDER BY sort_order'
    );

    console.log(`\nFound ${result.rows.length} shortcut(s):\n`);

    if (result.rows.length > 0) {
      result.rows.forEach((row) => {
        console.log(`ID: ${row.id}`);
        console.log(`Application: ${row.application}`);
        console.log(`Keys: ${row.keys}`);
        console.log(`Description: ${row.description}`);
        console.log(`Category: ${row.category || 'N/A'}`);
        console.log(`Created At: ${row.created_at}`);
        console.log(`Windows Protection: ${row.windows_protection_level || 'none'}`);
        console.log(`macOS Protection: ${row.macos_protection_level || 'none'}\n`);
      });
    } else {
      console.log('No shortcuts found in the database.\n');
    }
  });
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

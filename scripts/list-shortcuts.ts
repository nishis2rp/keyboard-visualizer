import { withDatabase } from './lib/db';

async function main() {
  const appFilter = process.argv.find(arg => arg.startsWith('--app='))?.split('=')[1] || 
                   (process.argv.indexOf('--app') !== -1 ? process.argv[process.argv.indexOf('--app') + 1] : null);

  await withDatabase(async (client) => {
    let query = 'SELECT id, application, keys, description, category, created_at, windows_protection_level, macos_protection_level, difficulty, sort_order FROM shortcuts';
    const params: any[] = [];

    if (appFilter) {
      query += ' WHERE application = $1';
      params.push(appFilter);
    }

    query += ' ORDER BY sort_order';
    const result = await client.query(query, params);

    console.log(`\nFound ${result.rows.length} shortcut(s):\n`);

    if (result.rows.length > 0) {
      result.rows.forEach((row) => {
        console.log(`ID: ${row.id}`);
        console.log(`Application: ${row.application}`);
        console.log(`Keys: ${row.keys}`);
        console.log(`Difficulty: ${row.difficulty || 'N/A'}`);
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

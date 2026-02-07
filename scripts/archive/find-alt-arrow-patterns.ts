import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    console.log('Searching for "Alt + Arrow" patterns in the database...');
    const selectQuery = `
      SELECT id, application, keys, description, difficulty
      FROM shortcuts
      WHERE keys ILIKE '%Alt%'
        AND (
          keys ILIKE '%Up' OR
          keys ILIKE '%Down' OR
          keys ILIKE '%Left' OR
          keys ILIKE '%Right'
        );
    `;
    const result = await client.query(selectQuery);

    if (result.rows.length === 0) {
      console.log('No shortcuts found containing "Alt" and "Arrow".');
    } else {
      console.log(`Found ${result.rows.length} shortcuts containing "Alt" and "Arrow":`);
      result.rows.forEach(row => {
        console.log(`  ID: ${row.id}, App: ${row.application}, Keys: ${row.keys}, Difficulty: ${row.difficulty}`);
      });
    }
  });
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

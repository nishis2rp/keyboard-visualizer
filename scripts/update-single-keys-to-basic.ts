import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    console.log('Finding single-key shortcuts to update to basic difficulty...');
    const selectQuery = `
      SELECT id, application, keys, description, difficulty
      FROM shortcuts
      WHERE keys NOT ILIKE '% + %' -- Exclude shortcuts with '+' (modifiers or multiple keys)
        AND LENGTH(TRIM(keys)) > 0 -- Exclude empty or whitespace-only keys
        AND difficulty != 'basic';
    `;
    const shortcutsToUpdate = await client.query(selectQuery);

    if (shortcutsToUpdate.rows.length === 0) {
      console.log('No single-key shortcuts found that need to be updated to basic difficulty.');
      return;
    }

    const idsToUpdate = shortcutsToUpdate.rows.map(row => row.id);

    console.log(`Updating ${idsToUpdate.length} single-key shortcuts to basic difficulty...`);
    
    const updateQuery = `
      UPDATE shortcuts
      SET difficulty = 'basic'
      WHERE id = ANY($1::bigint[])
      RETURNING id, application, keys, description, difficulty;
    `;
    const result = await client.query(updateQuery, [idsToUpdate]);

    console.log(`Updated ${result.rowCount} shortcuts to basic difficulty.\n`);

    console.log('Updated shortcuts:');
    result.rows.forEach(row => {
      console.log(`  ID: ${row.id}, App: ${row.application}, Keys: ${row.keys}, Desc: ${row.description}, New Difficulty: ${row.difficulty}`);
    });
  });
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

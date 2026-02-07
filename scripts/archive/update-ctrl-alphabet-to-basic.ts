import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    // Select shortcuts that are "Ctrl + [A-Z]" and not already basic
    console.log('Finding "Ctrl + Alphabet" shortcuts to update to basic difficulty...');
    const selectQuery = `
      SELECT id, application, keys, description, difficulty
      FROM shortcuts
      WHERE keys LIKE 'Ctrl + _'
        AND LENGTH(keys) = 8 -- Ensures it's exactly "Ctrl + A" (8 characters)
        AND SUBSTRING(keys FROM 8 FOR 1) ~ '[A-Z]' -- Ensures the last character is an uppercase letter
        AND difficulty != 'basic';
    `;
    const shortcutsToUpdate = await client.query(selectQuery);

    if (shortcutsToUpdate.rows.length === 0) {
      console.log('No "Ctrl + Alphabet" shortcuts found that need to be updated to basic difficulty.');
      return;
    }

    const idsToUpdate = shortcutsToUpdate.rows.map(row => row.id);

    console.log(`Updating ${idsToUpdate.length} "Ctrl + Alphabet" shortcuts to basic difficulty...`);
    
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

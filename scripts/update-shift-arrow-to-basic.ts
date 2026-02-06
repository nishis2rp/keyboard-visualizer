import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    // Define the patterns for "Shift + Arrow" shortcuts
    const shiftArrowPatterns = [
      'Shift + ArrowUp',
      'Shift + ArrowDown',
      'Shift + ArrowLeft',
      'Shift + ArrowRight'
    ];

    console.log('Finding "Shift + Arrow" shortcuts to update to basic difficulty...');
    const selectQuery = `
      SELECT id, application, keys, description, difficulty
      FROM shortcuts
      WHERE keys = ANY($1::text[])
        AND difficulty != 'basic';
    `;
    const shortcutsToUpdate = await client.query(selectQuery, [shiftArrowPatterns]);

    if (shortcutsToUpdate.rows.length === 0) {
      console.log('No "Shift + Arrow" shortcuts found that need to be updated to basic difficulty.');
      return;
    }

    const idsToUpdate = shortcutsToUpdate.rows.map(row => row.id);

    console.log(`Updating ${idsToUpdate.length} "Shift + Arrow" shortcuts to basic difficulty...`);
    
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

import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    // Define all patterns to update
    const patternsToUpdate = [
      'Shift + Up',
      'Shift + Down',
      'Shift + Left',
      'Shift + Right',
      'Shift + ArrowUp',
      'Shift + ArrowDown',
      'Shift + ArrowLeft',
      'Shift + ArrowRight',
      'Shift + Alt + Up',
      'Shift + Alt + Down',
      'Shift + Alt + Left',
      'Shift + Alt + Right',
      'Shift + PageUp',
      'Shift + PageDown',
      'Ctrl + Shift + Alt + PageUp',
      'Ctrl + Shift + Alt + PageDown',
      'Cmd + Shift + Option + PageUp',
      'Cmd + Shift + Option + PageDown'
    ];

    console.log('Finding complex Shift combinations to update to basic difficulty...');
    const selectQuery = `
      SELECT id, application, keys, description, difficulty
      FROM shortcuts
      WHERE keys = ANY($1::text[])
        AND difficulty != 'basic';
    `;
    const shortcutsToUpdate = await client.query(selectQuery, [patternsToUpdate]);

    if (shortcutsToUpdate.rows.length === 0) {
      console.log('No complex Shift combinations found that need to be updated to basic difficulty.');
      return;
    }

    const idsToUpdate = shortcutsToUpdate.rows.map(row => row.id);

    console.log(`Updating ${idsToUpdate.length} complex Shift combinations to basic difficulty...`);
    
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

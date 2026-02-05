import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    const altArrowPatterns = [
      'Alt + Up',
      'Alt + Down',
      'Alt + Left', // Assuming these might exist even if not found in the recent search
      'Alt + Right' // Assuming these might exist even if not found in the recent search
    ];

    console.log('Finding "Alt + Arrow" shortcuts to update to basic difficulty...');
    const selectQuery = `
      SELECT id, application, keys, description, difficulty
      FROM shortcuts
      WHERE keys = ANY($1::text[])
        AND difficulty != 'basic';
    `;
    const shortcutsToUpdate = await client.query(selectQuery, [altArrowPatterns]);

    if (shortcutsToUpdate.rows.length === 0) {
      console.log('No "Alt + Arrow" shortcuts found that need to be updated to basic difficulty.');
      return;
    }

    const idsToUpdate = shortcutsToUpdate.rows.map(row => row.id);

    console.log(`Updating ${idsToUpdate.length} "Alt + Arrow" shortcuts to basic difficulty...`);
    
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

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});


import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    // IDs that should revert to 'hard'
    const idsToRevertToHard = [
      989, // Ctrl + Shift + Alt + PageUp
      990, // Ctrl + Shift + Alt + PageDown
      1141, // Cmd + Shift + Option + PageUp
      1142, // Cmd + Shift + Option + PageDown
      1260, // Shift + Alt + Up
      1261  // Shift + Alt + Down
    ];

    if (idsToRevertToHard.length === 0) {
      console.log('No shortcuts identified to revert to hard difficulty.');
      return;
    }

    console.log(`Reverting ${idsToRevertToHard.length} shortcuts to 'hard' difficulty...`);
    
    const updateQuery = `
      UPDATE shortcuts
      SET difficulty = 'hard'
      WHERE id = ANY($1::bigint[])
      RETURNING id, application, keys, description, difficulty;
    `;
    const result = await client.query(updateQuery, [idsToRevertToHard]);

    console.log(`Reverted ${result.rowCount} shortcuts to 'hard' difficulty.\n`);

    console.log('Reverted shortcuts:');
    result.rows.forEach(row => {
      console.log(`  ID: ${row.id}, App: ${row.application}, Keys: ${row.keys}, Desc: ${row.description}, New Difficulty: ${row.difficulty}`);
    });
  });
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

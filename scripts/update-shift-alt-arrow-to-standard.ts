import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    // IDs that should be set to 'standard'
    const idsToSetToStandard = [
      1260, // Shift + Alt + Up
      1261  // Shift + Alt + Down
    ];

    if (idsToSetToStandard.length === 0) {
      console.log('No shortcuts identified to set to standard difficulty.');
      return;
    }

    console.log(`Updating ${idsToSetToStandard.length} shortcuts to 'standard' difficulty...`);
    
    const updateQuery = `
      UPDATE shortcuts
      SET difficulty = 'standard'
      WHERE id = ANY($1::bigint[])
        AND difficulty != 'standard'
      RETURNING id, application, keys, description, difficulty;
    `;
    const result = await client.query(updateQuery, [idsToSetToStandard]);

    console.log(`Updated ${result.rowCount} shortcuts to 'standard' difficulty.\n`);

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

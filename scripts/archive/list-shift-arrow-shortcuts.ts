import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    const shiftArrowPatterns = [
      'Shift + ArrowUp',
      'Shift + ArrowDown',
      'Shift + ArrowLeft',
      'Shift + ArrowRight'
    ];

    console.log('Listing "Shift + Arrow" shortcuts and their current difficulty...');
    const selectQuery = `
      SELECT id, application, keys, description, difficulty
      FROM shortcuts
      WHERE keys = ANY($1::text[]);
    `;
    const result = await client.query(selectQuery, [shiftArrowPatterns]);

    if (result.rows.length === 0) {
      console.log('No "Shift + Arrow" shortcuts found with the specified patterns.');
    } else {
      console.log(`Found ${result.rows.length} "Shift + Arrow" shortcuts:`)
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

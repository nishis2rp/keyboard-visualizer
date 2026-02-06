import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database');

    // Update Win+G to always-protected
    const result = await client.query(
      `UPDATE shortcuts
       SET windows_protection_level = 'always-protected'
       WHERE keys = 'Win + G'
       RETURNING id, keys, description, windows_protection_level`
    );

    console.log('\nUpdated shortcuts:');
    console.log(result.rows);
    console.log(`\nTotal updated: ${result.rowCount}`);
  });
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

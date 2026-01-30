// scripts/check-pageup-shortcuts.ts
import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // Check all variations of PageUp
    const variations = ['PageUp', 'Page Up', 'PgUp'];

    for (const variation of variations) {
      const result = await client.query(
        `SELECT application, keys, description
         FROM shortcuts
         WHERE keys LIKE $1
         ORDER BY application, keys
         LIMIT 20`,
        [`%${variation}%`]
      );

      if (result.rows.length > 0) {
        console.log(`\n"${variation}" found (${result.rows.length} shortcuts):`);
        result.rows.forEach(row => {
          console.log(`  ${row.application}: "${row.keys}" - ${row.description}`);
        });
      } else {
        console.log(`\n"${variation}": Not found`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

main();

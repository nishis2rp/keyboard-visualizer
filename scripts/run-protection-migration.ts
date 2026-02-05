import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { withDatabase } from './lib/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Running protection level migration...');

  await withDatabase(async (client) => {
    console.log('✓ Connected to Supabase PostgreSQL\n');

    // Run migration 022
    console.log('Running migration: 022_set_word_powerpoint_protection_levels.sql');
    const sql = await fs.readFile(
      path.join(__dirname, '../supabase/migrations/022_set_word_powerpoint_protection_levels.sql'),
      'utf-8'
    );
    await client.query(sql);
    console.log('✓ Protection levels updated\n');

    console.log('✓ Migration completed successfully!');
  });
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

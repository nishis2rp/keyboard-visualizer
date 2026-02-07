import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { withDatabase } from './lib/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Starting new migrations...');

  await withDatabase(async (client) => {
    console.log('✓ Connected to Supabase PostgreSQL\n');

    // Run Word shortcuts migration
    console.log('Running migration: 020_add_word_shortcuts.sql');
    const sql020 = await fs.readFile(
      path.join(__dirname, '../supabase/migrations/020_add_word_shortcuts.sql'),
      'utf-8'
    );
    await client.query(sql020);
    console.log('✓ Word shortcuts added\n');

    // Run PowerPoint shortcuts migration
    console.log('Running migration: 021_add_powerpoint_shortcuts.sql');
    const sql021 = await fs.readFile(
      path.join(__dirname, '../supabase/migrations/021_add_powerpoint_shortcuts.sql'),
      'utf-8'
    );
    await client.query(sql021);
    console.log('✓ PowerPoint shortcuts added\n');

    console.log('✓ All new migrations completed successfully!');
  });
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

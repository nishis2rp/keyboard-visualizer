// scripts/run-new-migrations.ts
import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log('Starting new migrations...');

  try {
    await client.connect();
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
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

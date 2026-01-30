// scripts/run-protection-migration.ts
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
  console.log('Running protection level migration...');

  try {
    await client.connect();
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

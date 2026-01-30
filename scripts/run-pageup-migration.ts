// scripts/run-pageup-migration.ts
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
  console.log('Running PageUp/PageDown normalization migration...');

  try {
    await client.connect();
    console.log('✓ Connected to Supabase PostgreSQL\n');

    console.log('Running migration: 023_normalize_pageup_pagedown.sql');
    const sql = await fs.readFile(
      path.join(__dirname, '../supabase/migrations/023_normalize_pageup_pagedown.sql'),
      'utf-8'
    );
    const result = await client.query(sql);
    console.log('✓ PageUp/PageDown normalized\n');

    // Verify the changes
    console.log('Verifying changes...');
    const checkResult = await client.query(
      `SELECT COUNT(*) as count FROM shortcuts WHERE keys LIKE '%Page Up%' OR keys LIKE '%Page Down%'`
    );
    console.log(`Shortcuts with "Page Up" or "Page Down" (should be 0): ${checkResult.rows[0].count}`);

    console.log('\n✓ Migration completed successfully!');
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

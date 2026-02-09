import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { withDatabase } from './lib/db';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration(client: Client, migrationFile: string) {
  const migrationPath = path.join(__dirname, '../supabase/migrations', migrationFile);
  try {
    const sql = await fs.readFile(migrationPath, 'utf-8');
    console.log(`Running migration: ${migrationFile}`);
    await client.query(sql);
    console.log(`✓ Completed: ${migrationFile}`);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error(`Migration file not found: ${migrationPath}`);
    } else {
      throw error;
    }
  }
}

async function main() {
  const migrationFile = process.argv[2];
  if (!migrationFile) {
    console.error('Usage: tsx scripts/run-single-migration.ts <migration_file_name>');
    process.exit(1);
  }

  console.log(`Starting migration for ${migrationFile}...`);

  await withDatabase(async (client) => {
    console.log('✓ Connected to Supabase PostgreSQL\n');

    await runMigration(client, migrationFile);

    console.log('\n✓ Migration completed successfully!');
  });
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { withDatabase } from './lib/db';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration(client: Client, migrationFile: string) {
  const migrationPath = path.join(__dirname, '../supabase/migrations', migrationFile);
  const sql = await fs.readFile(migrationPath, 'utf-8');

  console.log(`Running migration: ${migrationFile}`);
  await client.query(sql);
  console.log(`✓ Completed: ${migrationFile}`);
}

async function main() {
  console.log('Starting migration...');

  await withDatabase(async (client) => {
    console.log('✓ Connected to Supabase PostgreSQL\n');

    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const files = await fs.readdir(migrationsDir);

    const migrations = files
      .filter(file => file.endsWith('.sql'))
      .sort((a, b) => {
        const numA = parseInt(a.split('_')[0]);
        const numB = parseInt(b.split('_')[0]);
        return numA - numB;
      });

    for (const migration of migrations) {
      await runMigration(client, migration);
    }

    console.log('\n✓ All migrations completed successfully!');
  });
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});


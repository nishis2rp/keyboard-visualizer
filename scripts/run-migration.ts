// scripts/run-migration.ts
import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase PostgreSQL connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration(migrationFile: string) {
  const migrationPath = path.join(__dirname, '../supabase/migrations', migrationFile);
  const sql = await fs.readFile(migrationPath, 'utf-8');

  console.log(`Running migration: ${migrationFile}`);
  await client.query(sql);
  console.log(`✓ Completed: ${migrationFile}`);
}

async function main() {
  console.log('Starting migration...');

  try {
    await client.connect();
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
      await runMigration(migration);
    }

    console.log('\n✓ All migrations completed successfully!');
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

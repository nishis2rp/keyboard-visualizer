// scripts/run-auth-migration.ts
import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log('Starting authentication tables migration...');

  try {
    await client.connect();
    console.log('✓ Connected to Supabase PostgreSQL\n');

    // Run authentication tables migration
    console.log('Running migration: 025_add_user_authentication_tables.sql');
    const sql025 = await fs.readFile(
      path.join(__dirname, '../supabase/migrations/025_add_user_authentication_tables.sql'),
      'utf-8'
    );
    await client.query(sql025);
    console.log('✓ User authentication tables created\n');

    console.log('✓ Authentication migration completed successfully!');
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

// scripts/add-ctrl-esc-shortcut.ts
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
  console.log('Adding Ctrl + Esc shortcut...');

  try {
    await client.connect();
    console.log('✓ Connected to Supabase PostgreSQL\n');

    const migrationPath = path.join(__dirname, '../supabase/migrations/011_add_ctrl_esc_shortcut.sql');
    const sql = await fs.readFile(migrationPath, 'utf-8');

    await client.query(sql);
    console.log('✓ Successfully added Ctrl + Esc shortcut!');
  } catch (error) {
    console.error('Failed to add shortcut:', error);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

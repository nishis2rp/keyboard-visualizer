// scripts/update-slack-shortcuts.ts
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
  console.log('Updating Slack shortcuts...');

  try {
    await client.connect();
    console.log('✓ Connected to Supabase PostgreSQL\n');

    const migrationPath = path.join(__dirname, '../supabase/migrations/012_update_slack_shortcuts.sql');
    const sql = await fs.readFile(migrationPath, 'utf-8');

    await client.query(sql);
    console.log('✓ Successfully updated Slack shortcuts!');
  } catch (error) {
    console.error('Failed to update shortcuts:', error);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function runMigration() {
  console.log('\nStarting migration 019...');

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database');

    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '019_set_fullscreen_preventable_shortcuts_level.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log('✓ Loaded migration file');
    console.log('\nExecuting UPDATE statement...\n');

    const result = await client.query(sql);
    console.log(`✅ Migration completed! Updated ${result.rowCount} rows.`);

    await client.end();
  } catch (err) {
    console.error('❌ Migration failed:', err);
    await client.end();
    process.exit(1);
  }
}

runMigration();

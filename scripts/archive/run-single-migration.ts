import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Try .env.local first, then fall back to .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function runSingleMigration(migrationFile: string) {
  console.log(`\nStarting migration: ${migrationFile}...`);

  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

  try {
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', migrationFile);
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log(`✓ Loaded migration: ${migrationFile}`);
    console.log('\nExecuting SQL...\n');

    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      // Try direct query instead
      const pg = await import('pg');
      const connectionString = process.env.DATABASE_URL;

      if (!connectionString) {
        throw new Error('DATABASE_URL not found in .env');
      }

      const client = new pg.Client({ connectionString });
      await client.connect();

      await client.query(sql);
      await client.end();

      console.log(`✅ Migration ${migrationFile} completed successfully!`);
    } else {
      console.log(`✅ Migration ${migrationFile} completed successfully!`);
    }
  } catch (err) {
    console.error(`❌ Migration ${migrationFile} failed:`, err);
    throw err;
  }
}

async function main() {
  const migrationFile = process.argv[2];

  if (!migrationFile) {
    console.error('Usage: tsx scripts/run-single-migration.ts <migration-file>');
    process.exit(1);
  }

  try {
    await runSingleMigration(migrationFile);
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();

import pg from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const { Client } = pg;

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('supabase.co')
      ? { rejectUnauthorized: false }
      : undefined,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read migration file
    const migrationPath = path.join(
      process.cwd(),
      'supabase',
      'migrations',
      '043_add_windows11_ctrl_a.sql'
    );
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration: 043_add_windows11_ctrl_a.sql');
    await client.query(sql);
    console.log('✓ Migration completed successfully');

    // Verify the insertion
    const result = await client.query(
      `SELECT * FROM shortcuts WHERE application = 'windows11' AND keys = 'Ctrl + A'`
    );

    if (result.rows.length > 0) {
      console.log('\n✓ Windows11 Ctrl+A shortcut added:');
      console.log(result.rows[0]);
    } else {
      console.log('\n⚠ Shortcut may have already existed (ON CONFLICT DO NOTHING)');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

runMigration();

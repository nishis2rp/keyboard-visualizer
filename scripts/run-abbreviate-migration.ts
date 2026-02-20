import pg from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();
const { Client } = pg;

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Read migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '046_abbreviate_key_names.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log('📝 Running migration: 046_abbreviate_key_names.sql\n');

    // Execute migration
    await client.query(sql);

    console.log('✅ Migration completed successfully!\n');

    // Verify changes
    console.log('🔍 Verifying changes...\n');

    const { rows } = await client.query(`
      SELECT application, keys, description
      FROM shortcuts
      WHERE keys ~* '(BS|Esc|PgDn|PgUp|Ins|Del)'
      LIMIT 10
    `);

    console.log('Sample shortcuts with abbreviated keys:');
    rows.forEach(row => {
      console.log(`  [${row.application}] ${row.keys} - ${row.description}`);
    });

  } catch (error) {
    console.error('❌ Error running migration:', error);
    throw error;
  } finally {
    await client.end();
    console.log('\n✅ Database connection closed');
  }
}

runMigration();

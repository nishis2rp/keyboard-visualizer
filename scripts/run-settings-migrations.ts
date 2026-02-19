import pg from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const { Client } = pg;

const runMigration = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const migrations = [
      '055_add_app_settings_table.sql',
      '056_add_global_settings_table.sql'
    ];

    for (const migration of migrations) {
      const migrationPath = path.join(
        process.cwd(),
        'supabase',
        'migrations',
        migration
      );

      if (!fs.existsSync(migrationPath)) {
        console.log(`⚠️  Migration file not found: ${migration}`);
        continue;
      }

      console.log(`\n📄 Running migration: ${migration}`);
      const sql = fs.readFileSync(migrationPath, 'utf8');

      await client.query(sql);
      console.log(`✅ Successfully ran migration: ${migration}`);
    }

    // Verify tables were created
    console.log('\n🔍 Verifying tables...');

    const checkAppSettings = await client.query(
      `SELECT COUNT(*) as count FROM app_settings`
    );
    console.log(`✅ app_settings table: ${checkAppSettings.rows[0].count} rows`);

    const checkGlobalSettings = await client.query(
      `SELECT COUNT(*) as count FROM global_settings`
    );
    console.log(`✅ global_settings table: ${checkGlobalSettings.rows[0].count} rows`);

    // Display sample settings
    console.log('\n📊 Sample global settings:');
    const globalSettings = await client.query(
      `SELECT setting_key, setting_value, setting_type FROM global_settings LIMIT 5`
    );
    console.table(globalSettings.rows);

    console.log('\n📊 Sample app settings:');
    const appSettings = await client.query(
      `SELECT application_id, setting_key, setting_value FROM app_settings LIMIT 5`
    );
    console.table(appSettings.rows);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('\n✅ Database connection closed');
  }
};

runMigration();

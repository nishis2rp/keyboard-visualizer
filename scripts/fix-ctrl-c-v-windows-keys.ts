import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Ctrl+C と Ctrl+V の windows_keys を null に設定
    console.log('🔧 Fixing windows_keys for Ctrl+C and Ctrl+V...\n');

    const result = await client.query(
      `UPDATE shortcuts
       SET windows_keys = NULL
       WHERE application = 'windows11'
         AND id IN (774, 775)
       RETURNING id, keys, windows_keys, macos_keys, description`
    );

    console.log(`✅ Updated ${result.rowCount} shortcuts:\n`);

    result.rows.forEach(row => {
      console.log(`ID ${row.id}: ${row.keys}`);
      console.log(`  Description: ${row.description}`);
      console.log(`  windows_keys: ${row.windows_keys || 'null'}`);
      console.log(`  macos_keys: ${row.macos_keys || 'null'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('✅ Database connection closed');
  }
}

main();

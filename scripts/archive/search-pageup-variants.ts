import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function searchPageUpVariants() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // PageUp, PgUp, Page Up などの表記を検索
    const result = await client.query(
      `SELECT id, application, keys, windows_keys, macos_keys, description
       FROM shortcuts
       WHERE application = 'chrome'
         AND (
           keys LIKE '%PageUp%' OR keys LIKE '%PageDown%' OR
           keys LIKE '%PgUp%' OR keys LIKE '%PgDn%' OR
           keys LIKE '%Page Up%' OR keys LIKE '%Page Down%' OR
           windows_keys LIKE '%PageUp%' OR windows_keys LIKE '%PageDown%' OR
           windows_keys LIKE '%PgUp%' OR windows_keys LIKE '%PgDn%' OR
           windows_keys LIKE '%Page Up%' OR windows_keys LIKE '%Page Down%'
         )
       ORDER BY keys`
    );

    console.log(`Found ${result.rows.length} Chrome shortcuts with PageUp/PageDown variants:\n`);

    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}`);
      console.log(`   Application: ${row.application}`);
      console.log(`   keys: "${row.keys}"`);
      console.log(`   windows_keys: "${row.windows_keys}"`);
      console.log(`   macos_keys: "${row.macos_keys}"`);
      console.log(`   Description: ${row.description}\n`);
    });

    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

searchPageUpVariants();

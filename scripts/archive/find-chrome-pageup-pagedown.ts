import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function findChromePageUpPageDown() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // ChromeアプリのPageUp/PageDownを確認
    const result = await client.query(
      `SELECT id, application, keys, description, category, difficulty, platform,
              windows_keys, macos_keys, windows_protection_level, macos_protection_level
       FROM shortcuts
       WHERE application = 'chrome'
         AND (keys LIKE '%PageUp%' OR keys LIKE '%PageDown%')
       ORDER BY keys`
    );

    console.log(`Found ${result.rows.length} Chrome shortcuts with PageUp/PageDown:\n`);

    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}`);
      console.log(`   Keys: ${row.keys}`);
      console.log(`   Windows Keys: ${row.windows_keys}`);
      console.log(`   macOS Keys: ${row.macos_keys}`);
      console.log(`   Description: ${row.description}`);
      console.log(`   Category: ${row.category}`);
      console.log(`   Protection: Win=${row.windows_protection_level}, Mac=${row.macos_protection_level}\n`);
    });

    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

findChromePageUpPageDown();

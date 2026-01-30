import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function checkPageUpPageDownDuplicates() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // PageUp/PageDownの全レコードを確認
    const result = await client.query(
      `SELECT id, application, keys, description, category, difficulty, platform, windows_protection_level, macos_protection_level
       FROM shortcuts
       WHERE keys IN ('Ctrl + PageUp', 'Ctrl + PageDown')
       ORDER BY keys, application`
    );

    console.log(`Found ${result.rows.length} records for Ctrl + PageUp/PageDown:\n`);

    const grouped = new Map<string, any[]>();
    result.rows.forEach(row => {
      if (!grouped.has(row.keys)) {
        grouped.set(row.keys, []);
      }
      grouped.get(row.keys)!.push(row);
    });

    grouped.forEach((rows, key) => {
      console.log(`\n${key}: (${rows.length} records)`);
      rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ID: ${row.id} | App: ${row.application} | Desc: ${row.description}`);
        console.log(`     Category: ${row.category} | Difficulty: ${row.difficulty} | Platform: ${row.platform}`);
        console.log(`     Protection: Win=${row.windows_protection_level}, Mac=${row.macos_protection_level}`);
      });
    });

    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

checkPageUpPageDownDuplicates();

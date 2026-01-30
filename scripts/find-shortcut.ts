import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function findShortcut(searchKey: string) {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();

    const result = await client.query(
      'SELECT application, keys, description, windows_protection_level, macos_protection_level FROM shortcuts WHERE keys = $1',
      [searchKey]
    );

    console.log(`\nSearching for: "${searchKey}"\n`);

    if (result.rows.length > 0) {
      console.log(`Found ${result.rows.length} result(s):\n`);
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. Application: ${row.application}`);
        console.log(`   Description: ${row.description}`);
        console.log(`   Windows Protection: ${row.windows_protection_level || 'none'}`);
        console.log(`   macOS Protection: ${row.macos_protection_level || 'none'}\n`);
      });
    } else {
      console.log(`❌ No shortcuts found for "${searchKey}"\n`);
    }

    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

const searchKey = process.argv[2];
if (!searchKey) {
  console.error('Usage: tsx scripts/find-shortcut.ts "Ctrl + PageUp"');
  process.exit(1);
}

findShortcut(searchKey);

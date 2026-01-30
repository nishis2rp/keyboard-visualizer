// scripts/check-all-protection-levels.ts
import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const targetKeys = [
  'Ctrl + W',
  'Ctrl + N',
  'Ctrl + T',
  'Ctrl + Tab',
  'Ctrl + PageUp',
  'Ctrl + PageDown',
  'Ctrl + Shift + N',
  'Ctrl + Shift + W',
  'Ctrl + Shift + Tab',
  'Ctrl + Page Down',
  'Ctrl + Page Up',
  'Ctrl + Shift + Page Down',
  'Ctrl + Shift + Page Up'
];

async function main() {
  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    for (const key of targetKeys) {
      const result = await client.query(
        `SELECT application, keys, windows_protection_level, macos_protection_level
         FROM shortcuts
         WHERE keys = $1
         ORDER BY application`,
        [key]
      );

      if (result.rows.length > 0) {
        console.log(`\n${key}:`);
        result.rows.forEach(row => {
          const winLevel = row.windows_protection_level || 'none';
          const macLevel = row.macos_protection_level || 'none';
          console.log(`  ${row.application}: Win=${winLevel}, Mac=${macLevel}`);
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

main();

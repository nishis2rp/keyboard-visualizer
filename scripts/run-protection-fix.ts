import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { withDatabase } from './lib/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Running protection level fixes...');

  await withDatabase(async (client) => {
    console.log('✓ Connected to Supabase PostgreSQL\n');

    console.log('Running migration: 024_fix_protection_levels.sql');
    const sql = await fs.readFile(
      path.join(__dirname, '../supabase/migrations/024_fix_protection_levels.sql'),
      'utf-8'
    );
    await client.query(sql);
    console.log('✓ Protection levels fixed\n');

    // Verify Alt+F4
    console.log('Verifying Alt+F4...');
    const altF4 = await client.query(
      `SELECT application, windows_protection_level, macos_protection_level
       FROM shortcuts
       WHERE keys = 'Alt + F4' AND application IN ('word', 'powerpoint', 'chrome', 'excel')
       ORDER BY application`
    );
    altF4.rows.forEach(row => {
      console.log(`  ${row.application}: Win=${row.windows_protection_level}, Mac=${row.macos_protection_level}`);
    });

    // Verify Ctrl+P
    console.log('\nVerifying Ctrl+P (should all be none)...');
    const ctrlP = await client.query(
      `SELECT application, windows_protection_level, macos_protection_level
       FROM shortcuts
       WHERE keys = 'Ctrl + P'
       ORDER BY application`
    );
    ctrlP.rows.forEach(row => {
      const winLevel = row.windows_protection_level || 'none';
      const macLevel = row.macos_protection_level || 'none';
      console.log(`  ${row.application}: Win=${winLevel}, Mac=${macLevel}`);
    });

    console.log('\n✓ Migration completed successfully!');
  });
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

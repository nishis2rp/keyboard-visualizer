// scripts/check-protection-status.ts
import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // Check Alt+F4
    console.log('=== Alt+F4 ===');
    const altF4 = await client.query(
      `SELECT application, keys, windows_protection_level, macos_protection_level
       FROM shortcuts
       WHERE keys = 'Alt + F4'
       ORDER BY application`
    );
    altF4.rows.forEach(row => {
      console.log(`  ${row.application}: Win=${row.windows_protection_level || 'none'}, Mac=${row.macos_protection_level || 'none'}`);
    });

    // Check Ctrl+P
    console.log('\n=== Ctrl+P ===');
    const ctrlP = await client.query(
      `SELECT application, keys, windows_protection_level, macos_protection_level
       FROM shortcuts
       WHERE keys = 'Ctrl + P'
       ORDER BY application`
    );
    ctrlP.rows.forEach(row => {
      console.log(`  ${row.application}: Win=${row.windows_protection_level || 'none'}, Mac=${row.macos_protection_level || 'none'}`);
    });

    // Check Page Up / PageUp in Word and PowerPoint
    console.log('\n=== Page Up / PageUp in Word and PowerPoint ===');
    const pageUp = await client.query(
      `SELECT application, keys, description
       FROM shortcuts
       WHERE (application = 'word' OR application = 'powerpoint')
         AND (keys LIKE '%Page Up%' OR keys LIKE '%PageUp%' OR keys LIKE '%Page Down%' OR keys LIKE '%PageDown%')
       ORDER BY application, keys`
    );
    pageUp.rows.forEach(row => {
      console.log(`  ${row.application}: "${row.keys}" - ${row.description}`);
    });

  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

main();

// scripts/populate-protection-levels.ts
import 'dotenv/config';
import { Client } from 'pg';
import { getProtectionLevel } from '../src/constants/systemProtectedShortcuts'; // systemProtectedShortcuts.tsのロジックをインポート

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function populateProtectionLevels() {
  console.log('Connecting to database...');
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL.\n');

    // すべてのショートカットレコードを取得
    const result = await client.query('SELECT id, application, windows_keys, macos_keys FROM shortcuts;');
    const shortcuts = result.rows;

    console.log(`Processing ${shortcuts.length} shortcuts...`);

    for (let i = 0; i < shortcuts.length; i++) {
      const shortcut = shortcuts[i];
      const { id, application, windows_keys, macos_keys } = shortcut;

      let winProtection = 'none';
      if (windows_keys) {
        winProtection = getProtectionLevel(windows_keys, application);
      }

      let macProtection = 'none';
      if (macos_keys) {
        macProtection = getProtectionLevel(macos_keys, application);
      }

      // データベースを更新
      await client.query(
        `UPDATE shortcuts SET windows_protection_level = $1, macos_protection_level = $2 WHERE id = $3;`,
        [winProtection, macProtection, id]
      );
      if ((i + 1) % 100 === 0) {
        console.log(`Processed ${i + 1} of ${shortcuts.length} shortcuts...`);
      }
    }

    console.log('\n✓ All protection levels populated successfully!');

  } catch (error) {
    console.error('Failed to populate protection levels:', error);
    throw error;
  } finally {
    await client.end();
  }
}

populateProtectionLevels().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});

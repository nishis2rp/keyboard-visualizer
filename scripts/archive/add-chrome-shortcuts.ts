import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function addChromeShortcuts() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    const shortcuts = [
      {
        keys: 'Ctrl + PageUp',
        description: '前のタブへ移動',
        category: 'tabs',
        difficulty: 'intermediate'
      },
      {
        keys: 'Ctrl + PageDown',
        description: '次のタブへ移動',
        category: 'tabs',
        difficulty: 'intermediate'
      }
    ];

    console.log('Adding Chrome shortcuts...\n');

    for (const shortcut of shortcuts) {
      // 既存のショートカットを確認
      const existing = await client.query(
        'SELECT id FROM shortcuts WHERE application = $1 AND keys = $2',
        ['chrome', shortcut.keys]
      );

      if (existing.rows.length > 0) {
        console.log(`  ⚠️  ${shortcut.keys} already exists, skipping...`);
      } else {
        await client.query(
          `INSERT INTO shortcuts (application, keys, description, category, difficulty, windows_keys, macos_keys, platform, windows_protection_level, macos_protection_level)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            'chrome',
            shortcut.keys,
            shortcut.description,
            shortcut.category,
            shortcut.difficulty,
            shortcut.keys,
            shortcut.keys.replace('Ctrl', 'Cmd'),
            'Cross-Platform',
            'preventable_fullscreen',
            'preventable_fullscreen'
          ]
        );
        console.log(`  ✓ Added ${shortcut.keys}`);
      }
    }

    console.log('\n✅ Chrome shortcuts added successfully!');
    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

addChromeShortcuts();

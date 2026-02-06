import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('✓ Connected to database\n');

    console.log('Updating Chrome Alt+Shift+I and Alt+Shift+B shortcuts to preventable_fullscreen...\n');

    const result = await client.query(
      `UPDATE shortcuts
       SET windows_protection_level = 'preventable_fullscreen',
           macos_protection_level = 'preventable_fullscreen'
       WHERE application = 'chrome'
         AND id IN (80, 89)
       RETURNING *`
    );

    if (result.rows.length > 0) {
      console.log(`✓ Successfully updated ${result.rows.length} shortcuts:\n`);
      result.rows.forEach((shortcut) => {
        console.log(`ID: ${shortcut.id}`);
        console.log(`Keys: ${shortcut.keys}`);
        console.log(`Description: ${shortcut.description}`);
        console.log(`Windows Protection Level: ${shortcut.windows_protection_level}`);
        console.log(`macOS Protection Level: ${shortcut.macos_protection_level}`);
        console.log('---');
      });
    } else {
      console.log('No shortcuts were updated');
    }
  });
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

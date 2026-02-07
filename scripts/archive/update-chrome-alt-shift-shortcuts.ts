import { getSupabaseClient } from './lib/supabase';

async function main() {
  console.log('Updating Chrome Alt+Shift+I and Alt+Shift+B shortcuts to preventable_fullscreen...\n');

  const supabase = getSupabaseClient();

  // Update shortcuts with IDs 80 and 89
  const { data, error } = await supabase
    .from('shortcuts')
    .update({
      windows_protection_level: 'preventable_fullscreen',
      macos_protection_level: 'preventable_fullscreen'
    })
    .eq('application', 'chrome')
    .in('id', [80, 89])
    .select();

  if (error) {
    console.error('Error updating shortcuts:', error);
    process.exit(1);
  }

  if (data && data.length > 0) {
    console.log(`✓ Successfully updated ${data.length} shortcuts:\n`);
    data.forEach((shortcut) => {
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
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

import { getSupabaseClient } from './lib/supabase';

async function main() {
  console.log('Checking Chrome Alt+Shift+I and Alt+Shift+B shortcuts...\n');

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('shortcuts')
    .select('*')
    .eq('application', 'chrome')
    .or('keys.eq.Alt+Shift+I,keys.eq.Alt + Shift + I,keys.eq.Alt+Shift+B,keys.eq.Alt + Shift + B');

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  if (data && data.length > 0) {
    console.log(`Found ${data.length} shortcuts:\n`);
    data.forEach((shortcut) => {
      console.log(`ID: ${shortcut.id}`);
      console.log(`Keys: ${shortcut.keys}`);
      console.log(`Description: ${shortcut.description}`);
      console.log(`Windows Protection Level: ${shortcut.windows_protection_level || 'none'}`);
      console.log(`macOS Protection Level: ${shortcut.macos_protection_level || 'none'}`);
      console.log('---');
    });
  } else {
    console.log('No shortcuts found');
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

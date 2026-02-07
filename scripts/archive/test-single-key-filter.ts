import { getSupabaseClient } from './lib/supabase';

async function main() {
  const supabase = getSupabaseClient();

  const { data: richShortcuts, error } = await supabase
    .from('shortcuts')
    .select('*')
    .eq('application', 'gmail');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Total Gmail shortcuts:', richShortcuts.length);

  // Simulate getSingleKeyShortcuts logic
  const os = 'windows'; // or 'mac'

  const singleKeyShortcuts = richShortcuts
    .filter(item => {
      const targetKeys = (os === 'windows' ? item.windows_keys : item.macos_keys) || item.keys;
      if (!targetKeys) return false;
      const isSingleKey = !targetKeys.includes(' + ');

      // Debug output
      if (targetKeys === 'a' || targetKeys === 'e' || targetKeys === 'f' || targetKeys === 'r' || targetKeys === 'n') {
        console.log(`  ${targetKeys}: isSingleKey=${isSingleKey}, targetKeys="${targetKeys}"`);
      }

      return isSingleKey;
    });

  console.log('\nSingle-key shortcuts found:', singleKeyShortcuts.length);
  console.log('\nFirst 10 single-key shortcuts:');
  singleKeyShortcuts.slice(0, 10).forEach(item => {
    const targetKeys = (os === 'windows' ? item.windows_keys : item.macos_keys) || item.keys;
    console.log(`  ${targetKeys.padEnd(10)} - ${item.description}`);
  });

  // Check specific keys
  console.log('\nLooking for specific keys (a, e, f, r, n):');
  ['a', 'e', 'f', 'r', 'n'].forEach(key => {
    const found = singleKeyShortcuts.find(item => {
      const targetKeys = (os === 'windows' ? item.windows_keys : item.macos_keys) || item.keys;
      return targetKeys === key;
    });
    console.log(`  ${key}: ${found ? `✓ ${found.description}` : '✗ Not found'}`);
  });
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

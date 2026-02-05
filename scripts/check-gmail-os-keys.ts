import { getSupabaseClient } from './lib/supabase';

async function main() {
  const supabase = getSupabaseClient();

  const { data: allData, error } = await supabase
    .from('shortcuts')
    .select('keys, windows_keys, macos_keys, description')
    .eq('application', 'gmail');

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Filter single-key shortcuts (those without ' + ')
  const singleKeyData = allData?.filter(s => !s.keys.includes(' + ')) || [];

  console.log(`Total Gmail shortcuts: ${allData?.length}`);
  console.log(`Single-key shortcuts (based on keys column): ${singleKeyData.length}\n`);

  console.log('Sample single-key shortcuts with OS variants:\n');
  console.log('keys      | windows_keys | macos_keys | description');
  console.log('-'.repeat(80));

  singleKeyData.slice(0, 15).forEach(s => {
    const keys = (s.keys || 'null').padEnd(10);
    const win = (s.windows_keys || 'null').padEnd(12);
    const mac = (s.macos_keys || 'null').padEnd(10);
    console.log(`${keys} | ${win} | ${mac} | ${s.description}`);
  });

  // Count how many have null windows_keys or macos_keys
  const nullWindows = singleKeyData.filter(s => !s.windows_keys).length;
  const nullMac = singleKeyData.filter(s => !s.macos_keys).length;

  console.log('\n' + '='.repeat(80));
  console.log(`Single-key shortcuts with NULL windows_keys: ${nullWindows}`);
  console.log(`Single-key shortcuts with NULL macos_keys: ${nullMac}`);

  // Check if windows_keys/macos_keys have ' + ' when keys doesn't
  const problematic = singleKeyData.filter(s => {
    const winHasPlus = s.windows_keys && s.windows_keys.includes(' + ');
    const macHasPlus = s.macos_keys && s.macos_keys.includes(' + ');
    return winHasPlus || macHasPlus;
  });

  if (problematic.length > 0) {
    console.log(`\n⚠️ Found ${problematic.length} single-key shortcuts with ' + ' in OS-specific columns:`);
    problematic.forEach(s => {
      console.log(`  keys: "${s.keys}" -> windows: "${s.windows_keys}" | macos: "${s.macos_keys}"`);
    });
  }

  // Simulate getSingleKeyShortcuts for Windows
  const os = 'windows';
  const filtered = singleKeyData.filter(item => {
    const targetKeys = (os === 'windows' ? item.windows_keys : item.macos_keys) || item.keys;
    return targetKeys && !targetKeys.includes(' + ');
  });

  console.log(`\n${'='.repeat(80)}`);
  console.log(`After getSingleKeyShortcuts filtering (OS: ${os}): ${filtered.length} shortcuts`);
  console.log(`Missing: ${singleKeyData.length - filtered.length} shortcuts`);

  if (filtered.length < singleKeyData.length) {
    console.log('\nMissing shortcuts:');
    const missing = singleKeyData.filter(s => {
      const targetKeys = (os === 'windows' ? s.windows_keys : s.macos_keys) || s.keys;
      return !targetKeys || targetKeys.includes(' + ');
    });
    missing.slice(0, 10).forEach(s => {
      console.log(`  "${s.keys}" (win: "${s.windows_keys}", mac: "${s.macos_keys}") - ${s.description}`);
    });
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

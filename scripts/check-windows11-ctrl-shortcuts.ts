import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('\n🔍 Checking Windows 11 Ctrl+C and Ctrl+V shortcuts...\n');

  const { data, error } = await supabase
    .from('shortcuts')
    .select('*')
    .eq('application', 'windows11')
    .or('keys.eq.Ctrl + C,keys.eq.Ctrl + V,keys.eq.Ctrl+C,keys.eq.Ctrl+V')
    .order('id');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${data?.length || 0} shortcuts:\n`);

  data?.forEach(shortcut => {
    console.log(`ID: ${shortcut.id}`);
    console.log(`Keys: "${shortcut.keys}"`);
    console.log(`Description: ${shortcut.description}`);
    console.log(`Difficulty: ${shortcut.difficulty}`);
    console.log(`Category: ${shortcut.category}`);
    console.log(`Windows Protection: ${shortcut.windows_protection_level || 'none'}`);
    console.log(`macOS Protection: ${shortcut.macos_protection_level || 'none'}`);
    console.log('---\n');
  });

  // Also check all Windows 11 shortcuts with "Ctrl" to see the pattern
  const { data: allCtrl, error: allError } = await supabase
    .from('shortcuts')
    .select('id, keys, description')
    .eq('application', 'windows11')
    .ilike('keys', 'Ctrl%')
    .order('keys')
    .limit(20);

  if (!allError && allCtrl) {
    console.log(`\nSample of Windows 11 Ctrl shortcuts (${allCtrl.length}):\n`);
    allCtrl.forEach(s => {
      console.log(`${s.id}: "${s.keys}" - ${s.description}`);
    });
  }
}

main().catch(console.error);

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkChromePreventableShortcuts() {
  console.log('🔍 Checking Chrome shortcuts with preventable_fullscreen protection level...\n');

  const { data, error } = await supabase
    .from('shortcuts')
    .select('*')
    .eq('application', 'chrome')
    .or('windows_protection_level.eq.preventable_fullscreen,macos_protection_level.eq.preventable_fullscreen')
    .order('keys');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No preventable_fullscreen shortcuts found for Chrome');
    return;
  }

  console.log(`Found ${data.length} Chrome shortcuts with preventable_fullscreen protection:\n`);

  data.forEach((shortcut) => {
    console.log(`ID: ${shortcut.id}`);
    console.log(`Keys: ${shortcut.keys}`);
    console.log(`Windows Keys: ${shortcut.windows_keys || 'N/A'}`);
    console.log(`macOS Keys: ${shortcut.macos_keys || 'N/A'}`);
    console.log(`Description: ${shortcut.description}`);
    console.log(`Windows Protection: ${shortcut.windows_protection_level}`);
    console.log(`macOS Protection: ${shortcut.macos_protection_level}`);
    console.log('---');
  });

  console.log(`\n✅ Total: ${data.length} shortcuts`);
}

checkChromePreventableShortcuts();

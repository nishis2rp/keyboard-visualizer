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
  console.log('\n🔍 Checking Ctrl+C and Ctrl+V details...\n');

  const { data, error } = await supabase
    .from('shortcuts')
    .select('*')
    .eq('application', 'windows11')
    .in('id', [774, 775])
    .order('id');

  if (error) {
    console.error('Error:', error);
    return;
  }

  data?.forEach(shortcut => {
    console.log(`\n=== ID ${shortcut.id} ===`);
    console.log(`keys: "${shortcut.keys}"`);
    console.log(`windows_keys: ${shortcut.windows_keys || 'null'}`);
    console.log(`macos_keys: ${shortcut.macos_keys || 'null'}`);
    console.log(`description: ${shortcut.description}`);
    console.log(`platform: ${shortcut.platform || 'null'}`);
    console.log(`press_type: ${shortcut.press_type || 'null'}`);
    console.log(`category: ${shortcut.category}`);
  });
}

main().catch(console.error);

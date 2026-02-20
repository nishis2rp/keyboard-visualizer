import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLongKeyNames() {
  console.log('🔍 Checking for long key names in shortcuts...\n');

  // 長いキー名のリスト
  const longKeys = [
    'Backspace',
    'Escape',
    'PageDown',
    'PageUp',
    'Insert',
    'Delete',
    'Enter',
    'Space'
  ];

  for (const key of longKeys) {
    const { data, error } = await supabase
      .from('shortcuts')
      .select('id, application, keys, description')
      .or(`keys.ilike.%${key}%,windows_keys.ilike.%${key}%,macos_keys.ilike.%${key}%`);

    if (error) {
      console.error(`❌ Error checking ${key}:`, error);
      continue;
    }

    if (data && data.length > 0) {
      console.log(`📌 Found ${data.length} shortcuts with "${key}":`);
      data.slice(0, 5).forEach(item => {
        console.log(`   [${item.application}] ${item.keys} - ${item.description}`);
      });
      if (data.length > 5) {
        console.log(`   ... and ${data.length - 5} more`);
      }
      console.log('');
    }
  }
}

checkLongKeyNames();

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findShiftShortcuts() {
  console.log('Searching for shortcuts with "8秒" or "秒" in description...\n');

  // Search for shortcuts with 秒 in description
  const { data, error } = await supabase
    .from('shortcuts')
    .select('*')
    .or('description.ilike.%8秒%,description.ilike.%秒%,keys.ilike.%shift%')
    .order('id');

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('❌ No shortcuts found');
    return;
  }

  console.log(`Found ${data.length} shortcuts:\n`);

  data.forEach((shortcut) => {
    console.log(`ID: ${shortcut.id}`);
    console.log(`Application: ${shortcut.application}`);
    console.log(`Keys: ${shortcut.keys}`);
    console.log(`Description: ${shortcut.description}`);
    console.log(`Difficulty: ${shortcut.difficulty}`);
    console.log('---');
  });
}

findShiftShortcuts();

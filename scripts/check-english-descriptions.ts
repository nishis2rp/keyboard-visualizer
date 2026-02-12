import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkEnglishDescriptions() {
  console.log('Checking English descriptions in shortcuts table...\n');

  // Check if description_en column exists and has data
  const { data: shortcuts, error } = await supabase
    .from('shortcuts')
    .select('id, application, keys, description, description_en, category, category_en')
    .limit(10);

  if (error) {
    console.error('Error fetching shortcuts:', error);
    return;
  }

  if (!shortcuts || shortcuts.length === 0) {
    console.log('No shortcuts found');
    return;
  }

  console.log(`Found ${shortcuts.length} shortcuts (showing first 10):\n`);

  shortcuts.forEach((shortcut, index) => {
    console.log(`${index + 1}. [${shortcut.application}] ${shortcut.keys}`);
    console.log(`   JP: ${shortcut.description}`);
    console.log(`   EN: ${shortcut.description_en || '❌ NOT SET'}`);
    console.log(`   Category JP: ${shortcut.category || 'N/A'}`);
    console.log(`   Category EN: ${shortcut.category_en || '❌ NOT SET'}`);
    console.log('');
  });

  // Count total shortcuts with and without English descriptions
  const { count: totalCount } = await supabase
    .from('shortcuts')
    .select('*', { count: 'exact', head: true });

  const { count: withEnglishCount } = await supabase
    .from('shortcuts')
    .select('*', { count: 'exact', head: true })
    .not('description_en', 'is', null);

  console.log('\n=== Summary ===');
  console.log(`Total shortcuts: ${totalCount}`);
  console.log(`With English description: ${withEnglishCount || 0}`);
  console.log(`Without English description: ${(totalCount || 0) - (withEnglishCount || 0)}`);
}

checkEnglishDescriptions();

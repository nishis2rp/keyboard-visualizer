import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  console.log('🔍 Checking for potential duplicates after abbreviation...\n');

  // Simulate what keys would look like after abbreviation
  const abbreviations = [
    { long: 'Escape', short: 'Esc' },
    { long: 'Backspace', short: 'BS' },
    { long: 'PageDown', short: 'PgDn' },
    { long: 'PageUp', short: 'PgUp' },
    { long: 'Insert', short: 'Ins' },
    { long: 'Delete', short: 'Del' }
  ];

  for (const { long, short } of abbreviations) {
    // Find shortcuts with long form
    const { data: longData } = await supabase
      .from('shortcuts')
      .select('id, application, keys, description')
      .ilike('keys', `%${long}%`);

    if (!longData || longData.length === 0) continue;

    console.log(`\n📌 Checking "${long}" → "${short}":` );

    for (const item of longData) {
      const simulatedKey = item.keys.replace(new RegExp(long, 'gi'), short);

      // Check if this abbreviated form already exists
      const { data: existing } = await supabase
        .from('shortcuts')
        .select('id, keys, description')
        .eq('application', item.application)
        .eq('keys', simulatedKey);

      if (existing && existing.length > 0 && existing[0].id !== item.id) {
        console.log(`  ⚠️  DUPLICATE FOUND:`);
        console.log(`     Current: [${item.application}] "${item.keys}" - ${item.description}`);
        console.log(`     Would become: "${simulatedKey}"`);
        console.log(`     Conflicts with existing: "${existing[0].keys}" - ${existing[0].description}`);
        console.log(`     IDs: ${item.id} vs ${existing[0].id}\n`);
      }
    }
  }
}

checkDuplicates();

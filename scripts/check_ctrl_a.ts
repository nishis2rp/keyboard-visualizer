import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function checkCtrlA() {
  const { data, error } = await supabase
    .from('shortcuts')
    .select('*')
    .eq('application', 'windows11')
    .ilike('keys', '%ctrl%a%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${data.length} matching shortcuts:`);
  data.forEach(s => {
    console.log(`  [${s.id}] ${s.keys} - ${s.description}`);
  });
}

checkCtrlA();

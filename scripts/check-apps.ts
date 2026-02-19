import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkApps() {
  const { data, error } = await supabase
    .from('applications')
    .select('id, name')
    .order('id');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Applications in database:');
  data?.forEach((app) => {
    console.log(`  - ID: ${app.id}, Name: ${app.name}`);
  });
}

checkApps();

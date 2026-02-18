import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getApplications() {
  console.log('Fetching applications from database...\n');

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching applications:', error);
    process.exit(1);
  }

  console.log('📋 Supported Applications:\n');
  console.log('Total:', data?.length, 'applications\n');

  data?.forEach((app, index) => {
    console.log(`${index + 1}. ${app.icon} ${app.name}`);
    console.log(`   ID: ${app.id}`);
    console.log(`   OS: ${app.os}`);
    console.log(`   Display Order: ${app.display_order}`);
    console.log('');
  });

  // Get shortcut counts for each app
  console.log('\n📊 Shortcut Counts:\n');

  for (const app of data || []) {
    const { count, error: countError } = await supabase
      .from('shortcuts')
      .select('*', { count: 'exact', head: true })
      .eq('application', app.id);

    if (countError) {
      console.error(`Error counting shortcuts for ${app.id}:`, countError);
    } else {
      console.log(`${app.icon} ${app.name}: ${count} shortcuts`);
    }
  }

  // Total shortcuts
  const { count: totalCount } = await supabase
    .from('shortcuts')
    .select('*', { count: 'exact', head: true });

  console.log(`\n🎯 Total: ${totalCount} shortcuts across all applications`);
}

getApplications();

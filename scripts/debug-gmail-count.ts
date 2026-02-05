import { getSupabaseClient } from './lib/supabase';

async function main() {
  const supabase = getSupabaseClient();

  // Method 1: Filter by application
  const { data: method1, error: error1 } = await supabase
    .from('shortcuts')
    .select('*')
    .eq('application', 'gmail');

  console.log('Method 1 (eq gmail):', method1?.length);

  // Method 2: Get all and filter
  const { data: allData, error: error2 } = await supabase
    .from('shortcuts')
    .select('application, keys');

  const gmailCount = allData?.filter((s: any) => s.application === 'gmail').length;
  console.log('Method 2 (filter):', gmailCount);

  // Check what applications exist
  const apps = new Set(allData?.map((s: any) => s.application));
  console.log('\nAll applications:', Array.from(apps).sort());

  // Sample of what we think are Gmail shortcuts
  console.log('\nSample Gmail shortcuts from method 1:');
  method1?.slice(0, 5).forEach((s: any) => {
    console.log(`  ${s.application} - ${s.keys} - ${s.description}`);
  });
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

import { getSupabaseClient } from './lib/supabase';

async function main() {
  const supabase = getSupabaseClient();

  // Test with same select
  const { data: data1, error: error1, count: count1 } = await supabase
    .from('shortcuts')
    .select('*', { count: 'exact' })
    .eq('application', 'gmail');

  console.log('With eq filter:', data1?.length, 'count:', count1);

  const { data: data2, error: error2 } = await supabase
    .from('shortcuts')
    .select('application');

  const gmailRows = data2?.filter((s: any) => s.application === 'gmail');
  console.log('Without eq filter (then filtered):', gmailRows?.length);

  // Get total count
  const { count: totalCount } = await supabase
    .from('shortcuts')
    .select('*', { count: 'exact', head: true });

  console.log('Total shortcuts in DB:', totalCount);

  // Direct count query
  const { count: gmailCount } = await supabase
    .from('shortcuts')
    .select('*', { count: 'exact', head: true })
    .eq('application', 'gmail');

  console.log('Direct count query for gmail:', gmailCount);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

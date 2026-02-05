import { getSupabaseClient } from './lib/supabase';

async function main() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('shortcuts')
    .select('id, keys, description')
    .eq('application', 'gmail')
    .order('keys');

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Group by keys
  const keyGroups: Record<string, any[]> = {};
  data?.forEach(item => {
    if (!keyGroups[item.keys]) {
      keyGroups[item.keys] = [];
    }
    keyGroups[item.keys].push(item);
  });

  const duplicates = Object.entries(keyGroups).filter(([key, items]) => items.length > 1);

  console.log('Total Gmail shortcuts:', data?.length);
  console.log('Unique keys:', Object.keys(keyGroups).length);
  console.log('Duplicates:', duplicates.length);

  if (duplicates.length > 0) {
    console.log('\nDuplicate keys:');
    duplicates.slice(0, 10).forEach(([key, items]) => {
      console.log(`  Key: "${key}" - Count: ${items.length}`);
      items.forEach(item => console.log(`    ID: ${item.id} - ${item.description}`));
    });
  }

  // Check if there are 135 total
  console.log('\nExpected: 135 shortcuts');
  console.log(`Actual: ${data?.length} shortcuts`);
  console.log(`Difference: ${135 - (data?.length || 0)}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

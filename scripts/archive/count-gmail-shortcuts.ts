import { getSupabaseClient } from './lib/supabase';

async function main() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('shortcuts')
    .select('*')
    .eq('application', 'gmail');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Total Gmail shortcuts:', data.length);
  console.log('\nBy difficulty:');
  const byDifficulty = data.reduce((acc: any, s: any) => {
    acc[s.difficulty] = (acc[s.difficulty] || 0) + 1;
    return acc;
  }, {});
  console.log(byDifficulty);

  console.log('\nSample shortcuts:');
  data.slice(0, 5).forEach((s: any) => {
    console.log(`  ${s.keys} - ${s.description}`);
  });
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

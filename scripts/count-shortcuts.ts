import { getSupabaseClient } from './lib/supabase';

async function main() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('shortcuts')
    .select('application, difficulty');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const appCount: Record<string, number> = {};
  const difficultyCount: Record<string, number> = {
    basic: 0,
    standard: 0,
    hard: 0,
    madmax: 0
  };

  data.forEach((row: any) => {
    appCount[row.application] = (appCount[row.application] || 0) + 1;
    if (row.difficulty) {
      difficultyCount[row.difficulty] = (difficultyCount[row.difficulty] || 0) + 1;
    }
  });

  console.log('By Application:');
  Object.entries(appCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([app, count]) => {
      console.log(`  ${app}: ${count}`);
    });

  console.log('\nBy Difficulty:');
  Object.entries(difficultyCount).forEach(([diff, count]) => {
    console.log(`  ${diff}: ${count}`);
  });

  console.log('\nTotal:', data.length);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

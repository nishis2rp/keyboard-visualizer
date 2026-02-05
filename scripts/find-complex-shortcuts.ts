import { getSupabaseClient } from './lib/supabase';

async function main() {
  const supabase = getSupabaseClient();

  const { data } = await supabase
    .from('shortcuts')
    .select('id, application, keys, description, difficulty')
    .eq('difficulty', 'standard')
    .order('keys');

  if (!data) return;

  const complexShortcuts: any[] = [];

  data.forEach(s => {
    const keys = s.keys;
    const parts = keys.split('+').map((k: string) => k.trim());

    // 複雑さの判定基準
    let complexity = 0;

    // 1. キーの数が多い（3つ以上）
    if (parts.length >= 3) complexity += 2;
    if (parts.length >= 4) complexity += 3;

    // 2. 修飾キー2つ以上
    const modifiers = parts.filter((p: string) =>
      ['Ctrl', 'Shift', 'Alt', 'Win', 'Cmd', 'Meta', 'Option'].includes(p)
    );
    if (modifiers.length >= 2) complexity += 2;
    if (modifiers.length >= 3) complexity += 3;

    // 3. Altキーを含む（リボンコマンド系）
    if (keys.includes('Alt +')) complexity += 1;

    // 4. F1-F12を含む
    if (/F\d{1,2}/.test(keys)) complexity += 1;

    // 5. 順押し系（複数の + が離れている）
    const sequentialPattern = /\w\s\+\s\w/;
    if (sequentialPattern.test(keys)) complexity += 2;

    // 6. 専門的なキーワードを含む
    const advancedKeywords = [
      'ピボット', 'マクロ', 'VBA', 'デバッグ', 'スパークライン',
      'トレース', '数式', '開発', 'リボン', '詳細', '高度',
      'フィルター', 'グラフ', 'アドイン', 'プロパティ'
    ];
    if (advancedKeywords.some(kw => s.description.includes(kw))) {
      complexity += 1;
    }

    // complexityが3以上をhardの候補とする
    if (complexity >= 3) {
      complexShortcuts.push({
        ...s,
        complexity
      });
    }
  });

  // 複雑度でソート
  complexShortcuts.sort((a, b) => b.complexity - a.complexity);

  console.log(`Found ${complexShortcuts.length} complex shortcuts (complexity >= 3)\n`);

  // Top 220個を表示（余裕を持たせる）
  console.log('Top 220 candidates for hard difficulty:\n');
  complexShortcuts.slice(0, 220).forEach((s, i) => {
    console.log(`${i + 1}. [${s.application}] ${s.keys} - ${s.description} (complexity: ${s.complexity})`);
  });

  // アプリケーション別の内訳
  console.log('\n=== Breakdown by application ===');
  const byApp: Record<string, number> = {};
  complexShortcuts.slice(0, 220).forEach(s => {
    byApp[s.application] = (byApp[s.application] || 0) + 1;
  });
  Object.entries(byApp).sort((a, b) => b[1] - a[1]).forEach(([app, count]) => {
    console.log(`${app}: ${count}`);
  });

  // IDのリストを出力（スクリプト用）
  console.log('\n=== IDs for update script (top 200) ===');
  const ids = complexShortcuts.slice(0, 200).map(s => s.id);
  console.log(ids.join(', '));
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

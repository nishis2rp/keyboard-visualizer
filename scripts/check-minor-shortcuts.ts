import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    // Check Excel sequential shortcuts (Alt + H + ...)
    console.log('=== Excel Sequential Shortcuts (Alt + H/N/W + ...) ===');
    const excelSeq = await client.query(
      `SELECT id, keys, description, difficulty FROM shortcuts WHERE application = 'excel' AND (keys LIKE '%Alt + H + %' OR keys LIKE '%Alt + N + %' OR keys LIKE '%Alt + W + %' OR keys LIKE '%Alt + M + %' OR keys LIKE '%Alt + P + %') ORDER BY keys`
    );

    excelSeq.rows.forEach(s => {
      console.log(`${s.id}: ${s.keys} - ${s.description} [${s.difficulty}]`);
    });

    // Check shortcuts with 4+ keys
    console.log('\n=== Shortcuts with 4+ key combinations ===');
    const longKeys = await client.query(
      `SELECT id, application, keys, description, difficulty FROM shortcuts WHERE difficulty != 'madmax'`
    );

    const filtered = longKeys.rows.filter(s => {
      const keyCount = s.keys.split('+').length;
      return keyCount >= 4;
    });

    filtered.forEach(s => {
      console.log(`${s.id}: [${s.application}] ${s.keys} - ${s.description} [${s.difficulty}]`);
    });

    // Check advanced features that should be madmax
    console.log('\n=== Advanced Features (candidates for madmax) ===');
    const advanced = await client.query(
      `SELECT id, application, keys, description, difficulty FROM shortcuts WHERE difficulty != 'madmax' AND (description ILIKE '%VBA%' OR description ILIKE '%マクロ%' OR description ILIKE '%デバッグ%' OR description ILIKE '%開発%' OR description ILIKE '%アドイン%')`
    );

    advanced.rows.forEach(s => {
      console.log(`${s.id}: [${s.application}] ${s.keys} - ${s.description} [${s.difficulty}]`);
    });
  });
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});


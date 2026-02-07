import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    // Excel: Minor sequential shortcuts (スパークライン、トレース矢印、セル結合、etc.)
    const excelMinorSeq = [
      268, 269, 270, // スパークライン系 (Alt + N + S + L/C/W)
      253, 254, 255, // トレース矢印系 (Alt + M + P/D/A + A)
      251, 252, // セル結合系 (Alt + H + M + C/U)
      241, 242, // シート削除/名前変更 (Alt + H + D + S, Alt + H + O + R)
      243, 244, // 枠線/見出し表示切替 (Alt + W + V + G/H)
      134, // ルールの管理 (Alt + H + L + R)
      265, // ブックのプロパティ (Alt + F + I + S)
      247, // ユーザー設定の並べ替え (Alt + A + S + S)
    ];

    // Excel: VBA/マクロ関連
    const excelVBA = [129, 130]; // Alt + F8, Alt + F11

    // Windows: 超マイナー機能
    const windowsMinor = [828]; // Win + Ctrl + Shift + B (グラフィックドライバー再起動)

    // macOS: 超マイナー機能
    const macosMinor = [
      574, // Cmd + Option + Shift + N (新規音声収録)
      638, // Ctrl + Option + Cmd + 8 (色を反転)
    ];

    // All IDs to update
    const allIds = [
      ...excelMinorSeq,
      ...excelVBA,
      ...windowsMinor,
      ...macosMinor,
    ];

    console.log(`Updating ${allIds.length} shortcuts to madmax difficulty...\n`);

    const result = await client.query(
      `UPDATE shortcuts
       SET difficulty = 'madmax'
       WHERE id = ANY($1::bigint[])
       RETURNING id, application, keys, description, difficulty`,
      [allIds]
    );

    console.log('Updated shortcuts:');
    result.rows.forEach(row => {
      console.log(`${row.id}: [${row.application}] ${row.keys} - ${row.description}`);
    });
    console.log(`\nTotal updated: ${result.rowCount}`);
  });
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

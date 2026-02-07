// scripts/verify-data.ts
import db from '../src/server/db.js';

console.log('Verifying database data...\n');

// アプリケーションごとのショートカット数を取得
const countByApp = db.prepare(`
  SELECT application, COUNT(*) as count
  FROM shortcuts
  GROUP BY application
  ORDER BY application
`).all();

console.log('Shortcuts count by application:');
countByApp.forEach((row: any) => {
  console.log(`  ${row.application}: ${row.count} shortcuts`);
});

// 総数を取得
const total = db.prepare('SELECT COUNT(*) as count FROM shortcuts').get() as { count: number };
console.log(`\nTotal shortcuts: ${total.count}`);

// サンプルデータを表示
console.log('\nSample shortcuts (first 5):');
const samples = db.prepare('SELECT * FROM shortcuts LIMIT 5').all();
samples.forEach((row: any) => {
  console.log(`  [${row.application}] ${row.keys}: ${row.description}`);
});

db.close();
console.log('\nVerification completed!');

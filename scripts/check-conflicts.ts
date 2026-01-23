// scripts/check-conflicts.ts
import db from '../src/server/db.js';

console.log('Checking for Ctrl+A conflicts...\n');

// Ctrl+Aを含むショートカットを検索
const ctrlA = db.prepare(`
  SELECT application, keys, description
  FROM shortcuts
  WHERE keys LIKE '%Ctrl%A%'
  ORDER BY application, keys
`).all();

console.log(`Found ${ctrlA.length} shortcuts containing Ctrl+A:\n`);

// アプリケーションごとにグループ化
const byApp: Record<string, any[]> = {};
ctrlA.forEach((row: any) => {
  if (!byApp[row.application]) {
    byApp[row.application] = [];
  }
  byApp[row.application].push(row);
});

// 各アプリケーションの結果を表示
Object.entries(byApp).forEach(([app, shortcuts]) => {
  console.log(`[${app}] ${shortcuts.length} shortcuts:`);
  shortcuts.forEach((s: any) => {
    console.log(`  ${s.keys}: ${s.description}`);
  });
  console.log('');
});

// 同一アプリ内でのキーの重複をチェック
console.log('Checking for duplicates within same application...\n');
Object.entries(byApp).forEach(([app, shortcuts]) => {
  const keyGroups: Record<string, any[]> = {};
  shortcuts.forEach((s: any) => {
    if (!keyGroups[s.keys]) {
      keyGroups[s.keys] = [];
    }
    keyGroups[s.keys].push(s);
  });

  Object.entries(keyGroups).forEach(([key, items]) => {
    if (items.length > 1) {
      console.log(`⚠️  DUPLICATE in ${app}: ${key}`);
      items.forEach((item: any) => {
        console.log(`     - ${item.description}`);
      });
      console.log('');
    }
  });
});

db.close();
console.log('Conflict check completed!');

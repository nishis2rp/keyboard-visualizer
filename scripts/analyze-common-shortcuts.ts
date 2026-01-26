// スクリプト: Windows/macOS共通ショートカットの分析
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ShortcutEntry {
  application: string;
  keys: string;
  description: string;
}

async function analyzeCommonShortcuts() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/002_insert_data.sql');
  const content = await fs.readFile(migrationPath, 'utf-8');

  // 正規表現でショートカットを抽出
  const insertPattern = /INSERT INTO shortcuts \(application, keys, description\) VALUES \('([^']+)', '([^']+)', '([^']+)'\)/g;

  const windows11Shortcuts = new Map<string, string>();
  const macosShortcuts = new Map<string, string>();

  let match;
  while ((match = insertPattern.exec(content)) !== null) {
    const [, application, keys, description] = match;

    if (application === 'windows11') {
      windows11Shortcuts.set(description, keys);
    } else if (application === 'macos') {
      macosShortcuts.set(description, keys);
    }
  }

  // 共通のdescriptionを見つける
  const commonDescriptions: Array<{
    description: string;
    windowsKeys: string;
    macosKeys: string;
  }> = [];

  for (const [description, windowsKeys] of windows11Shortcuts.entries()) {
    if (macosShortcuts.has(description)) {
      commonDescriptions.push({
        description,
        windowsKeys,
        macosKeys: macosShortcuts.get(description)!,
      });
    }
  }

  console.log(`Found ${commonDescriptions.length} common shortcuts:\n`);

  commonDescriptions.forEach(({ description, windowsKeys, macosKeys }, index) => {
    console.log(`${index + 1}. ${description}`);
    console.log(`   Windows: ${windowsKeys}`);
    console.log(`   macOS:   ${macosKeys}\n`);
  });

  // SQLマイグレーション用のデータを生成
  console.log('\n--- SQL Migration Statements ---\n');

  commonDescriptions.forEach(({ description, windowsKeys, macosKeys }) => {
    // エスケープ処理
    const escapedDesc = description.replace(/'/g, "''");
    const escapedWinKeys = windowsKeys.replace(/'/g, "''");
    const escapedMacKeys = macosKeys.replace(/'/g, "''");

    console.log(`-- ${description}`);
    console.log(`UPDATE shortcuts SET`);
    console.log(`  application = 'os-common',`);
    console.log(`  platform = 'Cross-Platform',`);
    console.log(`  windows_keys = '${escapedWinKeys}',`);
    console.log(`  macos_keys = '${escapedMacKeys}'`);
    console.log(`WHERE application = 'windows11' AND description = '${escapedDesc}';`);
    console.log();
  });

  console.log('\n--- Delete Duplicate macOS Records ---\n');

  commonDescriptions.forEach(({ description }) => {
    const escapedDesc = description.replace(/'/g, "''");
    console.log(`DELETE FROM shortcuts WHERE application = 'macos' AND description = '${escapedDesc}';`);
  });

  return commonDescriptions;
}

analyzeCommonShortcuts().catch(err => {
  console.error('Analysis failed:', err);
  process.exit(1);
});

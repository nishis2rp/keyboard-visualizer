// scripts/migrate.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import db from '../src/server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shortcutsDir = path.join(__dirname, '../src/data/shortcuts');

function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS shortcuts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application VARCHAR(50) NOT NULL,
      keys VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100),
      UNIQUE(application, keys, description)
    );
  `;
  db.exec(createTableQuery);
  console.log('Table "shortcuts" created or already exists.');
}

function insertShortcut(application: string, keys: string, description: string) {
  const insertQuery = `
    INSERT OR IGNORE INTO shortcuts (application, keys, description, category)
    VALUES (?, ?, ?, ?);
  `;
  const stmt = db.prepare(insertQuery);
  stmt.run(application, keys, description, null);
}

async function migrate() {
  console.log('Starting migration...');

  // dataディレクトリを作成（存在しない場合）
  const dataDir = path.join(__dirname, '../data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    console.log('Created data directory.');
  }

  createTable();

  const files = await fs.readdir(shortcutsDir);
  const tsFiles = files.filter(file => file.endsWith('.ts') && file !== 'index.ts');

  for (const file of tsFiles) {
    const application = path.basename(file, '.ts');
    console.log(`Processing ${application}...`);

    const filePath = path.join(shortcutsDir, file);
    const content = await fs.readFile(filePath, 'utf-8');

    // The content is a JS module, not pure JSON. We need to extract the object.
    // The object is assigned to a const, e.g., `export const chromeShortcuts = { ... }`
    const shortcutsObjectString = content.substring(content.indexOf('{'));

    // A simple eval-based approach (use with caution, but safe here as we trust the source files)
    const shortcuts: Record<string, string> = (new Function(`return ${shortcutsObjectString}`))();

    for (const [keys, description] of Object.entries(shortcuts)) {
      insertShortcut(application, keys, description);
    }
    console.log(`Finished processing ${application}.`);
  }

  console.log('Migration completed successfully!');
  db.close();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  db.close();
  process.exit(1);
});

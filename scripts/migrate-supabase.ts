// scripts/migrate-supabase.ts
import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shortcutsDir = path.join(__dirname, '../src/data/shortcuts');

// Supabase PostgreSQL connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS shortcuts (
      id BIGSERIAL PRIMARY KEY,
      application VARCHAR(50) NOT NULL,
      keys VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      UNIQUE(application, keys)
    );

    CREATE INDEX IF NOT EXISTS idx_shortcuts_application ON shortcuts(application);
    CREATE INDEX IF NOT EXISTS idx_shortcuts_keys ON shortcuts(keys);
  `;

  await client.query(createTableQuery);
  console.log('Table "shortcuts" created or already exists.');
}

async function insertShortcut(application: string, keys: string, description: string) {
  const insertQuery = `
    INSERT INTO shortcuts (application, keys, description, category)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (application, keys) DO UPDATE SET
      description = EXCLUDED.description,
      category = EXCLUDED.category;
  `;
  await client.query(insertQuery, [application, keys, description, null]);
}

async function migrate() {
  console.log('Starting Supabase migration...');

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    await createTable();

    const files = await fs.readdir(shortcutsDir);
    const tsFiles = files.filter(file => file.endsWith('.ts') && file !== 'index.ts');

    for (const file of tsFiles) {
      const application = path.basename(file, '.ts');
      console.log(`Processing ${application}...`);

      const filePath = path.join(shortcutsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');

      const shortcutsObjectString = content.substring(content.indexOf('{'));
      const shortcuts: Record<string, string> = (new Function(`return ${shortcutsObjectString}`))();

      for (const [keys, description] of Object.entries(shortcuts)) {
        await insertShortcut(application, keys, description);
      }
      console.log(`Finished processing ${application}.`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

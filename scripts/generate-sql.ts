// scripts/generate-sql.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shortcutsDir = path.join(__dirname, '../src/data/shortcuts');

async function generateSQL() {
  console.log('Generating SQL file...');

  let sql = `-- Create shortcuts table
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

-- Enable Row Level Security
ALTER TABLE shortcuts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Allow public read access" ON shortcuts;
CREATE POLICY "Allow public read access" ON shortcuts
  FOR SELECT
  USING (true);

-- Insert data
`;

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
      const escapedKeys = keys.replace(/'/g, "''");
      const escapedDescription = description.replace(/'/g, "''");
      sql += `INSERT INTO shortcuts (application, keys, description) VALUES ('${application}', '${escapedKeys}', '${escapedDescription}') ON CONFLICT (application, keys) DO NOTHING;\n`;
    }
  }

  const outputPath = path.join(__dirname, '../supabase/migrations/002_insert_data.sql');
  await fs.writeFile(outputPath, sql, 'utf-8');
  console.log(`SQL file generated: ${outputPath}`);
}

generateSQL().catch(err => {
  console.error('Failed to generate SQL:', err);
  process.exit(1);
});

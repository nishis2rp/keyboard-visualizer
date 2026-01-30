# Scripts Directory

This directory contains utility scripts for database management and data analysis.

## Active Scripts

These scripts are actively used for database management:

- **`migrate-supabase.ts`** - Run all database migrations sequentially
- **`generate-sql.ts`** - Generate SQL INSERT statements from data files
- **`run-migration.ts`** - Run database migrations
- **`check-protection-levels.ts`** - Check protection levels for specific shortcuts
- **`find-shortcut.ts`** - Find a specific shortcut in the database
- **`check-table-structure.ts`** - Check database table structure

## Usage

\`\`\`bash
# Run all migrations
npm run db:migrate

# Or use individual scripts
npx tsx scripts/migrate-supabase.ts

# Check protection levels
npx tsx scripts/check-protection-levels.ts

# Find a shortcut
npx tsx scripts/find-shortcut.ts "Ctrl + C"
\`\`\`

## Archive Directory

The \`archive/\` directory contains one-time utility scripts that were used for:
- Data analysis and statistics
- One-time data migrations
- Duplicate detection and cleanup
- Protection level configuration

These scripts are kept for historical reference but are not actively used in the current workflow.

## Environment Requirements

Scripts require \`.env\` file with:
\`\`\`bash
DATABASE_URL=postgresql://postgres:[password]@db.your-project-id.supabase.co:5432/postgres
\`\`\`

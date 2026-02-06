import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function checkTableStructure() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('supabase.co')
      ? { rejectUnauthorized: false }
      : undefined,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'shortcuts'
        AND column_name LIKE '%protection%'
      ORDER BY ordinal_position;
    `);

    console.log('\nProtection level columns:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}:`);
      console.log(`    Type: ${row.data_type}`);
      console.log(`    Nullable: ${row.is_nullable}`);
      console.log(`    Default: ${row.column_default || 'none'}`);
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

checkTableStructure();

// scripts/lib/db.ts
import 'dotenv/config';
import pg from 'pg';

export async function withDatabase<T>(
  callback: (client: pg.Client) => Promise<T>
): Promise<T> {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // To match existing scripts
  });

  try {
    await client.connect();
    return await callback(client);
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error; // Re-throw to let the script fail
  } finally {
    if (client) {
      await client.end();
    }
  }
}

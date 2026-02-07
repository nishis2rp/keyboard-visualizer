import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function deleteShortcut() {
  try {
    await client.connect();
    console.log('Connected to database\n');

    // Check current shortcut
    console.log('Current shortcut:');
    const checkResult = await client.query(
      'SELECT * FROM shortcuts WHERE id = 825'
    );
    console.log(checkResult.rows[0]);
    console.log('\n---\n');

    // Delete the shortcut
    console.log('Deleting shortcut ID 825...');
    const deleteResult = await client.query(
      'DELETE FROM shortcuts WHERE id = 825 RETURNING *'
    );

    if (deleteResult.rowCount === 0) {
      console.log('❌ No shortcut was deleted');
    } else {
      console.log(`✅ Successfully deleted ${deleteResult.rowCount} shortcut:`);
      console.log(deleteResult.rows[0]);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed');
  }
}

deleteShortcut();

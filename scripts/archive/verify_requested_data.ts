import { withDatabase } from './lib/db';

async function verify() {
  await withDatabase(async (client) => {
    const res = await client.query(`
      SELECT application, keys, description, difficulty 
      FROM shortcuts 
      WHERE (application = 'chrome' AND keys = 'Space')
         OR (application = 'terminal' AND keys = 'Ctrl + U')
         OR (application = 'windows11' AND keys = 'Win + Ctrl + D')
    `);
    console.log('Verification Results:');
    console.table(res.rows);
  });
}

verify().catch(console.error);

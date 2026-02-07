import { withDatabase } from './lib/db';

async function checkApps() {
  await withDatabase(async (client) => {
    const res = await client.query(`SELECT DISTINCT application FROM shortcuts ORDER BY application`);
    console.log('Existing Applications:');
    console.log(res.rows.map(r => r.application).join(', '));
  });
}

checkApps().catch(console.error);

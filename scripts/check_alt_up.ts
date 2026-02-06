import { withDatabase } from './lib/db';

async function checkShortcut() {
  await withDatabase(async (client) => {
    const res = await client.query("SELECT * FROM shortcuts WHERE keys = 'Alt + ↑'");
    console.log('Current Alt + ↑ shortcuts:');
    console.table(res.rows);
  });
}

checkShortcut().catch(console.error);

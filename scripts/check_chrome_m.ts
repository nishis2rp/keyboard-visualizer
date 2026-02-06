import { withDatabase } from './lib/db';

async function checkShortcut() {
  await withDatabase(async (client) => {
    const res = await client.query("SELECT * FROM shortcuts WHERE keys LIKE '%M%' AND application = 'chrome'");
    console.log('Chrome M shortcuts:');
    console.table(res.rows);
  });
}

checkShortcut().catch(console.error);

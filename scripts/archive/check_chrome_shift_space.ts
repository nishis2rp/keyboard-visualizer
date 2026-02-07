import { withDatabase } from './lib/db';

async function checkShortcut() {
  await withDatabase(async (client) => {
    const res = await client.query("SELECT * FROM shortcuts WHERE keys = 'Shift + Space' AND application = 'chrome'");
    console.log('Chrome Shift + Space shortcut:');
    console.table(res.rows);
  });
}

checkShortcut().catch(console.error);

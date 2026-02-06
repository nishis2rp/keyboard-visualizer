import { withDatabase } from './lib/db';

const difficultyOrder = ['basic', 'standard', 'hard', 'madmax'];
const applicationOrder = ['windows11', 'macos'];

async function main() {
  await withDatabase(async (client) => {
    const result = await client.query(
      'SELECT id, application, difficulty FROM shortcuts'
    );

    const shortcuts = result.rows;

    shortcuts.sort((a, b) => {
      const appA = a.application.toLowerCase();
      const appB = b.application.toLowerCase();

      const getAppPriority = (app) => {
        if (app === 'windows11') return 0;
        if (app === 'macos') return 1;
        return 2;
      };

      const priorityA = getAppPriority(appA);
      const priorityB = getAppPriority(appB);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      if (priorityA === 2) { // Both are not windows or macos, sort alphabetically
        const appComparison = appA.localeCompare(appB);
        if (appComparison !== 0) {
          return appComparison;
        }
      }

      // Sort by difficulty
      const diffA = difficultyOrder.indexOf(a.difficulty);
      const diffB = difficultyOrder.indexOf(b.difficulty);

      return diffA - diffB;
    });

    for (let i = 0; i < shortcuts.length; i++) {
      await client.query(
        'UPDATE shortcuts SET sort_order =  WHERE id = $2',
        [i, shortcuts[i].id]
      );
    }

    console.log('✅ Successfully updated sort order for all shortcuts.');
  });
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
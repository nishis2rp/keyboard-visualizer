import pg from 'pg';
import * as dotenv from 'dotenv';
import { releases } from '../src/constants/releases.js';

dotenv.config();

const { Client } = pg;

async function populateReleases() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Clear existing data
    await client.query('DELETE FROM release_changes');
    await client.query('DELETE FROM releases');
    console.log('Cleared existing release data');

    // Insert releases in reverse order (oldest first) for proper display_order
    for (let i = releases.length - 1; i >= 0; i--) {
      const release = releases[i];
      const displayOrder = releases.length - 1 - i; // 0 = latest, higher = older

      // Insert release
      const releaseResult = await client.query(
        `INSERT INTO releases (version, release_date, title_en, title_ja, display_order)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [release.version, release.date, release.titleEn, release.titleJa, displayOrder]
      );

      const releaseId = releaseResult.rows[0].id;
      console.log(`Inserted release v${release.version} (id: ${releaseId}, order: ${displayOrder})`);

      // Insert changes for this release
      for (let j = 0; j < release.changes.length; j++) {
        const change = release.changes[j];
        await client.query(
          `INSERT INTO release_changes (release_id, category, description_en, description_ja, display_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [releaseId, change.category, change.descriptionEn, change.descriptionJa, j]
        );
      }
      console.log(`  Added ${release.changes.length} changes`);
    }

    console.log('\n✅ Successfully populated releases table');
    console.log(`Total releases: ${releases.length}`);

    // Verify data
    const countResult = await client.query('SELECT COUNT(*) FROM releases');
    const changesResult = await client.query('SELECT COUNT(*) FROM release_changes');
    console.log(`Verification: ${countResult.rows[0].count} releases, ${changesResult.rows[0].count} changes`);

  } catch (error) {
    console.error('Error populating releases:', error);
    throw error;
  } finally {
    await client.end();
  }
}

populateReleases();

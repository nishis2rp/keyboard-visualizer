import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function addReleaseV390() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database\n');
    console.log('Adding v3.9.0 release to database...\n');

    // Insert release
    const releaseResult = await client.query(
      `INSERT INTO releases (version, release_date, title_en, title_ja, display_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      ['3.9.0', '2026-02-23', 'Code Quality & Bug Fixes', 'コード品質改善・バグ修正', 0]
    );

    const release = releaseResult.rows[0];
    console.log('✅ Release inserted:', release);

    // Insert release changes
    const changes = [
      {
        category: 'fix',
        description_en: 'Fixed concurrent fetch race condition in shortcut cache — duplicate requests for the same app are now blocked',
        description_ja: 'ショートカットキャッシュの並行フェッチ競合状態を修正 — 同じアプリへの重複リクエストをブロック',
        display_order: 1
      },
      {
        category: 'improvement',
        description_en: 'Improved shortcut deduplication from O(n²) to O(1) using Map lookup for faster cache merging',
        description_ja: 'ショートカット重複排除をO(n²)からO(1)に改善 — Mapルックアップによりキャッシュマージが高速化',
        display_order: 2
      },
      {
        category: 'fix',
        description_en: 'Fixed data corruption bug in useLocalStorage when versioning non-object values',
        description_ja: 'useLocalStorageで非オブジェクト値にバージョンを付与した際のデータ破損バグを修正',
        display_order: 3
      },
      {
        category: 'fix',
        description_en: 'Fixed stale animation frame accumulation in adaptive performance hook on rapid re-renders',
        description_ja: '適応パフォーマンスフックで高速再レンダリング時に古いアニメーションフレームが蓄積するバグを修正',
        display_order: 4
      },
      {
        category: 'fix',
        description_en: 'Unified shortcut key letter casing between normalizeShortcutCombo and normalizeShortcut to prevent false mismatches',
        description_ja: 'normalizeShortcutComboとnormalizeShortcutのアルファベット大文字小文字を統一し、誤不一致を防止',
        display_order: 5
      },
      {
        category: 'improvement',
        description_en: 'Improved error type safety across quiz progress hooks — removed unsafe type casts',
        description_ja: 'クイズ進捗フックのエラー型安全性を向上 — 安全でない型キャストを除去',
        display_order: 6
      },
      {
        category: 'improvement',
        description_en: 'Removed debug console.log statements from production code in AuthContext and UserMenu',
        description_ja: 'AuthContextとUserMenuの本番コードからデバッグ用console.logを削除',
        display_order: 7
      },
      {
        category: 'improvement',
        description_en: 'Added TypeScript types to sortKeys utility function in keyboard.ts',
        description_ja: 'keyboard.tsのsortKeysユーティリティ関数にTypeScript型を追加',
        display_order: 8
      }
    ];

    let insertedCount = 0;
    for (const change of changes) {
      await client.query(
        `INSERT INTO release_changes (release_id, category, description_en, description_ja, display_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [release.id, change.category, change.description_en, change.description_ja, change.display_order]
      );
      insertedCount++;
    }

    console.log(`✅ ${insertedCount} changes inserted\n`);

    // Verify
    const verifyResult = await client.query(
      `SELECT
         r.*,
         json_agg(
           json_build_object(
             'category', rc.category,
             'description_en', rc.description_en,
             'description_ja', rc.description_ja,
             'display_order', rc.display_order
           ) ORDER BY rc.display_order
         ) as changes
       FROM releases r
       LEFT JOIN release_changes rc ON rc.release_id = r.id
       WHERE r.version = $1
       GROUP BY r.id`,
      ['3.9.0']
    );

    console.log('📋 Verification:');
    console.log(JSON.stringify(verifyResult.rows[0], null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

addReleaseV390().catch(console.error);

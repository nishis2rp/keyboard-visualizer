import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addReleaseV390() {
  console.log('Adding v3.9.0 release to database...\n');

  // Insert release
  const { data: release, error: releaseError } = await supabase
    .from('releases')
    .insert({
      version: '3.9.0',
      release_date: '2026-02-23',
      title_en: 'Code Quality & Bug Fixes',
      title_ja: 'コード品質改善・バグ修正',
      display_order: 0
    })
    .select()
    .single();

  if (releaseError) {
    console.error('Error inserting release:', releaseError);
    return;
  }

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

  const changesWithReleaseId = changes.map(change => ({
    ...change,
    release_id: release.id
  }));

  const { data: insertedChanges, error: changesError } = await supabase
    .from('release_changes')
    .insert(changesWithReleaseId)
    .select();

  if (changesError) {
    console.error('Error inserting changes:', changesError);
    return;
  }

  console.log(`✅ ${insertedChanges.length} changes inserted\n`);

  // Verify
  const { data: verifyRelease } = await supabase
    .from('releases')
    .select(`
      *,
      release_changes (
        category,
        description_en,
        description_ja,
        display_order
      )
    `)
    .eq('version', '3.9.0')
    .single();

  console.log('📋 Verification:');
  console.log(JSON.stringify(verifyRelease, null, 2));
}

addReleaseV390().catch(console.error);

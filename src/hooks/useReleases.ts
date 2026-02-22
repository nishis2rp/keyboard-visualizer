import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { releases as localReleases } from '../constants/releases';

export interface ReleaseChange {
  category: 'feature' | 'improvement' | 'fix' | 'breaking';
  descriptionEn: string;
  descriptionJa: string;
}

export interface Release {
  version: string;
  date: string;
  titleEn: string;
  titleJa: string;
  changes: ReleaseChange[];
}

interface DbRelease {
  id: number;
  version: string;
  release_date: string;
  title_en: string;
  title_ja: string;
  display_order: number;
}

interface DbReleaseChange {
  release_id: number;
  category: 'feature' | 'improvement' | 'fix' | 'breaking';
  description_en: string;
  description_ja: string;
  display_order: number;
}

export function useReleases() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReleases() {
      try {
        setLoading(true);

        // Fetch releases ordered by release_date (descending) initially
        const { data: releasesData, error: releasesError } = await supabase
          .from('releases')
          .select('id, version, release_date, title_en, title_ja'); // Removed display_order from select

        if (releasesError) throw releasesError;

        // Fetch all release changes
        const { data: changesData, error: changesError } = await supabase
          .from('release_changes')
          .select('*')
          .order('display_order', { ascending: true });

        if (changesError) throw changesError;

        // Group changes by release_id
        const changesByRelease = (changesData as DbReleaseChange[]).reduce((acc, change) => {
          if (!acc[change.release_id]) {
            acc[change.release_id] = [];
          }
          acc[change.release_id].push({
            category: change.category,
            descriptionEn: change.description_en,
            descriptionJa: change.description_ja,
          });
          return acc;
        }, {} as Record<number, ReleaseChange[]>);

        // Transform to Release format
        let transformedReleases: Release[] = (releasesData as DbRelease[]).map(release => ({
          version: release.version,
          date: release.release_date,
          titleEn: release.title_en,
          titleJa: release.title_ja,
          changes: changesByRelease[release.id] || [],
        }));
        
        // Custom sort function for semantic versioning (v3.10.0 should be after v3.2.0)
        const sortReleasesByVersion = (a: Release, b: Release): number => {
          const parseVersion = (version: string) => {
            return version.replace(/^v/, '').split('.').map(Number);
          };

          const aParts = parseVersion(a.version);
          const bParts = parseVersion(b.version);

          for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const a = aParts[i] || 0;
            const b = bParts[i] || 0;
            if (a > b) return -1; // Descending order (latest first)
            if (a < b) return 1;
          }
          return 0;
        };

        transformedReleases.sort(sortReleasesByVersion);

        // If no database releases found, use local releases.ts as fallback
        if (transformedReleases.length === 0) {
          const fallbackReleases = localReleases.map(release => ({
            version: release.version,
            date: release.date,
            titleEn: release.titleEn,
            titleJa: release.titleJa,
            changes: release.changes.map(change => ({
              category: change.category,
              descriptionEn: change.descriptionEn,
              descriptionJa: change.descriptionJa,
            })),
          })).sort(sortReleasesByVersion); // Also sort fallback releases
          setReleases(fallbackReleases);
        } else {
          setReleases(transformedReleases);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching releases:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch releases');
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();
  }, []);

  return { releases, loading, error };
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

        // Fetch releases ordered by display_order (0 = latest)
        const { data: releasesData, error: releasesError } = await supabase
          .from('releases')
          .select('*')
          .order('display_order', { ascending: true });

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
        const transformedReleases: Release[] = (releasesData as DbRelease[]).map(release => ({
          version: release.version,
          date: release.release_date,
          titleEn: release.title_en,
          titleJa: release.title_ja,
          changes: changesByRelease[release.id] || [],
        }));

        setReleases(transformedReleases);
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

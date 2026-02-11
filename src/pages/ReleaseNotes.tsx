import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ReleaseNotes.module.css';

interface Release {
  version: string;
  date: string;
  title: string;
  changes: {
    category: 'feature' | 'improvement' | 'fix' | 'breaking';
    description: string;
  }[];
}

const releases: Release[] = [
  {
    version: '2.1.0',
    date: '2026-02-11',
    title: 'Tailwind CSS v4 Migration & Landing Page Improvements',
    changes: [
      {
        category: 'feature',
        description: 'Migrated to Tailwind CSS v4 with modern @theme directive and CSS variables'
      },
      {
        category: 'improvement',
        description: 'Improved application logo visibility on Landing Page with full-color icons'
      },
      {
        category: 'improvement',
        description: 'Enhanced PageDown/PageUp navigation with smooth scrolling on Landing Page'
      },
      {
        category: 'improvement',
        description: 'Refactored CSS modules to Tailwind utility classes for authentication components'
      },
      {
        category: 'fix',
        description: 'Fixed duplicate export issue in AuthModal component'
      }
    ]
  },
  {
    version: '2.0.0',
    date: '2026-02-10',
    title: 'User Authentication & Database-Driven Configuration',
    changes: [
      {
        category: 'feature',
        description: 'Added user authentication with Google, GitHub, and Email/Password sign-in'
      },
      {
        category: 'feature',
        description: 'Implemented quiz progress tracking and session history for logged-in users'
      },
      {
        category: 'feature',
        description: 'Created user profile management with AuthContext, AuthModal, and UserMenu components'
      },
      {
        category: 'improvement',
        description: 'Migrated app configuration from hardcoded files to database-driven applications table'
      },
      {
        category: 'breaking',
        description: 'Removed hardcoded apps.ts and shortcutDifficulty.ts files in favor of database queries'
      }
    ]
  },
  {
    version: '1.5.0',
    date: '2026-01-25',
    title: 'Microsoft Office Support & Data Quality Improvements',
    changes: [
      {
        category: 'feature',
        description: 'Added Microsoft Word shortcuts with full protection level support'
      },
      {
        category: 'feature',
        description: 'Added Microsoft PowerPoint shortcuts with full protection level support'
      },
      {
        category: 'improvement',
        description: 'Normalized PageUp/PageDown key names across the entire database'
      },
      {
        category: 'improvement',
        description: 'Introduced RichShortcut type for detailed shortcut metadata'
      },
      {
        category: 'improvement',
        description: 'Separated read-only scripts (Supabase client) from write scripts (PostgreSQL client with -pg suffix)'
      }
    ]
  },
  {
    version: '1.0.0',
    date: '2025-12-01',
    title: 'Full TypeScript Migration & Protection Levels',
    changes: [
      {
        category: 'feature',
        description: 'Converted entire codebase from JavaScript to TypeScript'
      },
      {
        category: 'feature',
        description: 'Implemented database-driven protection levels with OS-specific support'
      },
      {
        category: 'improvement',
        description: 'Added visual indicators (blue borders for preventable_fullscreen, red for always-protected)'
      },
      {
        category: 'improvement',
        description: 'Refactored CSS to remove duplicate styles and consolidate to components.css'
      }
    ]
  }
];

const categoryIcons: Record<Release['changes'][0]['category'], string> = {
  feature: '✨',
  improvement: '🚀',
  fix: '🐛',
  breaking: '⚠️'
};

const categoryLabels: Record<Release['changes'][0]['category'], string> = {
  feature: 'New Feature',
  improvement: 'Improvement',
  fix: 'Bug Fix',
  breaking: 'Breaking Change'
};

export default function ReleaseNotes() {
  return (
    <div className={styles.releaseNotesWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link to="/" className={styles.backButton}>
            ← ホームに戻る
          </Link>
          <h1 className={styles.title}>リリースノート</h1>
          <p className={styles.subtitle}>
            Keyboard Visualizerの最新アップデートと改善履歴
          </p>
        </header>

        <div className={styles.releasesContainer}>
          {releases.map((release) => (
            <article key={release.version} className={styles.releaseCard}>
              <div className={styles.releaseHeader}>
                <div className={styles.versionBadge}>
                  v{release.version}
                </div>
                <time className={styles.releaseDate}>{release.date}</time>
              </div>

              <h2 className={styles.releaseTitle}>{release.title}</h2>

              <ul className={styles.changesList}>
                {release.changes.map((change, index) => (
                  <li key={index} className={styles.changeItem}>
                    <span className={styles.categoryBadge} data-category={change.category}>
                      <span className={styles.categoryIcon}>{categoryIcons[change.category]}</span>
                      <span className={styles.categoryLabel}>{categoryLabels[change.category]}</span>
                    </span>
                    <p className={styles.changeDescription}>{change.description}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

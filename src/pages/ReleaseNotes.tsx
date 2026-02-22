import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useReleases } from '../hooks/useReleases';
import styles from './ReleaseNotes.module.css';

const categoryIcons: Record<'feature' | 'improvement' | 'fix' | 'breaking', string> = {
  feature: '✨',
  improvement: '🚀',
  fix: '🐛',
  breaking: '⚠️'
};

export default function ReleaseNotes() {
  const { t, language } = useLanguage();
  const { releases, loading, error } = useReleases();

  if (loading) {
    return (
      <div className={styles.releaseNotesWrapper}>
        <div className={styles.container}>
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading releases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.releaseNotesWrapper}>
        <div className={styles.container}>
          <p style={{ textAlign: 'center', padding: '2rem', color: '#ff3b30' }}>
            Error loading releases: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.releaseNotesWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link to="/" className={styles.backButton}>
            {t.releaseNotes.backToHome}
          </Link>
          <h1 className={styles.title}>{t.releaseNotes.title}</h1>
          <p className={styles.subtitle}>
            {t.releaseNotes.subtitle}
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

              <h2 className={styles.releaseTitle}>
                {language === 'ja' ? release.titleJa : release.titleEn}
              </h2>

              <ul className={styles.changesList}>
                {release.changes.map((change, index) => (
                  <li key={index} className={styles.changeItem}>
                    <span className={styles.categoryBadge} data-category={change.category}>
                      <span className={styles.categoryIcon}>{categoryIcons[change.category]}</span>
                      <span className={styles.categoryLabel}>{t.releaseNotes.categories[change.category]}</span>
                    </span>
                    <p className={styles.changeDescription}>
                      {language === 'ja' ? change.descriptionJa : change.descriptionEn}
                    </p>
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

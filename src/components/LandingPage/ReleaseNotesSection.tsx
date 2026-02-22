import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { useReleases } from '../../hooks/useReleases';
import LandingSection from './LandingSection';

const ReleaseNotesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { releases, loading } = useReleases();

  const TARGET_VERSION = '3.7.0'; // The version the user wants to highlight on LP

  // Find the target release (v3.7.0)
  const targetRelease = releases.find(release => release.version === TARGET_VERSION);
  // Use the target release if found, otherwise fall back to the actual latest release
  const displayRelease = targetRelease || releases[0];

  if (loading || !displayRelease) return null;

  return (
    <LandingSection className={styles.releaseNotesSection}>
      <h2 className={styles.sectionTitle}>{t.landing.releaseNotesTitle}</h2>
      <p className={styles.sectionSubtitle}>
        {t.landing.releaseNotesDescription}
      </p>
      <div className={styles.releaseNotesCard}>
        <div className={styles.releaseNotesHeader}>
          <span className={styles.releaseVersion}>v{displayRelease.version}</span>
          <span className={styles.releaseDate}>{displayRelease.date}</span>
        </div>
        <h3 className={styles.releaseNotesTitle}>
          {language === 'ja' ? displayRelease.titleJa : displayRelease.titleEn}
        </h3>
        <ul className={styles.releaseNotesList}>
          {displayRelease.changes.slice(0, 5).map((change, index) => (
            <li key={index}>
              {language === 'ja' ? change.descriptionJa : change.descriptionEn}
            </li>
          ))}
          {displayRelease.changes.length > 5 && (
            <li className={styles.moreChanges}>
              ...and {displayRelease.changes.length - 5} more improvements
            </li>
          )}
        </ul>
        <Link to="/release-notes" className={styles.releaseNotesLink}>
          {t.landing.viewAllReleases}
        </Link>
      </div>
    </LandingSection>
  );
};

export default ReleaseNotesSection;

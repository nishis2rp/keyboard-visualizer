import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { releases } from '../../constants/releases';
import LandingSection from './LandingSection';

const ReleaseNotesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const latestRelease = releases[0];

  if (!latestRelease) return null;

  return (
    <LandingSection className={styles.releaseNotesSection}>
      <h2 className={styles.sectionTitle}>{t.landing.releaseNotesTitle}</h2>
      <p className={styles.sectionSubtitle}>
        {t.landing.releaseNotesDescription}
      </p>
      <div className={styles.releaseNotesCard}>
        <div className={styles.releaseNotesHeader}>
          <span className={styles.releaseVersion}>v{latestRelease.version}</span>
          <span className={styles.releaseDate}>{latestRelease.date}</span>
        </div>
        <h3 className={styles.releaseNotesTitle}>
          {language === 'ja' ? latestRelease.titleJa : latestRelease.titleEn}
        </h3>
        <ul className={styles.releaseNotesList}>
          {latestRelease.changes.slice(0, 5).map((change, index) => (
            <li key={index}>
              {language === 'ja' ? change.descriptionJa : change.descriptionEn}
            </li>
          ))}
          {latestRelease.changes.length > 5 && (
            <li className={styles.moreChanges}>
              ...and {latestRelease.changes.length - 5} more improvements
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

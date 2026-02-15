import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';

const ReleaseNotesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className={styles.releaseNotesSection}>
      <h2 className={styles.sectionTitle}>{t.landing.releaseNotesTitle}</h2>
      <p className={styles.sectionSubtitle}>
        {t.landing.releaseNotesDescription}
      </p>
      <div className={styles.releaseNotesCard}>
        <div className={styles.releaseNotesHeader}>
          <span className={styles.releaseVersion}>{t.landing.releaseNotesVersion}</span>
          <span className={styles.releaseDate}>{t.landing.releaseNotesDate}</span>
        </div>
        <h3 className={styles.releaseNotesTitle}>{t.landing.releaseNotesSubtitle}</h3>
        <ul className={styles.releaseNotesList}>
          {t.landing.releaseNotesList.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
        <Link to="/release-notes" className={styles.releaseNotesLink}>
          {t.landing.viewAllReleases}
        </Link>
      </div>
    </section>
  );
};

export default ReleaseNotesSection;

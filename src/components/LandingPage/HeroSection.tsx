import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { releases } from '../../constants/releases';
import LandingSection from './LandingSection';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const latestVersion = releases[0]?.version || '2.3';

  return (
    <LandingSection className={`${styles.heroSection} ${styles.isVisible}`}>
      <div className={styles.badge}>NEW VERSION {latestVersion}</div>
      <h1 className={styles.title}>{t.landing.title}</h1>
      <p className={styles.subtitle}>
        {t.landing.subtitle}
      </p>
      <p className={styles.description}>
        {t.landing.description}
      </p>
      <div className={styles.ctaButtonContainer}>
        <Link to="/app" className={styles.ctaButton}>
          {t.landing.ctaButton}
          <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </LandingSection>
  );
};

export default HeroSection;

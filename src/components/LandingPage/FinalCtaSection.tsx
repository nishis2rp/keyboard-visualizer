import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';
import LandingSection from './LandingSection';

const FinalCtaSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <LandingSection className={styles.finalCtaSection}>
      <h2 className={styles.finalCtaTitle}>{t.landing.finalCtaTitle}</h2>
      <p className={styles.finalCtaDescription}>
        {t.landing.finalCtaDescription}
      </p>
      <Link to="/app" className={styles.finalCtaButton}>
        {t.landing.finalCtaButton}
        <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </LandingSection>
  );
};

export default FinalCtaSection;

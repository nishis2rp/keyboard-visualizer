import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';

const StatsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className={styles.statsSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>1,300+</div>
          <div className={styles.statLabel}>{t.landing.stats.shortcuts}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>9</div>
          <div className={styles.statLabel}>{t.landing.stats.apps}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>4</div>
          <div className={styles.statLabel}>{t.landing.stats.levels}</div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

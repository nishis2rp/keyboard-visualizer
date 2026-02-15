import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';

const BenefitsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className={styles.benefitsSection}>
      <h2 className={styles.sectionTitle}>{t.landing.benefitsTitle}</h2>
      <div className={styles.benefitsGrid}>
        <div className={styles.benefitCard}>
          <div className={styles.benefitNumber}>{t.landing.benefits.productivity.number}</div>
          <h3 className={styles.benefitTitle}>{t.landing.benefits.productivity.title}</h3>
          <p className={styles.benefitDescription}>
            {t.landing.benefits.productivity.description}
          </p>
        </div>
        <div className={styles.benefitCard}>
          <div className={styles.benefitNumber}>{t.landing.benefits.flow.number}</div>
          <h3 className={styles.benefitTitle}>{t.landing.benefits.flow.title}</h3>
          <p className={styles.benefitDescription}>
            {t.landing.benefits.flow.description}
          </p>
        </div>
        <div className={styles.benefitCard}>
          <div className={styles.benefitNumber}>{t.landing.benefits.skill.number}</div>
          <h3 className={styles.benefitTitle}>{t.landing.benefits.skill.title}</h3>
          <p className={styles.benefitDescription}>
            {t.landing.benefits.skill.description}
          </p>
        </div>
        <div className={styles.benefitCard}>
          <div className={styles.benefitNumber}>{t.landing.benefits.ergonomics.number}</div>
          <h3 className={styles.benefitTitle}>{t.landing.benefits.ergonomics.title}</h3>
          <p className={styles.benefitDescription}>
            {t.landing.benefits.ergonomics.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

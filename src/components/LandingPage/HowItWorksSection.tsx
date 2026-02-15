import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';

const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className={styles.howItWorksSection}>
      <h2 className={styles.sectionTitle}>{t.landing.howItWorksTitle}</h2>
      <div className={styles.stepsGrid}>
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>{t.landing.steps.step1.number}</div>
          <h3 className={styles.stepTitle}>{t.landing.steps.step1.title}</h3>
          <p className={styles.stepDescription}>{t.landing.steps.step1.description}</p>
        </div>
        <div className={styles.stepArrow}>→</div>
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>{t.landing.steps.step2.number}</div>
          <h3 className={styles.stepTitle}>{t.landing.steps.step2.title}</h3>
          <p className={styles.stepDescription}>{t.landing.steps.step2.description}</p>
        </div>
        <div className={styles.stepArrow}>→</div>
        <div className={styles.stepCard}>
          <div className={styles.stepNumber}>{t.landing.steps.step3.number}</div>
          <h3 className={styles.stepTitle}>{t.landing.steps.step3.title}</h3>
          <p className={styles.stepDescription}>{t.landing.steps.step3.description}</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

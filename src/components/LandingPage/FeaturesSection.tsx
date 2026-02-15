import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';

const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.sectionTitle}>{t.landing.whyTitle}</h2>
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <img
              src={`${import.meta.env.BASE_URL}icons/visualizer.svg`}
              alt="Visualizer"
              className={styles.featureIcon}
              loading="lazy"
              width="32"
              height="32"
            />
          </div>
          <h3>{t.landing.features.visualFeedback.title}</h3>
          <p>{t.landing.features.visualFeedback.description}</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <img
              src={`${import.meta.env.BASE_URL}icons/quiz.svg`}
              alt="Quiz"
              className={styles.featureIcon}
              loading="lazy"
              width="32"
              height="32"
            />
          </div>
          <h3>{t.landing.features.quizMode.title}</h3>
          <p>{t.landing.features.quizMode.description}</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <img
              src={`${import.meta.env.BASE_URL}icons/allrange.svg`}
              alt="Apps"
              className={styles.featureIcon}
              loading="lazy"
              width="32"
              height="32"
            />
          </div>
          <h3>{t.landing.features.multiPlatform.title}</h3>
          <p>{t.landing.features.multiPlatform.description}</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

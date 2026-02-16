import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';
import LandingSection from './LandingSection';

const FaqSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <LandingSection className={styles.faqSection}>
      <h2 className={styles.sectionTitle}>{t.landing.faqTitle}</h2>
      <div className={styles.faqGrid}>
        {t.landing.faqs.map((faq, index) => (
          <div key={index} className={styles.faqCard}>
            <h3 className={styles.faqQuestion}>{faq.q}</h3>
            <p className={styles.faqAnswer}>{faq.a}</p>
          </div>
        ))}
      </div>
    </LandingSection>
  );
};

export default FaqSection;

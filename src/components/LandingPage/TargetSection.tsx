import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';
import LandingSection from './LandingSection';

type TargetKey = 'engineer' | 'designer' | 'business';

interface Target {
  key: TargetKey;
  icon: string;
}

const TargetSection: React.FC = () => {
  const { t } = useLanguage();

  const targets: Target[] = [
    {
      key: 'engineer',
      icon: 'vscode.svg',
    },
    {
      key: 'designer',
      icon: 'xcode.svg',
    },
    {
      key: 'business',
      icon: 'excel.svg',
    }
  ];

  const targetsContent = t.landing.targets as Record<TargetKey, { title: string; description: string }>;

  return (
    <LandingSection className={styles.featuresSection}>
      <h2 className={styles.sectionTitle}>{t.landing.targetTitle}</h2>
      <div className={styles.featuresGrid}>
        {targets.map((target) => {
          const content = targetsContent[target.key];
          return (
            <div key={target.key} className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <img
                  src={`${import.meta.env.BASE_URL}icons/${target.icon}`}
                  alt={content.title}
                  className={styles.featureIcon}
                  loading="lazy"
                  width="32"
                  height="32"
                />
              </div>
              <h3>{content.title}</h3>
              <p>{content.description}</p>
            </div>
          );
        })}
      </div>
    </LandingSection>
  );
};

export default TargetSection;

import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';

const LandingHeader: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <header className={styles.landingHeader}>
      <div className={styles.languageSwitch}>
        <button 
          className={`${styles.langButton} ${language === 'ja' ? styles.activeLang : ''}`}
          onClick={() => setLanguage('ja')}
        >
          <span className={styles.langFlag}>🇯🇵</span> 日本語
        </button>
        <button 
          className={`${styles.langButton} ${language === 'en' ? styles.activeLang : ''}`}
          onClick={() => setLanguage('en')}
        >
          <span className={styles.langFlag}>🇺🇸</span> English
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;

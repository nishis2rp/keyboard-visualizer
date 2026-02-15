import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} {t.landing.footer.copyright}</p>
    </footer>
  );
};

export default Footer;

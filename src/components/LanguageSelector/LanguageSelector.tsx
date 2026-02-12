import { useLanguage, Language } from '../../context/LanguageContext';
import styles from './LanguageSelector.module.css';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.languageSelectorGroup}>
      <button
        className={`${styles.languageButton} ${language === 'ja' ? styles.active : ''}`}
        onClick={() => setLanguage('ja')}
        aria-label="Switch to Japanese"
        title="日本語"
      >
        <span className={styles.flag}>🇯🇵</span>
        <span className={styles.label}>JA</span>
      </button>
      <button
        className={`${styles.languageButton} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="Switch to English"
        title="English"
      >
        <span className={styles.flag}>🇺🇸</span>
        <span className={styles.label}>EN</span>
      </button>
    </div>
  );
}

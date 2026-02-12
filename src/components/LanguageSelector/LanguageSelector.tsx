import { useLanguage, Language } from '../../context/LanguageContext';
import styles from './LanguageSelector.module.css';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ja' ? 'en' : 'ja');
  };

  return (
    <button
      className={styles.languageSelector}
      onClick={toggleLanguage}
      aria-label="Switch language"
      title={language === 'ja' ? 'Switch to English' : '日本語に切り替え'}
    >
      <span className={styles.flag}>
        {language === 'ja' ? '🇯🇵' : '🇺🇸'}
      </span>
      <span className={styles.label}>
        {language === 'ja' ? 'JA' : 'EN'}
      </span>
    </button>
  );
}

import React, { useMemo } from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { useShortcutData } from '../../context';
import { ICON_MAPPING } from '../../constants/icons';

// Fallback apps for initial load
const FALLBACK_APPS = [
  { id: 'windows11', name: 'Windows 11', icon: 'windows.svg' },
  { id: 'macos', name: 'macOS', icon: 'macos.svg' },
  { id: 'chrome', name: 'Chrome', icon: 'chrome.svg' },
  { id: 'vscode', name: 'VS Code', icon: 'vscode.svg' },
  { id: 'excel', name: 'Excel', icon: 'excel.svg' },
  { id: 'word', name: 'Word', icon: 'word.svg' },
  { id: 'powerpoint', name: 'PowerPoint', icon: 'powerpoint.svg' },
  { id: 'slack', name: 'Slack', icon: 'slack.svg' },
  { id: 'gmail', name: 'Gmail', icon: 'gmail.svg' }
];

const AppsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { apps } = useShortcutData();

  const displayApps = useMemo(() => {
    if (apps && apps.length > 0) {
      return apps.map(app => ({
        id: app.id,
        name: language === 'en' && app.name_en ? app.name_en : app.name,
        icon: ICON_MAPPING[app.id] || 'allrange.svg'
      }));
    }
    return FALLBACK_APPS;
  }, [apps, language]);

  return (
    <section className={styles.appsSection}>
      <h2 className={styles.sectionTitle}>{t.landing.appsTitle}</h2>
      <p className={styles.sectionSubtitle}>
        {t.landing.appsDescription}
      </p>
      <div className={styles.appsGrid}>
        {displayApps.map(app => (
          <div key={app.id} className={styles.appCard}>
            <img 
              src={`${import.meta.env.BASE_URL}icons/${app.icon}`} 
              alt={app.name} 
              className={styles.appIcon} 
              loading="lazy" 
              width="44" 
              height="44" 
            />
            <div className={styles.appName}>{app.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AppsSection;

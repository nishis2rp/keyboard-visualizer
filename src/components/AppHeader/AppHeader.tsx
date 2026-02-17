import { memo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { StyledButton } from '../common/StyledButton'
import { useAuth } from '../../context/AuthContext'
import { useShortcutData } from '../../context'
import { useLanguage } from '../../context/LanguageContext'
import AuthModal from '../Auth/AuthModal'
import UserMenu from '../Auth/UserMenu'
import { LanguageSelector } from '../LanguageSelector'
import { downloadShortcutsAsCSV } from '../../utils'
import { HeaderLogo } from '../common/HeaderLogo'
import styles from './AppHeader.module.css'

interface AppHeaderProps {
  fullscreenMode: boolean;
  onToggleFullscreen: () => void;
  isQuizMode: boolean;
  onQuizModeToggle: () => void;
}

/**
 * アプリケーションヘッダーコンポーネント
 *
 * タイトルと全画面モード切り替えボタンを表示
 * 全画面モードでない場合は、ショートカット競合に関する警告を表示
 */
const AppHeader = memo<AppHeaderProps>(({ fullscreenMode, onToggleFullscreen, isQuizMode, onQuizModeToggle }) => {
  const { user } = useAuth();
  const { richShortcuts } = useShortcutData();
  const { t } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // CSVダウンロードハンドラー
  const handleDownloadCSV = useCallback(() => {
    if (!richShortcuts || richShortcuts.length === 0) {
      alert(t.header.noShortcutsToDownload);
      return;
    }
    downloadShortcutsAsCSV(richShortcuts);
  }, [richShortcuts, t.header.noShortcutsToDownload]);

  return (
    <>
      <header className={styles.headerContainer}>
        <Link to="/app" className={styles.titleLink}>
          <div className={styles.titleContainer}>
            <div className={styles.logoIconContainer}>
              <HeaderLogo size={48} />
            </div>
            <div className={styles.titleTextContainer}>
              <span className={styles.titleText}>KEYBOARD Visualizer</span>
            </div>
          </div>
        </Link>
        <div className={styles.buttonGroup}>
          <Link to="/">
            <StyledButton
              backgroundColor="#2d3748"
              textColor="white"
              title={t.header.backToLP}
            >
              {t.header.backToLP}
            </StyledButton>
          </Link>
          <StyledButton
            onClick={onQuizModeToggle}
            backgroundColor={isQuizMode ? "#475569" : "#2d3748"}
            textColor="white"
            title={isQuizMode ? t.header.returnToVisualizer : t.header.startQuizMode}
          >
            {isQuizMode ? t.header.visualizer : t.header.quizMode}
          </StyledButton>
          <StyledButton
            onClick={onToggleFullscreen}
            backgroundColor={fullscreenMode ? "#f1f5f9" : "#ffffff"}
            textColor="#2d3748"
            borderColor="#e2e8f0"
            title={fullscreenMode ? t.header.exitFullscreen : t.header.fullscreen}
          >
            {fullscreenMode ? "⛶ " + t.header.exitFullscreen : "⛶ " + t.header.fullscreen}
          </StyledButton>
          <button
            className={styles.csvDownloadButton}
            onClick={handleDownloadCSV}
            title={t.header.csvDownload}
          >
            <span className={styles.csvText}>CSV</span>
          </button>
          <LanguageSelector />
          {user ? (
            <UserMenu />
          ) : (
            <StyledButton
              onClick={() => setShowAuthModal(true)}
              backgroundColor="#2d3748"
              textColor="white"
              title={t.header.login}
            >
              {t.header.login}
            </StyledButton>
          )}
        </div>
      </header>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
})

AppHeader.displayName = 'AppHeader'

export default AppHeader

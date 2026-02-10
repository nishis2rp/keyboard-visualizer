import { memo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { StyledButton } from '../common/StyledButton'
import { useAuth } from '../../context/AuthContext'
import { useShortcutData } from '../../context'
import AuthModal from '../Auth/AuthModal'
import UserMenu from '../Auth/UserMenu'
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
  const [showAuthModal, setShowAuthModal] = useState(false);

  // CSVダウンロードハンドラー
  const handleDownloadCSV = useCallback(() => {
    if (!richShortcuts || richShortcuts.length === 0) {
      alert('ダウンロードするショートカットがありません');
      return;
    }
    downloadShortcutsAsCSV(richShortcuts);
  }, [richShortcuts]);

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
          <StyledButton
            onClick={onQuizModeToggle}
            backgroundColor="#6366f1"
            textColor="white"
            title={isQuizMode ? 'ビジュアライザーに戻ります' : 'クイズモードを開始します'}
          >
            {isQuizMode ? 'Visualizer' : 'Quiz Mode'}
          </StyledButton>
          <StyledButton
            onClick={onToggleFullscreen}
            backgroundColor="#f1f5f9"
            textColor="#475569"
            borderColor="#e2e8f0"
            title="フルスクリーンモード"
          >
            {fullscreenMode ? '全画面終了' : '全画面'}
          </StyledButton>
          <button
            className={styles.csvDownloadButton}
            onClick={handleDownloadCSV}
            title="CSVダウンロード"
          >
            <span className={styles.csvText}>CSV</span>
          </button>
          {user ? (
            <UserMenu />
          ) : (
            <StyledButton
              onClick={() => setShowAuthModal(true)}
              backgroundColor="#1e293b"
              textColor="white"
              title="ログイン"
            >
              ログイン
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

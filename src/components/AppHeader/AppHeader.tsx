import { memo, useState, useCallback } from 'react'
import { StyledButton } from '../common/StyledButton'
import { useAuth } from '../../context/AuthContext'
import { useAppContext } from '../../context/AppContext'
import AuthModal from '../Auth/AuthModal'
import UserMenu from '../Auth/UserMenu'
import { downloadShortcutsAsCSV } from '../../utils'
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
  const { richShortcuts } = useAppContext();
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
      <div className={styles.headerContainer}>
        <h1 className={styles.titleContainer}>
          <div className={styles.logoGroup}>
            <span className={`${styles.logoBox} ${styles.logoBoxK}`}>K</span>
            <span className={`${styles.logoBox} ${styles.logoBoxS}`}>S</span>
            <span className={`${styles.logoBox} ${styles.logoBoxV}`}>V</span>
          </div>
          <div className={styles.titleTextContainer}>
            <span className={styles.titleLine1}>Keyboard Shortcut</span>
            <span className={styles.titleLine2}>Visualizer</span>
          </div>
        </h1>
        <div className={styles.buttonGroup}>
          <StyledButton
            onClick={onQuizModeToggle}
            backgroundColor="rgba(196, 181, 253, 0.85)"
            hoverBackgroundColor="rgba(196, 181, 253, 0.95)"
            textColor="#1e3a8a"
            borderColor="rgba(167, 139, 250, 0.5)"
            title={isQuizMode ? 'クイズモードを終了してビジュアライザーに戻ります' : 'ショートカットを学習するクイズモードを開始します'}
          >
            {isQuizMode ? 'Visualizer Mode' : 'Quiz Mode'}
          </StyledButton>
          <StyledButton
            onClick={onToggleFullscreen}
            backgroundColor="rgba(196, 181, 253, 0.85)"
            hoverBackgroundColor="rgba(196, 181, 253, 0.95)"
            textColor="#1e3a8a"
            borderColor="rgba(167, 139, 250, 0.5)"
            title="フルスクリーンモードでショートカット競合を軽減。Keyboard Lock APIによりほとんどのWinキーショートカットをキャプチャできますが、Win+L（ロック）などのセキュリティ関連はOSレベルで保護されています"
          >
            {fullscreenMode ? '全画面を終了' : '全画面モード'}
          </StyledButton>
          <button
            className={styles.csvDownloadButton}
            onClick={handleDownloadCSV}
            title="全ショートカットをCSV形式でダウンロード"
          >
            <span className={styles.csvText}>CSV DL</span>
          </button>
          {user ? (
            <UserMenu />
          ) : (
            <StyledButton
              onClick={() => setShowAuthModal(true)}
              backgroundColor="#667eea"
              title="ログインしてクイズの進捗を保存"
            >
              ログイン
            </StyledButton>
          )}
        </div>
      </div>
      <p className="subtitle">
        アプリケーション別のショートカットを視覚的に表示します
        {!fullscreenMode && <span className={styles.warningText}>
          💡 Ctrl+WやWinキーなどの競合を防ぐには全画面モードを使用してください
        </span>}
      </p>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
})

AppHeader.displayName = 'AppHeader'

export default AppHeader

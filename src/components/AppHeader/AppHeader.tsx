import { memo } from 'react'
import { StyledButton } from '../common/StyledButton'
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
            backgroundColor={isQuizMode ? '#6C757D' : '#007AFF'}
            title={isQuizMode ? 'クイズモードを終了してビジュアライザーに戻ります' : 'ショートカットを学習するクイズモードを開始します'}
          >
            {isQuizMode ? 'Visualizer Mode' : 'Quiz Mode'}
          </StyledButton>
          <StyledButton
            onClick={onToggleFullscreen}
            backgroundColor={fullscreenMode ? '#FF3B30' : '#007AFF'}
            title="フルスクリーンモードでショートカット競合を軽減。Keyboard Lock APIによりほとんどのWinキーショートカットをキャプチャできますが、Win+L（ロック）などのセキュリティ関連はOSレベルで保護されています"
          >
            {fullscreenMode ? '全画面を終了' : '全画面モード'}
          </StyledButton>
        </div>
      </div>
      <p className="subtitle">
        アプリケーション別のショートカットを視覚的に表示します
        {!fullscreenMode && <span className={styles.warningText}>
          💡 Ctrl+WやWinキーなどの競合を防ぐには全画面モードを使用してください
        </span>}
      </p>
    </>
  )
})

AppHeader.displayName = 'AppHeader'

export default AppHeader

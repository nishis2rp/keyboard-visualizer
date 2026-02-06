import { useState, useEffect } from 'react'
import { SETUP_VERSION } from '../../constants/app'
import { useAppContext } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../Auth/AuthModal'
import UserMenu from '../Auth/UserMenu'
import './SetupScreen.css'

interface SetupScreenProps {
  onSetupComplete: (app: string, layout: string, mode: string, quizApp: string | null, difficulty?: string, isFullscreen?: boolean) => void;
}

const SetupScreen = ({ onSetupComplete }: SetupScreenProps) => {
  const { isQuizMode, apps } = useAppContext()
  const { user } = useAuth()
  const [selectedFullscreen, setSelectedFullscreen] = useState(null)
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)
  const [selectedQuizApps, setSelectedQuizApps] = useState<any[]>([]) // 複数選択対応
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // クイズモードが既に有効な場合、モード選択をスキップ
  useEffect(() => {
    if (isQuizMode) {
      setSelectedMode({ id: 'quiz', title: 'クイズモード', icon: '🎯' })
    }
  }, [isQuizMode])

  const fullscreenOptions = [
    {
      id: 'fullscreen',
      title: '全画面モード',
      icon: '🖥️',
      description: 'フルスクリーン表示で集中して学習'
    },
    {
      id: 'windowed',
      title: 'ウィンドウモード',
      icon: '🪟',
      description: '他のウィンドウと並べて使用'
    }
  ]

  const layoutOptions = [
    {
      id: 'windows-jis',
      title: 'Windows JIS',
      icon: '🪟',
      description: '日本語キーボード（Windows）'
    },
    {
      id: 'mac-jis',
      title: 'Mac JIS',
      icon: '🍎',
      description: '日本語キーボード（Mac）'
    },
    {
      id: 'mac-us',
      title: 'Mac US',
      icon: '🇺🇸',
      description: 'US（英語）キーボード（Mac）'
    }
  ]

  // ビジュアライザーモード用のアプリケーション選択肢
  const visualizerAppOptions = apps.map(app => ({
    ...app,
    description: `${app.name}のショートカットを表示`
  }))

  const modes = [
    {
      id: 'visualizer',
      title: 'ビジュアライザーモード',
      icon: '⌨️',
      description: 'キーボードショートカットを可視化'
    },
    {
      id: 'quiz',
      title: 'クイズモード',
      icon: '🎯',
      description: 'ショートカットを学習してスコアを競う'
    }
  ]

  // 難易度選択肢
  const difficultyOptions = [
    {
      id: 'basic',
      name: 'basic',
      icon: '🌟',
      description: 'For beginners: Commonly used basic shortcuts'
    },
    {
      id: 'standard',
      name: 'standard',
      icon: '⚡',
      description: 'For intermediate users: Standard difficulty shortcuts'
    },
    {
      id: 'hard',
      name: 'hard',
      icon: '💪',
      description: 'For advanced users: More advanced and practical shortcuts'
    },
    {
      id: 'madmax',
      name: 'madmax',
      icon: '🔥',
      description: 'Expert level: Very specialized and difficult professional shortcuts'
    },
    {
      id: 'allrange',
      name: 'allrange',
      icon: '🎲',
      description: 'All difficulties: Random shortcuts from all levels'
    }
  ]

  // クイズ用のアプリ選択肢（ランダムを含む）
  const quizAppOptions = [
    {
      id: 'random',
      name: 'ランダム',
      icon: '🎲',
      description: 'すべてのアプリからランダムに出題'
    },
    ...apps.map(app => ({
      ...app,
      description: `${app.name}のショートカットのみ出題`
    }))
  ]

  const handleSelectFullscreen = (option) => {
    setSelectedFullscreen(option)
  }

  const handleSelectLayout = (layout) => {
    setSelectedLayout(layout)
  }

  const handleSelectMode = (mode) => {
    setSelectedMode(mode)
    // モード変更時にアプリ選択をリセット
    setSelectedApp(null)
    // クイズモード以外を選択した場合、クイズアプリと難易度をリセット
    if (mode.id !== 'quiz') {
      setSelectedQuizApps([])
      setSelectedDifficulty(null)
    }
  }

  const handleSelectApp = (app) => {
    setSelectedApp(app)
  }

  const handleSelectQuizApp = (app) => {
    // 複数選択対応
    setSelectedQuizApps(prev => {
      // 既に選択されている場合は削除
      if (prev.some(a => a.id === app.id)) {
        return prev.filter(a => a.id !== app.id)
      }
      // 選択されていない場合は追加
      return [...prev, app]
    })
  }

  const handleSelectDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty)
  }

  const handleConfirm = () => {
    // すべての必須項目が選択されているかチェック
    let canProceed = false

    if (selectedMode?.id === 'quiz') {
      // クイズモードの場合
      canProceed = selectedFullscreen && selectedLayout && selectedMode && selectedQuizApps.length > 0 && selectedDifficulty
    } else if (selectedMode?.id === 'visualizer') {
      // ビジュアライザーモードの場合
      canProceed = selectedFullscreen && selectedLayout && selectedMode && selectedApp
    }

    if (canProceed) {
      // 使用するアプリIDを決定（クイズモードの場合はquizAppを使わず、デフォルトのアプリを使う）
      const appId = selectedMode.id === 'quiz'
        ? (selectedLayout.id === 'windows-jis' ? 'windows11' : 'macos')
        : selectedApp.id

      localStorage.setItem('keyboard-visualizer-setup', JSON.stringify({
        app: appId,
        layout: selectedLayout.id,
        setupCompleted: true,
        version: SETUP_VERSION
      }))

      // クイズモードの場合は選択されたアプリ(複数)と難易度も渡す
      const quizAppsIds = selectedMode.id === 'quiz'
        ? selectedQuizApps.map(app => app.id).join(',')
        : null

      onSetupComplete(
        appId,
        selectedLayout.id,
        selectedMode.id,
        quizAppsIds,
        selectedMode.id === 'quiz' ? selectedDifficulty.id : undefined,
        selectedFullscreen.id === 'fullscreen'
      )
    }
  }

  return (
    <div className="setup-overlay">
      <div className="setup-container">
        <div className="setup-header">
          <div className="setup-header-top">
            <div>
              <h1>⌨️ キーボードビジュアライザー</h1>
              <h2>ようこそ！</h2>
              <p>お使いの環境を選択してください</p>
            </div>
            <div className="setup-auth-button">
              {user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="auth-login-button"
                  title="ログインしてクイズの進捗を保存"
                >
                  <span>👤</span>
                  <span>ログイン</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 全画面モード選択 */}
        <div className="setup-divider">
          <h3>表示モードを選択してください</h3>
        </div>

        <div className="setup-options setup-modes">
          {fullscreenOptions.map((option) => (
            <div
              key={option.id}
              className={`setup-option ${selectedFullscreen?.id === option.id ? 'selected' : ''}`}
              onClick={() => handleSelectFullscreen(option)}
            >
              <div className="option-icon">{option.icon}</div>
              <div className="option-content">
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                {option.id === 'fullscreen' && (
                  <p className="setup-recommendation">💡 推奨：より没入感のある学習体験</p>
                )}
              </div>
              <div className="option-check">
                {selectedFullscreen?.id === option.id && '✓'}
              </div>
            </div>
          ))}
        </div>

        {/* キーボードレイアウト選択 */}
        <div className="setup-divider">
          <h3>キーボードレイアウトを選択してください</h3>
        </div>

        <div className="setup-options setup-layouts">
          {layoutOptions.map((layout) => (
            <div
              key={layout.id}
              className={`setup-option ${selectedLayout?.id === layout.id ? 'selected' : ''}`}
              onClick={() => handleSelectLayout(layout)}
            >
              <div className="option-icon">{layout.icon}</div>
              <div className="option-content">
                <h3>{layout.title}</h3>
                <p>{layout.description}</p>
              </div>
              <div className="option-check">
                {selectedLayout?.id === layout.id && '✓'}
              </div>
            </div>
          ))}
        </div>

        {/* クイズモードが既に有効でない場合のみ、モード選択を表示 */}
        {!isQuizMode && (
          <>
            <div className="setup-divider">
              <h3>モードを選択してください</h3>
            </div>

            <div className="setup-options setup-modes">
              {modes.map((mode) => (
                <div
                  key={mode.id}
                  className={`setup-option ${selectedMode?.id === mode.id ? 'selected' : ''}`}
                  onClick={() => handleSelectMode(mode)}
                >
                  <div className="option-icon">{mode.icon}</div>
                  <div className="option-content">
                    <h3>{mode.title}</h3>
                    <p>{mode.description}</p>
                  </div>
                  <div className="option-check">
                    {selectedMode?.id === mode.id && '✓'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ビジュアライザーモードが選択された場合、アプリケーション選択を表示 */}
        {selectedMode?.id === 'visualizer' && (
          <>
            <div className="setup-divider">
              <h3>アプリケーションを選択してください</h3>
            </div>

            <div className="setup-options setup-quiz-apps">
              {visualizerAppOptions.map((app) => (
                <div
                  key={app.id}
                  className={`setup-option ${selectedApp?.id === app.id ? 'selected' : ''}`}
                  onClick={() => handleSelectApp(app)}
                >
                  <div className="option-icon">{app.icon}</div>
                  <div className="option-content">
                    <h3>{app.name}</h3>
                    <p>{app.description}</p>
                  </div>
                  <div className="option-check">
                    {selectedApp?.id === app.id && '✓'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* クイズモードが選択された場合、難易度選択を表示 */}
        {selectedMode?.id === 'quiz' && (
          <>
            <div className="setup-divider">
              <h3>難易度を選択してください</h3>
            </div>

            <div className="setup-options setup-modes">
              {difficultyOptions.map((difficulty) => (
                <div
                  key={difficulty.id}
                  className={`setup-option ${selectedDifficulty?.id === difficulty.id ? 'selected' : ''}`}
                  onClick={() => handleSelectDifficulty(difficulty)}
                >
                  <div className="option-icon">{difficulty.icon}</div>
                  <div className="option-content">
                    <h3>{difficulty.name}</h3>
                    <p>{difficulty.description}</p>
                  </div>
                  <div className="option-check">
                    {selectedDifficulty?.id === difficulty.id && '✓'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* クイズモードが選択された場合、アプリケーション選択を表示 */}
        {selectedMode?.id === 'quiz' && (
          <>
            <div className="setup-divider">
              <h3>出題するアプリケーションを選択してください（複数選択可）</h3>
            </div>

            <div className="setup-options setup-quiz-apps">
              {quizAppOptions.map((app) => (
                <div
                  key={app.id}
                  className={`setup-option ${selectedQuizApps.some(a => a.id === app.id) ? 'selected' : ''}`}
                  onClick={() => handleSelectQuizApp(app)}
                >
                  <div className="option-icon">{app.icon}</div>
                  <div className="option-content">
                    <h3>{app.name}</h3>
                    <p>{app.description}</p>
                  </div>
                  <div className="option-check">
                    {selectedQuizApps.some(a => a.id === app.id) && '✓'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="setup-footer">
          <button
            className="setup-confirm-btn"
            onClick={handleConfirm}
            disabled={
              !selectedFullscreen ||
              !selectedLayout ||
              !selectedMode ||
              (selectedMode?.id === 'visualizer' && !selectedApp) ||
              (selectedMode?.id === 'quiz' && (!selectedDifficulty || selectedQuizApps.length === 0))
            }
          >
            {!selectedFullscreen
              ? '表示モードを選択してください'
              : !selectedLayout
              ? 'キーボードレイアウトを選択してください'
              : !selectedMode
              ? 'モードを選択してください'
              : selectedMode.id === 'visualizer' && !selectedApp
              ? 'アプリケーションを選択してください'
              : selectedMode.id === 'quiz' && !selectedDifficulty
              ? '難易度を選択してください'
              : selectedMode.id === 'quiz' && selectedQuizApps.length === 0
              ? 'アプリケーションを選択してください'
              : '開始する'}
          </button>
          <p className="setup-note">
            後で設定から変更できます
          </p>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

export default SetupScreen

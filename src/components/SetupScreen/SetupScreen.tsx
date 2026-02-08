import { useState, useEffect, useMemo } from 'react'
import { SETUP_VERSION } from '../../constants/app'
import { 
  FULLSCREEN_OPTIONS, 
  LAYOUT_OPTIONS, 
  MODES, 
  DIFFICULTY_OPTIONS 
} from '../../constants/setup'
import { useUI, useShortcutData } from '../../context'
import { useAuth } from '../../context/AuthContext'
import { SetupOption as SetupOptionType } from '../../types'
import AuthModal from '../Auth/AuthModal'
import UserMenu from '../Auth/UserMenu'
import SetupOption from './SetupOption'
import SetupSection from './SetupSection'
import './SetupScreen.css'

interface SetupScreenProps {
  onSetupComplete: (app: string, layout: string, mode: string, quizApp: string | null, difficulty?: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' | null, isFullscreen?: boolean) => void;
}

const SetupScreen = ({ onSetupComplete }: SetupScreenProps) => {
  const { isQuizMode } = useUI()
  const { apps } = useShortcutData()
  const { user } = useAuth()
  const [selectedFullscreen, setSelectedFullscreen] = useState<SetupOptionType | null>(null)
  const [selectedLayout, setSelectedLayout] = useState<SetupOptionType | null>(null)
  const [selectedMode, setSelectedMode] = useState<SetupOptionType | null>(null)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [selectedQuizApps, setSelectedQuizApps] = useState<any[]>([]) // 複数選択対応
  const [selectedDifficulty, setSelectedDifficulty] = useState<SetupOptionType | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // クイズモードが既に有効な場合、モード選択をスキップ
  useEffect(() => {
    if (isQuizMode) {
      const quizMode = MODES.find(m => m.id === 'quiz') as SetupOptionType;
      setSelectedMode(quizMode)
    }
  }, [isQuizMode])

  // ビジュアライザーモード用のアプリケーション選択肢
  const visualizerAppOptions = useMemo(() => apps.map(app => ({
    ...app,
    title: app.name
  })), [apps])

  // クイズ用のアプリ選択肢（ランダムを含む）
  const quizAppOptions = useMemo(() => [
    {
      id: 'random',
      name: 'ランダム',
      title: 'ランダム',
      icon: '🎲'
    },
    ...apps.map(app => ({
      ...app,
      title: app.name
    }))
  ], [apps])

  const handleSelectMode = (mode: SetupOptionType) => {
    setSelectedMode(mode)
    setSelectedApp(null)
    if (mode.id !== 'quiz') {
      setSelectedQuizApps([])
      setSelectedDifficulty(null)
    }
  }

  const handleSelectQuizApp = (app: any) => {
    setSelectedQuizApps(prev => {
      if (prev.some(a => a.id === app.id)) {
        return prev.filter(a => a.id !== app.id)
      }
      return [...prev, app]
    })
  }

  const handleConfirm = () => {
    let canProceed = false

    if (selectedMode?.id === 'quiz') {
      canProceed = !!(selectedFullscreen && selectedLayout && selectedMode && selectedQuizApps.length > 0 && selectedDifficulty)
    } else if (selectedMode?.id === 'visualizer') {
      canProceed = !!(selectedFullscreen && selectedLayout && selectedMode && selectedApp)
    }

    if (canProceed && selectedMode && selectedLayout && selectedFullscreen) {
      const appId = selectedMode.id === 'quiz'
        ? (selectedLayout.id === 'windows-jis' ? 'windows11' : 'macos')
        : selectedApp.id

      localStorage.setItem('keyboard-visualizer-setup', JSON.stringify({
        app: appId,
        layout: selectedLayout.id,
        setupCompleted: true,
        version: SETUP_VERSION
      }))

      const quizAppsIds = selectedMode.id === 'quiz'
        ? selectedQuizApps.map(app => app.id).join(',')
        : null

      onSetupComplete(
        appId,
        selectedLayout.id,
        selectedMode.id,
        quizAppsIds,
        selectedMode.id === 'quiz' ? selectedDifficulty?.id : undefined,
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
        <SetupSection title="表示モードを選択してください">
          <div className="setup-options setup-modes">
            {FULLSCREEN_OPTIONS.map((option) => (
              <SetupOption
                key={option.id}
                option={option}
                isSelected={selectedFullscreen?.id === option.id}
                onSelect={setSelectedFullscreen}
                showRecommendation
              />
            ))}
          </div>
        </SetupSection>

        {/* キーボードレイアウト選択 */}
        <SetupSection title="キーボードレイアウトを選択してください">
          <div className="setup-options setup-layouts">
            {LAYOUT_OPTIONS.map((layout) => (
              <SetupOption
                key={layout.id}
                option={layout}
                isSelected={selectedLayout?.id === layout.id}
                onSelect={setSelectedLayout}
              />
            ))}
          </div>
        </SetupSection>

        {/* クイズモードが既に有効でない場合のみ、モード選択を表示 */}
        {!isQuizMode && (
          <SetupSection title="モードを選択してください">
            <div className="setup-options setup-modes">
              {MODES.map((mode) => (
                <SetupOption
                  key={mode.id}
                  option={mode}
                  isSelected={selectedMode?.id === mode.id}
                  onSelect={handleSelectMode}
                />
              ))}
            </div>
          </SetupSection>
        )}

        {/* ビジュアライザーモードが選択された場合、アプリケーション選択を表示 */}
        {selectedMode?.id === 'visualizer' && (
          <SetupSection title="アプリケーションを選択してください">
            <div className="setup-options setup-quiz-apps">
              {visualizerAppOptions.map((app) => (
                <SetupOption
                  key={app.id}
                  option={app}
                  isSelected={selectedApp?.id === app.id}
                  onSelect={setSelectedApp}
                />
              ))}
            </div>
          </SetupSection>
        )}

        {/* クイズモードが選択された場合、難易度選択を表示 */}
        {selectedMode?.id === 'quiz' && (
          <>
            <SetupSection title="難易度を選択してください">
              <div className="setup-options setup-modes">
                {DIFFICULTY_OPTIONS.map((difficulty) => (
                  <SetupOption
                    key={difficulty.id}
                    option={{ ...difficulty, title: difficulty.name }}
                    isSelected={selectedDifficulty?.id === difficulty.id}
                    onSelect={setSelectedDifficulty}
                  />
                ))}
              </div>
            </SetupSection>

            <SetupSection title="出題するアプリケーションを選択してください（複数選択可）">
              <div className="setup-options setup-quiz-apps">
                {quizAppOptions.map((app) => (
                  <SetupOption
                    key={app.id}
                    option={app}
                    isSelected={selectedQuizApps.some(a => a.id === app.id)}
                    onSelect={handleSelectQuizApp}
                  />
                ))}
              </div>
            </SetupSection>
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
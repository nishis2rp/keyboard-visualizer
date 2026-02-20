import { useState, useEffect, useMemo } from 'react'
import { SETUP_VERSION } from '../../constants/app'
import { DIFFICULTIES } from '../../constants/shortcuts'
import { LANGUAGE_OPTIONS } from '../../constants/setup'
import { useUI, useShortcutData } from '../../context'
import { useAuth } from '../../context/AuthContext'
import { useLanguage, Language } from '../../context/LanguageContext'
import { SetupOption as SetupOptionType, SetupCompleteOptions, ShortcutDifficulty, App } from '../../types'
import AuthModal from '../Auth/AuthModal'
import UserMenu from '../Auth/UserMenu'
import SetupOption from './SetupOption'
import SetupSection from './SetupSection'
import ParticleCanvas from '../LandingPage/ParticleCanvas'
import styles from '../../pages/LandingPage.module.css'
import './SetupScreen.css'

interface SetupScreenProps {
  onSetupComplete: (options: SetupCompleteOptions) => void;
}

const SetupScreen = ({ onSetupComplete }: SetupScreenProps) => {
  const { setSetup, setDifficulty, setSelectedApp, setKeyboardLayout } = useSettings()
  const { isQuizMode } = useUI()
  const { apps } = useShortcutData()
  const { user } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const [selectedFullscreen, setSelectedFullscreen] = useState<SetupOptionType | null>(null)
  const [selectedLayout, setSelectedLayout] = useState<SetupOptionType | null>(null)
  const [selectedMode, setSelectedMode] = useState<SetupOptionType | null>(null)
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const [selectedQuizApps, setSelectedQuizApps] = useState<App[]>([]) // 複数選択対応
  const [selectedDifficulty, setSelectedDifficulty] = useState<SetupOptionType | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Translated options
  const fullscreenOptions = useMemo(() => [
    {
      id: 'fullscreen',
      title: t.setup.displayMode.fullscreen.title,
      icon: 'fullscreen',
      description: t.setup.displayMode.fullscreen.description,
      recommendation: t.setup.displayMode.fullscreen.recommendation
    },
    {
      id: 'windowed',
      title: t.setup.displayMode.windowed.title,
      icon: 'windowed',
      description: t.setup.displayMode.windowed.description
    }
  ], [t])

  const layoutOptions = useMemo(() => [
    {
      id: 'windows-jis',
      title: t.setup.keyboardLayout.windowsJis.title,
      icon: 'windows-jis',
      description: t.setup.keyboardLayout.windowsJis.description
    },
    {
      id: 'windows-us',
      title: t.setup.keyboardLayout.windowsUs?.title || 'Windows US',
      icon: 'windows-us',
      description: t.setup.keyboardLayout.windowsUs?.description || 'US (English) Keyboard (Windows)'
    },
    {
      id: 'mac-jis',
      title: t.setup.keyboardLayout.macJis.title,
      icon: 'mac-jis',
      description: t.setup.keyboardLayout.macJis.description
    },
    {
      id: 'mac-us',
      title: t.setup.keyboardLayout.macUs.title,
      icon: 'mac-us',
      description: t.setup.keyboardLayout.macUs.description
    }
  ], [t])

  const modeOptions = useMemo(() => [
    {
      id: 'visualizer',
      title: t.setup.modes.visualizer.title,
      icon: 'visualizer',
      description: t.setup.modes.visualizer.description
    },
    {
      id: 'quiz',
      title: t.setup.modes.quiz.title,
      icon: 'quiz',
      description: t.setup.modes.quiz.description
    }
  ], [t])

  const difficultyOptionsTranslated = useMemo(() => [
    {
      id: DIFFICULTIES.BASIC,
      name: t.setup.difficultyOptions.basic.name,
      icon: DIFFICULTIES.BASIC,
      description: t.setup.difficultyOptions.basic.description
    },
    {
      id: DIFFICULTIES.STANDARD,
      name: t.setup.difficultyOptions.standard.name,
      icon: DIFFICULTIES.STANDARD,
      description: t.setup.difficultyOptions.standard.description
    },
    {
      id: DIFFICULTIES.HARD,
      name: t.setup.difficultyOptions.hard.name,
      icon: DIFFICULTIES.HARD,
      description: t.setup.difficultyOptions.hard.description
    },
    {
      id: DIFFICULTIES.MADMAX,
      name: t.setup.difficultyOptions.madmax.name,
      icon: DIFFICULTIES.MADMAX,
      description: t.setup.difficultyOptions.madmax.description
    },
    {
      id: DIFFICULTIES.ALLRANGE,
      name: t.setup.difficultyOptions.allrange.name,
      icon: DIFFICULTIES.ALLRANGE,
      description: t.setup.difficultyOptions.allrange.description
    }
  ], [t])

  // クイズモードが既に有効な場合、モード選択をスキップ
  useEffect(() => {
    if (isQuizMode) {
      const quizMode = modeOptions.find(m => m.id === 'quiz') as SetupOptionType;
      setSelectedMode(quizMode)
    }
  }, [isQuizMode, modeOptions])

  // ビジュアライザーモード用のアプリケーション選択肢
  const visualizerAppOptions = useMemo(() => apps.map(app => ({
    ...app,
    title: language === 'en' && app.name_en ? app.name_en : app.name
  })), [apps, language])

  // クイズ用のアプリ選択肢（ランダムを含む）
  const quizAppOptions = useMemo(() => [
    {
      id: 'random',
      name: t.setup.randomApp,
      title: t.setup.randomApp,
      icon: 'random'
    },
    ...apps.map(app => ({
      ...app,
      title: language === 'en' && app.name_en ? app.name_en : app.name
    }))
  ], [apps, t.setup.randomApp, language])

  const handleSelectMode = (mode: SetupOptionType) => {
    setSelectedMode(mode)
    setSelectedApp(null)
    if (mode.id !== 'quiz') {
      setSelectedQuizApps([])
      setSelectedDifficulty(null)
    }
  }

  const handleSelectQuizApp = (app: App) => {
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

      const quizAppsIds = selectedMode.id === 'quiz'
        ? selectedQuizApps.map(app => app.id).join(',')
        : null

      onSetupComplete({
        app: appId,
        layout: selectedLayout.id,
        mode: selectedMode.id,
        quizApp: quizAppsIds,
        difficulty: selectedMode.id === 'quiz' ? (selectedDifficulty?.id as ShortcutDifficulty) : undefined,
        shouldBeFullscreen: selectedFullscreen.id === 'fullscreen'
      })
    }
  }

  return (
    <div className={`setup-overlay ${styles.landingWrapper}`}>
      <ParticleCanvas />
      <div className="setup-container">
        <div className="setup-header">
          <div className="setup-header-top">
            <div>
              <h1 className="setup-title">{t.setup.title} <small>{t.setup.subtitle}</small></h1>
              <h2>{t.setup.welcome}</h2>
              <p>{t.setup.welcomeMessage}</p>
            </div>
            <div className="setup-auth-button">
              {user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="auth-login-button"
                  title={t.setup.loginTooltip}
                >
                  <span>👤</span>
                  <span>{t.setup.loginButton}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 言語選択 */}
        <SetupSection title={t.setup.selectLanguage || "Language / 言語"}>
          <div className="setup-options setup-modes">
            {LANGUAGE_OPTIONS.map((option) => (
              <SetupOption
                key={option.id}
                option={option}
                isSelected={language === option.id}
                onSelect={(opt) => setLanguage(opt.id as Language)}
              />
            ))}
          </div>
        </SetupSection>

        {/* 全画面モード選択 */}
        <SetupSection title={t.setup.selectDisplayMode}>
          <div className="setup-options setup-modes">
            {fullscreenOptions.map((option) => (
              <SetupOption
                key={option.id}
                option={option}
                isSelected={selectedFullscreen?.id === option.id}
                onSelect={setSelectedFullscreen}
                showRecommendation
                recommendationText={(option as any).recommendation}
              />
            ))}
          </div>
        </SetupSection>

        {/* キーボードレイアウト選択 */}
        <SetupSection title={t.setup.selectKeyboardLayout}>
          <div className="setup-options setup-layouts">
            {layoutOptions.map((layout) => (
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
          <SetupSection title={t.setup.selectMode}>
            <div className="setup-options setup-modes">
              {modeOptions.map((mode) => (
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
          <SetupSection title={t.setup.selectApplication}>
            <div className="setup-options setup-quiz-apps">
              {visualizerAppOptions.map((app) => (
                <SetupOption
                  key={app.id}
                  option={app}
                  isSelected={selectedApp?.id === app.id}
                  onSelect={(option) => {
                    if ('os' in option) {
                      setSelectedApp(option as App);
                    }
                  }}
                />
              ))}
            </div>
          </SetupSection>
        )}

        {/* クイズモードが選択された場合、難易度選択を表示 */}
        {selectedMode?.id === 'quiz' && (
          <>
            <SetupSection title={t.setup.selectDifficulty}>
              <div className="setup-options setup-modes">
                {difficultyOptionsTranslated.map((difficulty) => (
                  <SetupOption
                    key={difficulty.id}
                    option={{ ...difficulty, title: difficulty.name }}
                    isSelected={selectedDifficulty?.id === difficulty.id}
                    onSelect={setSelectedDifficulty}
                  />
                ))}
              </div>
            </SetupSection>

            <SetupSection title={t.setup.selectQuizApplication}>
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
              ? t.setup.pleaseSelectDisplayMode
              : !selectedLayout
              ? t.setup.pleaseSelectLayout
              : !selectedMode
              ? t.setup.pleaseSelectMode
              : selectedMode.id === 'visualizer' && !selectedApp
              ? t.setup.pleaseSelectApp
              : selectedMode.id === 'quiz' && !selectedDifficulty
              ? t.setup.pleaseSelectDifficulty
              : selectedMode.id === 'quiz' && selectedQuizApps.length === 0
              ? t.setup.pleaseSelectQuizApp
              : t.setup.confirmButton}
          </button>
          <p className="setup-note">
            {t.setup.canChangeInSettings}
          </p>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

export default SetupScreen
import { useState } from 'react'
import { SETUP_VERSION } from '../../constants/app'
import './SetupScreen.css'

const SetupScreen = ({ onSetupComplete }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)

  const options = [
    {
      id: 'windows-jis',
      title: 'Windows 11 & JIS',
      icon: '🪟',
      description: 'Windows 11 + 日本語キーボード',
      app: 'windows11',
      layout: 'windows-jis'
    },
    {
      id: 'macos-jis',
      title: 'macOS & JIS',
      icon: '🍎',
      description: 'macOS + 日本語キーボード',
      app: 'macos',
      layout: 'mac-jis'
    },
    {
      id: 'macos-us',
      title: 'macOS & US',
      icon: '🍎',
      description: 'macOS + US（英語）キーボード',
      app: 'macos',
      layout: 'mac-us'
    }
  ]

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

  const handleSelect = (option) => {
    setSelectedOption(option)
  }

  const handleSelectMode = (mode) => {
    setSelectedMode(mode)
  }

  const handleConfirm = () => {
    if (selectedOption && selectedMode) {
      localStorage.setItem('keyboard-visualizer-setup', JSON.stringify({
        app: selectedOption.app,
        layout: selectedOption.layout,
        setupCompleted: true,
        version: SETUP_VERSION
      }))

      onSetupComplete(selectedOption.app, selectedOption.layout, selectedMode.id)
    }
  }

  return (
    <div className="setup-overlay">
      <div className="setup-container">
        <div className="setup-header">
          <h1>⌨️ キーボードビジュアライザー</h1>
          <h2>ようこそ！</h2>
          <p>お使いの環境を選択してください</p>
        </div>

        <div className="setup-options">
          {options.map((option) => (
            <div
              key={option.id}
              className={`setup-option ${selectedOption?.id === option.id ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              <div className="option-icon">{option.icon}</div>
              <div className="option-content">
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </div>
              <div className="option-check">
                {selectedOption?.id === option.id && '✓'}
              </div>
            </div>
          ))}
        </div>

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

        <div className="setup-footer">
          <button
            className="setup-confirm-btn"
            onClick={handleConfirm}
            disabled={!selectedOption || !selectedMode}
          >
            {selectedOption && selectedMode ? '開始する' : !selectedOption ? '環境を選択してください' : 'モードを選択してください'}
          </button>
          <p className="setup-note">
            後で設定から変更できます
          </p>
        </div>
      </div>
    </div>
  )
}

export default SetupScreen

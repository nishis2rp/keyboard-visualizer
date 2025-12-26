import { useState } from 'react'
import './SetupScreen.css'
const SETUP_VERSION = 'v2'

const SetupScreen = ({ onSetupComplete }) => {
  const [selectedOption, setSelectedOption] = useState(null)

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

  const handleSelect = (option) => {
    setSelectedOption(option)
  }

  const handleConfirm = () => {
    if (selectedOption) {
      localStorage.setItem('keyboard-visualizer-setup', JSON.stringify({
        app: selectedOption.app,
        layout: selectedOption.layout,
        setupCompleted: true,
        version: SETUP_VERSION
      }))

      onSetupComplete(selectedOption.app, selectedOption.layout)
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

        <div className="setup-footer">
          <button
            className="setup-confirm-btn"
            onClick={handleConfirm}
            disabled={!selectedOption}
          >
            {selectedOption ? '開始する' : '環境を選択してください'}
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

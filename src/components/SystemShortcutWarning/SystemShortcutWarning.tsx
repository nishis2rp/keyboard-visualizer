import { useState, useEffect, useCallback } from 'react'
import { detectOS } from '../../utils/os'
import { useLanguage } from '../../context/LanguageContext'
import './SystemShortcutWarning.css'

const LOCAL_STORAGE_KEY_WARNING_SHOWN = 'macOsSystemShortcutWarningShown';

const SystemShortcutWarning = ({ onOpenRequest }) => { // onOpenRequestをプロップとして受け取る
  const [os, setOs] = useState('unknown')
  const [isVisible, setIsVisible] = useState(false) // モーダルの表示状態
  const { t } = useLanguage();
  const [hasShownWarning, setHasShownWarning] = useState(() => {
    // ローカルストレージから初回表示フラグを読み込む
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LOCAL_STORAGE_KEY_WARNING_SHOWN) === 'true';
    }
    return false;
  });

  const handleOpen = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const detectedOS = detectOS()
    setOs(detectedOS)

    // macOSで、かつまだ警告を表示していない場合、モーダルを自動で表示
    if (detectedOS === 'macos' && !hasShownWarning) {
      handleOpen(); // handleOpenを呼び出す
      // 一度表示したらフラグを立てる
      localStorage.setItem(LOCAL_STORAGE_KEY_WARNING_SHOWN, 'true');
      setHasShownWarning(true);
    }

    // onOpenRequestが提供された場合、handleOpenを渡す
    if (onOpenRequest) {
      onOpenRequest(handleOpen);
    }
  }, [hasShownWarning, onOpenRequest, handleOpen]); // onOpenRequestとhandleOpenを依存配列に追加

  if (os !== 'macos') {
    return null
  }

  return (
    <>
      {isVisible && (
        <div className="system-warning-container">
          <div className="system-warning-header">
            <span className="warning-icon">⚠️</span>
            <h3>{t.systemShortcutWarning.modalTitle}</h3>
            <button 
              className="warning-close-btn"
              onClick={handleClose}
              aria-label={t.common.close}
            >
              ✕
            </button>
          </div>
          
          <div className="system-warning-content">
            <p className="warning-description" dangerouslySetInnerHTML={{ __html: t.systemShortcutWarning.description }} />
            <p className="warning-description">
              {t.systemShortcutWarning.solutionTitle}
            </p>

            <div className="warning-solutions">
              <div className="solution-item">
                <h4>{t.systemShortcutWarning.method1Title}</h4>
                <p dangerouslySetInnerHTML={{ __html: t.systemShortcutWarning.method1Desc }} />
              </div>

              <div className="solution-item">
                <h4>{t.systemShortcutWarning.method2Title}</h4>
                <ol>
                  <li>{t.systemShortcutWarning.method2Step1}</li>
                  <li>{t.systemShortcutWarning.method2Step2}
                    <ul>
                      <li><strong>{t.systemShortcutWarning.method2Categories.missionControl}</strong>: <code>Ctrl + ↑↓←→</code>, <code>F3</code></li>
                      <li><strong>{t.systemShortcutWarning.method2Categories.launchpad}</strong>: <code>F4</code></li>
                      <li><strong>{t.systemShortcutWarning.method2Categories.keyboard}</strong>: <code>Ctrl + F2</code>, <code>Ctrl + F3</code></li>
                      <li><strong>{t.systemShortcutWarning.method2Categories.screenshots}</strong>: <code>Cmd + Shift + 3/4/5</code></li>
                    </ul>
                  </li>
                  <li>{t.systemShortcutWarning.method2Step3}</li>
                </ol>
              </div>

              <div className="solution-item">
                <h4>{t.systemShortcutWarning.commonConflictsTitle}</h4>
                <div className="shortcut-list">
                  {['Ctrl + F2', 'Ctrl + F3', 'F3', 'F4', 'Ctrl + ↑', 'Ctrl + ↓', 'Ctrl + ←', 'Ctrl + →', 'Cmd + Shift + 3', 'Cmd + Shift + 4'].map((shortcut) => (
                    <code key={shortcut} className="shortcut-badge">{shortcut}</code>
                  ))}
                </div>
                <p className="shortcut-note">
                  {t.systemShortcutWarning.canBeDisabledHint}
                </p>
              </div>
            </div>

            <div className="warning-footer">
              <p dangerouslySetInnerHTML={{ __html: t.systemShortcutWarning.securityHint }} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}


export default SystemShortcutWarning



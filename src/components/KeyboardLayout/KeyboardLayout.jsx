import PropTypes from 'prop-types'
import { memo } from 'react'
import { getKeyboardLayoutByName, getLayoutDisplayName } from '../../data/layouts'

const KeyboardLayout = memo(({ pressedKeys, specialKeys, getKeyDisplayName, shortcutDescriptions, keyboardLayout = 'windows-jis' }) => {
  // 現在のレイアウトを取得
  const keyboardRows = getKeyboardLayoutByName(keyboardLayout)
  const layoutName = getLayoutDisplayName(keyboardLayout)

  // キーが押されているかチェック
  const isKeyPressed = (key) => {
    if (key === ' ') return pressedKeys.has(' ')
    return pressedKeys.has(key) || pressedKeys.has(key.toUpperCase()) || pressedKeys.has(key.toLowerCase())
  }

  // キーに関連するショートカットを取得
  const getKeyShortcuts = (key) => {
    const displayName = getKeyDisplayName(key)
    const shortcuts = []

    // 単一キーのショートカット
    if (shortcutDescriptions[displayName]) {
      shortcuts.push({ combo: displayName, desc: shortcutDescriptions[displayName] })
    }

    // 修飾キーとの組み合わせ
    Object.entries(shortcutDescriptions).forEach(([combo, desc]) => {
      const comboKeys = combo.split(' + ')
      const lastKey = comboKeys[comboKeys.length - 1]

      if (lastKey.toUpperCase() === displayName.toUpperCase() ||
          lastKey.toUpperCase() === key.toUpperCase()) {
        shortcuts.push({ combo, desc })
      }
    })

    return shortcuts // すべてのショートカットを表示
  }

  return (
    <div className="keyboard-layout">
      <h3 className="keyboard-title">{layoutName}</h3>
      <div className="keyboard">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((keyObj, keyIndex) => {
              const isPressed = isKeyPressed(keyObj.key)
              const isSpecial = specialKeys.has(keyObj.key)
              const shortcuts = getKeyShortcuts(keyObj.key)

              return (
                <div
                  key={`${rowIndex}-${keyIndex}`}
                  className={`keyboard-key ${isPressed ? 'pressed' : ''} ${isSpecial ? 'special' : ''}`}
                  style={{ flex: `${keyObj.width} 1 0%` }}
                  title={shortcuts.length > 0 ? shortcuts.map(s => `${s.combo}: ${s.desc}`).join('\n') : ''}
                >
                  <div className="key-display">{keyObj.display}</div>
                  {shortcuts.length > 0 && (
                    <div className="key-shortcuts-popup">
                      {shortcuts.map((shortcut, idx) => (
                        <div key={idx} className="key-shortcut-item">
                          <strong>{shortcut.combo}</strong>: {shortcut.desc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="keyboard-legend">
        <div className="legend-item">
          <div className="legend-key normal"></div>
          <span>通常キー</span>
        </div>
        <div className="legend-item">
          <div className="legend-key special"></div>
          <span>修飾キー</span>
        </div>
        <div className="legend-item">
          <div className="legend-key pressed"></div>
          <span>押下中</span>
        </div>
      </div>
    </div>
  )
})

KeyboardLayout.displayName = 'KeyboardLayout'

KeyboardLayout.propTypes = {
  pressedKeys: PropTypes.instanceOf(Set).isRequired,
  specialKeys: PropTypes.instanceOf(Set).isRequired,
  getKeyDisplayName: PropTypes.func.isRequired,
  shortcutDescriptions: PropTypes.objectOf(PropTypes.string).isRequired,
  keyboardLayout: PropTypes.string
}

export default KeyboardLayout

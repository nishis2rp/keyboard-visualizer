import PropTypes from 'prop-types'
import { memo } from 'react'
import { getSingleKeyShortcuts } from '../../utils'
import ShortcutCard from '../ShortcutCard'
import { getCodeDisplayName } from '../../utils/keyMapping'

// 修飾キーのコードベースの表示順序
const MODIFIER_CODE_DISPLAY_ORDER = [
  'ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight',
  'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'
]

// 修飾キーのコードリスト
const MODIFIER_CODES = new Set(MODIFIER_CODE_DISPLAY_ORDER)

// 修飾キーかどうかを判定する関数
const isModifierKey = (code) => MODIFIER_CODES.has(code)

const KeyDisplay = memo(({ pressedKeys = new Set(), specialKeys = new Set(), description, availableShortcuts = [], selectedApp, shortcutDescriptions = {}, keyboardLayout }) => {
  // Shiftキーが押されているか判定（getCodeDisplayNameに渡すため）
  const shiftPressed = pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight');

  if (pressedKeys.size === 0) {
    // すべてのアプリケーションで単独キーショートカットを表示
    const singleKeyShortcuts = getSingleKeyShortcuts(shortcutDescriptions)

    if (singleKeyShortcuts.length > 0) {
      return (
        <div className="display-area active" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
            <div className="shortcut-description-inline">
              <span className="description-icon">{selectedApp === 'gmail' ? '📧' : '⌨️'}</span>
              {selectedApp === 'gmail'
                ? 'Gmailの単独キーショートカット - キーを押すだけで操作できます'
                : '単独キーショートカット - ファンクションキーなど、単独で使用できるショートカット'
              }
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 className="shortcuts-list-title" style={{ marginTop: '0', marginBottom: '0' }}>利用可能な単独キーショートカット</h3>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '14px' }}>🔵</span>
                  <span style={{ color: '#007AFF' }}>全画面表示で防げる</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '14px' }}>🔒</span>
                  <span style={{ color: '#FF3B30' }}>システム保護</span>
                </div>
              </div>
            </div>
            <div className="shortcuts-grid">
              {singleKeyShortcuts.map((item, index) => (
                <ShortcutCard
                  key={index}
                  shortcut={item.shortcut}
                  description={item.description}
                  showDebugLog={true} // デバッグ用
                />
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="display-area">
        <p className="instruction">キーを押してください...</p>
      </div>
    )
  }

  // pressedKeysはcodeのSetなので、表示用に変換し、ソートする
  const sortedCodes = Array.from(pressedKeys).sort((a, b) => {
    const aIndex = MODIFIER_CODE_DISPLAY_ORDER.indexOf(a)
    const bIndex = MODIFIER_CODE_DISPLAY_ORDER.indexOf(b)

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return 0
  })

  // 修飾キーのみが押されているかチェック (codeベースで)
  const isOnlyModifierKeys = sortedCodes.every(code => MODIFIER_CODES.has(code))

  // 完全なショートカットが押されている場合（説明がある）
  // ただし、修飾キーのみの場合は、利用可能なショートカット一覧も表示
  if (description && (!isOnlyModifierKeys || availableShortcuts.length === 0)) {
    return (
      <div className="display-area active">
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            {sortedCodes.map((code, index) => (
              <div key={`${code}-${index}`} style={{ display: 'contents' }}>
                {index > 0 && <span className="plus">+</span>}
                <div className={`key ${isModifierKey(code) ? 'modifier-key' : (specialKeys.has(code) ? 'special-key' : '')}`}>
                  {getCodeDisplayName(code, null, keyboardLayout, shiftPressed)} {/* keyは不明なのでnull */}
                </div>
              </div>
            ))}
          </div>
          <div className="shortcut-description-inline">
            <span className="description-icon">💡</span> {description}
          </div>
        </div>
      </div>
    )
  }

  // 修飾キーのみが押されている場合、または利用可能なショートカット一覧を表示
  return (
    <div className="display-area active" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginBottom: availableShortcuts.length > 0 ? '4px' : '0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {sortedCodes.map((code, index) => (
            <div key={`${code}-${index}`} style={{ display: 'contents' }}>
              {index > 0 && <span className="plus">+</span>}
              <div className={`key ${isModifierKey(code) ? 'modifier-key' : (specialKeys.has(code) ? 'special-key' : '')}`}>
                {getCodeDisplayName(code, null, keyboardLayout, shiftPressed)} {/* keyは不明なのでnull */}
              </div>
            </div>
          ))}
        </div>
        {availableShortcuts.length === 0 && (
          <div className="shortcut-description-inline" style={{ opacity: 0.6 }}>
            <span className="description-icon">ℹ️</span> このキーの組み合わせにショートカットは登録されていません
          </div>
        )}
      </div>
      {availableShortcuts.length > 0 && (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <h3 className="shortcuts-list-title" style={{ marginTop: '0', marginBottom: '0' }}>利用可能なショートカット</h3>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px' }}>🔵</span>
                <span style={{ color: '#007AFF' }}>全画面表示で防げる</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px' }}>🔒</span>
                <span style={{ color: '#FF3B30' }}>システム保護</span>
              </div>
            </div>
          </div>
          <div className="shortcuts-grid">
            {availableShortcuts.map((item, index) => (
              <ShortcutCard
                key={index}
                shortcut={item.shortcut}
                description={item.description}
                showDebugLog={true} // デバッグ用
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

KeyDisplay.displayName = 'KeyDisplay'

KeyDisplay.propTypes = {
  pressedKeys: PropTypes.instanceOf(Set).isRequired,
  specialKeys: PropTypes.instanceOf(Set).isRequired,
  description: PropTypes.string,
  availableShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      shortcut: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedApp: PropTypes.string.isRequired,
  shortcutDescriptions: PropTypes.objectOf(PropTypes.string).isRequired,
  keyboardLayout: PropTypes.string.isRequired, // keyboardLayoutを追加
}

export default KeyDisplay;
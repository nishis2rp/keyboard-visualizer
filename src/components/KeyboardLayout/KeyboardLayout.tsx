import { memo } from 'react'
import { getKeyboardLayoutByName, getLayoutDisplayName } from '../../data/layouts'
import { getCodeDisplayName } from '../../utils/keyMapping'
import { PressedKeys, ShortcutData } from '../../types'
import { isModifierKey, isWindowsKey } from '../../utils/keyUtils'

const KEY_WIDTH_MULTIPLIER = 50; // キー幅の基準値（px）

interface KeyboardLayoutProps {
  pressedKeys?: Set<string>;
  specialKeys?: Set<string>;
  shortcutDescriptions?: ShortcutData;
  keyboardLayout?: string;
}

const KeyboardLayout = memo<KeyboardLayoutProps>(({ pressedKeys = new Set(), specialKeys = new Set(), shortcutDescriptions = {}, keyboardLayout = 'windows-jis' }) => {
  // 現在のレイアウトを取得
  const keyboardRows = getKeyboardLayoutByName(keyboardLayout)
  const layoutName = getLayoutDisplayName(keyboardLayout)

  // キーが押されているかチェック
  const isKeyPressed = (keyObj) => { // keyObjを引数に
    if (!keyObj.code) return false; // codeがない場合は判定しない

    // pressedKeysにはcodeが格納されている
    const isCodePressed = pressedKeys.has(keyObj.code);

    // Shiftキーが押されているか確認
    const shiftPressed = pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight');

    // getCodeDisplayNameで表示名を取得し、そのキーもpressedKeysに含まれるか確認
    // これは主に修飾キーの表示名をチェックする際に有効だが、今回はcodeベースで統一
    // const displayKey = getCodeDisplayName(keyObj.code, keyObj.key, keyboardLayout, shiftPressed);
    // const isDisplayKeyPressed = pressedKeys.has(displayKey); // これは不要、pressedKeysはcode

    return isCodePressed; // codeがpressedKeysにあるかで判定
  }

  // キーに関連するショートカットを取得
  const getKeyShortcuts = (keyObj) => { // keyObjを引数に
    if (!keyObj.code) return [];

    const shiftPressed = pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight');
    const keyDisplayName = getCodeDisplayName(keyObj.code, keyObj.key, keyboardLayout, shiftPressed); // codeから表示名を取得
    const shortcuts = []

    // 単一キーのショートカット
    // shortcutDescriptionsは表示名（keyベース）で定義されていると仮定
    if (shortcutDescriptions[keyDisplayName]) {
      shortcuts.push({ combo: keyDisplayName, desc: shortcutDescriptions[keyDisplayName] })
    }

    // 修飾キーとの組み合わせ
    Object.entries(shortcutDescriptions).forEach(([combo, desc]) => {
      const comboKeys = combo.split(' + ') // shortcutDescriptionsのキーは表示名ベース
      const lastKey = comboKeys[comboKeys.length - 1]

      // キーの表示名がショートカットの最後のキーと一致するか
      if (lastKey.toUpperCase() === keyDisplayName.toUpperCase()) {
        shortcuts.push({ combo, desc })
      }
    })

    // 重複を排除
    const uniqueShortcuts = [];
    const seenCombos = new Set();
    shortcuts.forEach(s => {
      if (!seenCombos.has(s.combo)) {
        uniqueShortcuts.push(s);
        seenCombos.add(s.combo);
      }
    });

    return uniqueShortcuts // すべてのショートカットを表示
  }

  return (
    <div className="keyboard-layout">
      <h3 className="keyboard-title">{layoutName}</h3>
      <div className="keyboard">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((keyObj, keyIndex) => {
              const isPressed = isKeyPressed(keyObj)
              const isModifier = isModifierKey(keyObj.code)
              const isWinKey = isWindowsKey(keyObj.code)
              const isSpecial = !isModifier && specialKeys.has(keyObj.key)
              const shortcuts = getKeyShortcuts(keyObj)

              return (
                <div
                  key={`${rowIndex}-${keyIndex}`}
                  className={`keyboard-key ${isPressed ? 'pressed' : ''} ${isWinKey ? 'windows-key' : (isModifier ? 'modifier' : (isSpecial ? 'special' : ''))}`}
                  style={{
                    flexGrow: keyObj.width || 1,
                    flexShrink: 0,
                    flexBasis: `${(keyObj.width || 1) * KEY_WIDTH_MULTIPLIER}px`
                  }}
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

export default KeyboardLayout


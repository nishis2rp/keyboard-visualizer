import { memo, useMemo, useCallback } from 'react'
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
  const keyboardRows = useMemo(() => getKeyboardLayoutByName(keyboardLayout), [keyboardLayout])
  const layoutName = useMemo(() => getLayoutDisplayName(keyboardLayout), [keyboardLayout])

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

  // Shiftキーが押されているか確認（メモ化）
  const shiftPressed = useMemo(
    () => pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight'),
    [pressedKeys]
  );

  // キーに関連するショートカットを取得（メモ化）
  const getKeyShortcuts = useCallback((keyObj) => {
    if (!keyObj.code) return [];

    const keyDisplayName = getCodeDisplayName(keyObj.code, keyObj.key, keyboardLayout, shiftPressed);
    const shortcuts = []

    // 単一キーのショートカット
    if (shortcutDescriptions[keyDisplayName]) {
      shortcuts.push({ combo: keyDisplayName, desc: shortcutDescriptions[keyDisplayName] })
    }

    // 修飾キーとの組み合わせ
    Object.entries(shortcutDescriptions).forEach(([combo, desc]) => {
      const comboKeys = combo.split(' + ')
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

    return uniqueShortcuts
  }, [keyboardLayout, shortcutDescriptions, shiftPressed])

  // Calculate grid positions for all keys（メモ化）
  // Grid columns: 72 (allows 0.25 increments: 1.0 = 4 cols, 1.25 = 5 cols, etc.)
  // Main keyboard: 62 cols (15.5 * 4), Gap: 2 cols, Navigation: 12 cols (3 * 4)
  const keysWithPositions = useMemo(() => {
    const GRID_MULTIPLIER = 4
    const MAIN_KEYBOARD_END = 62
    const NAV_BLOCK_START = 64

    // Navigation keys that should be positioned on the right
    const navKeys = new Set(['Fn', 'Home', 'PageUp', 'Delete', 'End', 'PageDown', 'Insert', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'PrintScreen', 'ScrollLock', 'Pause', 'F13', 'F14', 'F15'])

    return keyboardRows.flatMap((row, rowIndex) => {
      let mainColStart = 1
      let navColStart = NAV_BLOCK_START

      return row.map((keyObj) => {
        const widthInCols = Math.round((keyObj.width || 1) * GRID_MULTIPLIER)
        const isNavKey = navKeys.has(keyObj.code)

        let colStart, colEnd
        if (isNavKey) {
          // Special handling for ArrowUp - center it in the nav block
          if (keyObj.code === 'ArrowUp') {
            colStart = NAV_BLOCK_START + 4 // Center position (skip 1 column)
            colEnd = colStart + widthInCols
          } else {
            colStart = navColStart
            colEnd = navColStart + widthInCols
            navColStart = colEnd
          }
        } else {
          colStart = mainColStart
          colEnd = mainColStart + widthInCols
          mainColStart = colEnd
        }

        const rowStart = rowIndex + 1
        const rowEnd = rowStart + (keyObj.rowSpan || 1)
        const position = {
          gridColumn: `${colStart} / ${colEnd}`,
          gridRow: `${rowStart} / ${rowEnd}`,
          width: keyObj.width || 1
        }

        return { ...keyObj, ...position }
      })
    })
  }, [keyboardRows])

  return (
    <div className="keyboard-layout">
      <h3 className="keyboard-title">{layoutName}</h3>
      <div className="keyboard">
        {keysWithPositions.map((keyObj, index) => {
          const isSpacer = !keyObj.code || keyObj.code === ''
          const isPressed = isKeyPressed(keyObj)
          const isModifier = isModifierKey(keyObj.code)
          const isWinKey = isWindowsKey(keyObj.code)
          const isSpecial = !isModifier && specialKeys.has(keyObj.key)
          const shortcuts = getKeyShortcuts(keyObj)

          return (
            <div
              key={`${index}-${keyObj.code}`}
              className={`keyboard-key ${isSpacer ? 'spacer' : ''} ${isPressed ? 'pressed' : ''} ${isWinKey ? 'windows-key' : (isModifier ? 'modifier' : (isSpecial ? 'special' : ''))}`}
              style={{
                gridColumn: keyObj.gridColumn,
                gridRow: keyObj.gridRow,
                minWidth: `${keyObj.width * KEY_WIDTH_MULTIPLIER}px`
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


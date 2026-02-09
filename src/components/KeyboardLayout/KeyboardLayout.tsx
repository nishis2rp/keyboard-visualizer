import { memo, useMemo, useCallback } from 'react'
import { getKeyboardLayoutByName, getLayoutDisplayName } from '../../data/layouts'
import { getCodeDisplayName, getPossibleKeyNamesFromDisplay } from '../../utils/keyMapping'
import { PressedKeys, AppShortcuts, KeyDefinition } from '../../types'
import { isModifierKey, isWindowsKey } from '../../utils/keyUtils'

const KEY_WIDTH_MULTIPLIER = 50; // キー幅の基準値（px）

interface KeyboardLayoutProps {
  pressedKeys?: Set<string>;
  specialKeys?: Set<string>;
  shortcutDescriptions?: AppShortcuts;
  keyboardLayout?: string;
}

const KeyboardLayout = memo<KeyboardLayoutProps>(({ pressedKeys = new Set(), specialKeys = new Set(), shortcutDescriptions = {}, keyboardLayout = 'windows-jis' }) => {
  // 現在のレイアウトを取得
  const keyboardRows = useMemo(() => getKeyboardLayoutByName(keyboardLayout), [keyboardLayout])
  const layoutName = useMemo(() => getLayoutDisplayName(keyboardLayout), [keyboardLayout])

  // キーが押されているかチェック（メモ化）
  const isKeyPressed = useCallback((keyObj: KeyDefinition) => {
    if (!keyObj.code) return false;
    return pressedKeys.has(keyObj.code);
  }, [pressedKeys])

  // Shiftキーが押されているか確認（メモ化）
  const shiftPressed = useMemo(
    () => pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight'),
    [pressedKeys]
  );

  // キーに関連するショートカットを取得（メモ化、重複排除最適化）
  const getKeyShortcuts = useCallback((keyObj: KeyDefinition) => {
    if (!keyObj.code) return [];

    const keyDisplayName = getCodeDisplayName(keyObj.code, keyObj.key, keyboardLayout, shiftPressed);
    const possibleKeyNames = getPossibleKeyNamesFromDisplay(keyDisplayName);
    const seenCombos = new Set<string>();
    const shortcuts: { combo: string; desc: string }[] = [];

    // 単一キーのショートカット
    for (const keyName of possibleKeyNames) {
      if (shortcutDescriptions[keyName] && !seenCombos.has(keyName)) {
        shortcuts.push({ combo: keyName, desc: shortcutDescriptions[keyName].description });
        seenCombos.add(keyName);
      }
    }

    // 修飾キーとの組み合わせ
    for (const [combo, details] of Object.entries(shortcutDescriptions)) {
      if (seenCombos.has(combo)) continue;

      const comboKeys = combo.split(' + ');
      const lastKey = comboKeys[comboKeys.length - 1];

      // キーの表示名または実際のキー名がショートカットの最後のキーと一致するか
      if (possibleKeyNames.some(name => lastKey.toUpperCase() === name.toUpperCase())) {
        shortcuts.push({ combo, desc: details.description });
        seenCombos.add(combo);
      }
    }

    return shortcuts;
  }, [keyboardLayout, shortcutDescriptions, shiftPressed])

  // Calculate grid positions for all keys（メモ化）
  const keysWithPositions = useMemo((): (KeyDefinition & { gridColumn: string, gridRow: string, width: number })[] => {
    const GRID_MULTIPLIER = 4
    const MAIN_BLOCK_WIDTH = 15.5
    const GAP_WIDTH = 0.5
    const NAV_BLOCK_START = Math.round((MAIN_BLOCK_WIDTH + GAP_WIDTH) * GRID_MULTIPLIER) + 1

    // Block categorization based on code
    const navBlockCodes = new Set(['Home', 'PageUp', 'Delete', 'End', 'PageDown', 'Insert', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'])
    const fBlockExtras = new Set(['PrintScreen', 'ScrollLock', 'Pause', 'F13', 'F14', 'F15'])

    return keyboardRows.keys.flatMap((row, rowIndex) => {
      let mainColStart = 1
      let navColStart = NAV_BLOCK_START

      return row.map((keyObj: KeyDefinition) => {
        const widthInCols = Math.round((keyObj.width || 1) * GRID_MULTIPLIER)
        const isNavBlock = navBlockCodes.has(keyObj.code)
        const isFBlockExtra = fBlockExtras.has(keyObj.code)

        let colStart, colEnd
        if (isNavBlock || isFBlockExtra) {
          // Navigation block or F-key row extensions (PrtSc etc.)
          if (keyObj.code === 'ArrowUp') {
            // ArrowUp is special - always centered in its 3-key block
            colStart = NAV_BLOCK_START + (1 * GRID_MULTIPLIER)
            colEnd = colStart + widthInCols
          } else if (keyObj.code === 'ArrowLeft') {
            colStart = NAV_BLOCK_START
            colEnd = colStart + widthInCols
          } else if (keyObj.code === 'ArrowDown') {
            colStart = NAV_BLOCK_START + (1 * GRID_MULTIPLIER)
            colEnd = colStart + widthInCols
          } else if (keyObj.code === 'ArrowRight') {
            colStart = NAV_BLOCK_START + (2 * GRID_MULTIPLIER)
            colEnd = colStart + widthInCols
          } else {
            // Sequential positioning for other nav keys (Home, End, etc.)
            colStart = navColStart
            colEnd = navColStart + widthInCols
            navColStart = colEnd
          }
        } else {
          // Main keyboard block
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
    <div className="keyboard-container" role="application" aria-label={`キーボードレイアウト: ${layoutName}`}>
      <div className="keyboard-base">
        <div className="keyboard-grid" role="grid">
          {keysWithPositions.map((keyObj, index) => {
            const isSpacer = !keyObj.code || keyObj.code === ''
            const isPressed = isKeyPressed(keyObj)
            const isModifier = isModifierKey(keyObj.code)
            const isWinKey = isWindowsKey(keyObj.code)
            const isSpecial = !isModifier && specialKeys.has(keyObj.key)
            const shortcuts = getKeyShortcuts(keyObj)

            // Build className for key-cap
            const keyClasses = ['key-cap']
            if (isSpacer) return null // Don't render spacer keys
            if (isPressed) keyClasses.push('active')
            if (isWinKey) keyClasses.push('windows')
            else if (isModifier) keyClasses.push('modifier')
            else if (isSpecial) keyClasses.push('special')

            return (
              <div
                key={`${index}-${keyObj.code}`}
                className={keyClasses.join(' ')}
                style={{
                  gridColumn: keyObj.gridColumn,
                  gridRow: keyObj.gridRow
                }}
                title={shortcuts.length > 0 ? shortcuts.map(s => `${s.combo}: ${s.desc}`).join('\n') : ''}
              >
                <div className="key-label">{keyObj.display}</div>
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
      </div>
    </div>
  )
})

KeyboardLayout.displayName = 'KeyboardLayout'

export default KeyboardLayout


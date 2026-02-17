import { memo, useMemo, useCallback } from 'react'
import { getKeyboardLayoutByName, getLayoutDisplayName } from '../../data/layouts'
import { getCodeDisplayName, getPossibleKeyNamesFromDisplay } from '../../utils/keyMapping'
import { PressedKeys, AppShortcuts, KeyDefinition } from '../../types'
import { isModifierKey, isWindowsKey } from '../../utils/keyUtils'
import Key from './Key'

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

  // Shiftキーが押されているか確認
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

      if (possibleKeyNames.some(name => lastKey.toUpperCase() === name.toUpperCase())) {
        shortcuts.push({ combo, desc: details.description });
        seenCombos.add(combo);
      }
    }

    return shortcuts;
  }, [keyboardLayout, shortcutDescriptions, shiftPressed])

  // Calculate grid positions for all keys
  const keysWithPositions = useMemo((): (KeyDefinition & { gridColumn: string, gridRow: string, width: number })[] => {
    const GRID_MULTIPLIER = 4
    const MAIN_BLOCK_WIDTH = 15.5
    const GAP_WIDTH = 0.5
    const NAV_BLOCK_START = Math.round((MAIN_BLOCK_WIDTH + GAP_WIDTH) * GRID_MULTIPLIER) + 1

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
          if (keyObj.code === 'ArrowUp') {
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
        
        return {
          ...keyObj,
          gridColumn: `${colStart} / ${colEnd}`,
          gridRow: `${rowStart} / ${rowEnd}`,
          width: keyObj.width || 1
        }
      })
    })
  }, [keyboardRows])

  return (
    <div className="keyboard-container" role="application" aria-label={`キーボードレイアウト: ${layoutName}`}>
      <div className="keyboard-base">
        <div className="keyboard-grid" role="grid">
          {keysWithPositions.map((keyObj, index) => {
            if (!keyObj.code || keyObj.code === '') return null;
            
            return (
              <Key
                key={`${index}-${keyObj.code}`}
                keyObj={keyObj}
                isPressed={pressedKeys.has(keyObj.code)}
                isModifier={isModifierKey(keyObj.code)}
                isWinKey={isWindowsKey(keyObj.code)}
                isSpecial={!isModifierKey(keyObj.code) && specialKeys.has(keyObj.key || '')}
                gridColumn={keyObj.gridColumn}
                gridRow={keyObj.gridRow}
                shortcuts={getKeyShortcuts(keyObj)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
})

KeyboardLayout.displayName = 'KeyboardLayout'

export default KeyboardLayout

import { memo, useMemo } from 'react';
import { getSingleKeyShortcuts } from '../../utils';
import ShortcutCard from '../ShortcutCard';
import { getCodeDisplayName } from '../../utils/keyMapping';
import {
  MODIFIER_CODE_DISPLAY_ORDER,
  MODIFIER_CODES,
  isModifierKey,
  isWindowsKey
} from '../../utils/keyUtils';
import { AvailableShortcut, RichShortcut } from '../../types'; // ★ AvailableShortcut, RichShortcutを追加

interface KeyDisplayProps {
  pressedKeys?: Set<string>;
  specialKeys?: Set<string>;
  description?: string | null;
  availableShortcuts?: AvailableShortcut[]; // ★ AvailableShortcut[]型に
  selectedApp?: string;
  // shortcutDescriptions?: AppShortcuts; // ★ 削除
  keyboardLayout?: string;
  richShortcuts?: RichShortcut[]; // ★ 追加
}

const KeyDisplay = memo<KeyDisplayProps>(({ pressedKeys = new Set(), specialKeys = new Set(), description, availableShortcuts = [], selectedApp, richShortcuts = [], keyboardLayout }) => {
  // Shiftキーが押されているか判定（getCodeDisplayNameに渡すため）
  const shiftPressed = useMemo(
    () => pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight'),
    [pressedKeys]
  );

  // pressedKeysはcodeのSetなので、表示用に変換し、ソートする（メモ化）
  const sortedCodes = useMemo(
    () => Array.from(pressedKeys).sort((a: string, b: string) => {
      const aIndex = MODIFIER_CODE_DISPLAY_ORDER.indexOf(a)
      const bIndex = MODIFIER_CODE_DISPLAY_ORDER.indexOf(b)

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      return 0
    }),
    [pressedKeys]
  )

  // 修飾キーのみが押されているかチェック (codeベースで、メモ化)
  const isOnlyModifierKeys = useMemo(
    () => sortedCodes.every((code: string) => MODIFIER_CODES.has(code)),
    [sortedCodes]
  )

  if (pressedKeys.size === 0) {
    // すべてのアプリケーションで単独キーショートカットを表示
    const singleKeyShortcuts = getSingleKeyShortcuts(richShortcuts, selectedApp || '')

    // デバッグログ
    console.log('[KeyDisplay] pressedKeys.size === 0');
    console.log('[KeyDisplay] richShortcuts.length:', richShortcuts.length);
    console.log('[KeyDisplay] selectedApp:', selectedApp);
    console.log('[KeyDisplay] singleKeyShortcuts.length:', singleKeyShortcuts.length);
    if (selectedApp === 'gmail') {
      console.log('[KeyDisplay] Gmail single-key shortcuts (first 5):', singleKeyShortcuts.slice(0, 5).map(s => s.shortcut));
    }

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
                  <span style={{ fontSize: '14px' }}>▶</span>
                  <span style={{ color: '#000000' }}>順押し</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '14px' }}>🔵</span>
                  <span style={{ color: '#000000' }}>全画面表示で防げる</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '14px' }}>🔒</span>
                  <span style={{ color: '#000000' }}>システム保護</span>
                </div>
              </div>
            </div>
            <div className="shortcuts-grid">
              {singleKeyShortcuts.map((item, index) => (
                <ShortcutCard
                  key={index}
                  shortcut={item.shortcut}
                  description={item.description}
                  appContext={selectedApp}
                  showDebugLog={true} // デバッグ用
                  windows_protection_level={item.windows_protection_level}
                  macos_protection_level={item.macos_protection_level}
                  difficulty={item.difficulty}
                  press_type={item.press_type} // ★ 追加
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

  // 完全なショートカットが押されている場合（説明がある）
  // ただし、修飾キーのみの場合は、利用可能なショートカット一覧も表示
  if (description && (!isOnlyModifierKeys || availableShortcuts.length === 0)) {
    // 現在押されているショートカットの難易度を取得
    const currentShortcut = availableShortcuts.find(s => s.description === description);
    const difficulty = currentShortcut?.difficulty || 'basic';

    // 難易度ラベルと色の設定
    const difficultyConfig = {
      basic: { label: '基礎', color: '#4CAF50' },
      standard: { label: '標準', color: '#2196F3' },
      hard: { label: '上級', color: '#FF9800' },
      madmax: { label: '最上級', color: '#F44336' }
    };
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.basic;

    return (
      <div className="display-area active">
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            {sortedCodes.map((code, index) => (
              <div key={`${code}-${index}`} style={{ display: 'contents' }}>
                {index > 0 && <span className="plus">+</span>}
                <div className={`key ${isWindowsKey(code) ? 'windows-key' : (isModifierKey(code) ? 'modifier-key' : (specialKeys.has(code) ? 'special-key' : ''))}`}>
                  {getCodeDisplayName(code, null, keyboardLayout, shiftPressed)} {/* keyは不明なのでnull */}
                </div>
              </div>
            ))}
          </div>
          <div className="shortcut-description-inline">
            <span className="description-icon">💡</span> {description}
          </div>
          <div style={{
            padding: '4px 10px',
            borderRadius: '12px',
            backgroundColor: config.color,
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            whiteSpace: 'nowrap'
          }}>
            {config.label}
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
              <div className={`key ${isWindowsKey(code) ? 'windows-key' : (isModifierKey(code) ? 'modifier-key' : (specialKeys.has(code) ? 'special-key' : ''))}`}>
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
                <span style={{ fontSize: '14px' }}>▶</span>
                <span style={{ color: '#000000' }}>順押し</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px' }}>🔵</span>
                <span style={{ color: '#000000' }}>全画面表示で防げる</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px' }}>🔒</span>
                <span style={{ color: '#000000' }}>システム保護</span>
              </div>
            </div>
          </div>
          <div className="shortcuts-grid">
            {availableShortcuts.map((item, index) => (
              <ShortcutCard
                key={index}
                shortcut={item.shortcut}
                description={item.description}
                appContext={selectedApp}
                showDebugLog={true} // デバッグ用
                                  windows_protection_level={item.windows_protection_level}
                                  macos_protection_level={item.macos_protection_level}
                                  difficulty={item.difficulty}
                                  press_type={item.press_type} // ★ 追加
                                />            ))}
          </div>
        </div>
      )}
    </div>
  )
})

KeyDisplay.displayName = 'KeyDisplay'


export default KeyDisplay;
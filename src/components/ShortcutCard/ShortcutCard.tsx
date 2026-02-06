import { memo, useMemo } from 'react'
import { isModifierKeyName, isWindowsKeyName } from '../../utils/keyUtils'
import { detectOS } from '../../utils/os'
import { EXCEL_APP_SAFE_SHORTCUTS } from '../../constants/systemProtectedShortcuts'
import { ShortcutDifficulty } from '../../types' // ShortcutDifficultyをインポート

const CURRENT_OS = detectOS();

interface ShortcutCardProps {
  shortcut: string;
  description: string;
  appContext?: string | null;
  showDebugLog?: boolean;
  windows_protection_level?: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen';
  macos_protection_level?: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen';
  difficulty?: ShortcutDifficulty; // difficultyプロップを追加
  press_type: 'sequential' | 'simultaneous'; // 追加
}

const ShortcutCard = memo<ShortcutCardProps>(({ shortcut, description, appContext = null, showDebugLog = false, windows_protection_level = 'none', macos_protection_level = 'none', difficulty, press_type }) => {
  // 難易度に応じた表示テキストを生成
  const difficultyDisplay = useMemo(() => {
    if (showDebugLog && import.meta.env.DEV) {
      console.log(`[ShortcutCard] shortcut="${shortcut}", difficulty="${difficulty}"`);
    }
    switch (difficulty) {
      case 'basic':
        return '🌟 基本';
      case 'standard':
        return '⚡ 標準';
      case 'hard':
        return '🔥 難解';
      case 'madmax':
        return '💀 超難解';
      case 'allrange':
        return '🎯 全範囲';
      default:
        return '';
    }
  }, [difficulty, showDebugLog]);
  const effectiveProtectionLevel = useMemo((): 'none' | 'preventable_fullscreen' | 'always-protected' => {
    // Excelアプリのコンテキストで、Excel固有のショートカットは保護不要
    if (appContext === 'excel' && EXCEL_APP_SAFE_SHORTCUTS.has(shortcut)) {
      return 'none';
    }

    let protectionLevel: 'none' | 'fullscreen-preventable' | 'always-protected' | 'preventable_fullscreen';
    if (CURRENT_OS === 'windows') {
      protectionLevel = windows_protection_level;
    } else if (CURRENT_OS === 'macos') {
      protectionLevel = macos_protection_level;
    } else {
      protectionLevel = windows_protection_level; // デフォルトまたは不明なOSの場合
    }

    // 古い 'fullscreen-preventable' を新しい 'preventable_fullscreen' にマッピング
    if (protectionLevel === 'fullscreen-preventable') {
      return 'preventable_fullscreen';
    }
    return protectionLevel || 'none'; // undefined の場合は 'none' にフォールバック
  }, [shortcut, appContext, windows_protection_level, macos_protection_level]);

  // デバッグログ（開発時のみ） - 全てのショートカットでログ出力
  if (showDebugLog && import.meta.env.DEV) {
    const emoji = effectiveProtectionLevel === 'always-protected' ? '🔒' : effectiveProtectionLevel === 'preventable_fullscreen' ? '🔵' : '⚪'
    // console.log(`${emoji} ${shortcut}: ${description} (${effectiveProtectionLevel})`); // デバッグログ
  }

  // 保護レベルに応じたスタイル（メモ化）
  const style = useMemo(() => {
    switch (effectiveProtectionLevel) {
      case 'always-protected':
        // 赤色: 全画面表示しても防げない（システムレベル保護）
        return {
          cardClass: 'always-protected', // クラス名を直接適用
          combo: {}, // CSSクラスで制御
          description: {}, // CSSクラスで制御
          icon: '🔒',
          tooltip: '⚠️ このショートカットはOSレベルで保護されており、全画面表示してもキャプチャできません'
        }

      case 'preventable_fullscreen': // 新しい保護レベル名を使用
        return {
          cardClass: 'preventable-fullscreen', // クラス名を直接適用
          combo: {}, // CSSクラスで制御
          description: {}, // CSSクラスで制御
          icon: '🔵',
          tooltip: 'ℹ️ このショートカットは全画面表示にするとキャプチャできます'
        }

      default:
        // 通常: 色なし（干渉しない）
        return {
          card: {},
          combo: {},
          description: {},
          icon: null,
          tooltip: ''
        }
    }
  }, [effectiveProtectionLevel]);


  // ショートカット表示JSXをメモ化
  const shortcutDisplay = useMemo(() => {
    // ショートカットを " + " で分割
    const parts = shortcut.split(' + ')
    const isSequential = press_type === 'sequential'

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        {/* 順押しの場合はアイコン表示 */}
        {isSequential && (
          <span style={{ fontSize: '0.85em', color: '#FF9500', marginRight: '2px' }} title="順押し: キーを順番に押します">
            ▶
          </span>
        )}
        {parts.map((part, index) => (
          <span key={index} style={{ display: 'contents' }}>
            {index > 0 && (
              <span style={{ fontSize: '0.8em', color: '#86868B', margin: '0 2px' }}>
                {isSequential ? '→' : '+'}
              </span>
            )}
            <span
              className={`key ${isWindowsKeyName(part) ? 'windows-key' : (isModifierKeyName(part) ? 'modifier-key' : '')}`}
              style={{
                padding: '2px 6px',
                fontSize: '0.75em',
                minWidth: 'auto',
                display: 'inline-block',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                // 順押しの場合は左から右へのグラデーション効果
                ...(isSequential && {
                  background: `linear-gradient(to right, rgba(255, 149, 0, 0.1) ${index * (100 / parts.length)}%, transparent ${(index + 1) * (100 / parts.length)}%)`,
                  backgroundSize: '200% 100%',
                  backgroundPosition: 'left center'
                })
              }}
            >
              {part}
            </span>
          </span>
        ))}
      </div>
    )
  }, [shortcut, appContext, press_type]);

  return (
    <div
      className={`shortcut-card ${style.cardClass || ''}`}
      title={style.tooltip}
      style={{ position: 'relative', paddingBottom: difficultyDisplay ? '24px' : undefined }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
        {style.icon && <span style={{ fontSize: '0.9em' }}>{style.icon}</span>}
        <div className="shortcut-combo" style={{ ...style.combo, marginBottom: 0 }}>
          {shortcutDisplay}
        </div>
      </div>
      <div className="shortcut-desc" style={style.description}>
        {description}
      </div>
      {difficultyDisplay && (
        <span style={{
          position: 'absolute',
          bottom: '6px',
          right: '8px',
          fontSize: '0.65em',
          color: '#888',
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: 'rgba(136, 136, 136, 0.1)',
          whiteSpace: 'nowrap',
          fontWeight: '500'
        }}>
          {difficultyDisplay}
        </span>
      )}
    </div>
  )
})

ShortcutCard.displayName = 'ShortcutCard'


export default ShortcutCard

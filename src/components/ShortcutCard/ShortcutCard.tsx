import { memo, useMemo } from 'react'
// import { getProtectionLevel } from '../../constants' // 削除
import { isSequentialShortcut } from '../../utils/shortcutUtils'
import { isModifierKeyName, isWindowsKeyName } from '../../utils/keyUtils'
import { detectOS } from '../../constants' // detectOSをインポート
// useAppContext はここで必要ない
import { EXCEL_APP_SAFE_SHORTCUTS } from '../../constants/systemProtectedShortcuts' // Excelの除外リストをインポート

// OSは実行時に変わらないため、モジュールレベルで1回だけ検出
const CURRENT_OS = detectOS();

/**
 * ショートカットカードコンポーネント
 *
 * ショートカットの情報を表示するカードコンポーネント
 * 保護レベルに応じて色分けされる：
 * - 通常: 色なし（干渉しない）
 * - 青色: 全画面表示で防げる（Keyboard Lock API）🔵
 * - 赤色: 全画面表示しても防げない（システムレベル保護）🔒
 *
 * @param {string} shortcut - ショートカットのキー組み合わせ（例: "Win + L"）
 * @param {string} description - ショートカットの説明
 * @param {string} appContext - アプリケーションコンテキスト（例: "excel", "chrome"など）
 * @param {boolean} showDebugLog - デバッグログを表示するか（開発モードのみ）
 */
interface ShortcutCardProps {
  shortcut: string;
  description: string;
  appContext?: string | null;
  showDebugLog?: boolean;
  windows_protection_level?: 'none' | 'fullscreen-preventable' | 'always-protected'; // ★ 追加
  macos_protection_level?: 'none' | 'fullscreen-preventable' | 'always-protected';   // ★ 追加
}

const ShortcutCard = memo<ShortcutCardProps>(({ shortcut, description, appContext = null, showDebugLog = false, windows_protection_level = 'none', macos_protection_level = 'none' }) => {
  // 保護レベルを計算（メモ化）
  const effectiveProtectionLevel = useMemo((): 'none' | 'fullscreen-preventable' | 'always-protected' => {
    // Excelアプリのコンテキストで、Excel固有のショートカットは保護不要
    if (appContext === 'excel' && EXCEL_APP_SAFE_SHORTCUTS.has(shortcut)) {
      return 'none';
    }

    // OSに応じた保護レベルを返す
    if (CURRENT_OS === 'windows') {
      return windows_protection_level;
    } else if (CURRENT_OS === 'macos') {
      return macos_protection_level;
    } else {
      // デフォルトまたは不明なOSの場合、Windowsの保護レベルを適用
      return windows_protection_level;
    }
  }, [shortcut, appContext, windows_protection_level, macos_protection_level]);

  // デバッグログ（開発時のみ） - 全てのショートカットでログ出力
  if (showDebugLog && import.meta.env.DEV) {
    const emoji = effectiveProtectionLevel === 'always-protected' ? '🔒' : effectiveProtectionLevel === 'fullscreen-preventable' ? '🔵' : '⚪'
    // console.log(`${emoji} ${shortcut}: ${description} (${effectiveProtectionLevel})`); // デバッグログ
  }

  // 保護レベルに応じたスタイル（メモ化）
  const style = useMemo(() => {
    switch (effectiveProtectionLevel) {
      case 'always-protected':
        // 赤色: 全画面表示しても防げない（システムレベル保護）
        return {
          card: {
            borderColor: '#FF3B30',
            backgroundColor: 'rgba(255, 59, 48, 0.08)'
          },
          combo: {
            color: '#FF3B30'
          },
          description: {
            color: '#E62E24'
          },
          icon: '🔒',
          tooltip: '⚠️ このショートカットはOSレベルで保護されており、全画面表示してもキャプチャできません'
        }

      case 'fullscreen-preventable':
        // 青色: 全画面表示で防げる（Keyboard Lock API）
        return {
          card: {
            borderColor: '#007AFF',
            backgroundColor: 'rgba(0, 122, 255, 0.08)'
          },
          combo: {
            color: '#007AFF'
          },
          description: {
            color: '#0062CC'
          },
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
    const isSequential = isSequentialShortcut(shortcut, appContext || undefined)

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
  }, [shortcut, appContext]);

  return (
    <div
      className="shortcut-card"
      style={style.card}
      title={style.tooltip}
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
    </div>
  )
})

ShortcutCard.displayName = 'ShortcutCard'


export default ShortcutCard

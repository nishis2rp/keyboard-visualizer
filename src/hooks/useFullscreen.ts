import { useState, useEffect, useCallback } from 'react'
import { toggleFullscreen, isFullscreen, onFullscreenChange } from '../utils'
import { analytics } from '../utils/analytics'

/**
 * フルスクリーン管理フック
 *
 * @returns {Object} フルスクリーン状態と操作関数
 * @property {boolean} isFullscreenMode - 現在フルスクリーンモードかどうか
 * @property {Function} toggleFullscreenMode - フルスクリーンモードを切り替える
 */
export const useFullscreen = () => {
  const [isFullscreenMode, setIsFullscreenMode] = useState(false)

  useEffect(() => {
    // 初期状態を設定
    setIsFullscreenMode(isFullscreen())

    // フルスクリーン変更イベントをリッスン
    const cleanup = onFullscreenChange((isFs) => {
      setIsFullscreenMode(isFs)
      // Analytics: Track fullscreen toggle
      analytics.fullscreenToggled(isFs)
    })

    return cleanup
  }, [])

  const toggleFullscreenMode = useCallback(() => {
    toggleFullscreen()
  }, [])

  return {
    isFullscreenMode,
    toggleFullscreenMode
  }
}

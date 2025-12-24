/**
 * フルスクリーンモード管理ユーティリティ
 * フルスクリーンモードでブラウザのショートカット競合を軽減
 */

/**
 * フルスクリーンモードに入る
 * @returns {Promise<void>}
 */
export const enterFullscreen = async () => {
  try {
    const element = document.documentElement

    if (element.requestFullscreen) {
      await element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) { // Safari
      await element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) { // IE11
      await element.msRequestFullscreen()
    }
  } catch (error) {
    console.error('フルスクリーンモードへの移行に失敗:', error)
  }
}

/**
 * フルスクリーンモードから退出
 * @returns {Promise<void>}
 */
export const exitFullscreen = async () => {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen()
    } else if (document.webkitExitFullscreen) { // Safari
      await document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) { // IE11
      await document.msExitFullscreen()
    }
  } catch (error) {
    console.error('フルスクリーンモードからの退出に失敗:', error)
  }
}

/**
 * フルスクリーンモードのトグル
 * @returns {Promise<void>}
 */
export const toggleFullscreen = async () => {
  if (isFullscreen()) {
    await exitFullscreen()
  } else {
    await enterFullscreen()
  }
}

/**
 * 現在フルスクリーンモードかどうかをチェック
 * @returns {boolean}
 */
export const isFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  )
}

/**
 * フルスクリーン変更イベントのリスナーを追加
 * @param {Function} callback - フルスクリーン状態が変更されたときのコールバック
 * @returns {Function} リスナーを削除する関数
 */
export const onFullscreenChange = (callback) => {
  const handler = () => callback(isFullscreen())

  document.addEventListener('fullscreenchange', handler)
  document.addEventListener('webkitfullscreenchange', handler)
  document.addEventListener('msfullscreenchange', handler)

  return () => {
    document.removeEventListener('fullscreenchange', handler)
    document.removeEventListener('webkitfullscreenchange', handler)
    document.removeEventListener('msfullscreenchange', handler)
  }
}

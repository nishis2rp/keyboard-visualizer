/**
 * フルスクリーンモード管理ユーティリティ
 * フルスクリーンモードでブラウザのショートカット競合を軽減
 */

/**
 * キーボードロックを有効化（全画面モード時のみ）
 * Winキーなどのシステムキーをブラウザがキャプチャできるようにする
 * 引数なしでlock()を呼び出すことで、可能な限り多くのキーをキャプチャ
 * ただし、Win+L（ロック）などのセキュリティ関連ショートカットはOSレベルで保護されており、キャプチャできない場合があります
 * @returns {Promise<void>}
 */
const lockKeyboard = async () => {
  try {
    // Keyboard Lock APIがサポートされているかチェック
    const nav = navigator as any;
    if (nav.keyboard && nav.keyboard.lock) {
      // 引数なしで呼び出すことで、できるだけ多くのキーをロック
      // （Escキーを除く。Escキーは全画面モードを終了するために常に利用可能）
      await nav.keyboard.lock()
    }
  } catch (error) {
    // キーボードロックは一部のブラウザでサポートされていない
  }
}

/**
 * キーボードロックを解除
 * @returns {void}
 */
const unlockKeyboard = () => {
  try {
    const nav = navigator as any;
    if (nav.keyboard && nav.keyboard.unlock) {
      nav.keyboard.unlock()
    }
  } catch (error) {
    // キーボードロックは一部のブラウザでサポートされていない
  }
}

/**
 * フルスクリーンモードに入る
 * @returns {Promise<void>}
 */
export const enterFullscreen = async () => {
  try {
    const element = document.documentElement as any

    if (element.requestFullscreen) {
      await element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) { // Safari
      await element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) { // IE11
      await element.msRequestFullscreen()
    }

    // フルスクリーン移行後にキーボードをロック
    await lockKeyboard()
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
    // キーボードロックを解除
    unlockKeyboard()

    const doc = document as any

    if (doc.exitFullscreen) {
      await doc.exitFullscreen()
    } else if (doc.webkitExitFullscreen) { // Safari
      await doc.webkitExitFullscreen()
    } else if (doc.msExitFullscreen) { // IE11
      await doc.msExitFullscreen()
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
  const doc = document as any
  return !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.msFullscreenElement
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

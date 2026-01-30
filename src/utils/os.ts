/**
 * OSを検出
 * @returns {'windows' | 'macos' | 'linux' | 'unknown'}
 */
export const detectOS = () => {
  const platform = navigator.platform.toLowerCase()
  const userAgent = navigator.userAgent.toLowerCase()

  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'macos'
  } else if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows'
  } else if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux'
  }
  return 'unknown'
}

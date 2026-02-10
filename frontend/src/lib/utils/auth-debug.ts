// ============================================
// AUTH DEBUGGING UTILITIES
// ============================================

export function debugAuthState() {
  if (typeof window === 'undefined') return

  console.group('🔍 Auth State Debug')
  console.log('User Agent:', navigator.userAgent)
  console.log('Platform:', navigator.platform)
  console.log('Touch Support:', 'ontouchstart' in window)

  // Check localStorage availability
  try {
    localStorage.setItem('__test__', 'test')
    localStorage.removeItem('__test__')
    console.log('✅ localStorage: Working')
  } catch (e) {
    console.error('❌ localStorage: Failed', e)
  }

  // Check sessionStorage availability
  try {
    sessionStorage.setItem('__test__', 'test')
    sessionStorage.removeItem('__test__')
    console.log('✅ sessionStorage: Working')
  } catch (e) {
    console.error('❌ sessionStorage: Failed', e)
  }

  // Check cookies
  console.log('🍪 Cookies enabled:', navigator.cookieEnabled)

  // Check network
  console.log('🌐 Online:', navigator.onLine)

  // Check screen info
  console.log('📱 Screen:', {
    width: screen.width,
    height: screen.height,
    pixelRatio: window.devicePixelRatio
  })

  console.groupEnd()
}

export function isMobileDevice() {
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
}

export function isIOSDevice() {
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent || navigator.vendor
  return /ipad|iphone|ipod/i.test(userAgent)
}

export function isSafari() {
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent || navigator.vendor
  return /safari/i.test(userAgent) && !/chrome/i.test(userAgent)
}

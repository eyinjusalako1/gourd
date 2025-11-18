'use client'

import { useEffect } from 'react'

/**
 * Sets a CSS custom property (--vh) representing 1% of the viewport height,
 * mitigating iOS Safari 100vh issues. Recalculates on resize & orientation change.
 */
export function useViewportVH() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVh()
    window.addEventListener('resize', setVh)
    window.addEventListener('orientationchange', setVh)

    return () => {
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
    }
  }, [])
}




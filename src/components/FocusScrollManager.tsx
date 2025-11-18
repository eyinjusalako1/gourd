'use client'

import { useEffect } from 'react'

/**
 * Ensures focused inputs remain visible when the keyboard opens on mobile devices.
 * Scrolls the focused element into view with gentle centering.
 */
export function FocusScrollManager() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      if (!target.matches('input, textarea, select, [contenteditable="true"]')) return

      window.setTimeout(() => {
        target.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 150)
    }

    document.addEventListener('focusin', handleFocusIn)
    return () => {
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [])

  return null
}




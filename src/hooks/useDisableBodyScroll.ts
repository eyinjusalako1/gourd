'use client'

import { useEffect } from 'react'

/**
 * Prevents body scrolling when a modal or sheet is open.
 * Applies overflow-hidden to the documentElement as well to cover mobile Safari quirks.
 */
export function useDisableBodyScroll(isDisabled: boolean) {
  useEffect(() => {
    if (typeof document === 'undefined') return

    const { documentElement, body } = document
    const previousBodyOverflow = body.style.overflow
    const previousHtmlOverflow = documentElement.style.overflow
    const previousPaddingRight = body.style.paddingRight

    if (isDisabled) {
      const scrollBarWidth = window.innerWidth - documentElement.clientWidth
      if (scrollBarWidth > 0) {
        body.style.paddingRight = `${scrollBarWidth}px`
      }
      body.style.overflow = 'hidden'
      documentElement.style.overflow = 'hidden'
    } else {
      body.style.overflow = previousBodyOverflow
      documentElement.style.overflow = previousHtmlOverflow
      body.style.paddingRight = previousPaddingRight
    }

    return () => {
      body.style.overflow = previousBodyOverflow
      documentElement.style.overflow = previousHtmlOverflow
      body.style.paddingRight = previousPaddingRight
    }
  }, [isDisabled])
}




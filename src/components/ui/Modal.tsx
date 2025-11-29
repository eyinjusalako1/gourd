'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import { useViewportVH } from '@/hooks/useViewportVH'

const focusableSelectors = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  descriptionId?: string
  children: React.ReactNode
  className?: string
  initialFocusRef?: React.RefObject<HTMLElement>
  closeOnOverlayClick?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  descriptionId,
  children,
  className,
  initialFocusRef,
  closeOnOverlayClick = true,
}: ModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useViewportVH()
  useDisableBodyScroll(isOpen)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement
      window.scrollTo({ top: 0, behavior: 'auto' })
    } else if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus({ preventScroll: true })
    }
  }, [isOpen])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }

      if (event.key === 'Tab' && containerRef.current) {
        const focusableEls = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
        ).filter((el) => !el.hasAttribute('data-focus-guard'))

        if (focusableEls.length === 0) {
          event.preventDefault()
          return
        }

        const firstElement = focusableEls[0]
        const lastElement = focusableEls[focusableEls.length - 1]

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        } else if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return

    const node = containerRef.current
    if (!node) return

    const focusTarget =
      initialFocusRef?.current ||
      node.querySelector<HTMLElement>(focusableSelectors) ||
      node

    focusTarget?.focus({ preventScroll: true })
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [handleKeyDown, initialFocusRef, isOpen])

  if (!mounted) return null

  const content = (
    <AnimatePresence>
      {isOpen ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
        >
          <motion.div
            key="backdrop"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => closeOnOverlayClick && onClose()}
          />

          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-describedby={descriptionId}
            ref={containerRef}
            tabIndex={-1}
            className={cn(
              'relative z-[10000] max-w-lg w-[clamp(320px,90vw,480px)] mx-auto rounded-2xl bg-[#1B2048] border border-[#D4AF37]/30 shadow-2xl p-6 outline-none text-white',
              'max-h-[calc(var(--vh,1vh)*100-3rem)] overflow-y-auto overscroll-contain',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]',
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {title ? (
              <h2 id="modal-title" className="text-lg font-semibold text-white mb-4">
                {title}
              </h2>
            ) : null}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )

  return ReactDOM.createPortal(content, document.body)
}



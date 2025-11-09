'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { AnimatePresence, motion, useMotionValue } from 'framer-motion'
import { cn } from '@/utils/cn'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import { useViewportVH } from '@/hooks/useViewportVH'

const DEFAULT_SNAP_POINTS = [0.8, 0.5, 0.25]

const focusableSelectors = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  snapPoints?: number[]
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  snapPoints = DEFAULT_SNAP_POINTS,
}: BottomSheetProps) {
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  )
  const sheetRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const y = useMotionValue(0)
  const [currentSnap, setCurrentSnap] = useState<number>(snapPoints[0])

  useViewportVH()
  useDisableBodyScroll(isOpen)

  const sortedSnapPoints = useMemo(
    () => [...snapPoints].sort((a, b) => b - a),
    [snapPoints]
  )

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return

    const updateHeight = () => setViewportHeight(window.innerHeight)
    updateHeight()
    window.addEventListener('resize', updateHeight)
    window.addEventListener('orientationchange', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
      window.removeEventListener('orientationchange', updateHeight)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement
      window.scrollTo({ top: 0, behavior: 'auto' })
      setCurrentSnap(sortedSnapPoints[0])
    } else if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus({ preventScroll: true })
    }
  }, [isOpen, sortedSnapPoints])

  const applySnap = useCallback(
    (snap: number) => {
      const height = viewportHeight || window.innerHeight || 0
      if (!height) return
      const target = height - height * snap
      y.stop()
      y.set(target)
    },
    [viewportHeight, y]
  )

  useEffect(() => {
    if (!isOpen) return
    applySnap(currentSnap)
  }, [applySnap, currentSnap, isOpen])

  const onDragEnd = (_: any, info: { velocity: { y: number }; point: { y: number } }) => {
    const height = viewportHeight || window.innerHeight || 0
    const currentOffset = y.get()
    const projected = currentOffset + info.velocity.y * 0.2

    if (!height) {
      onClose()
      return
    }

    if (projected > height * 0.6 || info.velocity.y > 1000) {
      onClose()
      return
    }

    const distances = sortedSnapPoints.map((snap) => {
      const offset = height - height * snap
      return { snap, distance: Math.abs(projected - offset) }
    })

    const closest = distances.sort((a, b) => a.distance - b.distance)[0]
    setCurrentSnap(closest.snap)
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
      if (event.key === 'Tab' && sheetRef.current) {
        const focusableEls = Array.from(
          sheetRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
        )
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
    const node = sheetRef.current
    if (!node) return

    const focusTarget =
      node.querySelector<HTMLElement>(focusableSelectors) || node

    focusTarget.focus({ preventScroll: true })
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [handleKeyDown, isOpen])

  if (!mounted) return null

  const maxHeight = 'calc(var(--vh, 1vh) * 100)'

  const content = (
    <AnimatePresence>
      {isOpen ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[9999]"
          style={{ height: maxHeight }}
        >
          <motion.div
            key="backdrop"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'bottom-sheet-title' : undefined}
            tabIndex={-1}
            className={cn(
              'absolute left-0 right-0 mx-auto mt-auto rounded-t-3xl bg-[#1B2048] border border-[#D4AF37]/30 shadow-2xl text-white',
              'w-full max-w-xl',
              className
            )}
            style={{
              y,
              top: 'auto',
              bottom: 0,
              maxHeight,
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={onDragEnd}
            dragElastic={{ top: 0.2, bottom: 0.6 }}
            dragMomentum={false}
            initial={{ y: '100%' }}
            animate={{
              y:
                viewportHeight > 0
                  ? viewportHeight - viewportHeight * currentSnap
                  : '0%',
            }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col">
              <div className="relative py-3">
                <div className="mx-auto h-1.5 w-12 rounded-full bg-white/30" />
              </div>
              <div className="px-6 pb-6 overflow-y-auto overscroll-contain">
                {title ? (
                  <h2 id="bottom-sheet-title" className="text-base font-semibold text-white mb-3">
                    {title}
                  </h2>
                ) : null}
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )

  return ReactDOM.createPortal(content, document.body)
}



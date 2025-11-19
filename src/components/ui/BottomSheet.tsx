'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import ReactDOM from 'react-dom'
import { cn } from '@/utils/cn'

export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  maxHeight?: string
  disableDrag?: boolean
  footer?: React.ReactNode
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  maxHeight = '90vh',
  disableDrag = false,
  footer,
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false)
  const sheetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose()
    }
  }

  useEffect(() => {
    if (mounted && isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mounted, isOpen])

  if (!mounted) return null

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              mass: 0.8,
            }}
            drag={disableDrag ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (!disableDrag && (info.offset.y > 100 || info.velocity.y > 500)) {
                onClose()
              }
            }}
            className={cn(
              'absolute left-0 right-0 bottom-0 bg-[#0F1433] text-white rounded-t-2xl border-t border-[#D4AF37]/30 shadow-2xl flex flex-col max-w-md mx-auto',
              className
            )}
            style={{
              maxHeight,
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
              willChange: 'transform',
            }}
          >
            {/* Drag Handle */}
            <div className="flex-shrink-0 pt-3 pb-2">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-white/30" />
            </div>

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex-shrink-0 flex items-center justify-between px-4 pb-4">
                {title ? (
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                ) : (
                  <div />
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
              {children}
            </div>

            {/* Footer - Fixed at bottom */}
            {footer && (
              <div className="flex-shrink-0 border-t border-white/10">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return ReactDOM.createPortal(content, document.body)
}

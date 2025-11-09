'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ReactDOM from 'react-dom'
import { cn } from '@/utils/cn'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastOptions {
  id?: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextValue {
  publish: (toast: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

interface ActiveToast extends ToastOptions {
  id: string
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ActiveToast[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const publish = useCallback(
    ({ id, title, description, variant = 'info', duration = 4000 }: ToastOptions) => {
      const toastId = id ?? `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
      const toast: ActiveToast = { id: toastId, title, description, variant, duration }
      setToasts((current) => [...current, toast])

      window.setTimeout(() => removeToast(toastId), duration)
    },
    [removeToast]
  )

  const contextValue = useMemo(() => ({ publish }), [publish])

  const portal =
    mounted &&
    ReactDOM.createPortal(
      <div
        className="fixed inset-x-0 bottom-0 z-[10000] flex flex-col items-center space-y-2 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, translateY: 16, scale: 0.95 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              exit={{ opacity: 0, translateY: 16, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'pointer-events-auto w-[90vw] max-w-sm rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-md',
                'bg-[#1B2048]/95 text-white',
                {
                  'border-green-400/60': toast.variant === 'success',
                  'border-red-500/60': toast.variant === 'error',
                  'border-[#D4AF37]/60': toast.variant === 'info',
                }
              )}
            >
              <div className="flex flex-col space-y-1">
                <strong className="text-sm font-semibold leading-tight">{toast.title}</strong>
                {toast.description ? (
                  <span className="text-xs text-white/80 leading-snug">{toast.description}</span>
                ) : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>,
      document.body
    )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portal}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context.publish
}



'use client'

import React, { useEffect, useState } from 'react'
import { useTutorial } from '@/lib/tutorial-context'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '@/components/Logo'

export default function TutorialOverlay() {
  const { isVisible, steps, currentIndex, next, prev, stop } = useTutorial()
  const [rect, setRect] = useState<{top:number;left:number;width:number;height:number} | null>(null)
  const step = steps[currentIndex]
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const swipeThreshold = 40

  // Measure target on each step
  useEffect(() => {
    if (!isVisible) { setRect(null); return }
    if (!step?.target) { setRect(null); return }
    const el = document.querySelector(step.target) as HTMLElement | null
    if (!el) { setRect(null); return }
    const b = el.getBoundingClientRect()
    setRect({ top: b.top + window.scrollY, left: b.left + window.scrollX, width: b.width, height: b.height })
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [isVisible, currentIndex, step?.target])

  const total = steps.length
  const progress = `${currentIndex + 1} / ${total}`

  // Prevent background scroll while visible
  useEffect(() => {
    if (!isVisible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isVisible])

  // Focus trap: keep tab inside the overlay
  useEffect(() => {
    if (!isVisible) return
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const dialog = document.getElementById('tutorial-overlay-dialog')
      if (!dialog) return
      const focusable = dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey) {
        if (active === first) { e.preventDefault(); last.focus() }
      } else {
        if (active === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isVisible, currentIndex])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className="fixed inset-0 z-[80] pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

          {/* Highlight */}
          {rect && (
            <motion.div
              className="absolute rounded-xl ring-2 ring-[#F5C451] shadow-[0_0_30px_6px_rgba(245,196,81,0.35)]"
              style={{ top: rect.top - window.scrollY - 8, left: rect.left - window.scrollX - 8, width: rect.width + 16, height: rect.height + 16 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            />
          )}

          {/* Card */}
          <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-auto">
            <motion.div
              id="tutorial-overlay-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Tutorial"
              key={step.id}
              className="relative mx-auto w-full max-w-[380px] bg-[#0F1433] border-2 border-[#D4AF37] rounded-2xl p-6 text-white flex flex-col min-h-[60vh]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              onTouchStart={(e)=> setTouchStartX(e.changedTouches[0].clientX)}
              onTouchMove={(e)=> setTouchEndX(e.changedTouches[0].clientX)}
              onTouchEnd={()=>{
                if (touchStartX === null || touchEndX === null) return
                const dx = touchEndX - touchStartX
                if (dx > swipeThreshold) prev()
                else if (dx < -swipeThreshold) next()
                setTouchStartX(null); setTouchEndX(null)
              }}
            >
              <button onClick={() => stop(true)} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white min-h-[44px]" autoFocus>
                <X className="w-5 h-5" />
              </button>
              <div className="mb-2 text-sm text-[#F5C451] font-bold">{progress}</div>
              <h3 className="text-xl font-bold mb-2 leading-snug">{step.title}</h3>
              <p className="text-white/80 mb-5 text-base leading-relaxed">{step.description}</p>

              <div className="mt-auto pt-4">
                <div className="flex items-center space-x-2">
                  <button onClick={prev} className="flex-1 min-h-[44px] py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20">Back</button>
                  <button onClick={() => stop(true)} className="flex-1 min-h-[44px] py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20">Skip Tutorial</button>
                  <button onClick={next} className="flex-1 min-h-[44px] py-3 px-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] font-semibold hover:from-[#F5C451] hover:to-[#D4AF37] flex items-center justify-center space-x-1 shadow-[0_0_16px_rgba(245,196,81,0.6)]">
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center text-xs text-white/60 mt-2">Tip: Swipe left/right to navigate</div>
              </div>

              {/* Watermark */}
              <div className="absolute -bottom-3 -right-3 opacity-30">
                <Logo size="sm" showText={false} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}



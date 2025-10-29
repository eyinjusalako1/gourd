'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useTutorial } from '@/lib/tutorial-context'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

export default function TutorialOverlay() {
  const { isVisible, steps, currentIndex, next, prev, stop } = useTutorial()
  const [rect, setRect] = useState<{top:number;left:number;width:number;height:number} | null>(null)
  const step = steps[currentIndex]

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

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none">
      <div className="absolute inset-0 bg-black/70 pointer-events-auto" />

      {rect && (
        <div
          className="absolute border-2 border-[#F5C451] rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
          style={{ top: rect.top - window.scrollY - 8, left: rect.left - window.scrollX - 8, width: rect.width + 16, height: rect.height + 16 }}
        />
      )}

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 max-w-md mx-auto px-4 pointer-events-auto">
        <div className="bg-[#0F1433] border-2 border-[#F5C451] rounded-2xl p-6 text-white relative">
          <button onClick={() => stop(true)} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="mb-2 text-sm text-[#F5C451] font-bold">{progress}</div>
          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
          <p className="text-white/80 mb-5">{step.description}</p>
          <div className="flex items-center space-x-2">
            <button onClick={prev} className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20">Back</button>
            <button onClick={() => stop(true)} className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20">Skip Tutorial</button>
            <button onClick={next} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] font-semibold hover:from-[#F5C451] hover:to-[#D4AF37] flex items-center justify-center space-x-1">
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



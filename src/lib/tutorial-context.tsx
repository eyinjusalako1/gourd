'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { TutorialStep } from '@/lib/tutorial-steps'
import { tutorialSteps } from '@/lib/tutorial-steps'

interface TutorialContextValue {
  isVisible: boolean
  steps: TutorialStep[]
  currentIndex: number
  start: () => void
  stop: (completed?: boolean) => void
  next: () => void
  prev: () => void
  restart: () => void
}

const TutorialContext = createContext<TutorialContextValue | undefined>(undefined)

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const steps = useMemo(() => tutorialSteps, [])

  useEffect(() => {
    try {
      const completed = localStorage.getItem('gathered_tutorial_completed') === 'true'
      if (!completed) setIsVisible(true)
    } catch {}
  }, [])

  const start = () => { setCurrentIndex(0); setIsVisible(true) }
  const stop = (completed?: boolean) => {
    setIsVisible(false)
    if (completed) {
      try { localStorage.setItem('gathered_tutorial_completed', 'true') } catch {}
    }
  }
  const next = () => {
    setCurrentIndex((i) => {
      if (i + 1 >= steps.length) { stop(true); return i }
      return i + 1
    })
  }
  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const restart = () => { try { localStorage.removeItem('gathered_tutorial_completed') } catch {}; start() }

  const value: TutorialContextValue = { isVisible, steps, currentIndex, start, stop, next, prev, restart }
  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}

export function useTutorial() {
  const ctx = useContext(TutorialContext)
  if (!ctx) throw new Error('useTutorial must be used within TutorialProvider')
  return ctx
}



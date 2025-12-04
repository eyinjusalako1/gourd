'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { X, ArrowRight, Check } from 'lucide-react'

interface TutorialStep {
  id: string
  title: string
  description: string
  target: string // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right'
  navigateTo?: string // optional route to navigate before showing this step
}

interface OnboardingTutorialProps {
  onComplete?: () => void
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Gathered! 👋',
    description: 'Let\'s take a quick tour to help you get started. This will only take 2 minutes.',
    target: '',
    position: 'bottom'
  },
  {
    id: 'profile',
    title: 'Set Up Your Profile',
    description: 'Click the profile icon to add your photo, bio, and interests. This helps others connect with you.',
    target: '[data-tutorial="profile"]',
    position: 'bottom'
  },
  {
    id: 'profile-edit',
    title: 'Edit Your Profile',
    description: 'Tap Edit Profile to update your photo, bio, and interests.',
    target: '[data-tutorial="edit-profile"]',
    position: 'top'
  },
  {
    id: 'testimonies',
    title: 'Share Your Testimony',
    description: 'Click the book icon to read and share testimonies. Your story can inspire others!',
    target: '[data-tutorial="testimonies"]',
    position: 'bottom'
  },
  {
    id: 'prayers',
    title: 'Request & Pray for Others',
    description: 'Click the heart icon to share prayer requests and pray for others in your community.',
    target: '[data-tutorial="prayers"]',
    position: 'bottom'
  },
  {
    id: 'bottom-nav',
    title: 'Navigate Features',
    description: 'Use the bottom bar to access Events, Chat, Fellowships, and Devotions.',
    target: '[data-tutorial="bottom-nav"]',
    position: 'top'
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🎉',
    description: 'Start exploring! Browse fellowships, join events, and connect with your community. Need help? Click the settings icon.',
    target: '[data-tutorial="settings"]',
    position: 'bottom'
  }
]

export default function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetRect, setTargetRect] = useState<{top:number;left:number;width:number;height:number} | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user has completed tutorial
    const hasCompleted = localStorage.getItem('gathered_tutorial_completed')
    if (!hasCompleted) {
      setIsVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    localStorage.setItem('gathered_tutorial_completed', 'true')
    setIsVisible(false)
    // Always route to dashboard after tutorial, not profile page
    router.push('/dashboard')
    if (onComplete) onComplete()
  }

  const handleSkip = () => {
    handleComplete()
  }

  const step = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1

  // Auto-navigation for steps that reference controls on specific pages
  // Only navigate if we're not already on the right page to avoid loops
  useEffect(() => {
    const routeMap: Record<string, string> = {
      profile: '/dashboard',
      'profile-edit': '/dashboard', // Changed from /profile to avoid forcing profile page
      testimonies: '/dashboard',
      prayers: '/dashboard',
      'bottom-nav': '/dashboard'
    }
    const desired = routeMap[step.id]
    // Only navigate if we're not on the desired route and tutorial is visible
    if (desired && pathname !== desired && isVisible) {
      router.push(desired)
    }
  }, [currentStep, step.id, pathname, router, isVisible])

  // Measure and highlight target if provided (must run before early return to keep hook order consistent)
  useEffect(() => {
    if (!step.target) {
      setTargetRect(null)
      return
    }
    const el = document.querySelector(step.target) as HTMLElement | null
    if (!el) {
      setTargetRect(null)
      return
    }
    const rect = el.getBoundingClientRect()
    const next = { top: rect.top + window.scrollY, left: rect.left + window.scrollX, width: rect.width, height: rect.height }
    setTargetRect(next)
    // Ensure into view
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [currentStep, step.target])

  // Auto-click targets to guide users directly into the flow (only if tutorial is visible)
  useEffect(() => {
    if (!isVisible) return
    const autoClickIds = new Set(['profile', 'profile-edit', 'testimonies', 'prayers'])
    if (!autoClickIds.has(step.id)) return
    const el = document.querySelector(step.target) as HTMLElement | null
    if (!el) return
    const timer = setTimeout(() => {
      el.click()
    }, 500)
    return () => clearTimeout(timer)
  }, [currentStep, step.id, step.target, isVisible])

  // Auto-advance after auto actions to keep the flow moving
  useEffect(() => {
    const autoAdvanceIds = new Set(['profile', 'profile-edit', 'testimonies', 'prayers'])
    if (!autoAdvanceIds.has(step.id)) return
    const t = setTimeout(() => {
      setCurrentStep(s => Math.min(s + 1, tutorialSteps.length - 1))
    }, 1200)
    return () => clearTimeout(t)
  }, [currentStep, step.id])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75 pointer-events-auto" />

      {/* Highlight box */}
      {targetRect && (
        <div
          className="absolute border-2 border-[#F5C451] rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none"
          style={{
            top: targetRect.top - 8 - window.scrollY,
            left: targetRect.left - 8 - window.scrollX,
            width: targetRect.width + 16,
            height: targetRect.height + 16
          }}
        />
      )}
      
      {/* Tooltip - center on mobile, or near target if available */}
      <div
        className="absolute inset-x-0 max-w-sm mx-auto px-4 pointer-events-auto"
        style={targetRect ? {
          top: step.position === 'top' ? Math.max(16, targetRect.top - 140 - window.scrollY) : undefined,
          left: '0', right: '0',
          bottom: step.position === 'top' ? undefined : Math.max(24, window.innerHeight - (targetRect.top - window.scrollY) + 16)
        } : { top: '50%', transform: 'translateY(-50%)' }}
      >
        <div className="bg-[#0F1433] border-2 border-[#F5C451] rounded-2xl p-6 relative">
          {/* Close button (skip tutorial) */}
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Content */}
          <div className="pr-6">
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-2 py-1 bg-[#F5C451] text-[#0F1433] rounded text-sm font-bold">
                {currentStep + 1} / {tutorialSteps.length}
              </span>
              {isLastStep && (
                <span className="px-2 py-1 bg-green-500 text-white rounded text-sm font-bold flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Complete</span>
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
            <p className="text-white/80 mb-4">{step.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 px-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
            >
              {isLastStep ? 'Got it!' : 'Skip Tutorial'}
            </button>
            {!isLastStep && (
              <button
                onClick={handleNext}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] rounded-lg font-bold hover:from-[#F5C451] hover:to-[#D4AF37] transition-all flex items-center justify-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5C451] transition-all duration-300"
          style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
        />
      </div>
    </div>
  )
}


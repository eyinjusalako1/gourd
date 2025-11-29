'use client'

import { useState, useEffect } from 'react'

const UNREAD_ACTIVITY_KEY = 'activity_unread'

export function useUnreadActivity() {
  const [hasUnread, setHasUnread] = useState(false)

  // Load initial state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(UNREAD_ACTIVITY_KEY)
      setHasUnread(stored === 'true')
    }
  }, [])

  // Check for new activity (mock logic for now)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Mock logic: Check if there are new events, testimonies, or prayers
    // In a real app, this would check your API/database
    const checkForNewActivity = () => {
      // Only check if we don't already have unread state
      // This prevents overwriting user's cleared state
      const currentState = localStorage.getItem(UNREAD_ACTIVITY_KEY)
      if (currentState === 'false') {
        // User has cleared, don't auto-set again (in real app, check API for actual new items)
        return
      }

      // Mock: Simulate checking for new activity
      // In production, replace this with actual API calls to check for:
      // - New events in user's fellowships
      // - New testimonies from followed users
      // - New prayer requests
      const hasNewEvents = false // TODO: Replace with actual API call
      const hasNewTestimonies = false // TODO: Replace with actual API call
      const hasNewPrayers = false // TODO: Replace with actual API call

      const shouldShowUnread = hasNewEvents || hasNewTestimonies || hasNewPrayers

      if (shouldShowUnread) {
        setHasUnread(true)
        localStorage.setItem(UNREAD_ACTIVITY_KEY, 'true')
      }
    }

    // Check on mount
    checkForNewActivity()
    
    // In production, you might want to poll every 30-60 seconds
    // const interval = setInterval(checkForNewActivity, 30000)
    // return () => clearInterval(interval)
  }, [])

  const clearUnread = () => {
    setHasUnread(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(UNREAD_ACTIVITY_KEY, 'false')
    }
  }

  const setUnread = (value: boolean) => {
    setHasUnread(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem(UNREAD_ACTIVITY_KEY, value.toString())
    }
  }

  return {
    hasUnread,
    clearUnread,
    setUnread,
  }
}


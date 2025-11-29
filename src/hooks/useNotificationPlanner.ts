'use client'

import { useEffect, useRef } from 'react'
import type { UserProfile } from '@/lib/prefs'

function isWithinQuietHours(date: Date, start?: string | null, end?: string | null) {
  if (!start || !end) return false
  const [startHour, startMinute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)

  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute
  const currentMinutes = date.getHours() * 60 + date.getMinutes()

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes
  }
  return currentMinutes >= startMinutes || currentMinutes < endMinutes
}

function getNextNudgeDate(profile: UserProfile): Date | null {
  if (profile.notif_cadence === 'off') return null

  const now = new Date()
  const target = new Date(now)

  if (profile.notif_cadence === 'daily') {
    target.setDate(now.getDate() + 1)
  } else {
    target.setDate(now.getDate() + 7)
  }

  target.setHours(9, 0, 0, 0)

  if (isWithinQuietHours(target, profile.quiet_hours_start, profile.quiet_hours_end)) {
    if (profile.quiet_hours_end) {
      const [hour, minute] = profile.quiet_hours_end.split(':').map(Number)
      target.setHours(hour, minute, 0, 0)
    }
  }

  return target
}

export function useNotificationPlanner(profile: UserProfile | null | undefined) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!profile) return
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    const next = getNextNudgeDate(profile)
    if (!next) return
    const delay = Math.max(0, next.getTime() - Date.now())

    timerRef.current = setTimeout(() => {
      console.info('[notifications]', 'Triggering scheduled nudge', {
        cadence: profile.notif_cadence,
        message:
          profile.notif_cadence === 'daily'
            ? "Keep your flame alive—share one gratitude today?"
            : 'Your fellowship has a gathering this week. Take a peek at events!',
        scheduledFor: next.toISOString(),
      })
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [profile])
}




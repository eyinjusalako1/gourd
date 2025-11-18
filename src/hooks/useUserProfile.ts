'use client'

import { useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import type { UserProfile, UserProfileUpdate } from '@/lib/prefs'
import { cacheProfile, clearProfileCache, getCachedProfile, getUserProfile, upsertUserProfile } from '@/lib/prefs'

interface UseUserProfileOptions {
  revalidateOnFocus?: boolean
}

export function useUserProfile(options: UseUserProfileOptions = {}) {
  const { user } = useAuth()
  const userId = user?.id

  const fetcher = useCallback(async () => {
    if (!userId) return null
    const profile = await getUserProfile(userId)
    if (profile) cacheProfile(profile)
    return profile
  }, [userId])

  const swr = useSWR<UserProfile | null>(userId ? ['user-profile', userId] : null, fetcher, {
    revalidateOnFocus: options.revalidateOnFocus ?? false,
    fallbackData: getCachedProfile(),
  })

  const profile = swr.data ?? null
  const normalizedProfile = useMemo(() => {
    if (!profile) return null
    return {
      ...profile,
      personalization_enabled: {
        interests: profile.personalization_enabled?.interests ?? true,
        location: profile.personalization_enabled?.location ?? false,
        suggestions: profile.personalization_enabled?.suggestions ?? true,
      },
      accessibility: {
        reduceMotion: profile.accessibility?.reduceMotion ?? false,
        largeText: profile.accessibility?.largeText ?? false,
        highContrast: profile.accessibility?.highContrast ?? false,
      },
    }
  }, [profile])

  const updateProfile = useCallback(
    async (payload: UserProfileUpdate) => {
      if (!userId) throw new Error('No authenticated user')
      const updated = await upsertUserProfile(userId, payload)
      if (updated) swr.mutate(updated, false)
      return updated
    },
    [swr, userId]
  )

  const markProfileComplete = useCallback(async () => {
    if (!userId) return
    await updateProfile({ profile_complete: true })
  }, [updateProfile, userId])

  const invalidate = useCallback(() => swr.mutate(), [swr])

  useEffect(() => {
    if (!normalizedProfile) return

    document.documentElement.classList.toggle('theme-high-contrast', !!normalizedProfile.accessibility?.highContrast)
    document.documentElement.classList.toggle('text-lg-base', !!normalizedProfile.accessibility?.largeText)

    if (normalizedProfile.accessibility?.reduceMotion) {
      document.documentElement.setAttribute('data-reduce-motion', 'true')
    } else {
      document.documentElement.removeAttribute('data-reduce-motion')
    }
  }, [normalizedProfile])

  useEffect(() => {
    return () => {
      if (!userId) clearProfileCache()
    }
  }, [userId])

  return {
    profile: normalizedProfile,
    isLoading: swr.isLoading,
    error: swr.error as Error | undefined,
    updateProfile,
    markProfileComplete,
    invalidate,
  }
}




'use client'

import { useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { UserProfile, UserProfileUpdate, Role } from '@/lib/prefs'
import { cacheProfile, clearProfileCache, getCachedProfile, getUserProfile, upsertUserProfile, isSteward, isDisciple, normalizeRole } from '@/lib/prefs'

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

  const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Avatar upload is unavailable.')
    }

    if (!userId) {
      throw new Error('No authenticated user')
    }

    try {
      // First, check if the bucket exists by listing buckets
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        console.error('Error listing buckets:', listError)
        throw new Error('Unable to access storage. Please contact support.')
      }

      // Check for bucket with case-insensitive matching (Supabase bucket names are case-sensitive)
      const avatarsBucket = buckets?.find(b => b.name.toLowerCase() === 'avatars')
      
      if (!avatarsBucket) {
        // Provide a helpful error message with setup instructions
        throw new Error('Profile picture upload is not available yet. The storage bucket needs to be set up. Please contact your administrator or check the setup documentation.')
      }

      // Use the actual bucket name (case-sensitive)
      const bucketName = avatarsBucket.name
      const filePath = `${bucketName.toLowerCase()}/${userId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

      if (uploadError) {
        console.error('Avatar upload failed:', uploadError)
        
        // Provide more helpful error messages based on error code
        if (uploadError.message?.includes('Bucket') || uploadError.message?.includes('bucket')) {
          throw new Error('Avatar storage bucket is not configured. Please contact an administrator to set up the "avatars" storage bucket in Supabase.')
        }
        
        throw new Error(`Failed to upload avatar: ${uploadError.message}`)
      }

      const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath)
      
      // Update profile with new avatar URL
      const updated = await updateProfile({ avatar_url: publicUrl })
      return publicUrl
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }, [userId, updateProfile])

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

  const isConfigured = isSupabaseConfigured()
  const hasError = swr.error || (!isConfigured && normalizedProfile === null)
  
  // Role checking helpers
  const role = useMemo(() => normalizeRole(normalizedProfile?.role), [normalizedProfile?.role])
  const isUserSteward = useMemo(() => isSteward(normalizedProfile), [normalizedProfile])
  const isUserDisciple = useMemo(() => isDisciple(normalizedProfile), [normalizedProfile])

  return {
    profile: normalizedProfile,
    role,
    isSteward: isUserSteward,
    isDisciple: isUserDisciple,
    isLoading: swr.isLoading,
    error: swr.error as Error | undefined,
    isConfigured,
    hasError: !!hasError,
    updateProfile,
    markProfileComplete,
    uploadAvatar,
    invalidate,
  }
}




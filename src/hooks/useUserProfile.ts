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
      
      // Get current session for userId
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) {
        throw new Error('You must be logged in to update your profile')
      }

      // Call backend API route which uses server-side Supabase (bypasses RLS)
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          userId: session.user.id,
        }),
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error || 'Failed to update profile')
      }

      // Update local cache and SWR
      if (json.profile) {
        const profile = { ...json.profile, last_activity_at: json.profile.last_seen_at ?? null }
        cacheProfile(profile)
        swr.mutate(profile, false)
        return profile
      }

      // Fallback to old method if API fails
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
      // Try common bucket name variations (case-sensitive in Supabase)
      const possibleBucketNames = ['Avatars', 'avatars', 'avatar', 'Avatar']
      let uploadError: any = null
      let successfulBucket: string | null = null
      let filePath: string = ''

      // Try each bucket name until one works
      for (const bucketName of possibleBucketNames) {
        filePath = `${bucketName.toLowerCase()}/${userId}/${Date.now()}-${file.name}`
        const { error } = await supabase.storage.from(bucketName).upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

        if (!error) {
          successfulBucket = bucketName
          break
        } else {
          uploadError = error
          // If it's not a bucket not found error, stop trying
          if (!error.message?.includes('Bucket') && !error.message?.includes('bucket') && !error.message?.includes('not found')) {
            break
          }
        }
      }

      // If no bucket worked, provide helpful error
      if (!successfulBucket) {
        console.error('Avatar upload failed:', uploadError)
        
        if (uploadError?.message?.includes('Bucket') || uploadError?.message?.includes('bucket') || uploadError?.message?.includes('not found')) {
          throw new Error('Storage bucket not found. Please ensure a bucket named "Avatars" (or "avatars") exists in your Supabase Storage and is set to PUBLIC. Check your Supabase dashboard: Storage > Buckets.')
        }
        
        throw new Error(`Failed to upload avatar: ${uploadError?.message || 'Unknown error'}`)
      }

      // Get public URL using the successful bucket name
      const { data: { publicUrl } } = supabase.storage.from(successfulBucket).getPublicUrl(filePath)
      
      // Update profile with new avatar URL
      try {
        const updated = await updateProfile({ avatar_url: publicUrl })
        return publicUrl
      } catch (profileError: any) {
        // If profile update fails but upload succeeded, still return the URL
        // The user can manually update their profile later
        console.error('Profile update failed, but file uploaded successfully:', profileError)
        if (profileError.message?.includes('row-level security') || profileError.message?.includes('RLS')) {
          throw new Error('Avatar uploaded successfully, but profile update was blocked. Please configure Row Level Security (RLS) policies in Supabase to allow users to update their own profiles. See README.md for setup instructions.')
        }
        throw profileError
      }
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




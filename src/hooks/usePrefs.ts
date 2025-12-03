'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

export type UserType = 'Disciple' | 'Steward' | null

interface Prefs {
  userType: UserType
  isLoading: boolean
}

const PREFS_CACHE_KEY = 'gathered_user_prefs'
const PREFS_TABLE = 'user_prefs'

export function usePrefs(): Prefs {
  const { user } = useAuth()
  const [userType, setUserType] = useState<UserType>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setUserType(null)
      setIsLoading(false)
      return
    }

    let isMounted = true
    const userId = user.id // Store user.id before async function

    async function loadPrefs() {
      if (!userId) return // Guard clause
      
      try {
        // First, try to load from local cache for instant hydration
        const cached = localStorage.getItem(PREFS_CACHE_KEY)
        let cachedUserType: UserType = null
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (parsed.userType && (parsed.userType === 'Disciple' || parsed.userType === 'Steward')) {
              cachedUserType = parsed.userType
              // Set cached value immediately for instant UI update
              if (isMounted) {
                setUserType(cachedUserType)
              }
            }
          } catch (e) {
            // Invalid cache, continue to fetch from Supabase
          }
        }

        // Try to fetch from user_prefs table first
        let fetchedUserType: UserType = null
        const { data: prefsData, error: prefsError } = await supabase
          .from(PREFS_TABLE)
          .select('user_type')
          .eq('user_id', userId)
          .single()

        if (!isMounted) return

        // If user_prefs works, use it
        if (prefsData?.user_type && !prefsError) {
          const role = prefsData.user_type
          if (role === 'Disciple' || role === 'Steward') {
            fetchedUserType = role as UserType
          }
        } else {
          // Fallback: try user_profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', userId)
            .single()

          if (profileData?.role && !profileError) {
            // Map role from user_profiles to UserType
            const role = profileData.role.toLowerCase()
            if (role === 'disciple') {
              fetchedUserType = 'Disciple'
            } else if (role === 'steward') {
              fetchedUserType = 'Steward'
            }
          }
        }

        if (fetchedUserType) {
          setUserType(fetchedUserType)
          // Update local cache
          localStorage.setItem(PREFS_CACHE_KEY, JSON.stringify({ userType: fetchedUserType }))
        } else if (!cachedUserType) {
          // No data in Supabase and no cache, user hasn't completed onboarding
          setUserType(null)
        }

        // Only set isLoading to false after both cache and Supabase have been checked
        setIsLoading(false)
      } catch (error) {
        console.error('Error in loadPrefs:', error)
        if (isMounted) {
          // Ensure userType is never undefined - use null on error
          setUserType(null)
          setIsLoading(false)
        }
      }
    }

    loadPrefs()

    return () => {
      isMounted = false
    }
  }, [user])

  // Memoize the returned values to prevent UI flicker
  return useMemo(() => ({
    userType: userType ?? null, // Ensure never undefined
    isLoading,
  }), [userType, isLoading])
}

// Helper function to save userType (can be called after onboarding)
export async function saveUserType(userId: string, userType: 'Disciple' | 'Steward'): Promise<void> {
  try {
    // Try saving to user_profiles table first (more reliable)
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        role: userType.toLowerCase(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
      })

    if (profileError) {
      console.error('Error saving to user_profiles:', profileError)
      // Try user_prefs as fallback
      const { error: prefsError } = await supabase
        .from(PREFS_TABLE)
        .upsert({
          user_id: userId,
          user_type: userType,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        })

      if (prefsError) {
        console.error('Error saving to user_prefs:', prefsError)
        throw new Error(`Failed to save role: ${profileError.message || prefsError.message}`)
      }
    }

    // Save to local cache for instant hydration
    localStorage.setItem(PREFS_CACHE_KEY, JSON.stringify({ userType }))
  } catch (error: any) {
    console.error('Error in saveUserType:', error)
    throw error
  }
}


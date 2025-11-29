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

    async function loadPrefs() {
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

        // Then fetch from Supabase to get the latest value
        // isLoading stays true until this completes
        const { data, error } = await supabase
          .from(PREFS_TABLE)
          .select('user_type')
          .eq('user_id', user.id)
          .single()

        if (!isMounted) return

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" which is fine for new users
          console.error('Error loading prefs:', error)
        }

        if (data?.user_type) {
          const fetchedUserType = data.user_type as UserType
          setUserType(fetchedUserType)
          
          // Update local cache
          localStorage.setItem(PREFS_CACHE_KEY, JSON.stringify({ userType: fetchedUserType }))
        } else if (!cachedUserType) {
          // No data in Supabase and no cache, user hasn't completed onboarding
          // Ensure userType is never undefined - use null
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
    // Save to Supabase
    const { error } = await supabase
      .from(PREFS_TABLE)
      .upsert({
        user_id: userId,
        user_type: userType,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })

    if (error) {
      console.error('Error saving userType to Supabase:', error)
      throw error
    }

    // Save to local cache for instant hydration
    localStorage.setItem(PREFS_CACHE_KEY, JSON.stringify({ userType }))
  } catch (error) {
    console.error('Error in saveUserType:', error)
    throw error
  }
}


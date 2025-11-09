'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User } from '@/types'

interface UserProfile {
  name: string
  bio: string
  location: string
  denomination: string
  interests: string[]
  avatarUrl?: string
  coverImageUrl?: string
  joinDate: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  setMockUserType: (type: 'individual' | 'leader') => void
  profile: UserProfile | null
  updateProfile: (updates: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const PROFILE_STORAGE_KEY = 'gathered_user_profile'

  const createMockUser = useCallback((type: 'individual' | 'leader'): User => {
    const now = new Date().toISOString()
    const isLeader = type === 'leader'
    return {
      id: isLeader ? 'demo-steward' : 'demo-disciple',
      email: isLeader ? 'steward@gathered.demo' : 'disciple@gathered.demo',
      user_metadata: {
        name: isLeader ? 'Demo Steward' : 'Demo Disciple',
        role: isLeader ? 'Leader' : 'Member',
      },
      created_at: now,
      updated_at: now,
    }
  }, [])

  const createDefaultProfile = useCallback((type: 'individual' | 'leader'): UserProfile => ({
    name: type === 'leader' ? 'Demo Steward' : 'Demo Disciple',
    bio: type === 'leader'
      ? 'Stewarding fellowships and encouraging believers to stay connected.'
      : 'Seeking fellowship, prayer, and growth with my community.',
    location: 'San Francisco, CA',
    denomination: 'Non-denominational',
    interests: type === 'leader'
      ? ['Leadership', 'Community Building', 'Prayer', 'Discipleship']
      : ['Bible Study', 'Prayer', 'Community Service', 'Worship'],
    avatarUrl: undefined,
    coverImageUrl: undefined,
    joinDate: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
  }), [])

  const persistProfile = useCallback((profileData: UserProfile) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData))
    } catch (error) {
      console.error('Failed to persist profile', error)
    }
  }, [])

  const initMockUser = useCallback((preferredType?: 'individual' | 'leader') => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    try {
      const storedUser = localStorage.getItem('gathered_mock_user')
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser)
        setUser(parsedUser)
        const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY)
        if (storedProfile) {
          try {
            const parsedProfile = JSON.parse(storedProfile)
            setProfile(parsedProfile)
          } catch (error) {
            console.error('Failed to parse stored profile', error)
          }
        } else {
          const inferredType = preferredType
            || ((parsedUser.user_metadata?.role === 'Leader' || parsedUser.user_metadata?.role === 'Church Admin') ? 'leader' : 'individual')
          const defaultProfile = createDefaultProfile(inferredType)
          setProfile(defaultProfile)
          persistProfile(defaultProfile)
        }
        setLoading(false)
        return
      }

      const storedType = preferredType || (localStorage.getItem('gathered_user_type') as 'individual' | 'leader' | null) || 'individual'
      localStorage.setItem('gathered_user_type', storedType)
      const mockUser = createMockUser(storedType)
      localStorage.setItem('gathered_mock_user', JSON.stringify(mockUser))
      setUser(mockUser)
      const defaultProfile = createDefaultProfile(storedType)
      setProfile(defaultProfile)
      persistProfile(defaultProfile)
    } catch (error) {
      console.error('Failed to initialize mock user', error)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [PROFILE_STORAGE_KEY, createDefaultProfile, createMockUser, persistProfile])

  useEffect(() => {
    // Initialize auth state (mock mode)
    initMockUser()
  }, [initMockUser])

  const setMockUserType = useCallback((type: 'individual' | 'leader') => {
    if (typeof window === 'undefined') return
    localStorage.setItem('gathered_user_type', type)
    setUser(prev => {
      const baseUser = prev ?? createMockUser(type)
      const updatedUser: User = {
        ...baseUser,
        user_metadata: {
          ...baseUser.user_metadata,
          role: type === 'leader' ? 'Leader' : 'Member',
        },
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('gathered_mock_user', JSON.stringify(updatedUser))
      return updatedUser
    })
    setProfile(prev => {
      if (prev) {
        const nextProfile = {
          ...prev,
          name: prev.name.startsWith('Demo ') ? (type === 'leader' ? 'Demo Steward' : 'Demo Disciple') : prev.name,
        }
        persistProfile(nextProfile)
        return nextProfile
      }
      const defaultProfile = createDefaultProfile(type)
      persistProfile(defaultProfile)
      const newUser = createMockUser(type)
      localStorage.setItem('gathered_mock_user', JSON.stringify(newUser))
      setUser(newUser)
      return defaultProfile
    })
  }, [createMockUser, createDefaultProfile, persistProfile])

  const updateStoredUser = useCallback((updatedUser: User | null) => {
    setUser(updatedUser)
    if (typeof window === 'undefined') return
    if (updatedUser) {
      localStorage.setItem('gathered_mock_user', JSON.stringify(updatedUser))
    } else {
      localStorage.removeItem('gathered_mock_user')
    }
  }, [])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    let nextProfileSnapshot: UserProfile | null = null

    setProfile(prev => {
      const baseProfile = prev ?? createDefaultProfile('individual')
      const nextProfile: UserProfile = {
        ...baseProfile,
        ...updates,
        interests: updates.interests ?? baseProfile.interests,
      }
      persistProfile(nextProfile)
      nextProfileSnapshot = nextProfile
      return nextProfile
    })

    if (nextProfileSnapshot) {
      setUser(prevUser => {
        if (!prevUser) return prevUser
        const updatedUser: User = {
          ...prevUser,
          user_metadata: {
            ...prevUser.user_metadata,
            name: nextProfileSnapshot?.name ?? prevUser.user_metadata?.name,
            denomination: nextProfileSnapshot?.denomination ?? prevUser.user_metadata?.denomination,
            location: nextProfileSnapshot?.location ?? prevUser.user_metadata?.location,
            avatar_url: nextProfileSnapshot?.avatarUrl ?? prevUser.user_metadata?.avatar_url,
          },
          updated_at: new Date().toISOString(),
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('gathered_mock_user', JSON.stringify(updatedUser))
        }
        return updatedUser
      })
    }
  }, [createDefaultProfile, persistProfile])

  const signIn = async (email: string, password: string) => {
    // Mock authentication - replace with real auth logic
    const mockUser: User = {
      id: '1',
      email,
      user_metadata: { name: 'Test User', role: 'Member' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    updateStoredUser(mockUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('gathered_mock_user', JSON.stringify(mockUser))
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Mock registration - replace with real auth logic
    const mockUser: User = {
      id: '1',
      email,
      user_metadata: { name, role: 'Member' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    updateStoredUser(mockUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('gathered_mock_user', JSON.stringify(mockUser))
    }
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gathered_mock_user')
      localStorage.removeItem('gathered_user_type')
      localStorage.removeItem(PROFILE_STORAGE_KEY)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, setMockUserType, profile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}






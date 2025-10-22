'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state
    // In a real app, this would check for existing session
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock authentication - replace with real auth logic
    const mockUser: User = {
      id: '1',
      email,
      user_metadata: { name: 'Test User' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setUser(mockUser)
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Mock registration - replace with real auth logic
    const mockUser: User = {
      id: '1',
      email,
      user_metadata: { name },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setUser(mockUser)
  }

  const signOut = async () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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



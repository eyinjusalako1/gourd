'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Sun, Moon, Heart, Users, BookOpen, Calendar, User, LogOut, MessageCircle, BarChart3 } from 'lucide-react'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Gathered
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/feed" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Feed</span>
            </a>
            <a href="/fellowship" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Users className="w-4 h-4" />
              <span>Fellowship</span>
            </a>
            <a href="/events" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </a>
            <a href="/bible-study" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Bible Study</span>
            </a>
            <a href="/analytics" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </a>
          </div>

          {/* Theme Toggle & Auth */}
          <div className="flex items-center space-x-4">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            )}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{user.user_metadata?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="btn-secondary"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="btn-primary"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

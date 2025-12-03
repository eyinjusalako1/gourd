'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { saveUserType } from '@/hooks/usePrefs'
import { BookOpen, Users, Loader2 } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSelectRole = async (userType: 'Disciple' | 'Steward') => {
    if (!user) {
      setError('You must be logged in to continue')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Await saveUserType before redirecting to prevent race condition
      await saveUserType(user.id, userType)
      
      // Use router.replace instead of router.push to avoid async race
      // and prevent loading the dashboard before userType exists
      router.replace('/dashboard')
    } catch (err: any) {
      console.error('Error saving user type:', err)
      const errorMessage = err?.message || 'Unknown error occurred'
      setError(`Failed to save your selection: ${errorMessage}. Please try again or contact support if the issue persists.`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-navy-900 py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
            Welcome to Gathered
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose your role to get started
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Disciple Option */}
          <button
            onClick={() => handleSelectRole('Disciple')}
            disabled={loading}
            className="group relative bg-white dark:bg-navy-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-gold-500 dark:hover:border-gold-500 transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 dark:text-white">
                Disciple
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Join fellowship groups, participate in Bible studies, and grow in your faith journey.
              </p>
              {loading && (
                <Loader2 className="w-5 h-5 animate-spin text-gold-500" />
              )}
            </div>
          </button>

          {/* Steward Option */}
          <button
            onClick={() => handleSelectRole('Steward')}
            disabled={loading}
            className="group relative bg-white dark:bg-navy-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-gold-500 dark:hover:border-gold-500 transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 dark:text-white">
                Steward
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Lead fellowship groups, create events, and help build the community.
              </p>
              {loading && (
                <Loader2 className="w-5 h-5 animate-spin text-gold-500" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}



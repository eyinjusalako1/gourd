'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

interface FaithFlameProps {
  userId: string
  fellowshipId: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function FaithFlame({ userId, fellowshipId, size = 'md', showText = false }: FaithFlameProps) {
  const [streak, setStreak] = useState(0)
  const [intensity, setIntensity] = useState<'out' | 'ember' | 'glow' | 'burning' | 'on-fire'>('ember')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch faith flame data
    fetchFaithFlame()
  }, [userId, fellowshipId])

  const fetchFaithFlame = async () => {
    try {
      const response = await fetch(`/api/gamification/faith-flame/${userId}/${fellowshipId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch faith flame')
      }
      const data = await response.json()
      setStreak(data.currentStreak || 0)
      setIntensity(data.intensity || 'out')
    } catch (error) {
      console.error('Error fetching faith flame:', error)
      // Fallback to default values
      setStreak(0)
      setIntensity('out')
    } finally {
      setLoading(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6 text-xl'
      case 'md': return 'w-8 h-8 text-2xl'
      case 'lg': return 'w-12 h-12 text-4xl'
      default: return 'w-8 h-8 text-2xl'
    }
  }

  const getIntensityClasses = () => {
    switch (intensity) {
      case 'out':
        return 'opacity-20'
      case 'ember':
        return 'text-yellow-400 opacity-60 animate-pulse'
      case 'glow':
        return 'text-yellow-300 opacity-75 animate-pulse'
      case 'burning':
        return 'text-orange-500 opacity-90 animate-pulse'
      case 'on-fire':
        return 'text-red-500 opacity-100 animate-pulse'
      default:
        return 'text-yellow-400'
    }
  }

  const getFlameIcon = () => {
    switch (intensity) {
      case 'out':
        return '💨' // or ember emoji
      case 'ember':
        return '🕯️'
      case 'glow':
        return '✨'
      case 'burning':
        return '🔥'
      case 'on-fire':
        return '🔥🔥'
      default:
        return '🕯️'
    }
  }

  const getFlameText = () => {
    switch (intensity) {
      case 'out':
        return 'Light your flame'
      case 'ember':
        return `${streak} day streak`
      case 'glow':
        return `${streak} days strong`
      case 'burning':
        return `${streak} days blazing`
      case 'on-fire':
        return `${streak} days on fire!`
      default:
        return 'On fire'
    }
  }

  if (loading) {
    return (
      <div className={`${getSizeClasses()} animate-pulse bg-white/10 rounded-full`}></div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`${getSizeClasses()} ${getIntensityClasses()} relative`}>
        {/* Glow effect for burning/on-fire */}
        {(intensity === 'burning' || intensity === 'on-fire') && (
          <div className="absolute inset-0 animate-ping opacity-30 blur-sm">
            {getFlameIcon()}
          </div>
        )}
        <div className="absolute inset-0 animate-ping opacity-20">
          {getFlameIcon()}
        </div>
        <div className="relative">
          {getFlameIcon()}
        </div>
      </div>
      {showText && (
        <span className="text-white/80 text-sm font-medium">
          {getFlameText()}
        </span>
      )}
    </div>
  )
}


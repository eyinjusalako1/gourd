'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface EmberMeterProps {
  fellowshipId: string
  animate?: boolean
}

export default function EmberMeter({ fellowshipId, animate = true }: EmberMeterProps) {
  const router = useRouter()
  const [level, setLevel] = useState(0)
  const [isOnFire, setIsOnFire] = useState(false)
  const [weeklyMessage, setWeeklyMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmberMeter()
  }, [fellowshipId])

  const fetchEmberMeter = async () => {
    try {
      const response = await fetch(`/api/gamification/unity-points/${fellowshipId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch unity points')
      }
      const data = await response.json()
      setLevel(data.emberMeterLevel || 0)
      setIsOnFire(data.isOnFire || false)
      setWeeklyMessage(data.weeklyMessage || null)
    } catch (error) {
      console.error('Error fetching ember meter:', error)
      // Fallback to default values
      setLevel(0)
      setIsOnFire(false)
      setWeeklyMessage(null)
    } finally {
      setLoading(false)
    }
  }

  // Calculate progress for circular meter
  const circumference = 2 * Math.PI * 40 // radius = 40
  const progress = (level / 100) * circumference
  const offset = circumference - progress

  const getMeterColor = () => {
    if (level >= 80) return '#FF6B35' // Bright orange-red when on fire
    if (level >= 60) return '#FF8C00' // Orange
    if (level >= 40) return '#FFD700' // Gold
    return '#D4AF37' // Deep gold
  }

  if (loading) {
    return (
      <div className="w-24 h-24 animate-pulse bg-white/10 rounded-full"></div>
    )
  }

  return (
    <div className="relative w-28 h-28">
      {/* Circular Progress Ring */}
      <svg className="transform -rotate-90" width="112" height="112">
        {/* Background Ring */}
        <circle
          cx="56"
          cy="56"
          r="40"
          stroke="rgba(212, 175, 55, 0.2)"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress Ring */}
        <circle
          cx="56"
          cy="56"
          r="40"
          stroke={getMeterColor()}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={animate && level > 0 ? 'transition-all duration-1000 ease-out' : ''}
        />
        {/* Glow effect when on fire */}
        {isOnFire && (
          <circle
            cx="56"
            cy="56"
            r="40"
            stroke={getMeterColor()}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            opacity="0.3"
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-3xl ${isOnFire ? 'animate-bounce' : ''}`}>
          🔥
        </div>
        <div className="text-[#F5C451] font-bold text-sm mt-1">
          {level}%
        </div>
      </div>

      {/* On Fire Badge */}
      {isOnFire && weeklyMessage && (
        <div className="absolute -top-2 right-0 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
          ON FIRE
        </div>
      )}
    </div>
  )
}

// Full card version with message
export function EmberMeterCard({ fellowshipId }: { fellowshipId: string }) {
  const [level, setLevel] = useState(0)
  const [isOnFire, setIsOnFire] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMeter()
  }, [fellowshipId])

  const fetchMeter = async () => {
    try {
      const response = await fetch(`/api/gamification/unity-points/${fellowshipId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch unity points')
      }
      const data = await response.json()
      setLevel(data.emberMeterLevel || 0)
      setIsOnFire(data.isOnFire || false)
      setMessage(data.weeklyMessage || null)
    } catch (error) {
      console.error('Error fetching ember meter:', error)
      setLevel(0)
      setIsOnFire(false)
      setMessage(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 animate-pulse">
        <div className="h-32"></div>
      </div>
    )
  }

  return (
    <div className={`bg-white/5 border rounded-2xl p-6 relative overflow-hidden ${
      isOnFire ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-[#D4AF37]'
    }`}>
      {/* Animated glow when on fire */}
      {isOnFire && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 animate-pulse pointer-events-none"></div>
      )}
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">Unity Points</h3>
          <p className="text-white/60 text-sm mb-3">Fellowship Engagement</p>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-white/5 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  level >= 80 ? 'bg-gradient-to-r from-red-600 to-orange-500' 
                  : level >= 60 ? 'bg-orange-500'
                  : level >= 40 ? 'bg-yellow-500'
                  : 'bg-[#D4AF37]'
                }`}
                style={{ width: `${level}%` }}
              ></div>
            </div>
            <span className="text-[#F5C451] font-bold">{level}%</span>
          </div>
          {message && (
            <p className="text-white/80 text-sm mt-3 animate-fade-in">
              {message}
            </p>
          )}
        </div>
        <div className={`text-5xl ${isOnFire ? 'animate-bounce' : ''}`}>
          🔥
        </div>
      </div>
    </div>
  )
}


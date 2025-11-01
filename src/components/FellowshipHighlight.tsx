'use client'

import React, { useState, useEffect } from 'react'
import { Award, TrendingUp, Crown } from 'lucide-react'

interface Highlight {
  id: string
  type: 'on_fire' | 'streak_milestone' | 'unity_champion' | 'growth_surge'
  title: string
  message: string
  icon: string
  pointsOrStreak?: number
}

interface FellowshipHighlightProps {
  fellowshipId: string
}

export default function FellowshipHighlight({ fellowshipId }: FellowshipHighlightProps) {
  const [highlight, setHighlight] = useState<Highlight | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHighlight()
  }, [fellowshipId])

  const fetchHighlight = async () => {
    try {
      // Mock data - replace with actual API call
      const mockHighlight: Highlight = {
        id: '1',
        type: 'on_fire',
        title: 'This fellowship is on fire! 🔥',
        message: 'Your fellowship stayed on fire this week with 127 Unity Points',
        icon: '🔥',
        pointsOrStreak: 85
      }
      setHighlight(mockHighlight)
    } catch (error) {
      console.error('Error fetching highlight:', error)
    } finally {
      setLoading(false)
    }
  }

  const getHighlightStyles = (type: string) => {
    switch (type) {
      case 'on_fire':
        return {
          gradient: 'from-orange-500 via-red-500 to-orange-500',
          glow: 'shadow-orange-500/30',
          icon: '🔥'
        }
      case 'streak_milestone':
        return {
          gradient: 'from-yellow-500 via-amber-500 to-yellow-500',
          glow: 'shadow-yellow-500/30',
          icon: '🔥🔥'
        }
      case 'unity_champion':
        return {
          gradient: 'from-purple-500 via-pink-500 to-purple-500',
          glow: 'shadow-purple-500/30',
          icon: '👑'
        }
      case 'growth_surge':
        return {
          gradient: 'from-green-500 via-emerald-500 to-green-500',
          glow: 'shadow-green-500/30',
          icon: '📈'
        }
      default:
        return {
          gradient: 'from-[#D4AF37] to-[#F5C451]',
          glow: 'shadow-[#F5C451]/30',
          icon: '✨'
        }
    }
  }

  if (loading) {
    return null
  }

  if (!highlight) {
    return null
  }

  const styles = getHighlightStyles(highlight.type)

  return (
    <div className={`bg-gradient-to-r ${styles.gradient} rounded-2xl p-6 shadow-lg ${styles.glow} animate-glow`}>
      <div className="text-[#0F1433]">
        {/* Icon & Title */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="text-4xl animate-bounce-slow">
            {styles.icon}
          </div>
          <h3 className="text-xl font-bold">
            {highlight.title}
          </h3>
        </div>

        {/* Message */}
        <p className="text-[#0F1433]/90 mb-4 leading-relaxed">
          {highlight.message}
        </p>

        {/* Stats */}
        {highlight.pointsOrStreak !== undefined && (
          <div className="flex items-center space-x-4 text-sm font-medium">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{highlight.pointsOrStreak}% engagement</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>Milestone reached!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


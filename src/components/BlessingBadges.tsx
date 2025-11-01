'use client'

import React, { useState, useEffect } from 'react'
import { Star, Award } from 'lucide-react'

interface Badge {
  id: string
  code: string
  name: string
  description: string
  icon: string
  category: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  glowColor?: string
  earnedAt?: string
  isFeatured?: boolean
}

interface BlessingBadgesProps {
  userId: string
  fellowshipId?: string
  compact?: boolean
}

export default function BlessingBadges({ userId, fellowshipId, compact = false }: BlessingBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBadges()
  }, [userId, fellowshipId])

  const fetchBadges = async () => {
    try {
      // Mock data - replace with actual API call
      const mockBadges: Badge[] = [
        {
          id: '1',
          code: 'first_flame',
          name: 'First Flame',
          description: 'Light your first Faith Flame',
          icon: '🕯️',
          category: 'spiritual',
          rarity: 'common',
          glowColor: '#F5C451',
          earnedAt: '2025-10-15',
          isFeatured: false
        },
        {
          id: '2',
          code: 'week_warrior',
          name: 'Week Warrior',
          description: 'Keep your flame burning for 7 days',
          icon: '🔥',
          category: 'consistency',
          rarity: 'uncommon',
          glowColor: '#FF6B35',
          earnedAt: '2025-10-20',
          isFeatured: true
        },
        {
          id: '3',
          code: 'encourager',
          name: 'Encourager',
          description: 'Leave 10 encouraging comments',
          icon: '💝',
          category: 'community',
          rarity: 'common',
          glowColor: '#FFD700',
          earnedAt: '2025-10-25',
          isFeatured: false
        }
      ]
      setBadges(mockBadges)
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-white/30 bg-white/5'
      case 'uncommon':
        return 'border-green-400/50 bg-green-400/10'
      case 'rare':
        return 'border-blue-400/50 bg-blue-400/10'
      case 'epic':
        return 'border-purple-400/50 bg-purple-400/10'
      case 'legendary':
        return 'border-yellow-400/50 bg-yellow-400/10'
      default:
        return 'border-white/30'
    }
  }

  const getRarityGlow = (rarity: string, glowColor?: string) => {
    if (!glowColor) return ''
    switch (rarity) {
      case 'rare':
      case 'epic':
      case 'legendary':
        return `shadow-[0_0_20px_${glowColor}]`
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 animate-pulse">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-square bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (badges.length === 0) {
    return (
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 text-center">
          <Award className="w-12 h-12 text-white/40 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No badges yet</h3>
          <p className="text-white/60 text-sm">
            Start engaging with your fellowship to earn badges!
          </p>
        </div>
      </div>
    )
  }

  // Compact view for profile/cards
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {badges.slice(0, 5).map(badge => (
          <div
            key={badge.id}
            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl bg-white/5 ${getRarityColor(badge.rarity)} ${getRarityGlow(badge.rarity, badge.glowColor)}`}
            title={badge.name}
          >
            {badge.icon}
          </div>
        ))}
        {badges.length > 5 && (
          <div className="w-10 h-10 rounded-lg border-2 border-[#D4AF37]/30 bg-white/5 flex items-center justify-center text-white/60 font-bold text-sm">
            +{badges.length - 5}
          </div>
        )}
      </div>
    )
  }

  // Full view
  return (
    <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Blessing Badges</h3>
          <div className="flex items-center space-x-1 text-[#F5C451]">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">{badges.length} earned</span>
          </div>
        </div>

        {/* Featured Badges */}
        {badges.filter(b => b.isFeatured).length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-white/80 mb-3">Recently Earned</h4>
            <div className="grid grid-cols-3 gap-3">
              {badges.filter(b => b.isFeatured).map(badge => (
                <div
                  key={badge.id}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-white/5 to-white/0 ${getRarityColor(badge.rarity)} ${getRarityGlow(badge.rarity, badge.glowColor)}`}
                >
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <div className="text-xs text-white font-medium text-center px-1">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Badges Grid */}
        <div className="grid grid-cols-4 gap-3">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center text-2xl bg-white/5 ${getRarityColor(badge.rarity)} ${getRarityGlow(badge.rarity, badge.glowColor)} hover:scale-110 transition-transform cursor-pointer`}
              title={`${badge.name}: ${badge.description}`}
            >
              {badge.icon}
            </div>
          ))}
        </div>

        {badges.length > 12 && (
          <button className="w-full mt-4 text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors">
            View All Badges ({badges.length})
          </button>
        )}
      </div>
    </div>
  )
}


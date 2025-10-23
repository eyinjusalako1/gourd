'use client'

import { useState } from 'react'
import { Calendar, Users, Heart, Award, TrendingUp, ChevronRight } from 'lucide-react'

interface UserStats {
  eventsAttended: number
  groupsJoined: number
  contributions: number
  faithStreak: number
  badgesEarned: number
  prayersShared: number
  testimoniesShared: number
}

const sampleStats: UserStats = {
  eventsAttended: 12,
  groupsJoined: 4,
  contributions: 150,
  faithStreak: 28,
  badgesEarned: 8,
  prayersShared: 15,
  testimoniesShared: 3
}

const badges = [
  { name: 'First Steps', description: 'Joined your first group', icon: '👶', earned: true },
  { name: 'Prayer Warrior', description: 'Shared 10 prayers', icon: '🙏', earned: true },
  { name: 'Community Builder', description: 'Attended 10 events', icon: '🏗️', earned: true },
  { name: 'Testimony Bearer', description: 'Shared your testimony', icon: '📖', earned: true },
  { name: 'Faithful Servant', description: '30-day faith streak', icon: '⭐', earned: true },
  { name: 'Bible Scholar', description: 'Complete 5 Bible studies', icon: '📚', earned: false },
  { name: 'Outreach Champion', description: 'Participate in 3 outreach events', icon: '🤝', earned: false },
  { name: 'Encourager', description: 'Encourage 20 people', icon: '💪', earned: false }
]

export default function StatsPanel() {
  const [stats] = useState<UserStats>(sampleStats)
  const [showAllBadges, setShowAllBadges] = useState(false)

  const earnedBadges = badges.filter(badge => badge.earned)
  const displayedBadges = showAllBadges ? badges : earnedBadges.slice(0, 4)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-navy-900 dark:text-white">
          Your Growth Journey
        </h2>
        <button className="text-sm text-gold-600 dark:text-gold-400 hover:text-gold-500 font-medium">
          View Full Stats
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 p-2">
        <div className="bg-[#0F1433] text-white border border-[#D4AF37]/50 rounded-xl py-4 text-center hover:shadow-lg transition-all duration-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-[#F5C451]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.eventsAttended}
            </h3>
            <p className="text-sm text-white/80">
              Events Attended
            </p>
          </div>
        </div>

        <div className="bg-[#0F1433] text-white border border-[#D4AF37]/50 rounded-xl py-4 text-center hover:shadow-lg transition-all duration-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-[#F5C451]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.groupsJoined}
            </h3>
            <p className="text-sm text-white/80">
              Groups Joined
            </p>
          </div>
        </div>

        <div className="bg-[#0F1433] text-white border border-[#D4AF37]/50 rounded-xl py-4 text-center hover:shadow-lg transition-all duration-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5C451]/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 text-[#F5C451]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatCurrency(stats.contributions)}
            </h3>
            <p className="text-sm text-white/80">
              Contributions
            </p>
          </div>
        </div>

        <div className="bg-[#0F1433] text-white border border-[#D4AF37]/50 rounded-xl py-4 text-center hover:shadow-lg transition-all duration-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-[#F5C451]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.faithStreak}
            </h3>
            <p className="text-sm text-white/80">
              Day Faith Streak
            </p>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-navy-900 dark:text-white mb-3">
          Community Impact
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-navy-900 dark:text-white">
              {stats.prayersShared}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Prayers Shared
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-navy-900 dark:text-white">
              {stats.testimoniesShared}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Testimonies Shared
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-navy-900 dark:text-white">
            Faith Badges ({earnedBadges.length}/{badges.length})
          </h3>
          {earnedBadges.length > 4 && (
            <button
              onClick={() => setShowAllBadges(!showAllBadges)}
              className="text-sm text-gold-600 dark:text-gold-400 hover:text-gold-500 font-medium flex items-center space-x-1"
            >
              <span>{showAllBadges ? 'Show Less' : 'Show All'}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showAllBadges ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {displayedBadges.map((badge, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-all ${
                badge.earned
                  ? 'border-gold-200 bg-gold-50 dark:border-gold-700 dark:bg-gold-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 opacity-60'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className={`text-sm font-medium ${
                  badge.earned 
                    ? 'text-navy-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {badge.name}
                </div>
                <div className={`text-xs ${
                  badge.earned 
                    ? 'text-gray-600 dark:text-gray-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {badge.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{earnedBadges.length}/{badges.length}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


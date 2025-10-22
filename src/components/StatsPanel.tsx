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
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
            {stats.eventsAttended}
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Events Attended
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">
            {stats.groupsJoined}
          </h3>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Groups Joined
          </p>
        </div>

        <div className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900 dark:to-gold-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gold-900 dark:text-gold-100">
            {formatCurrency(stats.contributions)}
          </h3>
          <p className="text-sm text-gold-700 dark:text-gold-300">
            Contributions
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
            {stats.faithStreak}
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            Day Faith Streak
          </p>
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


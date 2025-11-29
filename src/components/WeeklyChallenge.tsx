'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Target, CheckCircle, ChevronRight } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  icon: string
  progress: number
  threshold: number
  isCompleted: boolean
  badgeReward?: string
}

interface WeeklyChallengeProps {
  fellowshipId: string
  stewardView?: boolean
}

export default function WeeklyChallenge({ fellowshipId, stewardView = false }: WeeklyChallengeProps) {
  const router = useRouter()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChallenges()
  }, [fellowshipId])

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`/api/gamification/challenges/${fellowshipId}/active`)
      if (!response.ok) {
        throw new Error('Failed to fetch challenges')
      }
      const data: Challenge[] = await response.json()
      setChallenges(data)
    } catch (error) {
      console.error('Error fetching challenges:', error)
      setChallenges([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-20 bg-white/5 rounded-xl"></div>
          <div className="h-20 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (challenges.length === 0) {
    return (
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 text-center">
          <Target className="w-12 h-12 text-white/40 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No Active Challenges</h3>
          <p className="text-white/60 text-sm">
            {stewardView 
              ? 'Create a weekly challenge for your fellowship'
              : 'Check back soon for this week\'s challenges'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Weekly Challenges</h3>
          {stewardView && (
            <button
              onClick={() => router.push(`/fellowships/${fellowshipId}/manage/challenges`)}
              className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {challenges.map(challenge => (
            <div
              key={challenge.id}
              className={`bg-white/5 rounded-xl p-4 border transition-colors ${
                challenge.isCompleted 
                  ? 'border-green-500/50 bg-green-500/5' 
                  : 'border-[#D4AF37]/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#F5C451] rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
                  {challenge.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {challenge.isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    )}
                    <h4 className="font-semibold text-white">{challenge.title}</h4>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{challenge.description}</p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60">
                        {challenge.progress}/{challenge.threshold}
                      </span>
                      <span className="text-[#F5C451] font-medium">
                        {challenge.threshold === 1 ? 'Any' : challenge.threshold} this week
                      </span>
                    </div>
                    <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          challenge.isCompleted 
                            ? 'bg-green-500' 
                            : 'bg-gradient-to-r from-[#D4AF37] to-[#F5C451]'
                        }`}
                        style={{ width: `${Math.min(100, (challenge.progress / challenge.threshold) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Message */}
              {challenge.isCompleted && (
                <div className="mt-3 pt-3 border-t border-green-500/30 flex items-center space-x-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Challenge complete! {challenge.badgeReward && '🏅 Badge earned!'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


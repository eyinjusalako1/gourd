'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Calendar, TrendingUp, CheckCircle, Clock, Star, ArrowLeft, Plus } from 'lucide-react'
import Logo from '@/components/Logo'

interface Reading {
  id: string
  title: string
  verse: string
  content: string
  date: string
  isCompleted: boolean
  plan?: string
}

interface Plan {
  id: string
  name: string
  duration: string
  description: string
  progress: number
  isActive: boolean
}

const mockReadings: Reading[] = [
  {
    id: '1',
    title: 'Today&apos;s Reading',
    verse: 'Psalm 23:1-6',
    content: 'The LORD is my shepherd; I shall not want. He makes me lie down in green pastures...',
    date: new Date().toISOString().split('T')[0],
    isCompleted: false
  },
  {
    id: '2',
    title: 'Yesterday&apos;s Reading',
    verse: 'John 3:16-21',
    content: 'For God so loved the world that he gave his one and only Son...',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    isCompleted: true
  }
]

const mockPlans: Plan[] = [
  {
    id: '1',
    name: '30 Days in the Gospels',
    duration: '30 days',
    description: 'A journey through the life and teachings of Jesus',
    progress: 5,
    isActive: true
  },
  {
    id: '2',
    name: 'The Psalms',
    duration: '60 days',
    description: 'Every day in the Psalms for two months',
    progress: 0,
    isActive: false
  },
  {
    id: '3',
    name: 'Read the Bible in a Year',
    duration: '365 days',
    description: 'Complete Bible reading plan',
    progress: 0,
    isActive: false
  }
]

export default function DevotionsPage() {
  const router = useRouter()
  const [todayReading, setTodayReading] = useState<Reading>(mockReadings[0])
  const [activePlans, setActivePlans] = useState<Plan[]>(mockPlans.filter(p => p.isActive))
  const [streak, setStreak] = useState(5)
  const [totalReadings, setTotalReadings] = useState(127)

  const handleMarkComplete = (id: string) => {
    if (todayReading.id === id && !todayReading.isCompleted) {
      setTodayReading({ ...todayReading, isCompleted: true })
      setStreak(prev => prev + 1)
      setTotalReadings(prev => prev + 1)
    }
  }

  const handleStartPlan = (planId: string) => {
    const plan = mockPlans.find(p => p.id === planId)
    if (plan) {
      setActivePlans(prev => [...prev, { ...plan, isActive: true, progress: 0 }])
      router.push(`/devotions/plans/${planId}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      {/* Header */}
      <div className="bg-[#0F1433] shadow-sm border-b border-[#D4AF37]/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 text-white/60 hover:text-white transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <Logo size="md" showText={false} />
              <div>
                <h1 className="text-xl font-bold text-white">Devotions</h1>
                <p className="text-sm text-white/60">Daily Bible readings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push('/devotions/create')}
                className="bg-[#F5C451] text-[#0F1433] p-2 rounded-lg hover:bg-[#D4AF37] transition-colors"
                title="Create Devotional"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#F5C451] rounded-xl p-4 text-[#0F1433] text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs opacity-80">Day Streak</div>
          </div>
          <div className="bg-white/5 border border-[#D4AF37] rounded-xl p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <CheckCircle className="w-6 h-6 text-[#F5C451] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#F5C451]">{totalReadings}</div>
              <div className="text-xs text-white/80">Total Readings</div>
            </div>
          </div>
          <div className="bg-white/5 border border-[#D4AF37] rounded-xl p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <Star className="w-6 h-6 text-[#F5C451] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#F5C451]">{activePlans.length}</div>
              <div className="text-xs text-white/80">Active Plans</div>
            </div>
          </div>
        </div>

        {/* Today's Reading */}
        <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-2xl p-6 text-[#0F1433] relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#0F1433] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#F5C451]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Today&apos;s Reading</h2>
                  <p className="text-sm opacity-80">{todayReading.verse}</p>
                </div>
              </div>
              {todayReading.isCompleted ? (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Completed ✓
                </div>
              ) : (
                <div className="bg-[#0F1433] text-[#F5C451] px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Pending</span>
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{todayReading.title}</h3>
            <p className="text-sm leading-relaxed mb-4 opacity-90 line-clamp-3">{todayReading.content}</p>
            <div className="flex items-center space-x-2">
              <button className="bg-[#0F1433] text-[#F5C451] px-4 py-2 rounded-lg font-semibold hover:bg-[#0F1433]/90 transition-colors">
                Read Full Passage
              </button>
              {!todayReading.isCompleted && (
                <button
                  onClick={() => handleMarkComplete(todayReading.id)}
                  className="bg-[#0F1433]/80 text-[#F5C451] px-4 py-2 rounded-lg font-semibold hover:bg-[#0F1433] transition-colors border-2 border-[#0F1433]"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Plans */}
        {activePlans.length > 0 && (
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Active Plans</h3>
                <button
                  onClick={() => router.push('/devotions/plans')}
                  className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {activePlans.map(plan => (
                  <div key={plan.id} className="bg-white/10 rounded-xl p-4 border border-[#D4AF37]/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{plan.name}</h4>
                      <span className="text-xs text-white/60">{plan.progress}%</span>
                    </div>
                    <p className="text-sm text-white/80 mb-3">{plan.description}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] h-full transition-all duration-300"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-white/60">{plan.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All Reading Plans */}
        <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Reading Plans</h3>
              <button
                onClick={() => router.push('/devotions/plans')}
                  className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors"
              >
                Browse All
              </button>
            </div>
            <div className="space-y-3">
              {mockPlans.filter(p => !p.isActive).slice(0, 2).map(plan => (
                <button
                  key={plan.id}
                  onClick={() => handleStartPlan(plan.id)}
                  className="w-full bg-white/10 rounded-xl p-4 border border-[#D4AF37]/30 text-left hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{plan.name}</h4>
                    <span className="text-xs text-[#F5C451]">{plan.duration}</span>
                  </div>
                  <p className="text-sm text-white/80">{plan.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


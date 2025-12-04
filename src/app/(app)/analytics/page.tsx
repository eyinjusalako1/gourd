'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { AnalyticsService } from '@/lib/analytics-service'
import { UserAnalytics, CommunityAnalytics, SpiritualGrowthMetrics } from '@/lib/analytics-service'
import { 
  BarChart3, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Calendar,
  BookOpen,
  TrendingUp,
  Target,
  Award,
  Activity,
  PieChart,
  LineChart,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null)
  const [communityAnalytics, setCommunityAnalytics] = useState<CommunityAnalytics | null>(null)
  const [spiritualGrowth, setSpiritualGrowth] = useState<SpiritualGrowthMetrics | null>(null)

  useEffect(() => {
    if (user) {
      loadAnalytics()
    }
  }, [user])

  const loadAnalytics = async () => {
    try {
      const data = await AnalyticsService.getDashboardData(user!.id)
      setUserAnalytics(data.userAnalytics)
      setCommunityAnalytics(data.communityAnalytics)
      setSpiritualGrowth(data.spiritualGrowth)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Track your spiritual growth and community engagement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Spiritual Growth Overview */}
        {spiritualGrowth && (
          <div className="mb-8">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Spiritual Growth</h2>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600 capitalize">
                    {spiritualGrowth.growthTrend}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Prayer</h3>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {spiritualGrowth.prayerFrequency}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Prayer Requests</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-8 h-8 text-gold-600 dark:text-gold-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scripture</h3>
                  <p className="text-3xl font-bold text-gold-600 dark:text-gold-400">
                    {spiritualGrowth.scriptureReadingFrequency}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Scripture Shares</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fellowship</h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {spiritualGrowth.fellowshipParticipation}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Groups Joined</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service</h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {spiritualGrowth.serviceParticipation}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Service Events</p>
                </div>
              </div>

              {/* Overall Growth Score */}
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Overall Growth Score</h3>
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {spiritualGrowth.overallGrowthScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${spiritualGrowth.overallGrowthScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Milestones */}
              {spiritualGrowth.milestones.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {spiritualGrowth.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-2 px-3 py-1 bg-gold-100 dark:bg-gold-900 text-gold-700 dark:text-gold-300 rounded-full">
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-medium">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {spiritualGrowth.recommendations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Growth Recommendations</h3>
                  <div className="space-y-2">
                    {spiritualGrowth.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Analytics */}
        {userAnalytics && (
          <div className="mb-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Activity</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Posts</h3>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {userAnalytics.totalPosts}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Likes</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {userAnalytics.totalLikes}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Groups</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {userAnalytics.fellowshipGroupsJoined}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Events</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {userAnalytics.eventsAttended}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Community Engagement</h3>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-primary-600" />
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {userAnalytics.communityEngagementScore}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Score</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account Age</h3>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gold-600" />
                    <span className="text-2xl font-bold text-gold-600 dark:text-gold-400">
                      {userAnalytics.accountAge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Community Analytics */}
        {communityAnalytics && (
          <div className="mb-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Community Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Users</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {communityAnalytics.totalUsers}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Users</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {communityAnalytics.activeUsers}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Posts</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {communityAnalytics.totalPosts}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-gold-600 dark:text-gold-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Engagement Rate</h3>
                  <p className="text-2xl font-bold text-gold-600 dark:text-gold-400">
                    {Math.round(communityAnalytics.averageEngagementRate)}
                  </p>
                </div>
              </div>

              {/* Growth Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Growth This Week</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">New Users</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        +{communityAnalytics.growthMetrics.newUsersThisWeek}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">New Posts</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        +{communityAnalytics.growthMetrics.postsThisWeek}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Growth This Month</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">New Users</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        +{communityAnalytics.growthMetrics.newUsersThisMonth}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">New Posts</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        +{communityAnalytics.growthMetrics.postsThisMonth}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Content Types */}
              {communityAnalytics.topPostTypes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Content Types</h3>
                  <div className="space-y-2">
                    {communityAnalytics.topPostTypes.map((type, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="capitalize text-gray-900 dark:text-white">
                          {type.type.replace('_', ' ')}
                        </span>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                          {type.count} posts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}











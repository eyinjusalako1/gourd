'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ModerationService } from '@/lib/moderation-service'
import { ContentFlag } from '@/lib/moderation-service'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2,
  Flag,
  Clock,
  User,
  MessageCircle,
  Users,
  Calendar,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react'

export default function ModerationPage() {
  const { user } = useAuth()
  const [flags, setFlags] = useState<ContentFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFlags: 0,
    pendingFlags: 0,
    resolvedFlags: 0,
    criticalFlags: 0
  })
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all')
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')

  useEffect(() => {
    loadModerationData()
  }, [])

  const loadModerationData = async () => {
    try {
      const [flagsData, statsData] = await Promise.all([
        ModerationService.getPendingFlags(),
        ModerationService.getModerationStats()
      ])
      
      setFlags(flagsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading moderation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewFlag = async (flagId: string, action: 'approve' | 'reject' | 'remove_content') => {
    try {
      await ModerationService.reviewFlag(flagId, action, user!.id)
      // Reload data
      await loadModerationData()
    } catch (error) {
      console.error('Error reviewing flag:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getFlagTypeIcon = (type: string) => {
    switch (type) {
      case 'inappropriate':
        return <AlertTriangle className="w-4 h-4" />
      case 'spam':
        return <MessageCircle className="w-4 h-4" />
      case 'offensive':
        return <XCircle className="w-4 h-4" />
      case 'false_doctrine':
        return <Shield className="w-4 h-4" />
      default:
        return <Flag className="w-4 h-4" />
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <MessageCircle className="w-4 h-4" />
      case 'comment':
        return <MessageCircle className="w-4 h-4" />
      case 'group':
        return <Users className="w-4 h-4" />
      case 'event':
        return <Calendar className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const filteredFlags = flags.filter(flag => {
    const statusMatch = filterStatus === 'all' || flag.status === filterStatus
    const severityMatch = filterSeverity === 'all' || flag.severity === filterSeverity
    return statusMatch && severityMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading moderation dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Moderation</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Review and manage reported content to maintain community safety
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Flags</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFlags}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingFlags}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolvedFlags}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.criticalFlags}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
            </div>
            
            <select
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>

            <select
              className="input-field"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Flags List */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Content Flags ({filteredFlags.length})
          </h2>

          {filteredFlags.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No flags found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filterStatus === 'all' ? 'No content has been flagged yet.' : `No ${filterStatus} flags found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFlags.map((flag) => (
                <div key={flag.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getContentTypeIcon(flag.content_type)}
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {flag.content_type}
                        </span>
                      </div>
                      
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getSeverityColor(flag.severity)}`}>
                        {getFlagTypeIcon(flag.flag_type)}
                        <span className="capitalize">{flag.flag_type.replace('_', ' ')}</span>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        flag.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        flag.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {flag.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(flag.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason:</h3>
                    <p className="text-gray-900 dark:text-white">{flag.reason}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reported by:</h3>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {(flag as any).reporter?.user_metadata?.name || 'Unknown User'}
                      </span>
                    </div>
                  </div>

                  {flag.status === 'pending' && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleReviewFlag(flag.id, 'approve')}
                        className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      
                      <button
                        onClick={() => handleReviewFlag(flag.id, 'reject')}
                        className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      
                      <button
                        onClick={() => handleReviewFlag(flag.id, 'remove_content')}
                        className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove Content</span>
                      </button>
                    </div>
                  )}

                  {flag.status !== 'pending' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Reviewed by: {(flag as any).reviewed_by || 'System'} • 
                      {flag.reviewed_at && ` ${new Date(flag.reviewed_at).toLocaleDateString()}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}













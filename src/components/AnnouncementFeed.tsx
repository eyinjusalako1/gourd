'use client'

import { useState } from 'react'
import { Bell, Pin, Share2, Heart, MessageCircle, MoreVertical, User } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  author: string
  authorRole: string
  timestamp: string
  isPinned: boolean
  likes: number
  comments: number
  isLiked: boolean
  groupName?: string
  type: 'announcement' | 'prayer' | 'testimony' | 'event'
}

const sampleAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Sunday Service Update',
    content: 'This Sunday we\'ll be having a special guest speaker from our sister church. Please arrive 15 minutes early for fellowship time.',
    author: 'Pastor Johnson',
    authorRole: 'Pastor',
    timestamp: '2 hours ago',
    isPinned: true,
    likes: 12,
    comments: 3,
    isLiked: false,
    groupName: 'Grace Community Church',
    type: 'announcement'
  },
  {
    id: '2',
    title: 'Prayer Request',
    content: 'Please keep the Smith family in your prayers as they navigate through this difficult time. They need our support and encouragement.',
    author: 'Sarah Williams',
    authorRole: 'Member',
    timestamp: '4 hours ago',
    isPinned: false,
    likes: 8,
    comments: 5,
    isLiked: true,
    groupName: 'Prayer Warriors',
    type: 'prayer'
  },
  {
    id: '3',
    title: 'Testimony: God\'s Faithfulness',
    content: 'I wanted to share how God has been working in my life this past month. Despite the challenges, His grace has been sufficient.',
    author: 'Michael Chen',
    authorRole: 'Member',
    timestamp: '1 day ago',
    isPinned: false,
    likes: 15,
    comments: 7,
    isLiked: false,
    groupName: 'Young Adults Bible Study',
    type: 'testimony'
  },
  {
    id: '4',
    title: 'Community Outreach Event',
    content: 'Join us this Saturday for our monthly community service day. We\'ll be helping at the local food bank and visiting nursing homes.',
    author: 'Jennifer Davis',
    authorRole: 'Leader',
    timestamp: '2 days ago',
    isPinned: false,
    likes: 6,
    comments: 2,
    isLiked: false,
    groupName: 'Community Outreach',
    type: 'event'
  }
]

const typeColors = {
  announcement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  prayer: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  testimony: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  event: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
}

export default function AnnouncementFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements)

  const handleLike = (announcementId: string) => {
    setAnnouncements(announcements.map(announcement => {
      if (announcement.id === announcementId) {
        return {
          ...announcement,
          isLiked: !announcement.isLiked,
          likes: announcement.isLiked ? announcement.likes - 1 : announcement.likes + 1
        }
      }
      return announcement
    }))
  }

  const handleShare = (announcementId: string) => {
    const announcement = announcements.find(a => a.id === announcementId)
    if (announcement) {
      navigator.clipboard.writeText(`${announcement.title}\n\n${announcement.content}`)
      // Show toast notification
      console.log('Announcement shared to clipboard')
    }
  }

  const handlePin = (announcementId: string) => {
    setAnnouncements(announcements.map(announcement => {
      if (announcement.id === announcementId) {
        return {
          ...announcement,
          isPinned: !announcement.isPinned
        }
      }
      return announcement
    }))
  }

  const formatTimestamp = (timestamp: string) => {
    return timestamp
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-navy-900 dark:text-white">
          Announcements & News
        </h2>
        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements
          .sort((a, b) => {
            // Pinned announcements first, then by timestamp
            if (a.isPinned && !b.isPinned) return -1
            if (!a.isPinned && b.isPinned) return 1
            return 0
          })
          .map(announcement => (
          <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-navy-900 dark:text-white">
                      {announcement.author}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {announcement.authorRole}
                    </span>
                    {announcement.isPinned && (
                      <Pin className="w-3 h-3 text-gold-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{announcement.groupName}</span>
                    <span>•</span>
                    <span>{formatTimestamp(announcement.timestamp)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[announcement.type]}`}>
                      {announcement.type}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-4">
              <h4 className="font-medium text-navy-900 dark:text-white mb-2">
                {announcement.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {announcement.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(announcement.id)}
                  className={`flex items-center space-x-1 text-sm transition-colors ${
                    announcement.isLiked 
                      ? 'text-gold-600 dark:text-gold-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${announcement.isLiked ? 'fill-current' : ''}`} />
                  <span>{announcement.likes}</span>
                </button>
                
                <button className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MessageCircle className="w-4 h-4" />
                  <span>{announcement.comments}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePin(announcement.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    announcement.isPinned
                      ? 'bg-gold-100 dark:bg-gold-900 text-gold-600 dark:text-gold-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Pin className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleShare(announcement.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {announcements.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="mb-2">No announcements yet</p>
          <p className="text-sm">Check back later for updates from your groups</p>
        </div>
      )}
    </div>
  )
}

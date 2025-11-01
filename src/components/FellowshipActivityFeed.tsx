'use client'

import React, { useState } from 'react'
import { Heart, MessageCircle, Calendar, Users, MoreHorizontal, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ActivityItem {
  id: string
  type: 'event' | 'prayer' | 'testimony' | 'announcement'
  fellowship: string
  title: string
  content: string
  author: string
  time: string
  image?: string
  meta?: {
    attendees?: number
    maxAttendees?: number
    prayerCount?: number
    likes?: number
  }
}

const sampleActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'event',
    fellowship: 'Young Adults Bible Study',
    title: 'Sunday Morning Gathering',
    content: 'Join us this Sunday at 10:00 AM for worship and fellowship. We\'ll be diving into the book of Romans!',
    author: 'Pastor Johnson',
    time: '2 hours ago',
    meta: { attendees: 12, maxAttendees: 30 }
  },
  {
    id: '2',
    type: 'prayer',
    fellowship: 'Young Adults Bible Study',
    title: 'Prayer Request',
    content: 'Please keep my family in your prayers as we navigate through this difficult time. Thank you! 🙏',
    author: 'Sarah M.',
    time: '5 hours ago',
    meta: { prayerCount: 8 }
  },
  {
    id: '3',
    type: 'testimony',
    fellowship: 'Campus Christian Fellowship',
    title: 'God\'s Faithfulness',
    content: 'I wanted to share how God has been working in my life this semester. His grace has been amazing!',
    author: 'Mike Chen',
    time: '1 day ago',
    meta: { likes: 15 }
  },
  {
    id: '4',
    type: 'announcement',
    fellowship: 'Young Adults Bible Study',
    title: 'Retreat Sign-ups Open!',
    content: 'Our annual summer retreat registration is now live! Early bird pricing available until next Friday.',
    author: 'Leader Team',
    time: '2 days ago'
  }
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'event':
      return <Calendar className="w-5 h-5" />
    case 'prayer':
      return <Heart className="w-5 h-5" />
    case 'testimony':
      return <MessageCircle className="w-5 h-5" />
    default:
      return <Users className="w-5 h-5" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'event':
      return 'bg-blue-500'
    case 'prayer':
      return 'bg-purple-500'
    case 'testimony':
      return 'bg-green-500'
    default:
      return 'bg-orange-500'
  }
}

export default function FellowshipActivityFeed() {
  const router = useRouter()
  const [activities] = useState<ActivityItem[]>(sampleActivity)

  if (activities.length === 0) {
    return (
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 text-center">
          <Users className="w-12 h-12 text-white/40 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">You're caught up! 🌿</h3>
          <p className="text-white/60 text-sm">
            No updates yet? Start by sharing an encouragement with your fellowship.
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
          <h3 className="text-lg font-semibold text-white">Your Fellowship Activity</h3>
          <button
            onClick={() => router.push('/fellowships')}
            className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          {activities.slice(0, 3).map(activity => (
            <div
              key={activity.id}
              className="bg-white/5 rounded-xl p-4 border border-[#D4AF37]/30 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => {
                if (activity.type === 'event') {
                  router.push(`/events/${activity.id}`)
                }
              }}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/60">{activity.fellowship}</span>
                    <span className="text-xs text-white/60">{activity.time}</span>
                  </div>
                  <h4 className="font-semibold text-white mb-1">{activity.title}</h4>
                  <p className="text-white/80 text-sm line-clamp-2 mb-2">{activity.content}</p>
                  <div className="flex items-center space-x-4 text-xs text-white/60">
                    <span>{activity.author}</span>
                    {activity.meta?.attendees && (
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{activity.meta.attendees}/{activity.meta.maxAttendees}</span>
                      </span>
                    )}
                    {activity.meta?.prayerCount && (
                      <span className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{activity.meta.prayerCount} praying</span>
                      </span>
                    )}
                    {activity.meta?.likes && (
                      <span className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{activity.meta.likes}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


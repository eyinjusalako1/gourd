'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Calendar, 
  Plus, 
  Megaphone, 
  BarChart3, 
  Settings, 
  Crown,
  UserPlus,
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  BookOpen,
  MapPin,
  Star
} from 'lucide-react'

interface LeaderDashboardProps {
  userRole: 'Leader' | 'Church Admin'
}

export default function LeaderDashboard({ userRole }: LeaderDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for leadership dashboard
  const leadershipData = {
    stats: {
      totalMembers: 127,
      activeFellowships: 4,
      eventsHosted: 23,
      engagementRate: 87
    },
    fellowships: [
      {
        id: '1',
        name: 'Young Adults Bible Study',
        members: 24,
        location: 'Downtown Community Center',
        nextEvent: '2024-01-30',
        engagement: 92,
        status: 'active'
      },
      {
        id: '2',
        name: 'Women\'s Prayer Circle',
        members: 18,
        location: 'Grace Church',
        nextEvent: '2024-02-02',
        engagement: 88,
        status: 'active'
      },
      {
        id: '3',
        name: 'Men\'s Accountability Group',
        members: 12,
        location: 'Online - Zoom',
        nextEvent: '2024-01-29',
        engagement: 95,
        status: 'active'
      },
      {
        id: '4',
        name: 'Community Outreach Team',
        members: 31,
        location: 'Various Locations',
        nextEvent: '2024-02-05',
        engagement: 78,
        status: 'active'
      }
    ],
    upcomingEvents: [
      {
        id: '1',
        title: 'Sunday Morning Bible Study',
        fellowship: 'Young Adults Bible Study',
        date: '2024-01-28',
        time: '10:00 AM',
        attendees: 15,
        maxAttendees: 25,
        status: 'confirmed'
      },
      {
        id: '2',
        title: 'Prayer Meeting',
        fellowship: 'Women\'s Prayer Circle',
        date: '2024-01-30',
        time: '7:00 PM',
        attendees: 12,
        maxAttendees: 20,
        status: 'confirmed'
      },
      {
        id: '3',
        title: 'Community Service Day',
        fellowship: 'Community Outreach Team',
        date: '2024-02-03',
        time: '9:00 AM',
        attendees: 8,
        maxAttendees: 15,
        status: 'needs_attention'
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'member_joined',
        fellowship: 'Young Adults Bible Study',
        member: 'Sarah Johnson',
        time: '2 hours ago',
        icon: UserPlus
      },
      {
        id: '2',
        type: 'event_rsvp',
        fellowship: 'Women\'s Prayer Circle',
        member: 'Emily Chen',
        event: 'Prayer Meeting',
        time: '4 hours ago',
        icon: Calendar
      },
      {
        id: '3',
        type: 'prayer_request',
        fellowship: 'Men\'s Accountability Group',
        member: 'Mike Davis',
        time: '6 hours ago',
        icon: Heart
      }
    ]
  }

  const handleCreateFellowship = () => {
    router.push('/fellowships/create')
  }

  const handleCreateEvent = () => {
    router.push('/events/create')
  }

  const handleSendAnnouncement = () => {
    router.push('/announcements/create')
  }

  const handleManageFellowship = (fellowshipId: string) => {
    router.push(`/fellowships/${fellowshipId}/manage`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400'
      case 'confirmed':
        return 'text-green-400'
      case 'needs_attention':
        return 'text-yellow-400'
      case 'pending':
        return 'text-blue-400'
      default:
        return 'text-white/60'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'needs_attention':
        return <AlertCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Leadership Header */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-2xl p-6 text-[#0F1433] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/20 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#0F1433] rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#F5C451]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Leadership Dashboard</h2>
                <p className="text-[#0F1433]/80">
                  {userRole === 'Church Admin' ? 'Church Administration' : 'Fellowship Leadership'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{leadershipData.stats.totalMembers}</div>
              <div className="text-sm opacity-80">Total Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleCreateFellowship}
              className="bg-[#F5C451] text-[#0F1433] p-4 rounded-xl hover:bg-[#D4AF37] transition-colors flex items-center space-x-3 w-full"
            >
              <Users className="w-6 h-6 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Create Fellowship</div>
                <div className="text-sm opacity-80">Start a new group</div>
              </div>
            </button>
            <button
              onClick={handleCreateEvent}
              className="bg-white/10 text-white p-4 rounded-xl hover:bg-white/20 transition-colors border border-[#D4AF37]/50 flex items-center space-x-3 w-full"
            >
              <Calendar className="w-6 h-6 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Schedule Event</div>
                <div className="text-sm opacity-80">Plan new activities</div>
              </div>
            </button>
            <button
              onClick={handleSendAnnouncement}
              className="bg-white/10 text-white p-4 rounded-xl hover:bg-white/20 transition-colors border border-[#D4AF37]/50 flex items-center space-x-3 w-full"
            >
              <Megaphone className="w-6 h-6 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Send Announcement</div>
                <div className="text-sm opacity-80">Communicate with members</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Leadership Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-[#D4AF37] rounded-xl p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-[#F5C451]">{leadershipData.stats.activeFellowships}</div>
            <div className="text-sm text-white/80">Active Fellowships</div>
          </div>
        </div>
        <div className="bg-white/5 border border-[#D4AF37] rounded-xl p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-[#F5C451]">{leadershipData.stats.eventsHosted}</div>
            <div className="text-sm text-white/80">Events Hosted</div>
          </div>
        </div>
        <div className="bg-white/5 border border-[#D4AF37] rounded-xl p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-[#F5C451]">{leadershipData.stats.engagementRate}%</div>
            <div className="text-sm text-white/80">Engagement Rate</div>
          </div>
        </div>
        <div className="bg-white/5 border border-[#D4AF37] rounded-xl p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-[#F5C451]">4.8</div>
            <div className="text-sm text-white/80">Leader Rating</div>
          </div>
        </div>
      </div>

      {/* Active Fellowships */}
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Fellowships</h3>
            <button
              onClick={handleCreateFellowship}
              className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </button>
          </div>
          <div className="space-y-3">
            {leadershipData.fellowships.map(fellowship => (
              <div key={fellowship.id} className="bg-white/5 rounded-xl p-4 border border-[#D4AF37]/30 hover:bg-white/10 transition-colors">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2 flex-wrap">
                        <h4 className="font-semibold text-white break-words">{fellowship.name}</h4>
                        <div className={`flex items-center space-x-1 flex-shrink-0 ${getStatusColor(fellowship.status)}`}>
                          {getStatusIcon(fellowship.status)}
                          <span className="text-xs capitalize">{fellowship.status}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-white/70 mb-2">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-[#F5C451] flex-shrink-0" />
                          <span className="break-words">{fellowship.members} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-[#F5C451] flex-shrink-0" />
                          <span className="break-words">{fellowship.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4 text-[#F5C451] flex-shrink-0" />
                          <span>{fellowship.engagement}% engagement</span>
                        </div>
                      </div>
                      <div className="text-xs text-white/60">
                        Next event: {new Date(fellowship.nextEvent).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleManageFellowship(fellowship.id)}
                      className="bg-[#F5C451] text-[#0F1433] px-4 py-2 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors whitespace-nowrap"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
            <button
              onClick={handleCreateEvent}
              className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Event</span>
            </button>
          </div>
          <div className="space-y-3">
            {leadershipData.upcomingEvents.map(event => (
              <div key={event.id} className="bg-white/5 rounded-xl p-4 border border-[#D4AF37]/30 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-white">{event.title}</h4>
                      <div className={`flex items-center space-x-1 ${getStatusColor(event.status)}`}>
                        {getStatusIcon(event.status)}
                        <span className="text-xs capitalize">{event.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="text-sm text-white/80 mb-2">{event.fellowship}</div>
                    <div className="flex items-center space-x-4 text-sm text-white/70">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-[#F5C451]" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-[#F5C451]" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-[#F5C451]" />
                        <span>{event.attendees}/{event.maxAttendees} RSVPs</span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-[#D4AF37]/50">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {leadershipData.recentActivity.map(activity => {
              const IconComponent = activity.icon
              return (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#F5C451] rounded-full flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-[#0F1433]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">
                      {activity.type === 'member_joined' && `${activity.member} joined ${activity.fellowship}`}
                      {activity.type === 'event_rsvp' && `${activity.member} RSVP'd to ${activity.event}`}
                      {activity.type === 'prayer_request' && `${activity.member} shared a prayer request`}
                    </div>
                    <div className="text-xs text-white/60">{activity.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
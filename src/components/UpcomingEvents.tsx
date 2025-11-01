'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location?: string
  isVirtual: boolean
  rsvpCount: number
  maxAttendees: number
}

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Sunday Morning Gathering',
    date: 'December 8',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    isVirtual: false,
    rsvpCount: 15,
    maxAttendees: 50
  },
  {
    id: '2',
    title: 'Prayer & Worship Night',
    date: 'December 10',
    time: '7:00 PM',
    location: 'Youth Center',
    isVirtual: false,
    rsvpCount: 22,
    maxAttendees: 40
  },
  {
    id: '3',
    title: 'Study Session: Book of Romans',
    date: 'December 12',
    time: '6:00 PM',
    isVirtual: true,
    rsvpCount: 8,
    maxAttendees: 30
  }
]

export default function UpcomingEvents() {
  const router = useRouter()
  
  if (sampleEvents.length === 0) {
    return (
      <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 text-center">
          <Calendar className="w-12 h-12 text-white/40 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No upcoming events 📅</h3>
          <p className="text-white/60 text-sm">
            Your next gathering is coming up this weekend. Check back soon!
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
          <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
          <button
            onClick={() => router.push('/events')}
            className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {sampleEvents.map(event => (
            <div
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="bg-white/5 rounded-xl p-4 border border-[#D4AF37]/30 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-[#F5C451] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                  <div className="space-y-1 text-sm text-white/70">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#F5C451]" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#F5C451]" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.isVirtual && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-[#F5C451]" />
                        <span>Virtual Event</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 pt-1">
                      <Users className="w-4 h-4 text-[#F5C451]" />
                      <span>{event.rsvpCount} RSVP'd</span>
                    </div>
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


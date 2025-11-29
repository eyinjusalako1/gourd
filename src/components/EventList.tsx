'use client'

import { useState } from 'react'
import { Calendar, MapPin, Users, Clock, Filter, ChevronDown } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees?: number
  category: 'Bible Study' | 'Prayer' | 'Outreach' | 'Social'
  description: string
  isJoined: boolean
  isInterested: boolean
}

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Sunday Morning Bible Study',
    date: '2024-01-28',
    time: '10:00 AM',
    location: 'Grace Community Church',
    attendees: 15,
    maxAttendees: 25,
    category: 'Bible Study',
    description: 'Join us for an in-depth study of the Book of Romans',
    isJoined: false,
    isInterested: true
  },
  {
    id: '2',
    title: 'Prayer Meeting',
    date: '2024-01-30',
    time: '7:00 PM',
    location: 'Online - Zoom',
    attendees: 8,
    category: 'Prayer',
    description: 'Community prayer session for healing and guidance',
    isJoined: true,
    isInterested: false
  },
  {
    id: '3',
    title: 'Community Outreach',
    date: '2024-02-03',
    time: '9:00 AM',
    location: 'Downtown Shelter',
    attendees: 12,
    maxAttendees: 20,
    category: 'Outreach',
    description: 'Volunteer at the local homeless shelter',
    isJoined: false,
    isInterested: false
  },
  {
    id: '4',
    title: 'Young Adults Social',
    date: '2024-02-05',
    time: '6:30 PM',
    location: 'Coffee Corner',
    attendees: 6,
    maxAttendees: 15,
    category: 'Social',
    description: 'Casual meetup for young adults in the community',
    isJoined: false,
    isInterested: true
  }
]

const categoryColors = {
  'Bible Study': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Prayer': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Outreach': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Social': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>(sampleEvents)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['All', 'Bible Study', 'Prayer', 'Outreach', 'Social']

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory)

  const handleRSVP = (eventId: string, action: 'going' | 'interested' | 'not-going') => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          isJoined: action === 'going',
          isInterested: action === 'interested',
          attendees: action === 'going' ? event.attendees + 1 : 
                    (event.isJoined && action !== 'going') ? event.attendees - 1 : event.attendees
        }
      }
      return event
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-4">
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-navy-900 dark:text-white">
          Upcoming Events
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-3 py-2 bg-beige-100 dark:bg-beige-800 rounded-lg hover:bg-beige-200 dark:hover:bg-beige-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Category Filter */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-gold-500 text-navy-900'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Event Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-navy-900 dark:text-white mb-1">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {event.description}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
                  {event.category}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.date)}</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>
                  {event.attendees}
                  {event.maxAttendees && `/${event.maxAttendees}`} attending
                </span>
              </div>
            </div>

            {/* RSVP Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleRSVP(event.id, 'going')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  event.isJoined
                    ? 'bg-gold-500 text-navy-900'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {event.isJoined ? 'Going ✓' : 'Going'}
              </button>
              <button
                onClick={() => handleRSVP(event.id, 'interested')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  event.isInterested
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {event.isInterested ? 'Interested ✓' : 'Interested'}
              </button>
              <button
                onClick={() => handleRSVP(event.id, 'not-going')}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Not Going
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No events found for this category</p>
        </div>
      )}
    </div>
  )
}







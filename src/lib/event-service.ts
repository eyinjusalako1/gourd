import type { Event, EventRSVP } from '@/types'

export class EventService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  private static readonly RSVP_STORAGE_KEY = 'gathered_event_rsvps'

  private static loadLocalRsvps(): EventRSVP[] {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(EventService.RSVP_STORAGE_KEY)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch (error) {
      console.error('Error parsing local RSVPs:', error)
    }
    return []
  }

  private static saveLocalRsvps(rsvps: EventRSVP[]) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(EventService.RSVP_STORAGE_KEY, JSON.stringify(rsvps))
    } catch (error) {
      console.error('Error saving local RSVPs:', error)
    }
  }

  private static normalizeEvent(raw: any): Event {
    const startTime = raw.start_time ?? raw.startTime
    const endTime = raw.end_time ?? raw.endTime
    const eventType = raw.event_type ?? raw.eventType ?? raw.category?.toLowerCase().replace(/\s+/g, '_') ?? 'other'

    return {
      id: String(raw.id),
      title: raw.title ?? 'Untitled Event',
      description: raw.description ?? '',
      start_time: startTime,
      end_time: endTime ?? startTime,
      location: raw.location,
      is_virtual: raw.is_virtual ?? raw.isOnline ?? false,
      virtual_link: raw.virtual_link ?? raw.virtualLink,
      virtual_platform: raw.virtual_platform ?? raw.virtualPlatform,
      event_type: eventType,
      requires_rsvp: raw.requires_rsvp ?? raw.requiresRsvp ?? false,
      allow_guests: raw.allow_guests ?? raw.allowGuests ?? false,
      max_attendees: raw.max_attendees ?? raw.maxAttendees,
      is_recurring: raw.is_recurring ?? raw.isRecurring ?? false,
      recurrence_pattern: raw.recurrence_pattern ?? raw.recurrencePattern,
      recurrence_end_date: raw.recurrence_end_date ?? raw.recurrenceEndDate,
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      created_by: raw.created_by ?? raw.createdBy ?? 'demo-steward',
      created_at: raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
      updated_at: raw.updated_at ?? raw.updatedAt ?? new Date().toISOString(),
      rsvp_count: raw.rsvp_count ?? raw.rsvpCount ?? 0,
    }
  }

  private static enhanceEventWithLocalRsvps(event: Event, localRsvps: EventRSVP[]): Event {
    const localGoing = localRsvps.filter(rsvp => rsvp.event_id === event.id && rsvp.status === 'going').length
    return {
      ...event,
      rsvp_count: (event.rsvp_count || 0) + localGoing,
    }
  }

  private static tryGetMockUser() {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem('gathered_mock_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  static async getEvents(): Promise<Event[]> {
    // Try to get events from localStorage first
    if (typeof window !== 'undefined') {
      try {
        const savedEvents = localStorage.getItem('gathered_events')
        if (savedEvents) {
          const events = JSON.parse(savedEvents)
          if (events.length > 0) {
            const localRsvps = EventService.loadLocalRsvps()
            const normalizedEvents: Event[] = events.map((raw: any) =>
              EventService.normalizeEvent(raw)
            )
            return normalizedEvents.map((event) =>
              EventService.enhanceEventWithLocalRsvps(event, localRsvps)
            )
          }
        }
      } catch (error) {
        console.error('Error loading events from localStorage:', error)
      }
    }
    
    // Return mock data if no saved events
    const localRsvps = EventService.loadLocalRsvps()
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Sunday Morning Worship',
        description: 'Join us for our weekly worship service',
        start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        location: 'Main Sanctuary',
        is_virtual: false,
        event_type: 'worship',
        requires_rsvp: true,
        allow_guests: true,
        max_attendees: 200,
        is_recurring: true,
        recurrence_pattern: 'weekly',
        tags: ['worship', 'sunday'],
        created_by: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        rsvp_count: 45,
      },
      {
        id: '2',
        title: 'Bible Study - Book of Romans',
        description: 'Deep dive into the Book of Romans',
        start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
        location: 'Fellowship Hall',
        is_virtual: false,
        event_type: 'bible_study',
        requires_rsvp: true,
        allow_guests: false,
        max_attendees: 25,
        is_recurring: true,
        recurrence_pattern: 'weekly',
        tags: ['bible-study', 'romans'],
        created_by: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        rsvp_count: 12,
      },
    ]
    return mockEvents.map(event => EventService.enhanceEventWithLocalRsvps(EventService.normalizeEvent(event), localRsvps))
  }

  static async getEvent(id: string): Promise<Event> {
    const events = await this.getEvents()
    const event = events.find(e => e.id === id)
    if (!event) {
      throw new Error('Event not found')
    }
    return event
  }

  static async getEventRSVPs(eventId: string): Promise<EventRSVP[]> {
    const localRsvps = EventService.loadLocalRsvps().filter(rsvp => rsvp.event_id === eventId)

    // Mock data - replace with real API call
    const mockRsvps: EventRSVP[] = [
      {
        id: '1',
        event_id: eventId,
        user_id: '1',
        status: 'going',
        guest_count: 2,
        notes: 'Looking forward to it!',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: '1',
          email: 'test@example.com',
          user_metadata: { name: 'John Doe' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        id: '2',
        event_id: eventId,
        user_id: '2',
        status: 'maybe',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: '2',
          email: 'jane@example.com',
          user_metadata: { name: 'Jane Smith' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    ]

    const uniqueLocalUserIds = new Set(localRsvps.map(rsvp => rsvp.user_id))
    const filteredMockRsvps = mockRsvps.filter(rsvp => !uniqueLocalUserIds.has(rsvp.user_id))

    return [...localRsvps, ...filteredMockRsvps]
  }

  static async getUserRSVP(eventId: string, userId: string): Promise<EventRSVP | null> {
    const localRsvps = EventService.loadLocalRsvps()
    const localMatch = localRsvps.find(rsvp => rsvp.event_id === eventId && rsvp.user_id === userId)
    if (localMatch) {
      return localMatch
    }

    const rsvps = await this.getEventRSVPs(eventId)
    return rsvps.find(rsvp => rsvp.user_id === userId) || null
  }

  static async rsvpToEvent(
    eventId: string,
    userId: string,
    status: 'going' | 'maybe' | 'not_going',
    guestCount: number = 0,
    notes: string = ''
  ): Promise<void> {
    const now = new Date().toISOString()
    const allRsvps = EventService.loadLocalRsvps()
    const existingIndex = allRsvps.findIndex(rsvp => rsvp.event_id === eventId && rsvp.user_id === userId)

    const mockUser = EventService.tryGetMockUser()
    const userRecord = mockUser
      ? {
          id: userId,
          email: mockUser.email,
          user_metadata: {
            name: mockUser.user_metadata?.name,
            role: mockUser.user_metadata?.role,
          },
          created_at: mockUser.created_at,
          updated_at: now,
        }
      : undefined

    const nextRsvp: EventRSVP = {
      id: existingIndex >= 0 ? allRsvps[existingIndex].id : `local-${eventId}-${userId}`,
      event_id: eventId,
      user_id: userId,
      status,
      guest_count: guestCount,
      notes,
      created_at: existingIndex >= 0 ? allRsvps[existingIndex].created_at : now,
      updated_at: now,
      user: userRecord,
    }

    if (existingIndex >= 0) {
      allRsvps[existingIndex] = nextRsvp
    } else {
      allRsvps.push(nextRsvp)
    }

    EventService.saveLocalRsvps(allRsvps)

    if (typeof window !== 'undefined') {
      try {
        const savedEventsRaw = localStorage.getItem('gathered_events')
        if (savedEventsRaw) {
          const savedEvents: any[] = JSON.parse(savedEventsRaw)
          const updatedEvents = savedEvents.map(rawEvent => {
            if (String(rawEvent.id) !== eventId) return rawEvent
            const goingCount = allRsvps.filter(rsvp => rsvp.event_id === eventId && rsvp.status === 'going').length
            return {
              ...rawEvent,
              rsvp_count: goingCount,
              requires_rsvp: rawEvent.requires_rsvp ?? rawEvent.requiresRsvp,
              allow_guests: rawEvent.allow_guests ?? rawEvent.allowGuests,
            }
          })
          localStorage.setItem('gathered_events', JSON.stringify(updatedEvents))
        }
      } catch (error) {
        console.error('Failed to sync event RSVP count:', error)
      }
    }

    console.log('RSVP submitted (local mock):', { eventId, userId, status, guestCount, notes })
  }
}



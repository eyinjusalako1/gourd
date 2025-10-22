import type { Event, EventRSVP } from '@/types'

export class EventService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

  static async getEvents(): Promise<Event[]> {
    // Mock data - replace with real API call
    return [
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
    // Mock data - replace with real API call
    return [
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
  }

  static async getUserRSVP(eventId: string, userId: string): Promise<EventRSVP | null> {
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
    // Mock implementation - replace with real API call
    console.log('RSVP submitted:', { eventId, userId, status, guestCount, notes })
  }
}



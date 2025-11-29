import { supabase } from './supabase'
import { Event, EventRSVP, EventAttendance } from '@/types'

export class EventService {
  // Get all events (public or user's events)
  static async getEvents(userId?: string, groupId?: string): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('start_time', { ascending: true })

    if (groupId) {
      query = query.eq('group_id', groupId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Get upcoming events
  static async getUpcomingEvents(userId?: string, limit = 10): Promise<Event[]> {
    const now = new Date().toISOString()
    
    let query = supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('start_time', now)
      .order('start_time', { ascending: true })
      .limit(limit)

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Get event by ID
  static async getEvent(eventId: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (error) throw error
    return data
  }

  // Create a new event
  static async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'rsvp_count'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update event
  static async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Delete event (soft delete)
  static async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .update({ is_active: false })
      .eq('id', eventId)

    if (error) throw error
  }

  // RSVP to event
  static async rsvpToEvent(eventId: string, userId: string, status: EventRSVP['status'], guestCount = 0, notes?: string): Promise<void> {
    // Check if RSVP already exists
    const { data: existingRsvp } = await supabase
      .from('event_rsvps')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single()

    if (existingRsvp) {
      // Update existing RSVP
      const { error } = await supabase
        .from('event_rsvps')
        .update({
          status,
          guest_count: guestCount,
          notes,
          rsvp_date: new Date().toISOString()
        })
        .eq('id', existingRsvp.id)

      if (error) throw error
    } else {
      // Create new RSVP
      const { error } = await supabase
        .from('event_rsvps')
        .insert([{
          event_id: eventId,
          user_id: userId,
          status,
          guest_count: guestCount,
          notes,
          rsvp_date: new Date().toISOString()
        }])

      if (error) throw error
    }

    // Update event RSVP count
    await this.updateRsvpCount(eventId)
  }

  // Get event RSVPs
  static async getEventRSVPs(eventId: string): Promise<EventRSVP[]> {
    const { data, error } = await supabase
      .from('event_rsvps')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('event_id', eventId)
      .order('rsvp_date', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get user's RSVP for an event
  static async getUserRSVP(eventId: string, userId: string): Promise<EventRSVP | null> {
    const { data, error } = await supabase
      .from('event_rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Check in to event
  static async checkInToEvent(eventId: string, userId: string, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('event_attendance')
      .insert([{
        event_id: eventId,
        user_id: userId,
        attended: true,
        check_in_time: new Date().toISOString(),
        notes
      }])

    if (error) throw error
  }

  // Check out of event
  static async checkOutOfEvent(eventId: string, userId: string, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('event_attendance')
      .update({
        check_out_time: new Date().toISOString(),
        notes
      })
      .eq('event_id', eventId)
      .eq('user_id', userId)

    if (error) throw error
  }

  // Get event attendance
  static async getEventAttendance(eventId: string): Promise<EventAttendance[]> {
    const { data, error } = await supabase
      .from('event_attendance')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('event_id', eventId)
      .eq('attended', true)
      .order('check_in_time', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get events by date range
  static async getEventsByDateRange(startDate: string, endDate: string, userId?: string): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('start_time', startDate)
      .lte('start_time', endDate)
      .order('start_time', { ascending: true })

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Get user's events (created by user)
  static async getUserEvents(userId: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('created_by', userId)
      .eq('is_active', true)
      .order('start_time', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Get user's RSVPed events
  static async getUserRSVPedEvents(userId: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from('event_rsvps')
      .select(`
        event:event_id (
          *
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'going')
      .order('rsvp_date', { ascending: false })

    if (error) throw error
    return data?.map(item => item.event).filter(Boolean) || []
  }

  // Search events
  static async searchEvents(searchTerm: string, filters?: {
    eventType?: string
    isVirtual?: boolean
    startDate?: string
    endDate?: string
  }): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)

    if (filters?.eventType) {
      query = query.eq('event_type', filters.eventType)
    }

    if (filters?.isVirtual !== undefined) {
      query = query.eq('is_virtual', filters.isVirtual)
    }

    if (filters?.startDate) {
      query = query.gte('start_time', filters.startDate)
    }

    if (filters?.endDate) {
      query = query.lte('start_time', filters.endDate)
    }

    query = query.order('start_time', { ascending: true })

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Update RSVP count
  private static async updateRsvpCount(eventId: string): Promise<void> {
    const { count } = await supabase
      .from('event_rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'going')

    await supabase
      .from('events')
      .update({ rsvp_count: count || 0 })
      .eq('id', eventId)
  }

  // Get event statistics
  static async getEventStats(eventId: string): Promise<{
    totalRsvps: number
    goingCount: number
    maybeCount: number
    notGoingCount: number
    attendanceCount: number
  }> {
    const [rsvpStats, attendanceCount] = await Promise.all([
      supabase
        .from('event_rsvps')
        .select('status')
        .eq('event_id', eventId),
      supabase
        .from('event_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('attended', true)
    ])

    const rsvps = rsvpStats.data || []
    const goingCount = rsvps.filter(r => r.status === 'going').length
    const maybeCount = rsvps.filter(r => r.status === 'maybe').length
    const notGoingCount = rsvps.filter(r => r.status === 'not_going').length

    return {
      totalRsvps: rsvps.length,
      goingCount,
      maybeCount,
      notGoingCount,
      attendanceCount: attendanceCount.count || 0
    }
  }
}









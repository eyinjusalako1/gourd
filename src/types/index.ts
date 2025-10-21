export interface User {
  id: string
  email: string
  user_metadata: {
    name?: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  location?: string
  is_virtual: boolean
  virtual_link?: string
  virtual_platform?: string
  event_type: 'bible_study' | 'prayer_meeting' | 'worship' | 'evangelism' | 'community_service' | 'other'
  requires_rsvp: boolean
  allow_guests: boolean
  max_attendees?: number
  is_recurring: boolean
  recurrence_pattern?: string
  recurrence_end_date?: string
  tags: string[]
  created_by: string
  created_at: string
  updated_at: string
  rsvp_count: number
}

export interface EventRSVP {
  id: string
  event_id: string
  user_id: string
  status: 'going' | 'maybe' | 'not_going'
  guest_count?: number
  notes?: string
  created_at: string
  updated_at: string
  user?: User
}

'use client'

import { useAuth } from '@/lib/auth-context'
import WelcomeBanner from '@/components/WelcomeBanner'
import VerseCard from '@/components/VerseCard'
import EventList from '@/components/EventList'
import FellowshipGroups from '@/components/FellowshipGroups'
import AnnouncementFeed from '@/components/AnnouncementFeed'
import StatsPanel from '@/components/StatsPanel'

export default function DiscipleHome() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'Friend'

  return (
    <div className="space-y-6">
      {/* Quick Welcome Banner */}
      <WelcomeBanner firstName={firstName} message="Your fellowship is waiting" />

      {/* Section A: Spiritual Touchpoint */}
      <VerseCard />

      {/* Section B: Engagement & Community */}
      <div className="space-y-6">
        <EventList />
        <FellowshipGroups userRole="Member" />
        <AnnouncementFeed />
      </div>

      {/* Section C: Growth & Analytics */}
      <StatsPanel />
    </div>
  )
}


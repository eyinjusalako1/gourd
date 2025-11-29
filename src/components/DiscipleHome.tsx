'use client'

import VerseCard from '@/components/VerseCard'
import EventList from '@/components/EventList'
import FellowshipGroups from '@/components/FellowshipGroups'
import AnnouncementFeed from '@/components/AnnouncementFeed'
import StatsPanel from '@/components/StatsPanel'

export default function DiscipleHome() {
  return (
    <div className="space-y-6">
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


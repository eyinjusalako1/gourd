'use client'

import VerseCard from '@/components/VerseCard'
import EventList from '@/components/EventList'
import FellowshipGroups from '@/components/FellowshipGroups'
import AnnouncementFeed from '@/components/AnnouncementFeed'
import StatsPanel from '@/components/StatsPanel'
import LeaderDashboard from '@/components/LeaderDashboard'

export default function StewardHome() {
  return (
    <div className="space-y-6">
      {/* Section A: Spiritual Touchpoint */}
      <VerseCard />

      {/* Section B: Engagement & Community */}
      <div className="space-y-6">
        <EventList />
        <FellowshipGroups userRole="Leader" />
        <AnnouncementFeed />
      </div>

      {/* Section C: Growth & Analytics */}
      <StatsPanel />

      {/* Section D: Leader/Admin Features */}
      <LeaderDashboard userRole="Leader" />
    </div>
  )
}


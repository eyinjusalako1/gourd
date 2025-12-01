'use client'

import LeaderDashboard from '@/components/LeaderDashboard'
import VerseCard from '@/components/VerseCard'
import FellowshipActivityFeed from '@/components/FellowshipActivityFeed'
import WeeklyChallenge from '@/components/WeeklyChallenge'
import UpcomingEvents from '@/components/UpcomingEvents'
import SuggestionCard from '@/components/personalization/SuggestionCard'
import type { Suggestion, UserProfile } from '@/lib/prefs'
import QuickActions from '@/components/QuickActions'

interface StewardHomeProps {
  profile: UserProfile
  suggestions: Suggestion[]
  onDismissSuggestion: (id: string) => void
  onMuteType: (type: Suggestion['type']) => void
}

export default function StewardHome({
  profile,
  suggestions,
  onDismissSuggestion,
  onMuteType,
}: StewardHomeProps) {
  return (
    <>
      <LeaderDashboard userRole="Leader" />
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      {!!suggestions.length && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-white">
  Opportunities for this week (BETA)</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onDismiss={onDismissSuggestion}
                onMuteType={onMuteType}
              />
            ))}
          </div>
        </section>
      )}

      <VerseCard />
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <section>
        <h3 className="text-lg font-semibold text-white mb-3">This Week&apos;s Engagement</h3>
        <FellowshipActivityFeed profile={profile} limit={4} title="Fellowship Highlights" showViewAll />
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <WeeklyChallenge fellowshipId="1" />
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <section>
        <h3 className="text-lg font-semibold text-white mb-3">Best time to host</h3>
        <p className="text-sm text-white/70 mb-3">
          Most members are free on {profile.availability?.join(', ') || 'weeknights'}. Plan your next fellowship around those times.
        </p>
        <UpcomingEvents limit={2} />
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <section>
        <h3 className="text-lg font-semibold text-white mb-3">
          Steward Quick Actions (BETA)
        </h3>
        <QuickActions />
      </section>
    </>
  )
}





'use client'

import Link from 'next/link'
import FaithFlame from '@/components/FaithFlame'
import VerseCard from '@/components/VerseCard'
import GamificationHighlight from '@/components/FellowshipHighlight'
import { EmberMeterCard } from '@/components/EmberMeter'
import FellowshipActivityFeed from '@/components/FellowshipActivityFeed'
import WeeklyChallenge from '@/components/WeeklyChallenge'
import UpcomingEvents from '@/components/UpcomingEvents'
import QuickActions from '@/components/QuickActions'
import BlessingBadges from '@/components/BlessingBadges'
import SuggestionCard from '@/components/personalization/SuggestionCard'
import type { Suggestion, UserProfile } from '@/lib/prefs'

interface DiscipleHomeProps {
  userId: string
  profile: UserProfile
  suggestions: Suggestion[]
  onDismissSuggestion: (id: string) => void
  onMuteType: (type: Suggestion['type']) => void
}

export default function DiscipleHome({
  userId,
  profile,
  suggestions,
  onDismissSuggestion,
  onMuteType,
}: DiscipleHomeProps) {
  return (
    <>
      <section className="text-center mb-4 space-y-3">
        <h2 className="text-2xl font-bold text-white">
          Welcome back, {profile.name || 'Friend'}! 🌿
        </h2>
        <p className="text-white/80">
          Your fellowship community is here for you.
        </p>
        <div className="flex justify-center mt-3">
          <FaithFlame userId={userId} fellowshipId="1" size="md" showText />
        </div>
      </section>

      {!!suggestions.length && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Suggestions for you</h3>
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
        <h3 className="text-lg font-semibold text-white mb-3">Read Scripture</h3>
        <Link
          href="/bible"
          className="rounded-xl bg-white/5 border border-[#D4AF37]/30 px-4 py-4 flex items-center justify-between tappable hover:bg-white/10 transition-colors"
        >
          <div>
            <div className="text-sm font-semibold text-white">Bible</div>
            <div className="text-xs text-white/70">Read Scripture (WEB)</div>
          </div>
          <div className="text-2xl">📖</div>
        </Link>
      </section>
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <GamificationHighlight fellowshipId="1" />
      <EmberMeterCard fellowshipId="1" />
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <FellowshipActivityFeed profile={profile} />
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <WeeklyChallenge fellowshipId="1" />
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <UpcomingEvents limit={3} />
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <section>
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <QuickActions />
      </section>
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <BlessingBadges userId={userId} fellowshipId="1" />
    </>
  )
}




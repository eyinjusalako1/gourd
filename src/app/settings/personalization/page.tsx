'use client'

import { Sparkles, MapPin, SlidersHorizontal } from 'lucide-react'
import AppHeader from '@/components/AppHeader'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useToast } from '@/components/ui/Toast'
import Link from 'next/link'

export default function PersonalizationSettingsPage() {
  const { profile, updateProfile, isLoading } = useUserProfile()
  const toast = useToast()

  const personalization = profile?.personalization_enabled ?? {
    interests: true,
    location: false,
    suggestions: true,
  }

  const togglePreference = async (field: 'interests' | 'location' | 'suggestions', value: boolean) => {
    const next = {
      ...personalization,
      [field]: value,
    }
    await updateProfile({ personalization_enabled: next })
    toast({ title: 'Preferences updated', variant: 'success' })
  }

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20 text-white">
      <AppHeader title="Personalization" subtitle="Adjust tailored experiences" backHref="/settings" />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Control what we personalize</h2>
          <p className="text-sm text-white/60">
            Gathered only uses the preferences you share to surface more relevant events, challenges, and nudges. Toggle any feature off at any time.
          </p>
        </section>

        <section className="space-y-3">
          <label className="flex items-start justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-3 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#F5C451]" />
                <span className="font-semibold text-sm">Use interests to tailor feed</span>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Highlights posts and challenges that match your selected interests.
              </p>
            </div>
            <input
              type="checkbox"
              checked={personalization.interests}
              disabled={isLoading}
              onChange={(event) => togglePreference('interests', event.target.checked)}
            />
          </label>

          <label className="flex items-start justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-3 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#F5C451]" />
                <span className="font-semibold text-sm">Use city for nearby suggestions</span>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Helps us surface events and meetups close to you. We never share your exact location.
              </p>
            </div>
            <input
              type="checkbox"
              checked={personalization.location}
              disabled={isLoading}
              onChange={(event) => togglePreference('location', event.target.checked)}
            />
          </label>

          <label className="flex items-start justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-3 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#F5C451]" />
                <span className="font-semibold text-sm">Show smart suggestions</span>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Suggests fellowships, challenges, or ways to connect based on your role and activity.
              </p>
            </div>
            <input
              type="checkbox"
              checked={personalization.suggestions}
              disabled={isLoading}
              onChange={(event) => togglePreference('suggestions', event.target.checked)}
            />
          </label>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Why we ask</h2>
          <ul className="text-sm text-white/70 space-y-2 list-disc list-inside">
            <li>Interests help rank your feed so you see what matters first.</li>
            <li>Location is optional and only used to recommend nearby gatherings.</li>
            <li>You can revisit onboarding preferences anytime to fine-tune your experience.</li>
          </ul>
          <Link
            href="/onboarding/preferences"
            className="inline-flex items-center justify-center w-full bg-[#D4AF37] text-[#0F1433] font-semibold py-3 rounded-xl hover:bg-[#F5C451] transition-colors"
          >
            Update preferences
          </Link>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Need a reset?</h2>
          <p className="text-sm text-white/60">
            Want to delete your account or all personalization data? We&apos;re building a one-click option.
            For now, reach out and we&apos;ll help.
          </p>
          <a
            href="mailto:support@gathered.app?subject=Delete%20my%20Gathered%20account"
            className="inline-flex items-center justify-center w-full bg-white/10 border border-[#D4AF37]/30 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-colors"
          >
            Contact support
          </a>
        </section>
      </div>
    </div>
  )
}




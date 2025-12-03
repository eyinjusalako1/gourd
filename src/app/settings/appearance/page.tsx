'use client'

import { useState } from 'react'
import AppHeader from '@/components/AppHeader'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useToast } from '@/components/ui/Toast'

export const dynamic = 'force-dynamic'

export default function AppearanceSettingsPage() {
  const { profile, updateProfile, isLoading } = useUserProfile()
  const toast = useToast()
  const [saving, setSaving] = useState(false)

  const accessibility = profile?.accessibility ?? {
    reduceMotion: false,
    largeText: false,
    highContrast: false,
  }

  const handleToggle = async (field: keyof typeof accessibility, value: boolean) => {
    const next = { ...accessibility, [field]: value }
    setSaving(true)
    await updateProfile({ accessibility: next })
    toast({ title: 'Appearance updated', variant: 'success' })
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20 text-white">
      <AppHeader title="Appearance" subtitle="Accessibility & theme" backHref="/settings" />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Text size</h2>
          <p className="text-sm text-white/60">Large text increases the base font size across Gathered.</p>
          <label className="flex items-center justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-3">
            <span className="text-sm font-medium">Enable large text</span>
            <input
              type="checkbox"
              checked={accessibility.largeText}
              onChange={(event) => handleToggle('largeText', event.target.checked)}
              disabled={isLoading || saving}
            />
          </label>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Reduce motion</h2>
          <p className="text-sm text-white/60">Turns off non-essential animations for a calmer experience.</p>
          <label className="flex items-center justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-3">
            <span className="text-sm font-medium">Reduce motion</span>
            <input
              type="checkbox"
              checked={accessibility.reduceMotion}
              onChange={(event) => handleToggle('reduceMotion', event.target.checked)}
              disabled={isLoading || saving}
            />
          </label>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">High contrast mode</h2>
          <p className="text-sm text-white/60">
            Increases contrast for better legibility. Works across dashboard and content screens.
          </p>
          <label className="flex items-center justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-3">
            <span className="text-sm font-medium">High contrast theme</span>
            <input
              type="checkbox"
              checked={accessibility.highContrast}
              onChange={(event) => handleToggle('highContrast', event.target.checked)}
              disabled={isLoading || saving}
            />
          </label>
        </section>

        <section className="space-y-2 text-white/60 text-xs">
          <p>
            These accessibility preferences sync with your profile. If you ever clear your cache or sign in on another device,
            we&#39;ll reapply them automatically.
          </p>
        </section>
      </div>
    </div>
  )
}
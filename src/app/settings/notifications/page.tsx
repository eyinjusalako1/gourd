'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import AppHeader from '@/components/AppHeader'
import { useUserProfile } from '@/hooks/useUserProfile'

const cadenceLabels: Record<'daily' | 'weekly' | 'off', string> = {
  daily: 'Daily nudges',
  weekly: 'Weekly digest',
  off: 'No reminders',
}

const channelLabels: Record<'push' | 'email', string> = {
  push: 'Push notifications',
  email: 'Email notifications',
}

export default function NotificationsSettingsPage() {
  const toast = useToast()
  const { profile, updateProfile, isLoading } = useUserProfile()
  const [saving, setSaving] = useState(false)

  const quietStart = profile?.quiet_hours_start ?? '22:00'
  const quietEnd = profile?.quiet_hours_end ?? '07:00'

  const handleCadenceChange = async (value: 'daily' | 'weekly' | 'off') => {
    if (!profile) return
    setSaving(true)
    await updateProfile({ notif_cadence: value })
    toast({ title: 'Notification cadence updated', variant: 'success' })
    setSaving(false)
  }

  const handleChannelChange = async (value: 'push' | 'email') => {
    if (!profile) return
    setSaving(true)
    await updateProfile({ notif_channel: value })
    toast({ title: 'Preferences saved', description: `We will reach you via ${value}.`, variant: 'success' })
    setSaving(false)
  }

  const handleQuietHoursChange = async (start: string, end: string) => {
    if (!profile) return
    setSaving(true)
    await updateProfile({ quiet_hours_start: start, quiet_hours_end: end })
    toast({ title: 'Quiet hours updated', variant: 'success' })
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      <AppHeader title="Notifications" subtitle="Cadence, channels and quiet hours" backHref="/settings" />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-white">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Cadence</h2>
          <p className="text-sm text-white/60">
            Choose how often Gathered nudges you. We keep reminders gentle and easy to opt-out.
          </p>
          <div className="space-y-2">
            {(['daily', 'weekly', 'off'] as const).map((cadence) => (
              <button
                key={cadence}
                onClick={() => handleCadenceChange(cadence)}
                disabled={isLoading || saving}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition ${
                  profile?.notif_cadence === cadence
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="text-sm font-semibold">{cadenceLabels[cadence]}</span>
                <span className="text-xs text-white/60">
                  {cadence === 'off' ? 'No reminders' : cadence === 'daily' ? 'Once each day' : 'Sunday evening'}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Delivery channel</h2>
          <div className="space-y-2">
            {(['push', 'email'] as const).map((channel) => (
              <label
                key={channel}
                className="flex items-center justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-3"
              >
                <span className="text-sm font-medium">{channelLabels[channel]}</span>
                <input
                  type="radio"
                  name="notif-channel"
                  value={channel}
                  checked={profile?.notif_channel === channel}
                  onChange={() => handleChannelChange(channel)}
                  disabled={isLoading || saving}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Quiet hours</h2>
          <p className="text-sm text-white/60">
            We’ll never nudge you during your preferred downtime.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Start</label>
              <input
                type="time"
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                value={quietStart}
                onChange={(event) => handleQuietHoursChange(event.target.value, quietEnd)}
                disabled={isLoading || saving}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">End</label>
              <input
                type="time"
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                value={quietEnd}
                onChange={(event) => handleQuietHoursChange(quietStart, event.target.value)}
                disabled={isLoading || saving}
              />
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Notifications you might receive</h2>
          <ul className="text-sm text-white/70 list-disc list-inside space-y-1">
            <li>“Keep your flame alive—share one gratitude today?”</li>
            <li>“Your fellowship has a gathering Friday at 7pm.”</li>
            <li>Monthly highlight summaries (if cadence is weekly).</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

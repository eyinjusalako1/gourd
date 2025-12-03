'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, ChevronRight, Loader2 } from 'lucide-react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { cacheProfile } from '@/lib/prefs'

const INTEREST_OPTIONS = ['Prayer', 'Bible Study', 'Worship', 'Outreach', 'Youth Hangouts'] as const
const AVAILABILITY_OPTIONS = ['Weeknights', 'Weekend mornings', 'Sunday'] as const
const ROLE_OPTIONS = [
  { id: 'disciple', title: 'Disciple', description: 'Participate, grow, and stay connected.' },
  { id: 'steward', title: 'Steward', description: 'Lead and encourage your fellowship.' },
] as const

type Role = 'disciple' | 'steward'
type Cadence = 'daily' | 'weekly' | 'off'
type Channel = 'push' | 'email'

interface QuietHours {
  start: string
  end: string
}

function isValidRole(value: string | null | undefined): value is Role {
  return value === 'disciple' || value === 'steward'
}

export default function PreferenceForm() {
  const router = useRouter()
  const { profile, updateProfile, markProfileComplete, isLoading } = useUserProfile()
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('disciple')
  const [interests, setInterests] = useState<string[]>([])
  const [availability, setAvailability] = useState<string[]>([])
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [notifCadence, setNotifCadence] = useState<Cadence>('weekly')
  const [notifChannel, setNotifChannel] = useState<Channel>('push')
  const [quietHours, setQuietHours] = useState<QuietHours>({ start: '22:00', end: '07:00' })
  const [reduceMotion, setReduceMotion] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const timezone = useMemo(() => {
    if (typeof Intl === 'undefined') return ''
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }, [])

  useEffect(() => {
    if (!profile) return
    setName(profile.name ?? '')
    setRole(isValidRole(profile.role) ? profile.role : 'disciple')
    setInterests(profile.interests ?? [])
    setAvailability(profile.availability ?? [])
    setCity(profile.city ?? '')
    setBio(profile.bio ?? '')
    setAvatarPreview(profile.avatar_url ?? null)
    setNotifCadence(profile.notif_cadence ?? 'weekly')
    setNotifChannel(profile.notif_channel ?? 'push')
    setQuietHours({
      start: profile.quiet_hours_start ?? '22:00',
      end: profile.quiet_hours_end ?? '07:00',
    })
    setReduceMotion(!!profile.accessibility?.reduceMotion)
    setLargeText(!!profile.accessibility?.largeText)
    setHighContrast(!!profile.accessibility?.highContrast)
  }, [profile])

  const toggleValue = (value: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value))
    } else {
      setList([...list, value])
    }
  }

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(typeof reader.result === 'string' ? reader.result : null)
    }
    reader.readAsDataURL(file)
  }

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return avatarPreview
    if (!isSupabaseConfigured()) return avatarPreview

    const filePath = `avatars/${Date.now()}-${avatarFile.name}`
    const { error } = await supabase.storage.from('avatars').upload(filePath, avatarFile, {
      cacheControl: '3600',
      upsert: true,
    })
    if (error) {
      console.warn('Avatar upload failed:', error.message)
      return avatarPreview
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    setError(null)
    setSaving(true)

    try {
      const avatarUrl = await uploadAvatar()
      const accessibility = { reduceMotion, largeText, highContrast }

      const updated = await updateProfile({
        name,
        role,
        bio,
        avatar_url: avatarUrl,
        city: city || null,
        timezone,
        interests,
        availability,
        notif_cadence: notifCadence,
        notif_channel: notifChannel,
        quiet_hours_start: quietHours.start,
        quiet_hours_end: quietHours.end,
        accessibility,
        personalization_enabled: {
          interests: true,
          location: !!city,
          suggestions: true,
        },
        profile_complete: true,
      })

      if (updated) cacheProfile(updated)
      await markProfileComplete()
      router.replace('/dashboard')
    } catch (err: any) {
      console.error(err)
      setError(err.message ?? 'Failed to save preferences. Please try again.')
      setSaving(false)
    }
  }

  const formDisabled = saving || isLoading

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      <section className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Name *</label>
          <input
            type="text"
            value={name}
            disabled={formDisabled}
            onChange={(event) => setName(event.target.value)}
            className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            placeholder="How should we greet you?"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Profile photo (optional)</label>
          <div className="flex items-center space-x-3">
            <div className="relative w-16 h-16 rounded-full bg-white/10 border border-[#D4AF37]/30 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-6 h-6 text-white/60" />
              )}
            </div>
            <label className="text-sm text-[#F5C451] font-medium hover:text-[#D4AF37] transition-colors">
              <input
                type="file"
                accept="image/*"
                disabled={formDisabled}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) handleAvatarChange(file)
                }}
                className="hidden"
              />
              Upload photo
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">How do you use Gathered?</h2>
        <div className="space-y-3">
          {ROLE_OPTIONS.map((option) => {
            const active = role === option.id
            return (
              <button
                key={option.id}
                type="button"
                disabled={formDisabled}
                onClick={() => setRole(option.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  active
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold">{option.title}</div>
                <div className="text-sm text-white/70">{option.description}</div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Interests</h2>
        <p className="text-sm text-white/60">Choose what you&apos;d like to see more of. Optional and changeable.</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const selected = interests.includes(interest)
            return (
              <button
                key={interest}
                type="button"
                disabled={formDisabled}
                onClick={() => toggleValue(interest, interests, setInterests)}
                className={`px-3 py-2 rounded-full border text-sm transition ${
                  selected ? 'bg-[#D4AF37] text-[#0F1433]' : 'border-white/20 text-white/70'
                }`}
              >
                {interest}
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">When are you usually free?</h2>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((slot) => {
            const selected = availability.includes(slot)
            return (
              <button
                key={slot}
                type="button"
                disabled={formDisabled}
                onClick={() => toggleValue(slot, availability, setAvailability)}
                className={`px-3 py-2 rounded-full border text-sm transition ${
                  selected ? 'bg-[#F5C451] text-[#0F1433]' : 'border-white/20 text-white/70'
                }`}
              >
                {slot}
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Where are you located?</h2>
        <p className="text-sm text-white/60">We use city + timezone to suggest nearby events. Optional.</p>
        <input
          type="text"
          value={city}
          disabled={formDisabled}
          onChange={(event) => setCity(event.target.value)}
          className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          placeholder="City or neighborhood"
        />
        <div className="text-xs text-white/50">Timezone detected: {timezone || 'Unknown'}</div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Bio (optional)</h2>
        <textarea
          rows={3}
          value={bio}
          disabled={formDisabled}
          onChange={(event) => setBio(event.target.value)}
          className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
          placeholder="Share a little about your faith journey."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Notifications</h2>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'off'] as Cadence[]).map((cadence) => {
            const active = notifCadence === cadence
            return (
              <button
                key={cadence}
                type="button"
                disabled={formDisabled}
                onClick={() => setNotifCadence(cadence)}
                className={`flex-1 py-2 rounded-xl border text-sm capitalize ${
                  active ? 'bg-[#D4AF37] text-[#0F1433]' : 'border-white/20 text-white/70'
                }`}
              >
                {cadence}
              </button>
            )
          })}
        </div>

        <div className="flex gap-2">
          {(['push', 'email'] as Channel[]).map((channel) => {
            const active = notifChannel === channel
            return (
              <button
                key={channel}
                type="button"
                disabled={formDisabled}
                onClick={() => setNotifChannel(channel)}
                className={`flex-1 py-2 rounded-xl border text-sm capitalize ${
                  active ? 'bg-[#F5C451] text-[#0F1433]' : 'border-white/20 text-white/70'
                }`}
              >
                {channel}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white/70">Quiet hours start</label>
            <input
              type="time"
              value={quietHours.start}
              disabled={formDisabled}
              onChange={(event) => setQuietHours((prev) => ({ ...prev, start: event.target.value }))}
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white/70">Quiet hours end</label>
            <input
              type="time"
              value={quietHours.end}
              disabled={formDisabled}
              onChange={(event) => setQuietHours((prev) => ({ ...prev, end: event.target.value }))}
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Accessibility</h2>
        <div className="space-y-2">
          <label className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <div>
              <div className="font-medium text-sm">Reduce motion</div>
              <p className="text-xs text-white/60">Minimize animations for a calmer experience.</p>
            </div>
            <input
              type="checkbox"
              checked={reduceMotion}
              disabled={formDisabled}
              onChange={(event) => setReduceMotion(event.target.checked)}
              className="h-5 w-5"
            />
          </label>

          <label className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <div>
              <div className="font-medium text-sm">Large text</div>
              <p className="text-xs text-white/60">Increase base font size for easier reading.</p>
            </div>
            <input
              type="checkbox"
              checked={largeText}
              disabled={formDisabled}
              onChange={(event) => setLargeText(event.target.checked)}
              className="h-5 w-5"
            />
          </label>

          <label className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <div>
              <div className="font-medium text-sm">High contrast</div>
              <p className="text-xs text-white/60">Boost contrast for improved readability.</p>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              disabled={formDisabled}
              onChange={(event) => setHighContrast(event.target.checked)}
              className="h-5 w-5"
            />
          </label>
        </div>
      </section>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/40 text-red-200 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={formDisabled}
        className="w-full bg-[#D4AF37] text-[#0F1433] font-semibold py-3 rounded-xl hover:bg-[#F5C451] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving preferences…
          </>
        ) : (
          <>
            Finish setup
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-white/50 text-center">
        You can adjust these in Settings → Personalization anytime. We only use them to help you feel at home.
      </p>
    </form>
  )
}



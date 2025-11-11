'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTutorial } from '@/lib/tutorial-context'
import AppHeader from '@/components/AppHeader'
import { Bell, Shield, User, Palette, Smartphone, HelpCircle, Sparkles } from 'lucide-react'
import { RoleSelector } from '@/components/settings/RoleSelector'
import { useAuth } from '@/lib/auth-context'

export default function SettingsPage() {
  const router = useRouter()
  const tutorial = useTutorial()
  const { user, setMockUserType } = useAuth()

  const sections = [
    { id: 'account', title: 'Account', icon: User, desc: 'Profile, email, password' },
    { id: 'personalization', title: 'Personalization', icon: Sparkles, desc: 'Tailored feed & suggestions' },
    { id: 'notifications', title: 'Notifications', icon: Bell, desc: 'Push, email alerts' },
    { id: 'privacy', title: 'Privacy & Safety', icon: Shield, desc: 'Visibility, blocking' },
    { id: 'appearance', title: 'Appearance', icon: Palette, desc: 'Theme, text size' },
    { id: 'devices', title: 'Devices', icon: Smartphone, desc: 'Sessions, security' },
    { id: 'help', title: 'Help & FAQ', icon: HelpCircle, desc: 'Support resources' },
  ]

  const currentRole = useMemo(() => {
    const role = user?.user_metadata?.role
    if (role === 'Leader' || role === 'Church Admin') return 'steward'
    return 'disciple'
  }, [user])

  return (
    <div className="min-h-screen bg-[#0F1433] pb-[calc(env(safe-area-inset-bottom,0px)+96px)]">
      <AppHeader
        title="Settings"
        subtitle="Tune your Gathered experience"
        backHref="/dashboard"
      />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <RoleSelector
          currentRole={currentRole}
          onConfirm={async (role) => {
            await new Promise<void>((resolve) => {
              setMockUserType(role === 'steward' ? 'leader' : 'individual')
              window.setTimeout(resolve, 150)
            })
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          {sections.map((sec) => {
            const Icon = sec.icon
            return (
              <button
                onClick={() => router.push(`/settings/${sec.id}`)}
                key={sec.id}
                className="bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-4 text-left hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] min-h-[120px]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#F5C451]" />
                </div>
                <div className="text-white font-semibold text-base leading-tight">{sec.title}</div>
                <div className="text-white/60 text-sm leading-snug mt-1">{sec.desc}</div>
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          <button className="w-full bg-[#F5C451] text-[#0F1433] py-3 rounded-xl font-semibold hover:bg-[#D4AF37] transition-colors min-h-[56px]">
            Save Changes
          </button>
          <button className="w-full bg-white/5 text-white py-3 rounded-xl font-semibold border border-[#D4AF37]/30 hover:bg-white/10 transition-colors min-h-[56px]">
            Reset to Defaults
          </button>
          <button
            onClick={() => tutorial.restart()}
            className="w-full bg-white/5 text-white py-3 rounded-xl font-semibold border border-[#D4AF37]/30 hover:bg-white/10 transition-colors min-h-[56px]"
          >
            Restart Tutorial
          </button>
        </div>
      </div>
    </div>
  )
}


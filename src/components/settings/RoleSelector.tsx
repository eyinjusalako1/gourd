'use client'

import { useEffect, useState } from 'react'
import { Check, Info, Shield, Users } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useToast } from '@/components/ui/Toast'
import { analytics } from '@/utils/analytics'

type RoleOption = 'disciple' | 'steward'

const ROLE_LABELS: Record<RoleOption, string> = {
  disciple: 'Disciple',
  steward: 'Steward',
}

const ROLE_DESCRIPTIONS: Record<RoleOption, string> = {
  disciple: 'Discover fellowships, RSVP to events, share testimonies.',
  steward: 'Create fellowships, host events, lead engagement.',
}

const ROLE_CAPABILITIES: Array<{ label: string; disciple: boolean; steward: boolean }> = [
  { label: 'Join and RSVP to events', disciple: true, steward: true },
  { label: 'Create fellowships', disciple: false, steward: true },
  { label: 'Host and manage events', disciple: false, steward: true },
  { label: 'Post testimonies & prayer requests', disciple: true, steward: true },
  { label: 'Access stewardship dashboard', disciple: false, steward: true },
]

interface RoleSelectorProps {
  currentRole: RoleOption
  onConfirm: (newRole: RoleOption) => Promise<void> | void
}

export function RoleSelector({ currentRole, onConfirm }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<RoleOption>(currentRole)
  const [pendingRole, setPendingRole] = useState<RoleOption | null>(null)
  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setSelectedRole(currentRole)
  }, [currentRole])

  const openConfirm = (role: RoleOption) => {
    if (role === currentRole) return
    setPendingRole(role)
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!pendingRole) return
    setIsSaving(true)
    setConfirmOpen(false)
    const previousRole = currentRole
    setSelectedRole(pendingRole)

    try {
      await onConfirm(pendingRole)
      toast({
        title: pendingRole === 'steward'
          ? "You're now a Steward"
          : "You're now a Disciple",
        description:
          pendingRole === 'steward'
            ? 'You can create fellowships and events.'
            : 'Explore and engage with your community.',
        variant: 'success',
      })
      analytics.track('user_role_changed', {
        from: previousRole,
        to: pendingRole,
        ts: Date.now(),
      })
    } catch (error) {
      console.error('Failed to change role', error)
      setSelectedRole(previousRole)
      toast({
        title: 'Role update failed',
        description: 'Please try again or contact support.',
        variant: 'error',
      })
    } finally {
      setIsSaving(false)
      setPendingRole(null)
    }
  }

  const segmentedControl = (
    <div className="mt-4 bg-white/10 p-1 rounded-xl flex items-center text-sm font-semibold">
      {(['disciple', 'steward'] as RoleOption[]).map((role) => {
        const isActive = selectedRole === role
        return (
          <button
            key={role}
            type="button"
            aria-pressed={isActive}
            onClick={() => openConfirm(role)}
            className="flex-1 py-3 px-2 rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <div
              className={`w-full h-full flex flex-col items-center justify-center gap-1 ${
                isActive ? 'bg-[#D4AF37] text-[#0F1433] rounded-lg shadow-inner' : 'text-white/80'
              }`}
            >
              <span className="text-base leading-none">{ROLE_LABELS[role]}</span>
              <span className="text-[11px] font-medium opacity-80">
                {role === 'disciple' ? 'Member mode' : 'Leader mode'}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )

  return (
    <section
      className="bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-5 text-white"
      aria-labelledby="role-selector-title"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 id="role-selector-title" className="text-lg font-semibold">Your Gathered Role</h2>
          <p className="text-sm text-white/70">
            Choose how you interact with the community.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex items-center space-x-1 text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg px-2 py-1"
        >
          <Info className="w-4 h-4" />
          <span>Review differences</span>
        </button>
      </div>

      {segmentedControl}

      <div className="mt-4 rounded-xl bg-[#1B2048]/80 border border-white/10 p-4">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center space-x-2">
          {selectedRole === 'steward' ? (
            <>
              <Shield className="w-4 h-4 text-[#F5C451]" />
              <span>Steward Capabilities</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4 text-[#F5C451]" />
              <span>Disciple Experience</span>
            </>
          )}
        </h3>
        <p className="text-sm text-white/70">
          {ROLE_DESCRIPTIONS[selectedRole]}
        </p>
      </div>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => {
          setConfirmOpen(false)
          setPendingRole(null)
        }}
        title={pendingRole
          ? `Switch your role to ${ROLE_LABELS[pendingRole]}?`
          : undefined}
      >
        <div className="space-y-4 text-sm">
          <p className="text-white/70">
            This updates your experience immediately. You can switch back anytime.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSaving}
              className="w-full bg-[#D4AF37] text-[#0F1433] py-3 rounded-xl font-semibold hover:bg-[#F5C451] transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              {isSaving ? 'Updating...' : 'Confirm switch'}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmOpen(false)
                setPendingRole(null)
              }}
              className="w-full bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Disciple vs Steward"
      >
        <div className="space-y-4 text-white/80 text-sm pb-4">
          <p>
            Stewards shepherd their fellowships with creation and management tools.
            Disciples focus on participation and growth.
          </p>
          <div className="space-y-3">
            {ROLE_CAPABILITIES.map((capability) => (
              <div
                key={capability.label}
                className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-3"
              >
                <span className="text-sm font-medium text-white">{capability.label}</span>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="uppercase tracking-wide opacity-70">Disciple</span>
                    {capability.disciple ? (
                      <Check className="w-4 h-4 text-[#F5C451]" aria-hidden />
                    ) : (
                      <span aria-hidden className="text-white/40">—</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="uppercase tracking-wide opacity-70">Steward</span>
                    {capability.steward ? (
                      <Check className="w-4 h-4 text-[#F5C451]" aria-hidden />
                    ) : (
                      <span aria-hidden className="text-white/40">—</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>
    </section>
  )
}



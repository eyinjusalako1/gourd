'use client'

import { usePrefs, UserType } from '@/hooks/usePrefs'
import { useAuth } from '@/lib/auth-context'
import { saveUserType } from '@/hooks/usePrefs'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function RoleSelector() {
  const { user } = useAuth()
  const { userType, isLoading } = usePrefs()
  const [saving, setSaving] = useState(false)

  const handleRoleChange = async (newRole: 'Disciple' | 'Steward') => {
    if (!user || newRole === userType || saving) return

    setSaving(true)
    try {
      await saveUserType(user.id, newRole)
    } catch (error) {
      console.error('Error updating role:', error)
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex rounded-xl bg-[#1B2033] p-1">
        <div className="flex-1 py-2.5 text-center text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex rounded-xl bg-[#1B2033] p-1">
      <button
        onClick={() => handleRoleChange('Disciple')}
        disabled={saving}
        className={cn(
          "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
          userType === 'Disciple'
            ? "bg-[#D4AF37] text-[#0A0F1C] shadow-sm"
            : "text-slate-200/80 hover:text-white",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        Disciple
      </button>
      <button
        onClick={() => handleRoleChange('Steward')}
        disabled={saving}
        className={cn(
          "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
          userType === 'Steward'
            ? "bg-[#D4AF37] text-[#0A0F1C] shadow-sm"
            : "text-slate-200/80 hover:text-white",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        Steward
      </button>
    </div>
  )
}


'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, MessageSquare, Calendar } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  onClick: () => void
}

export default function QuickActions() {
  const router = useRouter()
  const { user } = useAuth()
  const role = user?.user_metadata?.role
  const isSteward = role === 'Leader' || role === 'Church Admin'

  const actions: QuickAction[] = useMemo(() => {
    const items: QuickAction[] = []

    if (isSteward) {
      items.push({
        id: 'create-event',
        label: 'Create Event',
        icon: Calendar,
        onClick: () => router.push('/events/create')
      })
    }

    items.push(
      {
        id: 'share-encouragement',
        label: 'Share Encouragement',
        icon: Heart,
        onClick: () => {
          router.push('/fellowships')
        }
      },
      {
        id: 'request-prayer',
        label: 'Request Prayer',
        icon: MessageSquare,
        onClick: () => {
          router.push('/prayers/create')
        }
      }
    )

    return items
  }, [isSteward, router])

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map(action => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            onClick={action.onClick}
            className="bg-white/5 border border-[#D4AF37] rounded-xl p-4 text-center hover:bg-white/10 transition-colors group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Icon className="w-5 h-5 text-[#0F1433]" />
            </div>
            <p className="text-white text-xs font-medium">{action.label}</p>
          </button>
        )
      })}
    </div>
  )
}




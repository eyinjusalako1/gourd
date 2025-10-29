'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import BottomNavigation from '@/components/BottomNavigation'

export default function GlobalBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const getActiveTab = (): string => {
    if (!pathname) return 'home'
    if (pathname.startsWith('/events')) return 'events'
    if (pathname.startsWith('/chat')) return 'chat'
    if (pathname.startsWith('/fellowships')) return 'fellowships'
    if (pathname.startsWith('/devotions')) return 'devotions'
    return 'home'
  }

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'events':
        router.push('/events')
        break
      case 'chat':
        router.push('/chat')
        break
      case 'fellowships':
        router.push('/fellowships')
        break
      case 'devotions':
        router.push('/devotions')
        break
      default:
        router.push('/dashboard')
        break
    }
  }

  return (
    <BottomNavigation activeTab={getActiveTab()} onTabChange={handleTabChange} />
  )
}



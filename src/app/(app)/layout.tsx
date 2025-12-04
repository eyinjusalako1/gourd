'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import BottomNavigation from '@/components/BottomNavigation'

// Routes that should NOT have bottom navigation
const NO_BOTTOM_NAV_ROUTES = [
  '/auth',
  '/onboarding',
  '/',
]

// Routes that should have bottom navigation
const BOTTOM_NAV_ROUTES = [
  '/dashboard',
  '/events',
  '/fellowship',
  '/feed',
  '/bible-study',
  '/prayers',
  '/testimonies',
  '/settings',
  '/profile',
  '/chat',
  '/devotions',
]

function shouldShowBottomNav(pathname: string): boolean {
  // Never show on auth or onboarding routes
  if (NO_BOTTOM_NAV_ROUTES.some(route => pathname.startsWith(route))) {
    return false
  }

  // Show on authenticated app routes
  if (BOTTOM_NAV_ROUTES.some(route => pathname.startsWith(route))) {
    return true
  }

  // Show on detail/create pages that are part of authenticated routes
  if (pathname.match(/^\/(events|fellowship|feed|prayers|testimonies)\//)) {
    return true
  }

  return false
}

function getActiveTab(pathname: string): string {
  if (pathname.startsWith('/dashboard') || pathname === '/') return 'home'
  if (pathname.startsWith('/events')) return 'events'
  if (pathname.startsWith('/chat')) return 'chat'
  if (pathname.startsWith('/fellowship')) return 'fellowships'
  if (pathname.startsWith('/devotions')) return 'devotions'
  return 'home'
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // Redirect to login if not authenticated (only on mount)
  useEffect(() => {
    if (!loading && !user && pathname !== '/auth/login') {
      router.replace('/auth/login')
    }
  }, [user, loading, router, pathname])

  const showBottomNav = shouldShowBottomNav(pathname)
  const activeTab = getActiveTab(pathname)

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        router.push('/dashboard')
        break
      case 'events':
        router.push('/events')
        break
      case 'chat':
        router.push('/chat')
        break
      case 'fellowships':
        router.push('/fellowship')
        break
      case 'devotions':
        router.push('/devotions')
        break
      default:
        break
    }
  }

  return (
    <>
      {children}
      {showBottomNav && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </>
  )
}


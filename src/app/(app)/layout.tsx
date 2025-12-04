'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import BottomNavigation from '@/components/BottomNavigation'

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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [user, loading, router])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-navy-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!user) {
    return null
  }

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
    <div className="flex flex-col min-h-screen bg-beige-50 dark:bg-navy-900">
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}



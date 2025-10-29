import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import QuickActionsFab from '@/components/QuickActionsFab'
import CommandPalette from '@/components/CommandPalette'
import PageTransition from '@/components/PageTransition'
import GlobalBottomNav from '@/components/GlobalBottomNav'
import BottomMoreSheet from '@/components/BottomMoreSheet'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gathered - Church Event Management',
  description: 'A modern platform for managing church events and community engagement',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-[#0F1433]">
            <PageTransition>
              {children}
            </PageTransition>
            <QuickActionsFab />
            <CommandPalette />
            <GlobalBottomNav />
            <BottomMoreSheet />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [phase, setPhase] = useState<'enter' | 'active'>('enter')

  useEffect(() => {
    setPhase('enter')
    const id = requestAnimationFrame(() => setPhase('active'))
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <div className={phase === 'enter' ? 'page-fade-enter' : 'page-fade-enter-active'}>
      {children}
    </div>
  )
}






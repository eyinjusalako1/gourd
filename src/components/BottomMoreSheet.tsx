'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { HelpCircle, Users, User, LogOut, MessageCircle, BookOpen } from 'lucide-react'
import ReactDOM from 'react-dom'

export default function BottomMoreSheet() {
  const router = useRouter()
  const { signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const openSheet = () => setOpen(true)
    window.addEventListener('open-bottom-more', openSheet as EventListener)
    return () => window.removeEventListener('open-bottom-more', openSheet as EventListener)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!mounted) return null

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                setOpen(false)
              }
            }}
            className="absolute left-0 right-0 bottom-0 bg-[#0F1433] border-t border-[#D4AF37]/40 rounded-t-2xl p-4 max-w-md mx-auto"
            style={{
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
              willChange: 'transform',
            }}
          >
            {/* Drag Handle */}
            <div className="flex-shrink-0 pt-3 pb-2">
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setOpen(false); router.push('/bible') }}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 rounded-xl py-4 px-3 text-left min-h-[44px]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-[#F5C451]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-white text-sm font-medium block">Bible (WEB)</span>
                  <span className="text-white/60 text-xs">Open the Bible reader</span>
                </div>
              </button>
              <button
                onClick={() => { setOpen(false); router.push('/faq') }}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 rounded-xl py-4 px-3 text-left min-h-[44px]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-[#F5C451]" />
                </div>
                <span className="text-white text-sm font-medium">Help & FAQ</span>
              </button>
              <button
                onClick={() => { setOpen(false); router.push('/discover') }}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 rounded-xl py-4 px-3 text-left min-h-[44px]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#F5C451]" />
                </div>
                <span className="text-white text-sm font-medium">Discover People</span>
              </button>
              <button
                onClick={() => { setOpen(false); router.push('/profile') }}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 rounded-xl py-4 px-3 text-left min-h-[44px]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-[#F5C451]" />
                </div>
                <span className="text-white text-sm font-medium">My Profile</span>
              </button>
              <button
                onClick={() => { setOpen(false); router.push('/faq'); setTimeout(() => window.dispatchEvent(new Event('open-command-palette')), 50) }}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 rounded-xl py-4 px-3 text-left min-h-[44px]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#F5C451]" />
                </div>
                <span className="text-white text-sm font-medium">Send Feedback</span>
              </button>
            </div>
            <button
              onClick={async () => { setOpen(false); await signOut(); router.push('/') }}
              className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 text-white rounded-xl py-4 px-3 flex items-center justify-center gap-3 min-h-[44px]"
            >
              <LogOut className="w-5 h-5 text-[#F5C451]" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return ReactDOM.createPortal(content, document.body)
}







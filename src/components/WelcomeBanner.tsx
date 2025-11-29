'use client'

import { motion } from 'framer-motion'

interface WelcomeBannerProps {
  firstName: string
  message?: string
}

export default function WelcomeBanner({ firstName, message = "Your fellowship is waiting" }: WelcomeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl p-4 shadow-lg mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl font-bold text-navy-900 mb-1"
          >
            Welcome back, {firstName}! 👋
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-navy-900/80"
          >
            {message}
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
        >
          <span className="text-2xl">✨</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

